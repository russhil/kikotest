import React, { useState, useEffect } from "react";
import { ADD_WEBINAR_PARTICIPANT } from "../../api/apiList";
import API from "../../api";
import "./styles-w.scss";
import { handleError, notify } from "../../utils";
import firstSlide from "../Webinar/img/host_img.png";
import Footer from "../Common/Footer/footer";
import WebinarModal from "./WebinarModal";
import SuccessModal from "./SuccessModel";
import PreRazorpay from "../WebinarRazorPay/PreRazorpay";
import { Modal } from "reactstrap";

function Webinar(props) {
 const [isOpenModal, setOpenModal] = useState(false);
 const [disabled, setDisabled] = useState(false);
 const [showRazorpay, setShowRazorpay] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);
 const [userData, setUserData] = useState({
  email: "",
  phone: "",
  status: "inactive",
  sellerName: "",
  storeName: "",
  paymentRazorPayId: "",
  paymentOrderId: "",
  paymentStatus: "unpaid",
 });
 function closeModal() {
  setOpenModal(false);
 }
 useEffect(() => {
  // Load Meta Pixel script if not already present
  if (process.env.NODE_ENV !== "development") {
   if (!window.fbq) {
    (function (f, b, e, v, n, t, s) {
     if (f.fbq) return;
     n = f.fbq = function () {
      n.callMethod
       ? n.callMethod.apply(n, arguments)
       : n.queue.push(arguments);
     };
     if (!f._fbq) f._fbq = n;
     n.push = n;
     n.loaded = true;
     n.version = "2.0";
     n.queue = [];
     t = b.createElement(e);
     t.async = true;
     t.src = v;
     s = b.getElementsByTagName(e)[0];
     s.parentNode.insertBefore(t, s);
    })(
     window,
     document,
     "script",
     "https://connect.facebook.net/en_US/fbevents.js"
    );

    window.fbq("init", "326242339368504");
   }
   // Fire tracking events
   window.fbq("track", "PageView");

   (function (c, l, a, r, i, t, y) {
    c[a] =
     c[a] ||
     function () {
      (c[a].q = c[a].q || []).push(arguments);
     };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
   })(window, document, "clarity", "script", "sr3m95np08");
  }
 }, []);

 useEffect(() => { }, [userData, disabled]);
 const handleChange = (e) => {
  // console.log('eeee')
  setUserData({
   ...userData,
   [e.target.name]: e.target.value,
  });
 };

 const handlePaymentResponse = async (payload) => {
  try {
   if (payload?.paymentResponse?.razorpay_payment_id && payload?.success) {
    // setShowRazorpay(false);
    const user = JSON.parse(localStorage.getItem("userDetails")) || {};
    user.paymentRazorPayId = payload?.paymentResponse?.razorpay_payment_id;
    user.paymentOrderId = payload?.paymentResponse?.razorpay_order_id;
    user.paymentStatus = "paid";
    user.status = "active";
    localStorage.setItem("userDetails", JSON.stringify(user));
    const response = await API.post(ADD_WEBINAR_PARTICIPANT, user);
    if (response?.data?.success) {
     // console.log(response?.data?,'data')
     localStorage.setItem(
      "userDetails",
      JSON.stringify(response?.data?.result)
     );
     setUserData(response?.data?.result);
     closeModal();
     setShowRazorpay(false);
     setIsSuccess(true);
    } else {
     notify("error", "Something went wrong!");
    }
    // notify("success", "Subscription Activated");
   } else {
    setShowRazorpay(false);
    notify("error", payload?.message);
   }
  } catch (error) { }
 };

 const onsubmit = async (e) => {
  e.preventDefault();
  try {
   if (!userData?.sellerName) {
    notify("error", "Please Enter seller name!");
    return;
   }
   if (
    !userData?.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)
   ) {
    notify("error", "Please enter a valid email address!");
    return;
   }
   if (userData?.phone?.length < 10 || userData?.phone?.length > 10) {
    notify("error", "Please Enter valid number!");
    return;
   }
   if (!userData?.storeName) {
    notify("error", "Please Enter store name!");
    return;
   }
   setDisabled(true);
   const response = await API.post(ADD_WEBINAR_PARTICIPANT, userData);
   if (response?.data?.success) {
    // try {
    localStorage.setItem(
     "userDetails",
     JSON.stringify(response?.data?.result)
    );
    // } catch (err) {
    //   console.error("Failed to set localStorage:", err);
    // }
    setUserData({
     email: "",
     phone: "",
     status: "inactive",
     sellerName: "",
     storeName: "",
     paymentRazorPayId: "",
     paymentOrderId: "",
     paymentStatus: "unpaid",
    });
    closeModal();
    setShowRazorpay(true);
   } else {
    notify("error", "Something went wrong!");
   }
   setDisabled(false);
  } catch (error) {
   handleError(error);
  }
 };

 return (
  <>
   <div className="container-w">
    <div className="banner-w">Kiko Live - Seller Webinar Registration</div>
    <div className="banner-w-heading">
     <h1>
      How to Start, Build & Grow <span>Your own Business Online</span>
     </h1>

     <div className="subheading-w">
      Are you an offline seller looking to take your business online?
     </div>
    </div>

    <div className="icons-w">
     <span>🏪 Retailers</span>
     <span>🛒 Kirana shop owners</span>
     <span>🚚 Distributors</span>
     <span>🍽️ Restaurant</span>
     <span>👨‍🍳 Cloud Kitchen</span>
    </div>

    <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
     <div className="row">
      <div className="col-md-6">
       <div className="image-container-w">
        <img src={firstSlide} alt="Speaker" />
        <h3>Mr. Imran Alam, VP - National Sales (Kiko Live)</h3>
       </div>
      </div>
      <div className="col-md-6">
       <div className="workshop-time-w">Workshop Timing👇</div>
       <div className="workshop-w">
        <div className="card-w">
         <strong className="heading-fs-w">Date</strong>
         <br />
         Friday 22 August
        </div>
        <div className="card-w">
         <strong className="heading-fs-w">Time</strong>
         <br />
         3 PM to 4 PM
        </div>
        <div className="card-w">
         <strong className="heading-fs-w">1M + Orders</strong>
         <br />
         Processed
        </div>
        <div className="card-w">
         <strong className="heading-fs-w"> 2000+ Business</strong>
         <br />
         Connected
        </div>
       </div>
       <div
        className="button-w"
        onClick={() => {
         setOpenModal(true);
        }}
       >
        REGISTER FOR WEBINAR
        <span>Hurry! Limited Spots Available</span>
       </div>
      </div>
     </div>
    </div>

    <div className="notes-w">
     👍 How to digitize your store and go live on ONDC | Easy onboarding
     steps – no technical skills needed | Managing products, orders, and
     payments online
     <br />
     <br />
     <span>
      This session is perfect for retailers and service providers looking
      to start their digital journey.
     </span>
    </div>

    <div className="highlight-free-mw">
     <h1>
      What You Get with <span className="highlight-w">Kiko Live</span>
     </h1>
    </div>

    <ul className="list-w">
     <li>Your own branded online e-commerce website</li>
     <li>Pre-listed catalog with thousands of items</li>
     <li>
      ONDC Listing → more orders from Paytm, Digihaat, Ola MyStore & other
      platforms
     </li>
     <li>
      Government-funded discounts for your customers (₹40–₹50 off per
      order, full payment to you)
     </li>
     <li>Digital marketing support to reach more customers</li>
     <li>Payment gateway & on-demand delivery service included</li>
     <li>Cash on Delivery (COD) & Khata orders supported</li>
     <li>
      AI-powered dashboard – track online + offline sales, best-selling
      items & restock alerts
     </li>
     <li>WhatsApp remarketing panel to re-engage customers</li>
     <li>Catalog creation & product listing support from our team</li>
     <li>
      Option to deliver yourself and collect payment directly, or use
      Kiko’s riders
     </li>
    </ul>
    <Modal
     isOpen={showRazorpay}
     onRequestClose={() => {
      setShowRazorpay(false);
     }}
    >
     <div className="subscribe-modal-payment">
      <PreRazorpay
       coinAmount={9}
       paymentType={"FirstTime"}
       subscriptionType={"Premium"}
       subscriptionPlan={"FirstTime"}
       amount={9}
       onPaymentResponse={handlePaymentResponse}
       setOpenPreRazorpayModal={setShowRazorpay}
      />
     </div>
    </Modal>
    {isOpenModal && (
     <WebinarModal
      handleChange={handleChange}
      disabled={disabled}
      userData={userData}
      onsubmit={onsubmit}
      onClose={() => setOpenModal(false)}
     />
    )}
   </div>
   {isSuccess && (
    <SuccessModal
     onClose={() => {
      setUserData({
       email: "",
       phone: "",
       status: "inactive",
       sellerName: "",
       storeName: "",
       paymentRazorPayId: "",
       paymentOrderId: "",
       paymentStatus: "unpaid",
      });
      setIsSuccess(false);
     }}
    />
   )}
   <Footer />
  </>
 );
}

export default Webinar;
