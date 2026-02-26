import React, { useEffect, useState } from "react";
import upiicon from "../Razorpay/images/p_type_upi.svg";
import paytm from "../Razorpay/images/p_type_paytm.svg";
import gpay from "../Razorpay/images/p_type_gpay.svg";
import phonepay from "../Razorpay/images/p_type_phonePe.svg";
import RazorpayModule from "./Razorpay.js";
import crossIcon from "../../images/cross-icon.svg";

const PreRazorpay = (props) => {
  const [paymentMethod, setPaymentMethod] = useState("upi");

  useEffect(() => {
    if (!props?.pixelId) return;

    import("./initiatePixel").then((module) => {
      module.initializeFacebookPixel(props?.pixelId);
    });
  }, [props?.pixelId])

  return (
    <>
      <div className="KikoDashboardWrapper subscribe-modal-webinar">
        <div className="dashboardWrapper">
          <div className="RightBlock">
            <header className="header-top">
              PAYMENTS
              {/* {fromSellerRegistration && */}
                <button onClick={() => { props.setOpenPreRazorpayModal(false) }} className="backbtn">
                  <img src={crossIcon} />
                </button>
                {/* } */}
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
                    <span>₹ {props?.amount?.toFixed(2)}</span>
                  </li>
                  <li className="gray-colout-text">
                    <span>Transaction fees</span> <span>₹ 0</span>
                  </li>
                  <li className="blue-colour-text">
                    <span>Final amount</span>{" "}
                    <span>₹ {props?.amount?.toFixed(2)}</span>
                  </li>
                </ul>
                <p className="bonus-application">
                  <span>**</span>Bonus applicable as per offer on Amount entered
                </p>
              </div>
              <div className="proceed__btn-wrapper">
                <RazorpayModule
                    paymentMethod={paymentMethod}
                    orderAmount={props?.amount}
                    onPaymentResponse={props?.onPaymentResponse}
                    endPoint={props?.endPoint}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreRazorpay;