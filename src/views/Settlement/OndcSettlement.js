import React, { useState, useEffect } from "react";
import Coin from "../../images/Payment/coins.svg";
//import SpeedDelivery from "../../images/Payment/speeddelivery.svg";
import PiggyBank from "../../images/Payment/piggybank.svg";
import PaymentProcessed from "../../images/Payment/bank.svg";
//import WebsiteEarning from "../../images/Payment/website-earning.svg";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import crossIcon from "../../images/cross-icon.svg";
import { LoadingOutlined } from "@ant-design/icons";
import cartIcon from "../../images/Inventry/cart-icon.png";
import ONDCearning from "../../images/Payment/ondc-earning.svg";
//import Printer from "../../components/svgIcons/Printer";
import MinusCircle from "../../images/wallet/MinusCircle.svg";
import { ToastContainer, toast } from "react-toastify";
import { get } from "lodash";
import moment from "moment";
import ReactDOMServer from "react-dom/server";
import InvoiceTemplate from "../SellerInvoice/sellerInvoice";
import { CSVLink } from "react-csv";
import { Spin } from "antd";
import axios from "axios";
import s from "./Support.module.css";
import API from "../../api";
import {
  handleError,
  // nomenclature,
  notify,
  PaginationFilter,
  DateFilters,
  handleLogout
  // flutterDownloadPermission
} from "../../utils";
import { ONDC_PAYMENT_DATA, INVOICE_MONTHLY_DATA } from "../../api/apiList";
import * as turf from '@turf/turf';

const OndcSettlement = (props) => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const [user_data] = useState(getSellerDetails());
  const [search, setSearch] = useState("");
  const [clear, setclear] = useState(false);
  const [status, setStatus] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [PaymentInfo, setPaymentInfo] = useState(false);
  const [limit] = useState(20);
  const [page, setpage] = useState(1);
  const [count, setCount] = useState(0);
  const [tableLoading, setTableloading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [allCount, setAllCount] = useState({});
  const [orderData, setorderData] = useState({});
  const [singleOrderData, setSingleOrderData] = useState({});
  const [paymentData, setPaymentData] = useState([]);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [componentMounted, setComponentMounted] = useState(false);
  const [settlementStatus, setSettlementStatus] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportPayment, setexportPayment] = useState([]);
  const [itemData, setitemData] = useState([]);
  const [invoiceMonth, setInvoiceMonth] = useState("");
  // const [paymentDataExport, setPaymentDataExport] = useState([]);
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);

  const handleCheck = (latitude, longitude) => {
    const point = turf.point([longitude, latitude]);
    const madhyaPradeshBoundary = turf.polygon([
      [
        [74.7278, 22.1607],
        [74.7278, 26.8657],
        [82.5825, 26.8657],
        [82.5825, 22.1607],
        [74.7278, 22.1607]
      ]
    ]);
    const isInMP = turf.booleanPointInPolygon(point, madhyaPradeshBoundary);
    // setIsInMadhyaPradesh(isInMP);
    return isInMP;
  };

  const onPageChanged = (page) => {
    setpage(page);
  };
  const getSellerToken = () => {
    try {
      return JSON.parse(localStorage.getItem("token") || "");
    } catch (error) {
      return null;
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (componentMounted) {
      getPayment();
    } else {
      setComponentMounted(true);
    }
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [componentMounted, status, page]);

  useEffect(() => {
    if (
      startDate === "" &&
      search === "" &&
      endDate === "" &&
      clear &&
      settlementStatus === "" &&
      paymentMode === ""
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
      if (startDate !== "" && endDate !== "") {
        var sDate = new Date(startDate);
        obj.startDate = sDate.setDate(sDate.getDate() + 1);
        var eDate = new Date(endDate);
        obj.endDate = eDate.setDate(eDate.getDate() + 1);
      }
      const response = await API.post(ONDC_PAYMENT_DATA, obj);
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
  const invoiceDetail = async () => {
    try {
      setInvoiceLoading(true);
      const obj = {
        month: invoiceMonth,
        userId: user_data?._id,
      };
      const response = await API.post(INVOICE_MONTHLY_DATA, obj);
      setOpenInvoiceModal(false)
      if (response.data.success) {
        let isFromMp = handleCheck(user_data?.storeAddress?.latitude, user_data?.storeAddress?.longitude)
        const data = response.data.result
        data.isMp = isFromMp
        printAndOpenInvoice(data)
        setInvoiceLoading(false);
        setInvoiceMonth("")
      }
    } catch (error) {
      setOpenInvoiceModal(false)
      setInvoiceLoading(false);
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
      if (page === 1) {
        getPayment();
      }
      else {
        onPageChanged(1);
      }
    }
  };

  const itcHandler = async (file) => {
    const args = [file, `ondcSettlement.csv`];
    await window.flutter_inappwebview.callHandler('downloadFile', ...args).then(result => {
      if (result) {
        alert(`File Downloaded, Please Check in Downloads Folder`);
      } else {
        alert(`Somethng went wrong, please try again later`);
      }
    })
      .catch(error => {
        alert("Somethng went wrong, please try again later");
      });

  }

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
        itc: window.flutter_inappwebview
      };
      const response = await API.post(ONDC_PAYMENT_DATA, obj);
      if (response?.data?.success) {
        let paymentDataExport = response?.data?.result?.totalData?.sample;
        let exportData = [];
        paymentDataExport.forEach((order, index) => {
          const obj = {
            sno: index + 1,
            date: moment(order?.createdAt).format("DD MMM YYYY"),
            time: moment(order?.createdAt).format("hh:mm A"),
            orderSource: order?.context?.bap_id,
            orderID: order?.orderId,
            customerName: order?.userAddress?.contactName,
            customerPhone: order?.userAddress?.contactPhone,
            orderAmount: order?.orderAmount,
            totalAmount: parseFloat(get(order, "orderAmount", 0)) + parseFloat(get(order, "shippingAmount", 0)),
            kikoCommission: order?.settlementData?.tcsIt ?
              parseFloat(
                (
                  parseFloat(order?.shippingAmount) +
                  parseFloat(order?.orderAmount)
                ) * parseFloat(order?.kikoCommission?.value) + order?.settlementData?.tcsIt + order?.settlementData?.tcsGst
              ).toFixed(2) :
              parseFloat(
                (
                  parseFloat(order?.shippingAmount) +
                  parseFloat(order?.orderAmount)
                ) * parseFloat(order?.kikoCommission?.value)
              ).toFixed(2),
            deliveryCharges: order?.shippingAmount,
            orderValue: order?.orderAmount,
            settlementAmount:
              order?.settlementData.amount ? order?.settlementData?.amount.toFixed(2)
                : parseFloat(order?.orderAmount) +
                parseFloat(order?.shippingAmount)
            ,
            additionalDeductions:  order?.additionalCharges ?parseFloat(order?.additionalCharges):0,
            paymentStataus: order?.settlementData?.status,
            txnId: "-",
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
      else if (response?.data?.isItc) {
        itcHandler(response?.data?.data?.allExportData?.file_url)
        setExportLoading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getItems = async (order, state, deliveryPartnerTaskId) => {
    setOpenOrder(true);
    setModalLoading(true);
    const token = getSellerToken();
    const orderId = order?._id
    const version = order?.context?.core_version
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/get-single-order-detail`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderId: orderId,
      },
    };
    try {
      const response = await axios(options);
      if (response) {

        setitemData(response?.data?.data?.itemRes);
        setSingleOrderData(response?.data?.data?.otherData);
      }
      setModalLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const printAndOpenInvoice = async (result) => {
    const printWindow = window.open("", "_blank");
    const renderPromise = new Promise((resolve) => {
      const invoiceMarkup = ReactDOMServer.renderToStaticMarkup(
        <InvoiceTemplate orderData={result} month={invoiceMonth} />
      );
      printWindow.document.write(invoiceMarkup);
      printWindow.document.close();
      setTimeout(() => {
        resolve();
      }, 500);
    });
    await renderPromise;
    printWindow.print();
  };

    const getPackingAmount = (data) => {
    if (data && data.price && data.price.value && data.breakup) {
      let total = 0;
      for (const item of data.breakup) {
        if (item.title === "Packing charges" && item.price && item.price.value) {
          total = parseFloat(item.price.value);
        }
      }
      return parseFloat(total.toFixed(2)); // Round to 2 decimal places
    }
    return 0;
  };

  function convertToCSV(data, headings) {
    const headerRow = headings.map((heading) => heading.label).join(",");
    const dataRows = data.map((row) => {
      return headings
        .map((heading) => {
          const key = heading.key;
          let cell = row[key];
          if (typeof cell === "string" && cell.includes(",")) {
            cell = `"${cell}"`;
          }
          return cell;
        })
        .join(",");
    });
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
    // { label: "Total Order Amount", key: "orderValue" },
    { label: "Ondc Commission", key: "kikoCommission" },
    { label: "Delivery Charges", key: "deliveryCharges" },
    { label: "Total Order Value", key: "totalAmount" },
    { label: "Additional Deductions", key: "additionalDeductions" },
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
      <div className="RightBlock" style={isMobile ? { "width": "100%", "left": "0", "top": isAppView === "true" ? "0px" : "68px" } : {}} >
        <div className="section-title">
          <h1 className="mb-0">Ondc Settlement</h1>

          <div className="order-data-btn">
            <button
              className="btn me-2 btn-primary"
              onClick={exportPayments}

              disabled={exportLoading}
            >
              {exportLoading ? "Loading..." : "Download"}
            </button>
            {!window?.flutter_inappwebview &&
              <button className="btn me-2 btn-primary" onClick={() => { setOpenInvoiceModal(true) }}>Monthly Invoice</button>
            }</div>
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
        <div>
          <ul className={`${s.PaymentCards}`} role="tablist">
            <li
              className={`nav-item ${s.processingCard} active`}
              onClick={() => {
                setStatus("");
              }}
            >
              <a data-toggle="tab" href="#1a">
                <img src={Coin} className={s.cardIcon} alt="" />
                <h6 className={s.cardTitle}>Total Earnings</h6>
                <h3 className={s.rate}>
                  ₹
                  <span>
                    {allCount.websiteCompletePayment
                      ? parseFloat(
                        allCount?.websitePendingPayment +
                        allCount?.websiteCompletePayment
                      ).toFixed(2)
                      : 0}
                  </span>
                </h3>
              </a>
            </li>
            <li
              className={`nav-item ${s.processingCard}`}
              onClick={() => {
                setStatus("rejected");
              }}
            >
              <a data-toggle="tab" href="#3a">
                <img src={ONDCearning} className={s.cardIcon} alt="" />
                <h6 className={s.cardTitle}>Settlement Rejected</h6>
                <h3 className={s.rate}>
                  ₹
                  <span>
                    {allCount.websitePendingRejected
                      ? allCount.websitePendingRejected.toFixed(2)
                      : 0}
                  </span>
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
                <img src={PiggyBank} className={s.cardIcon} alt="" />
                <h6 className={s.cardTitle}>Settlement Pending</h6>
                <h3 className={s.rate}>
                  ₹
                  <span>
                    {allCount?.websitePendingPayment
                      ? allCount?.websitePendingPayment.toFixed(2)
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
                <img src={PaymentProcessed} className={s.cardIcon} alt="" />
                <h6 className={s.cardTitle}>Settlement Received</h6>
                <h3 className={s.rate}>
                  ₹
                  <span>
                    {allCount?.websiteCompletePayment
                      ? allCount?.websiteCompletePayment.toFixed(2)
                      : 0}
                  </span>
                </h3>
              </a>
            </li>
          </ul>

        </div>
        <div className={s.filter}>
          <div>
            <label>Filter By:</label>
          </div>
          <span className="m-0 d-flex flex-wrap gap-0 filterBlock">
            <DateFilters
              changeStartDate={(date) => setstartDate(date)}
              changeEndDate={(date) => setendDate(date)}
              startDate={startDate}
              endDate={endDate}
              title={"Order Date"}
            />
          </span>
          <span className={s.filterList}>
            <label>Customer Name/Mobile Number/Transaction ID/Order ID</label>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </span>
          <span>
            <button
              onClick={() => {
                validation();
              }}
              disabled={
                search === "" &&
                  startDate === "" &&
                  paymentMode === "" &&
                  settlementStatus === "" &&
                  endDate === ""
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
                search === "" &&
                  startDate === "" &&
                  paymentMode === "" &&
                  settlementStatus === "" &&
                  endDate === ""
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
          <div>
            <div className="tab-content">
              <div id="1a" className="tab-pane active">
                <h4
                  className={s.settlementHeading}
                  style={
                    status === "websiteEarning"
                      ? { color: "#7459AF" }
                      : status === "ondcEarning"
                        ? { color: "#005298" }
                        : status === "pending"
                          ? { color: "#FBAE17" }
                          : status === "completed"
                            ? { color: "#2C067B" }
                            : { color: "#117C57" }
                  }
                >
                  {status === "rejected"
                    ? "Settlement Rejected"
                    : status === "ondcEarning"
                      ? "ONDC Earnings"
                      : status === "pending"
                        ? "Settlement Pending"
                        : status === "completed"
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
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody className={s.globalBody}>
                          {paymentData.map((order) => {
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
                                <td>
                                  {order?.context?.bap_id}
                                </td>
                                <td className={s.Settlementamount}>
                                  <span
                                    onClick={() => {
                                      getItems(order);
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
                                  {order?.orderPaymentMode === "SelfPayment"
                                    ? "COD"
                                    : "Kiko Payment"}
                                </td>
                                <td>{order?.name}</td>
                                <td>{order?.userAddress?.contactPhone}</td>
                                <td>
                                {(
                                    parseFloat(get(order, "orderAmount", 0)) + parseFloat(get(order, "shippingAmount", 0))
                                  ).toFixed(2)}
                                </td>
                                <td
                                  className={s.Settlementamount}
                                  style={{ cursor: "pointer" }}
                                >
                                  {order?.orderPaymentMode ===
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
                                        ? order?.settlementData?.amount.toFixed(
                                          2
                                        )
                                        : parseFloat(order?.orderAmount) +
                                        parseFloat(order?.shippingAmount)}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {order?.orderPaymentMode ===
                                    "SelfPayment" ? (
                                    "-"
                                  ) : (
                                    <p className={s.PaymentStatus}>
                                      {order?.settlementData?.status ===
                                        "completed" ? (
                                        <span className={s.Paid}>Paid</span>
                                      ) : order?.settlementData?.status ===
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
                          <img src={cartIcon} alt="" />
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
                alt=""
              />
            </h1>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <td style={{ textAlign: "left" }}>Total Item(s) Amount</td>
                <td style={{ textAlign: "right" }}>₹{orderData?.orderAmount}</td>                
              </tr>
              {orderData.createdFrom !== "microwebsite" && (                
                <tr>
                  <td style={{ textAlign: "left" }}>ONDC Comission(5% + Charges + Taxes)</td>
                  { orderData?.context?.domain === "ONDC:RET10" && <td style={{ textAlign: "right" }}>₹{
                    orderData?.context?.domain === "ONDC:RET11"
                      ?
                      //  parseFloat(orderData?.kikoCommission?.value || 0).toFixed(2)
                      ((parseFloat(get(orderData, "orderAmount", 0))+parseFloat(get(orderData, "shippingAmount", 0)) +parseFloat(getPackingAmount(get(orderData, "quote", 0)))) *0.118).toFixed(2) // logic from dashboatrd
                   
                      : (
                    orderData?.settlementData?.tcsIt ?
                      parseFloat(
                        (
                          parseFloat(orderData?.shippingAmount) +

                          parseFloat(orderData?.orderAmount)
                        ) * parseFloat(orderData?.kikoCommission?.value) + orderData?.settlementData?.tcsIt + orderData?.settlementData?.tcsGst
                      ).toFixed(2) :
                      parseFloat(
                        (
                          parseFloat(orderData?.shippingAmount) +

                          parseFloat(orderData?.orderAmount)
                        ) * parseFloat(orderData?.kikoCommission?.value)
                      ).toFixed(2)
                    )
                  
                  }</td>}
                { orderData?.context?.domain === "ONDC:RET11" && <td style={{ textAlign: "right" }}>₹{
                   orderData?.context?.domain === "ONDC:RET11"
                   ? (
                   parseFloat(orderData?.kikoCommission?.value || 0) +
                   parseFloat(orderData?.settlementData?.tcsIt || 0) +
                   parseFloat(orderData?.settlementData?.tcsGst || 0)
                   ).toFixed(2)
                   : (
                   orderData?.settlementData?.tcsIt
                   ? (
                   (
                   orderData?.context?.bap_id === "prod.nirmitbap.ondc.org"
                   ? 0
                   : get(orderData, "shippingAmount", 0) +
                   parseFloat(orderData?.orderAmount)
                   ) *
                   parseFloat(orderData?.kikoCommission?.value) +
                   orderData?.settlementData?.tcsIt +
                   orderData?.settlementData?.tcsGst
                   ).toFixed(2)
                   : (
                   (
                   orderData?.context?.bap_id === "prod.nirmitbap.ondc.org"
                   ? 0
                   : get(orderData, "shippingAmount", 0) +
                   parseFloat(orderData?.orderAmount)
                   ) * parseFloat(orderData?.kikoCommission?.value)
                   ).toFixed(2)
                   )
                }</td>}
                </tr>
              )}
              <tr>
                <td style={{ textAlign: "left" }}>Delivery Charges</td>
                <td style={{ textAlign: "right" }}>₹{ orderData?.context?.bap_id
                  ==="prod.nirmitbap.ondc.org" && orderData?.context?.domain === "ONDC:RET11"  ? 0 : get(orderData, "shippingAmount", 0)}</td>
              </tr>
              <tr style={{ background: "#F1F1F1" }}>
                <td style={{ textAlign: "left" }}>Total Order Value</td>
                <td style={{ textAlign: "right" }}>
                  ₹
                  {(orderData?.context?.bap_id
                    ==="prod.nirmitbap.ondc.org" && orderData?.context?.domain === "ONDC:RET11" ? 0 : parseFloat(get(orderData, "shippingAmount", 0))) +
                    parseFloat(orderData?.orderAmount)}
                </td>
              </tr>
              <tr style={{ background: "#F1F1F1" }}>
                <td style={{ textAlign: "left" }}>Additional Deductions</td>
                <td style={{ textAlign: "right" }}>
                  ₹
                  {orderData?.additionalCharges ? orderData?.context?.bap_id
                  ==="prod.nirmitbap.ondc.org"  && orderData?.context?.domain === "ONDC:RET11" ? 0 : parseFloat(orderData?.additionalCharges):0}
                </td>
              </tr>
              <tr style={{ background: "#E4ECFF" }}>
                <td style={{ textAlign: "left" }}>Settlement Amount</td>
                <td style={{ textAlign: "right" }}>
                  ₹{parseFloat(orderData?.settlementData?.amount.toFixed(2))}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={s.paymentFooter}>
            <h6>Settlement Amount Calculation</h6>
            <p>
              Total Order Value <img src={MinusCircle} alt="" style={{ maxWidth: "18px", verticalAlign: "sub" }} /> ONDC Comission(5% + Taxes)
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
        className="viewOrder viewOrderXl"
        centered
      >
        {modalLoading ? (
          <Spin indicator={antIcon} />
        ) : (
          <div className="container pb-3">
            <div className="view-order-modal">
              <ModalHeader className="pe-0 ps-0">
                View Order
                <img
                  src={crossIcon}
                  onClick={() => {
                    setOpenOrder(false);
                  }}
                  alt=""
                />
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                  <p className="m-0">
                    Order Id: <b>{singleOrderData?.orderId}</b>{" "}
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 pb-2">
                  <p className="m-0">
                    Customer Name:{singleOrderData?.customerName}
                  </p>
                  <p className="m-0">Mobile Number:{singleOrderData?.phone}</p>
                </div>
                <p className="mb-1 py-2">
                  Address :
                  {singleOrderData?.address?.address?.building &&
                    singleOrderData?.address?.address?.building[0].toUpperCase() +
                    singleOrderData?.address?.address?.building.slice(1)}{" "}
                  {singleOrderData?.address?.address?.locality}{" "}
                  {singleOrderData?.address?.address?.area_code}
                </p>
                <div className="tabel-responsive">
                  <table className="global-table">
                    <thead style={{ background: "#EFF3FD" }}>
                      <tr>
                        <th>Sr No.</th>
                        <th className="text-center">Product Name</th>
                        <th className="text-center">Net Weight</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Price</th>
                      </tr>
                    </thead>
                    <tbody className="view-order-body">
                      {itemData &&
                        itemData.map((item, index) => {
                          return (
                            <tr>
                                  {/* <th className={item?.tags !== "" ? "strikeout1" : ""}>{index + 1}</th> */}
                              <th className="text-start">{index + 1}</th>
                              <td>
                                {item?.productName &&
                                  item?.productName[0].toUpperCase() +
                                  item?.productName.slice(1)}
                              </td>
                              <td>
                                {item?.weight}
                                {item?.weightUnit}
                              </td>
                              <td>{item?.quantity?.count}</td>
                              <td className="text-end">
                                {item?.discountedPrice
                                  ? parseFloat(item?.discountedPrice).toFixed(2)
                                  : ""}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center justify-content-between py-2 ps-2 pe-2">
                  <span>Order amount (Inclusive Of All Tax)</span>
                  <span>
                    ₹{parseFloat(singleOrderData?.orderAmount).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
                  <span>Delivery charges</span>
                  <span>
                    ₹
                    {parseFloat(singleOrderData?.deliveryChargesValue).toFixed(
                      2
                    )}
                  </span>
                </div>
              </ModalBody>
              <ModalFooter
                className="justify-content-between footer-total-amount"
              >
                <p className="m-0" >
                  Total amount
                </p>
                <p className="m-0">
                  ₹
                  {parseFloat(singleOrderData?.orderAmount) +
                    parseFloat(singleOrderData?.deliveryChargesValue)}
                </p>
              </ModalFooter>
              <p className="error">
                *Marked item(s) are requested for return/replacement.
              </p>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={openInvoiceModal}
        onClose={() => {
          setOpenInvoiceModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        size="sm"
        centered
      >
        {invoiceLoading ? (
          <Spin indicator={antIcon} className="invoice-loader" />
        ) : (
          <div className="container p-4">
            <div className="pt-2 pb-3">
              <h4 className="edit-title text-center mb-0">
                Please Select Month
              </h4>
              <div className="edit-para mt-3 mb-1 text-center">
                <input
                  type="month"
                  className="form-control date-picker full-width"
                  value={invoiceMonth}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(event) => {
                    const selectedMonth = new Date(
                      event.target.value + "-01"
                    );
                    const currentMonth = new Date();
                    if (selectedMonth <= currentMonth) {
                      setInvoiceMonth(event.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-1">
              <button
                className="btn btn-primary btn-sm"
                disabled={invoiceMonth === ""}
                onClick={() => {
                  invoiceDetail()
                }}
              >
                 Invoice
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setOpenInvoiceModal(false);
                  setInvoiceMonth("")
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default OndcSettlement;
