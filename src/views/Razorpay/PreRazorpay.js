import React, { Component, useEffect, useState } from "react";
import layouts from "./layouts.scss";
import upiicon from "./images/p_type_upi.svg";
import SideBar from "../SideBar/SideBar";
import paytm from "./images/p_type_paytm.svg";
import gpay from "./images/p_type_gpay.svg";
import phonepay from "./images/p_type_phonePe.svg";
import cardicon from "./images/p_type_card.svg";
import netbanking from "./images/p_type_netbanking.svg";
import wallet from "./images/p_type_wallet.svg";
import paylater from "./images/p_type_pay_latter.svg";
import RazorpayModule from "./Razorpay";
import APIKIKO from "../../api/api_kiko.js";
import { SETTING } from "../../api/apiList";
import { useLocation, useNavigate } from "react-router-dom";
import { notify } from "../../utils";
import crossIcon from "../../images/cross-icon.svg";

const PreRazorpay = (props) => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const user_data = getSellerDetails();
  const fromSellerRegistration = props?.from == "Registration"
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [bonusMultiple, setbonusMultiple] = useState(0);
  const location = useLocation();
  const coinAmount = fromSellerRegistration ? props?.coinAmount : location.state.coinAmount;
  const subscriptionType = fromSellerRegistration ? props?.subscriptionType : location.state?.subscriptionType;
  const subscriptionPlan = fromSellerRegistration ? props?.subscriptionPlan : location.state?.subscriptionPlan;
  const amount = fromSellerRegistration ? props?.amount : location.state?.amount;
  const paymentType = fromSellerRegistration ? props?.paymentType : location.state?.paymentType || "addwallet";
  const navigate = useNavigate();
  const settingData = async () => {
    const response = await APIKIKO.get(SETTING);
    if (response?.data?.success) {
      setbonusMultiple(response?.data?.setting?.bonusFrequency);
    } else {
      notify("error", response?.data?.message);
    }
  };

  useEffect(() => {
    settingData();
  }, []);

  const body = {
    sellerId: user_data && user_data._id ? user_data._id : "",
    amount: parseFloat(coinAmount),
    bonusAmount: Number((parseFloat(coinAmount) * bonusMultiple).toFixed(2)),
    paymentType: "addwallet",
    transactionFee:
      paymentMethod === "upi" ? 0 : parseInt((coinAmount * 2) / 100),
  };
  return (
    <>
      <div className="KikoDashboardWrapper">
        <div className="dashboardWrapper">
          {!fromSellerRegistration && <SideBar />}
          <div className="RightBlock">
            <header className="header-top">
              PAYMENTS
              {fromSellerRegistration &&
                <button onClick={() => { props.setOpenPreRazorpayModal(false) }} className="backbtn">
                  <img src={crossIcon} />
                </button>}
            </header>
            <div className="container">
              <div className="main-content-wrapper">
                <h4 className="pre-razorpay-title">SELECT PAYMENT METHOD</h4>
                <div className="upi-card">
                  <div className="checkbox">
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      name="radio"
                    />
                    <span
                      onClick={() => setPaymentMethod("upi")}
                      className="checkmark"
                    ></span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className="card box-card-shadow"
                  >
                    <div className="upi-wrapper">
                      <img src={upiicon} className="upi-icon" alt="Upi Logo" />
                      <div>
                        <p className="card-heading">UPI</p>
                        <img
                          src={paytm}
                          className="paytmicon"
                          alt="Paytm Logo"
                        />
                        <img src={gpay} className="gpayicon" alt="Gpay Logo" />
                        <img
                          src={phonepay}
                          className="phonepayicon"
                          alt="PhonePe Logo"
                        />
                        <span className="more"> & More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="transaction-wrapper">
                <p className="transaction-title">
                  0% transaction fees applicable
                </p>
                <ul className="transaction-list">
                  <li className="gray-colout-text">
                    <span>Amount entered</span>{" "}
                    <span>₹ {coinAmount?.toFixed(2)}</span>
                  </li>
                  <li className="gray-colout-text">
                    <span>Transaction fees</span> <span>₹ 0</span>
                  </li>
                  <li className="blue-colour-text">
                    <span>Final amount</span>{" "}
                    <span>₹ {coinAmount?.toFixed(2)}</span>
                  </li>
                </ul>
                <p className="bonus-application">
                  <span>**</span>Bonus applicable as per offer on Amount entered
                </p>
              </div>
              <div className="main-content-wrapper-2nd">
                <div className="upi-card">
                  <div className="checkbox">
                    <input
                      value="other"
                      type="radio"
                      checked={paymentMethod === "other"}
                      name="radio"
                    />
                    <span
                      onClick={() => {
                        setPaymentMethod("other");
                      }}
                      className="checkmark"
                    ></span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("other")}
                    className="card box-card-shadow"
                  >
                    <div className="upi-wrapper">
                      <img
                        src={cardicon}
                        className="card-icon"
                        alt="Card Logo"
                      />
                      <div>
                        <p className="card-heading">Card</p>
                        <p className="bottom-text">
                          Visa, Mastercards, RuPay and maestro{" "}
                        </p>
                      </div>
                    </div>
                    <div className="upi-wrapper">
                      <img
                        src={netbanking}
                        className="card-icon"
                        alt="Card Logo"
                      />
                      <div>
                        <p className="card-heading">Netbanking</p>
                        <p className="bottom-text">All indian banks</p>
                      </div>
                    </div>
                    <div className="upi-wrapper">
                      <img src={wallet} className="card-icon" alt="Card Logo" />
                      <div>
                        <p className="card-heading">wallet</p>
                        <p className="bottom-text">Mobikwik & More </p>
                      </div>
                    </div>
                    <div className="upi-wrapper">
                      <img
                        src={paylater}
                        className="card-icon"
                        alt="Card Logo"
                      />
                      <div>
                        <p className="card-heading">Pay Later</p>
                        <p className="bottom-text">Simpl & More</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="transaction-wrapper">
                <p className="transaction-title">
                  2% transaction fees applicable
                </p>
                <ul className="transaction-list">
                  <li className="gray-colout-text">
                    <span>Amount entered </span>{" "}
                    <span>₹ {coinAmount?.toFixed(2)}</span>
                  </li>
                  <li className="gray-colout-text">
                    <span>Transaction fees</span>{" "}
                    <span>₹ {(coinAmount * 2) / 100}</span>
                  </li>
                  <li className="blue-colour-text">
                    <span>Final amount </span>{" "}
                    <span>₹ {coinAmount * 1.02}</span>
                  </li>
                </ul>
                <p className="bonus-application">
                  <span>**</span>Bonus applicable as per offer on Amount entered
                </p>
              </div>
              <div className="proceed__btn-wrapper">
                {fromSellerRegistration ?
                  <RazorpayModule
                    paymentMethod={paymentMethod}
                    paymentFrom={"sellerRegistration"}
                    transactionFee={paymentMethod === "other" ? (coinAmount * 2) / 100 : 0}
                    orderAmount={coinAmount}
                    paymentType={paymentType}
                    subscriptionType={subscriptionType}
                    subscriptionPlan={subscriptionPlan}
                    onPaymentResponse={props?.onPaymentResponse}
                  />
                  : <RazorpayModule
                    paymentMethod={paymentMethod}
                    transactionFee={
                      paymentMethod === "other" ? (coinAmount * 2) / 100 : 0
                    }
                    orderAmount={coinAmount}
                    paymentType={paymentType}
                    subscriptionType={subscriptionType}
                    subscriptionPlan={subscriptionPlan}
                  />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreRazorpay;