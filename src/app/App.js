import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { GET_USER } from "../api/apiList";
import { handleError, notify } from "../utils";
import API from "../api";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";
import { app, analytics } from "../../src/firebase/FirebaseConfig";
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Modal } from "reactstrap";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Loader from "../components/Loader/Loader";
import PermissionAlertP from "../components/Modal/PermissionAlertPopup";

// --- Code-split all page/view components via React.lazy ---
const Home = React.lazy(() => import("../views/HomeNew/component"));
const Sidebar = React.lazy(() => import("../views/SideBar/SideBar"));
const OtpVerify = React.lazy(() => import("../views/OtpVerify/component"));
const SellerRegistration = React.lazy(() => import("../views/SellerRegistration/component"));
const ShopDetails = React.lazy(() => import("../views/ShopDetails/component"));
const KikoDashboard = React.lazy(() => import("../views/KikoDashboard/component"));
const IgmLogin = React.lazy(() => import("../views/IgmDashboard/IgmLogin"));
const IgmManager = React.lazy(() => import("../views/IgmDashboard/IgmManager"));
const ViewTicket = React.lazy(() => import("../views/IgmDashboard/ViewTicket"));
const EditTicket = React.lazy(() => import("../views/IgmDashboard/EditTicket"));
const AddSingleCatalog = React.lazy(() => import("../views/AddSingleCatalog/component"));
const Categories = React.lazy(() => import("../views/Categories/component"));
const FBCategories = React.lazy(() => import("../views/Categories/f&bcomponent"));
const Inventry = React.lazy(() => import("../views/Inventry/component"));
const SsoLoginError = React.lazy(() => import("../views/SsoLoginError/SsoLoginError"));
const Wallet = React.lazy(() => import("../views/Wallet/component"));
const NewOndcOrder = React.lazy(() => import("../views/NewOrders/component"));
const OrderDetail = React.lazy(() => import("../views/CreateOrders/orderDetail"));
const CreateOrder = React.lazy(() => import("../views/CreateOrders/component"));
const KikoOrder = React.lazy(() => import("../views/KikoOrders/component"));
const Support = React.lazy(() => import("../views/Support/support"));
const WebsiteSettlement = React.lazy(() => import("../views/Settlement/WebsiteSettlement"));
const OndcSettlement = React.lazy(() => import("../views/Settlement/OndcSettlement"));
const PreRazorpay = React.lazy(() => import("../views/Razorpay/PreRazorpay"));
const AdminAccess = React.lazy(() => import("../views/Admin-Access/component"));
const DeliveryPolicy = React.lazy(() => import("../views/Common/Delivery-policy/delivery-policy"));
const Disclaimer = React.lazy(() => import("../views/Common/Disclaimer/disclaimer"));
const TrackShipment = React.lazy(() => import("../views/TrackShipment/component"));
const PrivacyPolicy = React.lazy(() => import("../views/Common/Privacy-policy/privacy-policy"));
const ReturnPolicy = React.lazy(() => import("../views/Common/Return-Refund-Policy/return-refund-policy"));
const TermsCondition = React.lazy(() => import("../views/Common/Terms-condition/terms-condition"));
const NewReturn = React.lazy(() => import("../views/NewReturn/component"));
const SsoOtp = React.lazy(() => import("../views/SsoOtp/component"));
const SalesData = React.lazy(() => import("../views/SalesData/component"));
const Webinar = React.lazy(() => import("../views/Webinar/component"));
const WebinarRestaurant = React.lazy(() => import("../views/Webinar/componentRestaurant"));
const InstantLoan = React.lazy(() => import("../views/InstantLoan/component"));
const InsuranceOffer = React.lazy(() => import("../views/InsuranceOffer/InsuranceOffer"));
const InsurancePartner = React.lazy(() => import("../views/InsuranceOffer/insurancePartner"));

// Firebase messaging test function
const fireBaseTest = async () => {
  const isMessagingSupported = await isSupported();
  return isMessagingSupported;
}

// Function to retrieve seller details from localStorage
const getSellerDetails = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "");
  } catch (error) {
    return null;
  }
};

// Function to retrieve seller token from localStorage
const getSellerToken = () => {
  try {
    return JSON.parse(localStorage.getItem("token") || "");
  } catch (error) {
    return null;
  }
};

