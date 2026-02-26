import React, { useState, useEffect, useRef } from "react";
import Coin from "../../images/Payment/coins.svg";
import SpeedDelivery from "../../images/Payment/speeddelivery.svg";
import PiggyBank from "../../images/Payment/piggybank.svg";
import PaymentProcessed from "../../images/Payment/bank.svg";
import WebsiteEarning from "../../images/Payment/website-earning.svg";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import crossIcon from "../../images/cross-icon.svg";
import { LoadingOutlined } from "@ant-design/icons";
import cartIcon from "../../images/Inventry/cart-icon.png";
import ONDCearning from "../../images/Payment/ondc-earning.svg";
import Pluscircle from "../../images/wallet/PlusCircle.svg";
import Printer from "../../components/svgIcons/Printer";
import MinusCircle from "../../images/wallet/MinusCircle.svg";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Spin } from "antd";
import s from "./Support.module.css";
import API from "../../api";
import {
  handleError,
  nomenclature,
  notify,
  PaginationFilter,
  CsvGenerator,
  DateFilters,
  handleLogout
} from "../../utils";
import { PAYMENT_DATA } from "../../api/apiList";

const Payment = (props) => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const [user_data, setuser_data] = useState(getSellerDetails());
  const [search, setSearch] = useState("");
  const [clear, setclear] = useState(false);
  const [status, setStatus] = useState("");
  const [openOrder, setOpenOrder] = useState(false);
  const [PaymentInfo, setPaymentInfo] = useState(false);
  const [limit, setlimit] = useState(20);
  const [page, setpage] = useState(1);
  const [count, setCount] = useState(0);
  const [tableLoading, setTableloading] = useState(false);
  const [allCount, setAllCount] = useState({});
  const [orderData, setorderData] = useState({});
  const [paymentData, setPaymentData] = useState([]);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [componentMounted, setComponentMounted] = useState(false);
  const [settlementStatus, setSettlementStatus] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportPayment, setexportPayment] = useState([]);
  // const [paymentDataExport, setPaymentDataExport] = useState([]);
  const onPageChanged = (page) => {
    setpage(page);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (componentMounted) {
      getPayment();
    } else {
      setComponentMounted(true);
    }
  }, [componentMounted, status, page]);

  useEffect(() => {
    if (
      startDate == "" &&
      search == "" &&
      endDate == "" &&
      clear &&
      settlementStatus == "" &&
      paymentMode == ""
    ) {
      getPayment();
    }
  }, [startDate, search, endDate, settlementStatus, paymentMode]);

  const getPayment = async () => {
    try {
      if (!user_data._id || user_data._id == "") {
        handleLogout();
      }
      setTableloading(true);
      const obj = {
        limit: 20,
        page: page,
        search: search,
        startDate: startDate,
        endDate: endDate,
        status: status,
        settlementStatus: settlementStatus,
        paymentMode: paymentMode,
        userId: user_data?._id,
      };
      const response = await API.post(PAYMENT_DATA, obj);
      if (response?.data?.success) {
        setAllCount(response?.data?.result?.websiteOrderPayment);
        setPaymentData(response?.data?.result?.totalData?.sample);
        setCount(response?.data?.result?.totalData?.count);
        setTableloading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const clearState = () => {
    setclear(true);
    setstartDate("");
    setSearch("");
    setendDate("");
    setSettlementStatus("");
    setpaymentMode("");
  };

  const validation = () => {
    if (startDate === "" && endDate !== "") {
      notify("error", "Please Enter Start Date..!");
    }
    if (startDate !== "" && endDate === "") {
      notify("error", "Please Enter End Date..!");
    }
    if (
      (startDate === "" && endDate === "") ||
      (startDate !== "" && endDate !== "")
    ) {
      getPayment();
      onPageChanged(1);
    }
  };

  const exportPayments = async () => {
    setExportLoading(true);
    try {
      const obj = {
        limit: null,
        page: page,
        search: search,
        startDate: startDate,
        endDate: endDate,
        status: status,
        settlementStatus: settlementStatus,
        paymentMode: paymentMode,
        userId: user_data?._id,
      };
      const response = await API.post(PAYMENT_DATA, obj);
      if (response?.data?.success) {
        let paymentDataExport = response?.data?.result?.totalData?.sample;
        let exportData = [];
        paymentDataExport.forEach((order, index) => {
          const obj = {
            sno: index + 1,
            date: moment(order?.createdAt).format("DD MMM YYYY"),
            time: moment(order?.createdAt).format("hh:mm A"),
            orderSource: nomenclature(order?.createdFrom),
            orderID: order?.orderId,
            customerName: order?.buyerName,
            customerPhone: order?.buyerPhoneNumber,
            orderAmount: order?.orderAmount,
            totalAmount: order?.orderAmount + order?.shippingAmount,
            kikoCommission: 0,
            deliveryCharges: order?.shippingAmount,
            orderValue: order?.orderAmount,
            settlementAmount: order?.orderAmount + order?.shippingAmount,
            paymentStataus: order?.settlementData?.status,
            txnId: order?.orderId,
            settleDate: order?.settlementData?.date
              ? moment(order?.settlementData?.date).format("DD MMM YYYY")
              : "-",
            settleTime: order?.settlementData?.date
              ? moment(order?.settlementData?.date).format("hh:mm A")
              : "-",
            remark: order?.settlementData ? order?.settlementData?.remark : "-",
          };
          exportData.push(obj);
        });
        setexportPayment(exportData);
        setExportLoading(false);
        const csvData = convertToCSV(exportData, headings);
        const csvBlob = new Blob([csvData], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement("a");
        csvLink.href = csvUrl;
        csvLink.download = "Settlement.csv";
        csvLink.click();
      }
    } catch (error) {
      handleError(error);
    }
  };

  function convertToCSV(data, headings) {
    // Create header row
    const headerRow = headings.map((heading) => heading.label).join(",");

    // Create data rows
    const dataRows = data.map((row) => {
      return headings
        .map((heading) => {
          const key = heading.key;
          let cell = row[key];

          // Handle cell values that may contain commas
          if (typeof cell === "string" && cell.includes(",")) {
            cell = `"${cell}"`;
          }

          return cell;
        })
        .join(",");
    });

    // Combine header and data rows
    const csvContent = [headerRow, ...dataRows].join("\n");

    return csvContent;
  }

  const headings = [
    { label: "Sr No", key: "sno" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Order Source", key: "orderSource" },
    { label: "Order ID", key: "orderID" },
    { label: "Customer Name", key: "customerName" },
    { label: "Customer Contact", key: "customerPhone" },
    { label: "Order Amount", key: "orderAmount" },
    { label: "Total Item Amount", key: "totalAmount" },
    { label: "Kiko Commission", key: "kikoCommission" },
    { label: "Delivery Charges", key: "deliveryCharges" },
    { label: "Total Order Value", key: "orderValue" },
    { label: "Settlement Amount", key: "settlementAmount" },
    { label: "Payment Status", key: "paymentStataus" },
    { label: "TXN ID", key: "txnId" },
    { label: "Settled date", key: "settleDate" },
    { label: "Settled time", key: "settleTime" },
    { label: "Remark", key: "remark" },
  ];

  return (
    <>
      {" "}
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="RightBlock">
        {/* <div className={s.mainHeading}>
                    <h1 className={s.title}>Welcome to Kiko Live</h1>
                </div> */}
        <div className="section-title">
          <h1 className="mb-0">Settlement</h1>
          <button
            className="btn me-2"
            onClick={exportPayments}
            disabled={exportLoading}
          >
            {exportLoading ? "Loading..." : "Download"}
          </button>
        </div>
        <div style={{ display: "none" }}>
          {exportPayment.length > 0 && (
            <CSVLink
              data={exportPayment}
              headings={headings}
              asyncOnClick={true}
              fileName={"Settlement.csv"}
            >
              Download CSV
            </CSVLink>
          )}
        </div>
        <ul className={`nav nav-pills ${s.PaymentCards}`} role="tablist">
          <li
            className={`nav-item ${s.processingCard} active`}
            onClick={() => {
              setStatus("");
            }}
          >
            <a data-toggle="tab" href="#1a">
              <img src={Coin} className={s.cardIcon} />
              <h6 className={s.cardTitle}>Total Earnings</h6>
              <h3 className={s.rate}>
                ₹
                <span>
                  {allCount.websitePendingPayment
                    ? allCount?.websitePendingPayment +
                      allCount?.websiteCompletePayment
                    : 0}
                </span>
              </h3>
            </a>
          </li>
          <li
            className={`nav-item ${s.processingCard}`}
            onClick={() => {
              setStatus("websiteEarning");
            }}
          >
            <a data-toggle="tab" href="#2a">
              <img src={WebsiteEarning} className={s.cardIcon} />
              <h6 className={s.cardTitle}>Website Earnings</h6>
              <h3 className={s.rate}>
                ₹
                <span>
                  {allCount.websitePendingPayment
                    ? allCount?.websitePendingPayment +
                      allCount?.websiteCompletePayment
                    : 0}
                </span>
              </h3>
            </a>
          </li>
          <li
            className={`nav-item ${s.processingCard}`}
            onClick={() => {
              setStatus("ondcEarning");
            }}
          >
            <a data-toggle="tab" href="#3a">
              <img src={ONDCearning} className={s.cardIcon} />
              <h6 className={s.cardTitle}>ONDC Earnings</h6>
              <h3 className={s.rate}>
                ₹<span>0</span>
              </h3>
            </a>
          </li>
          <li
            className={`nav-item ${s.processingCard}`}
            onClick={() => {
              setStatus("pending");
            }}
          >
            <a data-toggle="tab" href="#4a">
              <img src={PiggyBank} className={s.cardIcon} />
              <h6 className={s.cardTitle}>Settlement Pending</h6>
              <h3 className={s.rate}>
                ₹
                <span>
                  {allCount?.websitePendingPayment
                    ? allCount?.websitePendingPayment
                    : 0}
                </span>
              </h3>
            </a>
          </li>
          <li
            className={`nav-item ${s.processingCard}`}
            onClick={() => {
              setStatus("completed");
            }}
          >
            <a data-toggle="tab" href="#5a">
              <img src={PaymentProcessed} className={s.cardIcon} />
              <h6 className={s.cardTitle}>Payment Received</h6>
              <h3 className={s.rate}>
                ₹
                <span>
                  {allCount?.websiteCompletePayment
                    ? allCount?.websiteCompletePayment
                    : 0}
                </span>
              </h3>
            </a>
          </li>
        </ul>
        <div className={s.filter}>
          <label>Filter By:</label>
          <div className="d-flex align-items-center gap-2">
            <DateFilters
              changeStartDate={(date) => setstartDate(date)}
              changeEndDate={(date) => setendDate(date)}
              startDate={startDate}
              endDate={endDate}
              title={"Order Date"}
            />
          </div>
          <div className={s.filterList}>
            <label>Customer Name/Mobile Number/Transaction ID/Order ID</label>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <span>
            <label className="me-2">Order Source</label>
            <select className={s.orderSelect}>
              <option>Website Orders</option>
              <option>ONDC Orders</option>
            </select>
          </span>
          <span>
            <label className="me-2">Settlement Status</label>
            <select
              className={s.orderSelect}
              value={settlementStatus}
              onChange={(e) => {
                setSettlementStatus(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </span>
          {/* <label>Payment Mode</label>
                    <select className={s.orderSelect} value={paymentMode} onChange={(e) => { setpaymentMode(e.target.value) }}>
                        <option value="" >All</option>
                        <option value={"KikoPayment"}>Kiko Payment</option>
                        <option value={"SelfPayment"}>COD</option>
                    </select> */}
          <span>
            <button
              onClick={() => {
                validation();
              }}
              disabled={
                search == "" &&
                startDate == "" &&
                paymentMode == "" &&
                settlementStatus == "" &&
                endDate == ""
                  ? true
                  : false
              }
              className="btn btn-primary btn-sm me-2"
            >
              Search
            </button>
            <button
              onClick={() => {
                clearState();
              }}
              disabled={
                search == "" &&
                startDate == "" &&
                paymentMode == "" &&
                settlementStatus == "" &&
                endDate == ""
                  ? true
                  : false
              }
              className="btn btn-sm btn-outline me-2"
            >
              Clear
            </button>
          </span>
        </div>
        <div className={s.containerMain}>
          <div className="row justify-content-between">
            <div className="col-lg-12">
              <div className="tab-content">
                <div id="1a" className="tab-pane active">
                  <h4
                    className={s.settlementHeading}
                    style={
                      status == "websiteEarning"
                        ? { color: "#7459AF" }
                        : status == "ondcEarning"
                        ? { color: "#005298" }
                        : status == "pending"
                        ? { color: "#FBAE17" }
                        : status == "completed"
                        ? { color: "#2C067B" }
                        : { color: "#117C57" }
                    }
                  >
                    {status == "websiteEarning"
                      ? "Website Earnings"
                      : status == "ondcEarning"
                      ? "ONDC Earnings"
                      : status == "pending"
                      ? "Settlement Pending"
                      : status == "completed"
                      ? "Payment Received"
                      : "Total Earnings"}
                  </h4>
                  {paymentData.length > 0 ? (
                    <div className={s.tableContainer}>
                      {tableLoading ? (
                        <Spin indicator={antIcon} className="loader" />
                      ) : (
                        <table className="global-table">
                          <thead className={s.globalHead}>
                            <tr>
                              <th>Date & Time</th>
                              <th>Order Source</th>
                              <th>Order ID</th>
                              <th>Payment Mode</th>
                              <th>Customer Name</th>
                              <th>Mobile Number</th>
                              <th>Total Order Amount</th>
                              <th>Settlement Amount</th>
                              <th>Settlement Status</th>
                              <th>Transaction ID</th>
                              <th>Settled On</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody className={s.globalBody}>
                            {paymentData.map((order, index) => {
                              return (
                                <tr>
                                  <td>
                                    <span className="date-time">
                                      {moment(order?.createdAt).format(
                                        "DD MMM YYYY"
                                      ) +
                                        " at " +
                                        moment(order?.createdAt).format(
                                          "hh:mm A"
                                        )}
                                    </span>
                                  </td>
                                  <td>{nomenclature(order?.createdFrom)}</td>
                                  <td className={s.Settlementamount}>
                                    <span
                                      onClick={() => {
                                        setorderData(order);
                                        setOpenOrder(true);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        textDecoder: "underline",
                                      }}
                                    >
                                      {order?.orderId}
                                    </span>
                                  </td>
                                  <td>
                                    {order?.orderPaymentMode == "SelfPayment"
                                      ? "COD"
                                      : "Kiko Payment"}
                                  </td>
                                  <td>{order?.buyerName}</td>
                                  <td>{order?.buyerPhoneNumber}</td>
                                  <td>
                                    {order?.orderAmount + order?.shippingAmount}
                                  </td>
                                  <td
                                    className={s.Settlementamount}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {order?.orderPaymentMode ==
                                    "SelfPayment" ? (
                                      "-"
                                    ) : (
                                      <span
                                        onClick={() => {
                                          setorderData(order);
                                          setPaymentInfo(true);
                                        }}
                                      >
                                        {order?.settlementData.amount
                                          ? order?.settlementData?.amount
                                          : order?.orderAmount +
                                            order?.shippingAmount}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    {order?.orderPaymentMode ==
                                    "SelfPayment" ? (
                                      "-"
                                    ) : (
                                      <p className={s.PaymentStatus}>
                                        {order?.settlementData?.status ==
                                        "completed" ? (
                                          <span className={s.Paid}>Paid</span>
                                        ) : order?.settlementData?.status ==
                                          "rejected" ? (
                                          <span className={s.Reject}>
                                            Reject
                                          </span>
                                        ) : (
                                          <span className={s.Pending}>
                                            Pending
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </td>
                                  <td>-</td>
                                  <td>
                                    {order?.settlementData?.date ? (
                                      <span className="date-time">
                                        {moment(
                                          order?.settlementData?.date
                                        ).format("DD MMM YYYY") +
                                          " at " +
                                          moment(
                                            order?.settlementData?.date
                                          ).format("hh:mm A")}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td>{order?.settlementData?.remark}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ) : (
                    <div className="no-data-status">
                      {tableLoading ? (
                        <Spin
                          indicator={antIcon}
                          className="loader"
                          size="large"
                        />
                      ) : (
                        <div>
                          <div className="cart-icon">
                            <img src={cartIcon} />
                          </div>
                          <h5>No Payment Yet</h5>
                          <p>
                            We will Notify you once you receive any Payment!
                          </p>
                          <div className="d-flex gap-2 mt-4 justify-content-center"></div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="d-flex justify-content-center">
                    <PaginationFilter
                      onPageChanged={onPageChanged}
                      limit={limit}
                      count={count}
                      page={page}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={PaymentInfo}
        toggle={() => {
          setPaymentInfo(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className={s.paymentAmount}>
          <div>
            <h1>
              Settlement Amount{" "}
              <img
                src={crossIcon}
                style={{ cursor: "pointer", float: "right" }}
                onClick={() => {
                  setPaymentInfo(false);
                }}
              />
            </h1>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <td style={{textAlign:"left"}}>Total Item(s) Amount</td>
                <td style={{textAlign:"right"}}>₹{orderData.orderAmount}</td>
              </tr>
              {orderData.createdFrom != "microwebsite" && (
                <tr>
                  <td style={{textAlign:"left"}}>Kiko Comission(3%)</td>
                  <td style={{textAlign:"right"}}>₹0</td>
                </tr>
              )}
              <tr>
                <td style={{textAlign:"left"}}>Delivery Charges</td>
                <td style={{textAlign:"right"}}>₹{orderData.shippingAmount}</td>
              </tr>
              <tr style={{ background: "#F1F1F1" }}>
                <td style={{textAlign:"left"}}>Total Order Value</td>
                <td style={{textAlign:"right"}}>₹{orderData.shippingAmount + orderData.orderAmount}</td>
              </tr>
              <tr style={{ background: "#E4ECFF" }}>
                <td style={{textAlign:"left"}}>Settlement Amount</td>
                <td style={{textAlign:"right"}}>₹{orderData.shippingAmount + orderData.orderAmount}</td>
              </tr>
            </tbody>
          </table>
          <div className={s.paymentFooter}>
            <h6>Settlement Amount Calculation</h6>
            <p>
              Total Item(s) Amount <img src={MinusCircle} style={{maxWidth:"18px",  verticalAlign:"sub"}} /> Kiko Comission(3%
              on Total Items) <img src={Pluscircle} /> Delivery Charges
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openOrder}
        toggle={() => {
          setOpenOrder(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        className="viewOrder"
        centered
      >
        <div className="container pb-3">
          <div className="view-order-modal">
            <ModalHeader className="pe-0 ps-0">
              View Order
              <img
                src={crossIcon}
                onClick={() => {
                  setOpenOrder(false);
                }}
              />
            </ModalHeader>
            <ModalBody className="p-0">
              <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                <p className="m-0">Order Id:{orderData.orderId} </p>
                <p className="m-0">
                  Print Invoice <Printer />{" "}
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 pb-2">
                <p className="m-0">Customer Name:{orderData.buyerName}</p>
                <p className="m-0">
                  Mobile Number:{orderData.buyerPhoneNumber}
                </p>
              </div>
              <p className="mb-1 py-2">
                Address :{" "}
                {orderData?.userAddress?.address_line2
                  ? orderData?.userAddress?.address_line2
                  : "" + "," + orderData?.userAddress?.address_line1
                  ? orderData?.userAddress?.address_line1
                  : ""}
              </p>
              <div className="tabel-responsive">
                <table className="global-table">
                  <thead style={{ background: "#EFF3FD" }}>
                    <tr>
                      <th>Sr No.</th>
                      <th>Product Name</th>
                      <th>Net Weight</th>
                      <th>Quantity</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody className="view-order-body">
                    {orderData.cartItem &&
                      orderData.cartItem.map((order, index) => {
                        return (
                          <tr>
                            <th className="text-start">{index + 1}</th>
                            <td>{order?.id?.productName}</td>
                            <td>
                              {order?.id?.weight + "" + order?.id?.weightUnit}
                            </td>
                            <td>{order?.quantity?.count}</td>
                            <td className="text-end">{order?.price}</td>
                            {/* <td>
                                                                <span className="date-time">{moment(order?.createdAt).format("DD MMM YYYY") + " at " + moment(order?.createdAt).format("hh:mm A")}</span>
                                                            </td>
                                                            <td>{nomenclature(order?.createdFrom)}</td>
                                                            <td><span onClick={() => { setorderData(order); setOpenOrder(true) }} style={{ cursor: "pointer", textDecoder: "underline" }}>{order?.orderId}</span></td>
                                                            <td>{nomenclature(order?.orderPaymentMode)}</td>
                                                            <td>{order?.buyerName}</td>
                                                            <td>{order?.buyerPhoneNumber}</td>
                                                            <td>{order?.orderAmount}</td>
                                                            <td className={s.Settlementamount} style={{ cursor: "pointer" }}><span onClick={() => { setPaymentInfo(true) }} >{order?.settlementData ? order?.settlementData?.amount : order?.orderAmount + order?.shippingAmount}</span></td>
                                                            <td><p className={s.PaymentStatus}>{order?.settlementData?.status == 'completed' ? <span className={s.Paid}>Paid</span> : order?.settlementData?.status == 'rejected' ? <span className={s.Reject}>Reject</span> : <span className={s.Pending}>Pending</span>}</p></td>
                                                            <td>N/A</td>
                                                            <td><span className="date-time">{moment(order?.settlementData?.date).format("DD MMM YYYY") + " at " + moment(order?.settlementData?.date).format("hh:mm A")}</span></td>
                                                            <td>{order?.settlementData?.remark}</td> */}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="d-flex align-items-center justify-content-between ps-2 pe-2">
                <span>Order amount (Inclusive Of All Tax)</span>
                <span>₹{orderData?.orderAmount}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 mt-2 mb-2 ps-2 pe-2">
                <span>Delivery charges</span>
                <span>₹{orderData?.shippingAmount}</span>
              </div>
            </ModalBody>
            <ModalFooter
              className="justify-content-between footer-total-amount"
            >
              <p className="m-0">
                Total amount
              </p>
              <p className="m-0" >
                ₹{orderData?.orderAmount + orderData?.shippingAmount}
              </p>
            </ModalFooter>
            <p className="error">
              *Marked item(s) are requested for return/replacement.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Payment;
