import React, { useState, useEffect } from "react";
// import { get } from "lodash";
import "./styles.scss";
import moment from "moment";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
// import Rupee from "../../images/rupee.svg";
// import Shop from "../../images/wallet/wallet-img.png";
import { Spin } from "antd";
import cartIcon from "../../images/Inventry/cart-icon.png";
import { LoadingOutlined } from "@ant-design/icons";
import AddMoney from "../../images/wallet/AddMoney.svg";
import successfullImg from "../../images/wallet/successfull.png";
import rejectImg from "../../images/wallet/rejection.png";
import Transaction from "../../images/wallet/All transaction.svg";
import AddedMoney from "../../images/wallet/Added.svg";
import PaidMoney from "../../images/wallet/Paid.svg";
import InfoDark from "../../images/wallet/Info-dark.svg";
import crossIcon from "../../images/cross-icon.svg";
import blueCurrency from "../../images/wallet/blue-currency.svg";
import DarkBlueCurrency from "../../images/wallet/darkblue-currency.svg";
import {
  handleError,
  notify,
  DateFilters,
  PaginationFilter,
  CsvGenerator,
  // handleLogout,
} from "../../utils";
import APIKIKO from "../../api/api_kiko.js";
import { ToastContainer, toast } from "react-toastify";
import { WALLET_DATA } from "../../api/apiList";
import { useLocation, useNavigate } from "react-router-dom";

const Wallet = () => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const location = useLocation();
  const payment = location.state;
  const user_data = getSellerDetails();
  const [walletInfo, setWalletInfo] = useState(false);
  const [addMoney, setAddMoney] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportWallet, setexportWallet] = useState([]);
  const [tableLoading, setTableloading] = useState(false);
  const [page, setpage] = useState(1);
  const [status, setStatus] = useState("");
  const [limit] = useState(20);
  // const [componentMounted, setComponentMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [coinAmount, setCoinAmount] = useState(100);
  const [transactionDetail, setTransactionDetail] = useState([]);
  const [search] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [clear, setclear] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");

  const getWalletDATA = async () => {
    const obj = {
      status: status,
      limit: 20,
      page: page,
      startDate: startDate,
      endDate: endDate,
      keyword: searchOrderId,
    };
    if (startDate !== "" && endDate !== "") {
      var sDate = new Date(startDate);
      obj.startDate = sDate.setDate(sDate.getDate() + 1);
      var eDate = new Date(endDate);
      obj.endDate = eDate.setDate(eDate.getDate() + 1);
    }
    setTableloading(true);
    try {
      const walletData = await APIKIKO.post(WALLET_DATA, obj);
      if (walletData) {
        setTableloading(false);
        setclear(false);
        setTransactionDetail(
          walletData.data.data.paymentHistoriesArr[0].sample
        );
        setCount(
          walletData.data.data.paymentHistoriesArr[0].count[0]
            ? walletData.data.data.paymentHistoriesArr[0].count[0].count
            : 0
        );
      } else {
        setTableloading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const exportWallets = () => {
    setExportLoading(true);
    let exportWallet = [];
    transactionDetail.forEach((data, index) => {
      const obj = {
        srNo: index + 1,
        date:
          moment(data?.createdAt).format("DD MMM YYYY") +
          " at " +
          moment(data?.createdAt).format("hh:mm A"),
        ondcId: data?.rawCharges?.id,
        remark: data?.paymentType === "addwallet" ? "Add Wallet" : data?.remark,
        amount: data?.amount,
        bonusAmount: data?.bonusAmount,
        closingBalance: data?.closingBalance,
      };
      exportWallet.push(obj);
      setexportWallet(exportWallet);
    });
    setExportLoading(false);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const navigate = useNavigate();

  const clearState = () => {
    setclear(true);
    setstartDate("");
    setSearchOrderId("");
    setendDate("");
  };

  useEffect(() => {
    getWalletDATA();
  }, [status, page, clear]);

  const onPageChanged = (page) => {
    setpage(page);
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
        getWalletDATA();
       }
     else {
      onPageChanged(1);
     }
    }
  };

  // useEffect(() => {
  //   const userData = getSellerDetails();
  //   if (componentMounted) {
  //     if ((get(userData, "_id", "") && get(userData, "_id", "") !== "")) {
  //       getWalletDATA();
  //     } else {
  //       handleLogout();
  //       navigate("/");
  //     }
  //   } else {
  //     setComponentMounted(true);
  //   }
  // }, [componentMounted]);

  const headings = [
    { label: "SrNo.", key: "srNo" },
    { label: "Date & Time.", key: "date" },
    { label: "Order ID/TXNID", key: "ondcId" },
    { label: "Remark", key: "remark" },
    { label: "Amount ", key: "amount" },
    { label: "Bonus", key: "bonusAmount" },
    { label: "Closing Balance", key: "closingBalance" },
  ];

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="KikoDashboardWrapper">
        <div className="dashboardWrapper">
          {/* <SideBar /> */}
          <div className="RightBlock">
            {/* <div className="section-heading">
              <h1 className="heading">Welcome to Kiko Live</h1>
            </div> */}
            <div className="section-title">
              <h1>
                Kiko Wallet{" "}
                <img
                  src={InfoDark}
                  alt="icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setWalletInfo(true);
                  }}
                />
              </h1>

              {!window?.flutter_inappwebview &&
                <div className="subheader-btn">
                  <CsvGenerator
                    data={exportWallet}
                    headings={headings}
                    fileName={"Wallet.csv"}
                    onClick={exportWallets}
                    buttonName={"Download Transaction"}
                    exportLoading={exportLoading}
                  />
                </div>}
            </div>
            <div className="container-main pt-3">
              <div className="row">
                <div className="col-lg-12">
                  <div className="location-balance-container">
                    {/* <div className="address-block">
                      <div className="shop-thumb">
                        <img src={Shop} alt="Shop" />
                      </div>
                      <div className="address-detail">
                        <ul>
                          <li>
                            AVAIL <span>1X BONUS</span> ON TOP-UP AMOUNT!
                          </li>
                          <li>
                            <p>
                              Example: Add <strong>₹250</strong> in your wallet
                              and get <strong>₹250</strong> Bonus <br />
                              from Kiko Live. So your final Top-up in wallet
                              will be <strong>₹500</strong>
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                    <div className="available-balance-block">
                      <h5>Available Balance</h5>
                      <h6>
                        <img
                          src={DarkBlueCurrency}
                          alt="icon"
                          className="me-1"
                        />
                        {user_data?.walletBalance
                          ? parseFloat(user_data?.walletBalance)?.toFixed(2)
                          : 0}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-main mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <div className="wallet-action-container">
                    <div
                      className={`wallet-action-block ${addMoney ? "active" : ""
                        }`}
                      onClick={() => {
                        setAddMoney(true);
                      }}
                    >
                      <div className="icon-block">
                        <img src={AddMoney} alt="icon" />
                      </div>
                      <h6>Add Money</h6>
                    </div>
                    <div
                      className={`wallet-action-block ${status === "" && !addMoney ? "active" : ""
                        }`}
                      onClick={() => {
                        setAddMoney(false);
                        setStatus("");
                      }}
                    >
                      <div className="icon-block">
                        <img src={Transaction} alt="icon" />
                      </div>
                      <h6>All Transaction</h6>
                    </div>
                    <div
                      className={`wallet-action-block ${status === "credit" ? "active" : ""
                        }`}
                      onClick={() => {
                        setStatus("credit");
                        setAddMoney(false);
                      }}
                    >
                      <div className="icon-block">
                        <img src={AddedMoney} alt="icon" />
                      </div>
                      <h6>Added</h6>
                    </div>
                    <div
                      c
                      className={`wallet-action-block ${status === "debit" ? "active" : ""
                        }`}
                      onClick={() => {
                        setStatus("debit");
                        setAddMoney(false);
                      }}
                    >
                      <div className="icon-block">
                        <img src={PaidMoney} alt="icon" />
                      </div>
                      <h6>Paid</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {addMoney ? (
              <div className="wallet-details">
                <div className="enter-amount">
                  <div className="col-lg-4">
                    <div className="amount-block">
                      <h3>Enter Amount</h3>
                      <p>Minimum recharge amount: Rs 100</p>
                      <div className="amount-field">
                        <img src={blueCurrency} alt="icon" className="me-2" />
                        <input
                          type="text"
                          value={coinAmount}
                          onChange={(e) => {
                            const inputValue = e.target.value.trimStart();
                            if (inputValue === "" || Number(inputValue) > 0) {
                              setCoinAmount(inputValue);
                            }
                          }}
                        />
                      </div>
                      <div className="amount-btn-grp">
                        <button
                          className="btn-outline"
                          onClick={() => setCoinAmount(100)}
                        >
                          +100
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => setCoinAmount(500)}
                        >
                          +500
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => setCoinAmount(750)}
                        >
                          +750
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => setCoinAmount(1000)}
                        >
                          +1000
                        </button>
                      </div>
                      <div className="bottom-action">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          disabled={coinAmount < 100}
                          onClick={() => {
                            navigate("/preRazorpay", {
                              state: { coinAmount: parseFloat(coinAmount) },
                            });
                          }}
                        >
                          Add Amount
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="filter filterBlock mt-3">
                  <span>
                    <label>Filter By:</label>
                  </span>
                  <span className="m-0">
                    <DateFilters
                      changeStartDate={(date) => setstartDate(date)}
                      changeEndDate={(date) => setendDate(date)}
                      startDate={startDate}
                      endDate={endDate}
                      title={"Order Date"}
                    />
                  </span>
                  {/* <span>
                    <label className="me-2">Order ID / TXNID</label>
                    <input type="text" value={searchOrderId} className="date-picker" onChange={(e) => setSearchOrderId(e.target.value)} />
                  </span> */}
                  <span className="m-0">
                    <button
                      onClick={() => {
                        validation();
                      }}
                      disabled={
                        search === "" &&
                          startDate === "" &&
                          searchOrderId === "" &&
                          endDate === ""
                          ? true
                          : false
                      }
                      className="btn btn-sm btn-primary me-2"
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
                          searchOrderId === "" &&
                          endDate === ""
                          ? true
                          : false
                      }
                      className="btn btn-sm btn-outline"
                    >
                      Clear
                    </button>
                  </span>
                </div>
                <div>
                  {transactionDetail.length > 0 ? (
                    <div className="table-responsive">
                      {tableLoading ? (
                        <Spin indicator={antIcon} className="loader" />
                      ) : (
                        <table className="global-table">
                          <thead>
                            <tr>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Date & Time{" "}
                              </th>
                              <th>Order ID/TXNID</th>
                              <th>Remark</th>
                              <th>Amount</th>
                              <th>Bonus</th>
                              <th>Closing Balance</th>
                            </tr>
                          </thead>
                          <tbody className="kiko-wallet-body">
                            {transactionDetail.map((data) => (
                              <tr>
                                <td>
                                  <span className="date-time">
                                    {moment(data?.createdAt).format(
                                      "DD MMM YYYY"
                                    ) +
                                      " at " +
                                      moment(data?.createdAt).format(
                                        "hh:mm A"
                                      )}
                                  </span>
                                </td>
                                <td>
                                  {data.kikoOrderId.length !== 0
                                    ? data.kikoOrderId[0]
                                    : data.ondcOrderId.length !== 0
                                      ? data.ondcOrderId[0]
                                      : data?.rawCharges?.id ?? ""}
                                </td>
                                <td>
                                  {data?.paymentType === "addwallet"
                                    ? "Add Wallet"
                                    : data?.remark}
                                </td>
                                <td>
                                  <span className={data?.status==="debit"?"amount red":"amount green"}>
                                    {data?.status==="debit"?`- ₹${data.amount}`:`+ ₹${data.amount}`}
                                  </span>
                                </td>
                                <td>
                                  <span className="amount green">
                                    {data?.bonusAmount}
                                  </span>
                                </td>
                                <td>
                                  <span className="amount">
                                    {data?.closingBalance?.toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            ))}
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
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={payment?.transection === "success"}
        onClose={() => {
          navigate("/wallet");
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="wallet-modal">
          <h1 className="success-heading">Congratulations!</h1>
          <div className="center-img">
            <img className="modal-success-image" src={successfullImg} alt="Success" />
          </div>
          <h6 className="wallet-para">Wallet Recharge Done Successfully!</h6>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success"
              onClick={() => {
                navigate("/wallet");
              }}
            >
              View Balance
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={payment?.transection === "fail"}
        onClose={() => {
          navigate("/wallet");
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="wallet-modal">
          <h1 className="reject-heading">Oh..Sorry!</h1>
          <div className="center-img">
            <img src={rejectImg} alt="" />
          </div>
          <h6 className="wallet-para">Something Went wrong.</h6>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger"
              onClick={() => {
                navigate("/wallet");
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={walletInfo}
        toggle={() => {
          setWalletInfo(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
        centered
      >
        <ModalHeader>
          Information
          <img
            src={crossIcon}
            onClick={() => {
              setWalletInfo(false);
            }}
            alt=""
          />
        </ModalHeader>
        <ModalBody>
          <div className="information-wallet">
            <div className="information-list">
              <h1>What is Kiko Wallet?</h1>
              <p>
                Kiko Wallet is a <b>digital wallet or e-wallet</b> specifically
                designed for conducting financial transactions within the Kiko
                Live platform.
              </p>
            </div>
            <div className="information-list">
              <h1>Who can use Kiko Wallet?</h1>
              <p>
                Kiko Wallet can be used only by <b>Kiko sellers</b>.
              </p>
            </div>
            <div className="information-list">
              <h1>Why use Kiko Wallet?</h1>
              Use Kiko wallet to,
              <ul className="wallet-list">
                <li>
                  Avail <b>attractive offers</b> on wallet top-up.
                </li>
                <li>
                  Use Kiko's highly <b>economical delivery</b> services as
                  payment for the same can only be done via the Kiko wallet.
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default Wallet;
