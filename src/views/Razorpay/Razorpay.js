import React, { useState } from "react";
import { get } from "lodash";
import axios from "axios";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";
// import Loader from "../../components/common/loader";
// import { sellerDetails } from '../../components/common/utils';
import APIKIKO from "../../api/api_kiko";
import { ADD_WALLET_MONEY } from "../../api/apiList";

const RazorpayModule = (props) => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const Razorpay = useRazorpay();
  const [loadingPayment, setLoadingPayment] = useState(false);
  let orderDetails = {};
  const orderAmount = props.orderAmount;
  const transactionFee = props.transactionFee;
  const paymentMethod = props.paymentMethod;
  const paymentType = props.paymentType || "addwallet";
  const subscriptionType = props.subscriptionType;
  const subscriptionPlan = props.subscriptionPlan;
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    const userData = getSellerDetails();
    const body = {
      sellerId: userData && userData._id ? userData._id : "",
      amount: parseFloat(orderAmount),
      // bonusAmount: parseFloat(orderAmount),
      bonusAmount: 0,
      paymentType: "addwallet",
      transactionFee: transactionFee,
    };
    orderDetails = await addMoney(body);
    const razorpayId = get(orderDetails, "razorPayOrderId", "");
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
    const options = {
      key: razorpayKey,
      currency: "INR",
      name: "Kiko Live",
      description: "Kiko Seller Payment",
      image: "",
      order_id: razorpayId,
      handler: (response) => {
        if (
          response?.razorpay_signature &&
          response?.razorpay_signature != ""
        ) {
          navigate("/wallet", { state: { transection: "success" } });
        } else {
          navigate("/wallet", { state: { transection: "fail" } });
        }
      },
      prefill: {
        name: get(userData, "name", ""),
        email: "",
        contact: get(userData, "mobile", ""),
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      config: {
        display: {
          hide:
            paymentMethod === "upi"
              ? [
                { method: "card" },
                { method: "wallet" },
                { method: "netbanking" },
                { method: "paylater" },
              ]
              : paymentMethod === "other"
                ? [{ method: "upi" }]
                : [],
        },
      },
    };
    const rzpay = new Razorpay(options);
    rzpay.open();
  };

  const handlePaymentSubscription = async (e) => {
    setLoadingPayment(true);
    const userData = getSellerDetails();
    const sellerId = userData && userData._id ? userData._id : "";
    const body = {
      sellerId: sellerId,
      subscriptionType: subscriptionType,
      subscriptionPlan: subscriptionPlan,
      paymentType: paymentType,
      amount: orderAmount,
      transactionFee: transactionFee,
    };
    try {
      orderDetails = await generateSubscriptionOrder(body);
      if (orderDetails?.razorPayOrderId) {
        const razorpayId = get(orderDetails, "razorPayOrderId", "");
        const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
        const options = {
          key: razorpayKey,
          currency: "INR",
          name: "Kiko Live",
          description: "Kiko Seller Payment",
          image: "",
          order_id: razorpayId,
          handler: async (response) => {
            const isSellerRegistration = props?.paymentFrom === "sellerRegistration";
            if (
              response?.razorpay_signature &&
              response?.razorpay_signature != "" &&
              response?.razorpay_payment_id &&
              response?.razorpay_payment_id != ""
            ) {
              const subscribeRes = await callSubscribePlanApi(
                sellerId,
                razorpayId,
                response?.razorpay_payment_id
              );
              setLoadingPayment(false);
              const isPaymentSuccess =
                subscribeRes?.success &&
                subscribeRes?.subscription?.status === "Active";
              isSellerRegistration
                ? props?.onPaymentResponse({
                  paymentResponse: response,
                  success: isPaymentSuccess,
                  message: isPaymentSuccess
                    ? "Subscription successfully"
                    : "Payment order id is not found",
                })
                : navigate("/shopdetails", {
                  state: {
                    transection: isPaymentSuccess ? "success" : "fail",
                  },
                });
            } else {
              setLoadingPayment(false);
              if (isSellerRegistration) {
                props?.onPaymentResponse({
                  paymentResponse: response,
                  success: false,
                  message: "Payment order id is not found",
                });
              } else {
                navigate("/shopdetails", { state: { transection: "fail" } });
              }
            }
            setLoadingPayment(false);
          },
          prefill: {
            name: get(userData, "name", ""),
            email: "",
            contact: get(userData, "mobile", ""),
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
          config: {
            display: {
              hide:
                paymentMethod === "upi"
                  ? [
                    { method: "card" },
                    { method: "wallet" },
                    { method: "netbanking" },
                    { method: "paylater" },
                  ]
                  : paymentMethod === "other"
                    ? [
                      { method: "upi" },
                      { method: "wallet" },
                      { method: "emi" },
                      { method: "cardless_emi" },
                      { method: "paylater" },
                    ]
                    : [
                      { method: "emi" },
                      { method: "cardless_emi" },
                      { method: "paylater" },
                      { method: "wallet" },
                    ],
            },
          },
        };
        const rzpay = new Razorpay(options);
        rzpay.open();
        setLoadingPayment(false);
      }
      else {
        setLoadingPayment(false);
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Payment setup error:", error);
      setLoadingPayment(false);
    }
  };

  const addMoney = async (body) => {
    const addMoneyRes = await APIKIKO.post(ADD_WALLET_MONEY, body);
    return addMoneyRes?.data?.data;
  };
  const getSellerToken = () => {
    try {
      return JSON.parse(localStorage.getItem("token") || "");
    } catch (error) {
      return null;
    }
  };
  const generateSubscriptionOrder = async (body) => {
    try {
      const token = getSellerToken();
      const options = {
        method: "POST",
        url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/update-razorpayid-subscription`,
        headers: {
          Authorization: `${token}`,
          desktop: true,
        },
        data: body,
      };
      const response = await axios(options);
      if (response?.data?.success) {
        return response?.data?.subscription;
      } else if (response?.data) {
        return response?.data;
      }
    } catch (error) {
      console.error("Generate subscription order error:", error);
      return { success: false, message: "Server error" };
    }
  };

  const callSubscribePlanApi = async (
    sellerId,
    razorPayOrderId,
    razorpayPaymentId
  ) => {
    try {
      const token = getSellerToken();
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/subscribe-plan`,
        headers: {
          Authorization: `${token}`,
          desktop: true,
        },
        data: {
          sellerId: sellerId,
          razorPayOrderId: razorPayOrderId,
          razorpayPaymentId: razorpayPaymentId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error calling subscribe-plan API:", error);
      return null;
    }
  };
  return (
    <div className="button-loader  mb-4">
      <button
        className="Proceed-btn"
        disabled={loadingPayment}
        onClick={
          paymentType === "addwallet"
            ? handlePayment
            : handlePaymentSubscription
        }
      >
        {loadingPayment
          ? "Processing..."
          : paymentType === "addwallet"
            ? "Proceed"
            : "Subscribe"}
      </button>
    </div>
  );
};

export default RazorpayModule;