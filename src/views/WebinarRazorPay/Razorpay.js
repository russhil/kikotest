import React, { useState } from "react";
import { get } from "lodash";
import axios from "axios";
import useRazorpay from "react-razorpay";

const RazorpayModule = (props) => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("userDetails") || "");
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
  const paymentType = "FirstTime";
  const subscriptionType = "Premium";
  const subscriptionPlan = "FirstTime";

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
      orderDetails = await createRazorPayOrderId(body,props?.endPoint??"update-razorpayid-for-webinar-participant");
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
            if (
              response?.razorpay_signature &&
              response?.razorpay_signature != "" &&
              response?.razorpay_payment_id &&
              response?.razorpay_payment_id != ""
            ) {
              setLoadingPayment(false);
              props?.onPaymentResponse({
                paymentResponse: response,
                success: true,
                message: true
                  ? "Subscription successfully"
                  : "Payment order id is not found",
              });
            } else {
              setLoadingPayment(false);
              props?.onPaymentResponse({
                paymentResponse: response,
                success: false,
                message: "Payment order id is not found",
              });
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
      } else {
        setLoadingPayment(false);
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Payment setup error:", error);
      setLoadingPayment(false);
    }
  };

  const createRazorPayOrderId = async (body, endPoint="update-razorpayid-for-webinar-participant") => {
    try {
      console.log(endPoint)
      // const token = getSellerToken();
      const options = {
        method: "POST",
        url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/${endPoint}`,
        headers: {
          // Authorization: `${token}`,
          // desktop: true,
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

  return (
    <div className="button-loader  mb-4">
      <button
        className="Proceed-btn"
        disabled={loadingPayment}
        onClick={handlePaymentSubscription}
      >
        {loadingPayment ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default RazorpayModule;
