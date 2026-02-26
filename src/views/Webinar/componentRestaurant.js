import React, { useState, useEffect } from "react";
import { ADD_WEBINAR_PARTICIPANT, FETCH_SETTINGS } from "../../api/apiList";
import API from "../../api";
import "./styles-w.scss";
import WebinarModal from "./WebinarModal";
import PreRazorpay from "../WebinarRazorPay/PreRazorpay";
import { Modal } from "reactstrap";
import { handleError, notify } from "../../utils";
import FooterWebinar from "../Common/Footer/footerWebinar";
import SuccessModal from "./SuccessModel";
import CalendarIcon from "./img/calendar-icon.png";
import RestaurantHero from "../../images/HomeNew/restaurant_hero.png";
import CalendarIcon2 from "../../images/HomeNew/calendar-icon.png";
import OnlineSellingSection from "./online-selling-section";
import WebinarBlogSection from "./webinar-blog-section";
import CoverWebinarSection from "./cover-webinar-section-restaurant";
import MeetExpertSection from "./meet-expert-section";
import WebinarProofSection from "./webinar-media-section";
import JoinWebinarSection from "./join-webinar-section";
import WebinarFaqSection from "./webinar-faq-section";
import YourWebinarSection from "./your-webinar-section-restaurant";
import JoinCommunitySection from "./Join-community-section";
import TestimonialSection from "./testimonial-section-restaurant";
import { get } from "lodash";
import moment from "moment";
import axios from "axios";
// import { Helmet } from "react-helmet";
function Webinar(props) {
  const isFromLead = props.isFromLead;
  const pixelId = props?.pixelId;
  const isWebinarRS9 = props.isWebinarRS9;
  // console.log("ISWEBINAR9 : ", isWebinarRS9, isFromLead);

  const isFromLeadWithForm = props.isFromLeadWithForm;
  const [isOpenModal, setOpenModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);

  const [userData, setUserData] = useState({
    email: "",
    phone: "",
    city: "",
    status: "inactive",
    sellerName: "",
    storeName: "",
    webinarDate: "",
    paymentRazorPayId: "",
    paymentOrderId: "",
    paymentStatus: "unpaid",
    isFromLeadWithForm: false,
  });

  const [settingData, setSettingData] = useState({});
  const [Utms, setUtms] = useState({});

  const getSetting = async () => {
    const response = await API.get(FETCH_SETTINGS);
    if (response?.data?.success) {
      setSettingData(response?.data?.result);
    } else {
      notify("error", response?.data?.message);
    }
  };

  function closeModal() {
    setOpenModal(false);
  }
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_term: params.get("utm_term"),
      utm_content: params.get("utm_content"),
    };
  }
  const saveUtms = async (utms) => {
    try {
      const options = {
        method: "post",
        url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/save-utms`,
        headers: {
          desktop: true,
        },
        data: utms,
      };
      const response = await axios(options);
    } catch (error) {}
  };

  useEffect(() => {
    if (!pixelId) return;

    import("./pixel").then((module) => {
      module.initializeFacebookPixel(pixelId);
    });
  }, [pixelId]);

  useEffect(() => {
    getSetting();
    // Load Meta Pixel script if not already present
    if (process.env.NODE_ENV !== "development") {
      try {
        const utms = getUTMParams();
        setUtms(utms);
        saveUtms(utms);
        console.log(utms, "utms");
        window.fbq("track", "PageView", utms);
      } catch (error) {
        window.fbq("track", "PageView");
        console.log(error, "error");
      }
      // ✅ Send them as parameters with PageView event
      // Fire tracking events

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

  // useEffect(() => {
  //   let timer;
  //   if (minutes > 0 || seconds > 0) {
  //     timer = setInterval(() => {
  //       if (seconds > 0) {
  //         setSeconds((prev) => prev - 1);
  //       } else if (minutes > 0) {
  //         setMinutes((prev) => prev - 1);
  //         setSeconds(59);
  //       }
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer); // cleanup
  // }, [minutes, seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        else {
          setMinutes((prevMin) => (prevMin > 0 ? prevMin - 1 : 0));
          return 59;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          console.log(response?.data,'data')
          localStorage.setItem(
            "userDetails",
            JSON.stringify(response?.data?.result)
          );
          import("./pixel").then((module) => {
            module.initializeFacebookPixel(pixelId, {
              em: response?.data?.result?.email,
              fn: response?.data?.result?.sellerName,
              ln: response?.data?.result?.storeName,
              ph: response?.data?.result?.phone,
            });
          });
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
    } catch (error) {}
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submitted:", userData);
    try {
      if (!userData?.sellerName) {
        notify("error", "Please Enter seller name!");
        return;
      }
      if (!userData?.city) {
        notify("error", "Please Enter City / Town / Village");
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
      const body = {
        ...userData,
        webinarDate: get(settingData, "webinarDate", "") || "",
        isFromLeadWithForm: isFromLeadWithForm ? isFromLeadWithForm : false,
        utm_source: Utms?.utm_source ?? "",
        utm_medium: Utms?.utm_medium ?? "",
        utm_campaign: Utms?.utm_campaign ?? "",
        utm_content: Utms?.utm_content ?? "",
      };

      setDisabled(true);
      const response = await API.post(ADD_WEBINAR_PARTICIPANT, body);
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
          city: "",
          status: "inactive",
          sellerName: "",
          storeName: "",
          paymentRazorPayId: "",
          paymentOrderId: "",
          paymentStatus: "unpaid",
        });
        closeModal();
        if (isFromLeadWithForm) {
          setIsSuccess(true);
        } else {
          setShowRazorpay(true);
        }
      } else {
        notify("error", "Something went wrong!");
      }
      setDisabled(false);
    } catch (error) {
      console.log("error: ====>>>>> ", error);

      handleError(error);
    }
  };

  return (
    <>
      {/* {isFromLeadWithForm && (
        <Helmet>
          <title>Free Restaurant Registration | Sell on Own Website</title>
          <meta
            name="description"
            content=" Start getting website orders within 24 hours. Best solution for Restaurants. Easy 2 minute registration. Best Customer Support. Free Ecommerce Website."
          />
        </Helmet>
      )} */}
      <div className="webinar-container">
        <section className="webinar-hero-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="webinar-hero-inner">
                  <div className="webinar-hero-img">
                    <img src={RestaurantHero} alt="" />
                  </div>
                  <div>
                    <div className="webinar-hero-title">
                      Stop Paying <span className="yellow-text">50%</span>{" "}
                      Commission! Get{" "}
                      <span className="yellow-text">
                        {" "}
                        Your Own Online Restaurant
                      </span>{" "}
                      {isFromLeadWithForm ? "Website." : "on ONDC."}
                    </div>

                    <div className="webinar-hero-text">
                      {isFromLeadWithForm ? (
                        <>
                          Take back control. Join our free webinar for
                          Restaurant and F&B Owners and learn how to launch your
                          own online ordering website. Keep your profits, own
                          your customer data, and get direct orders.
                        </>
                      ) : (
                        "Take back control. Join our free webinar for Restaurant and F&B Owners and learn how to launch your own online ordering website on ONDC. Keep your profits, own your customer data, and get direct orders."
                      )}
                    </div>
                    <div className="webinar-date-time">
                      <img
                        className="calendar-icon"
                        src={CalendarIcon2}
                        alt=""
                      />
                      <div className="webinar-date">
                        {moment(
                          new Date(get(settingData, "webinarDate", new Date()))
                        ).format("MMMM D, YYYY")}
                        <span className="divider">|</span>
                        3:00 PM
                      </div>
                    </div>
                    <button
                      className="register-webinar-btn"
                      onClick={() =>
                        isFromLead
                          ? window.open(
                              get(settingData, "webinarWhatsappUrl", "")
                                ? get(settingData, "webinarWhatsappUrl", "")
                                : "https://chat.whatsapp.com/CSt5Uq9KBmj96FmaJYYYfk?mode=ems_copy_t",
                              "_blank"
                            )
                          : setOpenModal(true)
                      }
                    >
                      {isFromLead || isFromLeadWithForm
                        ? "JOIN WEBINAR WHATSAPP GROUP"
                        : "Register for webinar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <OnlineSellingSection /> */}
        {/* <WebinarBlogSection /> */}
        <CoverWebinarSection />
        <JoinCommunitySection />
        <YourWebinarSection />
        <TestimonialSection />
        <MeetExpertSection />
        <WebinarProofSection />
        <JoinWebinarSection
          setOpenModal={setOpenModal}
          isFromLead={isFromLead}
          isFromLeadWithForm={isFromLeadWithForm}
          whatsAppUrl={get(settingData, "webinarWhatsappUrl", "")}
        />
        <WebinarFaqSection />
      </div>
      <Modal
        isOpen={showRazorpay}
        onRequestClose={() => {
          setShowRazorpay(false);
        }}
      >
        <div className="subscribe-modal-payment">
          <PreRazorpay
            amount={isWebinarRS9 ? 9 : 49}
            onPaymentResponse={handlePaymentResponse}
            setOpenPreRazorpayModal={setShowRazorpay}
            {...props}
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
          isFromLeadWithForm={isFromLeadWithForm}
          isWebinarRS9={isWebinarRS9}
        />
      )}
      {isSuccess && (
        <SuccessModal
          whatsAppUrl={get(settingData, "webinarWhatsappUrl", "")}
          amount={isWebinarRS9 ? 9 : 49}
          onClose={() => {
            setUserData({
              email: "",
              phone: "",
              city: "",
              status: "inactive",
              sellerName: "",
              storeName: "",
              paymentRazorPayId: "",
              paymentOrderId: "",
              paymentStatus: "unpaid",
            });
            setIsSuccess(false);
          }}
          pixelId={pixelId}
          isFromLeadWithForm={isFromLeadWithForm}
          // {...props}
        />
      )}
      <FooterWebinar />
      <div className="webinar-remaining-time-container">
        <div className="webinar-remaining-time-container-inner">
          {isFromLead || isFromLeadWithForm ? (
            <div className="webinar-remaining-time-title title-thanks">
              <span>Thank You For Registration</span>
              <br />
              <p>Click on the button to join our webinar whatsapp group</p>
            </div>
          ) : (
            <div className="webinar-remaining-time-title">
              Hurry! Only Few Seats Left For The <span>Webinar</span>
            </div>
          )}
          <div className="webinar-remaining-time-right">
            {!isFromLead && !isFromLeadWithForm && (
              <div className="webinar-remaining-time">
                <div className="remaining-time-items">
                  {minutes}
                  <div className="remaining-time-label">Minutes</div>
                </div>
                <div className="remaining-time-divider">:</div>
                <div className="remaining-time-items">
                  {seconds}
                  <div className="remaining-time-label">Seconds</div>
                </div>
              </div>
            )}
            <button
              className="register-webinar-btn"
              onClick={() =>
                isFromLead
                  ? window.open(
                      get(settingData, "webinarWhatsappUrl", "")
                        ? get(settingData, "webinarWhatsappUrl", "")
                        : "https://chat.whatsapp.com/CSt5Uq9KBmj96FmaJYYYfk?mode=ems_copy_t",
                      "_blank"
                    )
                  : setOpenModal(true)
              }
            >
              {isFromLead || isFromLeadWithForm
                ? "JOIN WEBINAR WHATSAPP GROUP"
                : "Register for webinar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Webinar;