function App() {
  const [orderNotification, setOrderNotification] = useState({});
  const [isFromItc, setIsFromItc] = useState(false);
  const [isItcLoginSuccess, setIsItcLoginSuccess] = useState(false);
  const [isRegularFlow, setIsRegularFlow] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 54 }} spin />;

  // Log event for Firebase Analytics
  useEffect(() => {
    logEvent(analytics, 'SellerAppLogin', { mobile_number: 'WebsiteMobileLogin' });
  }, []);

  // Request notification permission
  function requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }

  // Initialize Firebase messaging
  const firebaseMessage = async () => {
    const isSupported = await fireBaseTest();
    if (isSupported) {
      const messaging = getMessaging(app);
      getToken(messaging, { vapidKey: 'BH8BmX4r4eTnzrdUA2g_nVqsv7aPsNrO-6E7ibIiyMnCChUE8D82TwEgwXGG3bhZqFNBUB4zXJAodZsMOe1FYo4' }).then((currentToken) => {
        if (currentToken) {
          localStorage.setItem("webToken", JSON.stringify(currentToken));
        } else {
          requestPermission();
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });

      onMessage(messaging, (payload) => {
        const data = payload;
        console.log("dataonMessage", data);
        setOrderNotification({
          notificationTitle: data?.data?.title,
          notificationBody: data?.data?.body
        });
      });
    }
  };

  // Initialize messaging on component mount
  useEffect(() => {
    firebaseMessage();
  }, []);

  // Handle user login flow
  useEffect(() => {
    let details = navigator.userAgent;
    const user = getSellerDetails();
    const localToken = getSellerToken();
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");
    const uuId = searchParams.get("uuId");
    const uuid = searchParams.get("uuid");
    const mobile = searchParams.get("mobile");
    const token = searchParams.get("token");

    if ((uuId || uuid) && (uuId !== "" || uuid !== "") && mobile && mobile !== "") {
      setIsRegularFlow(false);
      setIsFromItc(true);
      let obj = {
        brandProviderId: uuId && uuId !== "" ? uuId.toString() : uuid.toString(),
        phone: mobile,
        brandName: "ITC"
      };
      if (user?.mobile && mobile && user?.mobile !== mobile) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      if (mobile.length === 10) {
        !otpSend && ssoLogin(obj);
      } else {
        notify("error", "Please Enter valid number!");
        setIsFromItc(false);
      }
    } else {
      setIsRegularFlow(true);
    }

    const path = searchParams.get("path") || "/shopdetails";
    if (user && user !== "" && user._id === userId && token !== "" && token === localToken) {
      localStorage.setItem("isAppView", true);
      sessionStorage.setItem("hasReloaded", "true");
      if (path && window.location.pathname !== path) {
        window.location.href = path;
        return;
      }
    } else if (userId && userId !== "" && token && token !== "") {
      localStorage.setItem("isAppView", true);
      localStorage.setItem("token", JSON.stringify(token));
      getUser(userId, path);
    }
  }, [otpSend]);

  const ssoLogin = async (obj) => {
    const mobile = obj.phone;
    setOtpSend(true);
    obj.phone = `+91${obj.phone}`;
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_KIKO_API_V1}/user/ssologin`,
      headers: {
        desktop: true,
      },
      data: obj,
    };
    try {
      const result = await axios(options);
      if (result) {
        let kikoUser = result?.data?.isUserExists;
        setIsItcLoginSuccess(true);
        if (!kikoUser) {
          if (result?.data?.otp) {
            const brandProviderId = obj?.brandProviderId;
            var url = `/sso-otp?mobile=${encodeURIComponent(mobile)}&brandProviderId=${brandProviderId}`;
            window.location.href = url;
          } else {
            window.location.href = "/orders";
            localStorage.setItem("user", JSON.stringify(result?.data?.user));
            localStorage.setItem("token", JSON.stringify(result?.data?.token));
          }
        } else {
          window.location.href = "/sso-login";
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getUser = async (userId, path) => {
    try {
      const response = await API.post(GET_USER, {
        _id: userId,
      });
      if (response?.data?.success) {
        sessionStorage.setItem("hasReloaded", "true");
        localStorage.setItem("user", JSON.stringify(response?.data?.result));
        if (path && window.location.pathname !== path) {
          window.location.href = path;
          return null;
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} autoClose={3000} toastStyle={{ backgroundColor: "crimson" }} />
      {isItcLoginSuccess || isRegularFlow ? (
        <Router>
          <React.Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<PageWithSidebar><Home isFromItc={isFromItc} /></PageWithSidebar>} />
              <Route path="instant-loan" element={<PageWithSidebar><InstantLoan isFromItc={isFromItc} /></PageWithSidebar>} />
              <Route path="/delivery-policy" element={<DeliveryPolicy />} />
              <Route path="/track-shipment/:id" element={<TrackShipment />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/terms-condition" element={<TermsCondition />} />
              <Route path="/verifyotp" element={<PageWithSidebar><OtpVerify /></PageWithSidebar>} />
              <Route path="/registration" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><SellerRegistration /></PageWithSidebar>} />
              <Route path="/shopdetails" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><ShopDetails /></PageWithSidebar>} />
              <Route path="/kikodashboard" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><KikoDashboard /></PageWithSidebar>} />
              <Route path="/addsinglecatalog" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><AddSingleCatalog /></PageWithSidebar>} />
              <Route path="/categories" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><Categories /></PageWithSidebar>} />
              <Route path="/fb-categories" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><FBCategories /></PageWithSidebar>} />
              <Route path="/inventory" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><Inventry /></PageWithSidebar>} />
              <Route path="/wallet" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><Wallet /></PageWithSidebar>} />
              <Route path="/orders" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><NewOndcOrder /></PageWithSidebar>} />
              <Route path="/create-orders" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><CreateOrder /></PageWithSidebar>} />
              <Route path="/orders-details" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><OrderDetail /></PageWithSidebar>} />
              <Route path="/kiko-orders" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><KikoOrder /></PageWithSidebar>} />
              <Route path="/support" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><Support /></PageWithSidebar>} />
              <Route path="/website-settlement" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><WebsiteSettlement /></PageWithSidebar>} />
              <Route path="/ondc-settlement" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><OndcSettlement /></PageWithSidebar>} />
              <Route path="/return" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><NewReturn /></PageWithSidebar>} />
              <Route path="/preRazorpay" element={<PageWithSidebar><PreRazorpay /></PageWithSidebar>} />
              <Route path="/admin-access" element={<AdminAccess />} />
              <Route path="/sso-login" element={<SsoLoginError />} />
              <Route path="/sso-otp" element={<SsoOtp />} />
              <Route path="/igm" element={<IgmLogin />} />
              <Route path="/igm-manager" element={<IgmManager />} />
              <Route path="/view-ticket" element={<ViewTicket />} />
              <Route path="/edit-ticket" element={<EditTicket />} />
              <Route path="/sales-data" element={<PageWithSidebar notification={orderNotification} setNotification={setOrderNotification}><SalesData /></PageWithSidebar>} />
              <Route path="/webinar-registration" element={<Webinar isFromLead={false} isWebinarRS9={true} pixelId={`326242339368504`} />} />
              <Route path="/webinar-registration-lead" element={<Webinar isFromLead={true} />} pixelId={``} />
              <Route path="/webinar-registration-lead2" element={<WebinarRestaurant isFromLead={false} isFromLeadWithForm={true} pixelId={``} />} />
              <Route path="/webinar-registration2" element={<Webinar isFromLead={false} isWebinarRS9={false} pixelId={``} />} />
              <Route path="/webinar-registration-2" element={<Webinar isFromLead={false} isWebinarRS9={true} pixelId={`264771596216811`} />} />
              <Route path="/webinar-registration-3" element={<Webinar isFromLead={false} isWebinarRS9={true} pixelId={`817290117802368`} />} />
              <Route path="/webinar-registration-4" element={<Webinar isFromLead={false} isWebinarRS9={true} pixelId={`820276667513135`} />} />
              <Route path="/webinar-registration-restaurant" element={<WebinarRestaurant isFromLead={false} isWebinarRS9={true} pixelId={`326242339368504`} />} />
              <Route path="/webinar-registration-restaurant2" element={<WebinarRestaurant isFromLead={false} isWebinarRS9={true} pixelId={`264771596216811`} />} />
              <Route path="/webinar-registration-restaurant3" element={<WebinarRestaurant isFromLead={false} isWebinarRS9={true} pixelId={`817290117802368`} />} />
              <Route path="/webinar-registration-restaurant4" element={<WebinarRestaurant isFromLead={false} isWebinarRS9={true} pixelId={`820276667513135`} />} />
              <Route path="/shopinsurancelead" element={<InsuranceOffer />} />
              <Route path="/insurancecandidate" element={<InsurancePartner />} />

            </Routes>
          </React.Suspense>
        </Router>
      ) : (
        <Spin indicator={antIcon} className="loader" />
      )}
    </>
  );
}

// PageWithSidebar component for wrapping pages with sidebar logic
function PageWithSidebar({ children, notification, setNotification }) {
  const user_data = getSellerDetails();
  const isHome = window.location.pathname === "/";
  const isOtpVerify = window.location.pathname === "/verifyotp";
  const isSellerRegistration = window.location.pathname === "/registration";
  const navigate = useNavigate();
  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({ permission: false, type: "" });

  useEffect(() => {
    if (window && window.flutter_inappwebview) {
      document.documentElement.style.setProperty('--mainColor', '#2874f0');
      document.documentElement.style.setProperty('--activeColor', '#5691f1');
    }
  }, []);

  return (
    <div className="KikoDashboardWrapper">
      <div className="dashboardWrapper">
        {isHome || isOtpVerify || (!user_data?.isProfileComplete && !user_data?.isProfileSkip && isSellerRegistration) ? null : (
          <Sidebar />
        )}
        {children}
        <Modal
          isOpen={notification?.notificationTitle && notification?.notificationTitle !== ""}
          onClose={() => setNotification({})}
          style={{ width: "350px" }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container p-5">
            <div className="Insufficient-modal">
              <h4 className="text-center mb-0">{notification?.notificationTitle}</h4>
              <p>{notification?.notificationBody}</p>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <button
                onClick={() => {
                  navigate("/orders");
                  setNotification({});
                }}
                className="btn btn-success w-100"
              >
                ONDC Orders
              </button>
              <button
                onClick={() => {
                  setNotification({});
                }}
                className="btn btn-danger w-100"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
        <PermissionAlertP permissionAlertPopUp={permissionAlertPopUp} setPermissionAlertPopUp={setPermissionAlertPopUp} />
      </div>
    </div>
  );
}

export default App;
