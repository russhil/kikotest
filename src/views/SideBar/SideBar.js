import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "reactstrap";
import { ModalBody, ModalHeader } from "reactstrap";
import QRCode from "react-qr-code";
import crossIcon from "../../images/cross-icon.svg";
import "./styles.scss";
// import profileImg from "../../images/ShopDetails/profile-img.png";
import Logout from "../../images/ShopDetails/logout.svg";
import LogoutBlack from "../../images/ShopDetails/logout-black.svg";
import brandLogo from "../../images/Registration/brandLogo.png";
import Profile from "../../images/ShopDetails/profile.svg";
import { useNavigate } from "react-router-dom";
//sidebar
import { Link } from "react-router-dom";
import Product from "../../images/ShopDetails/product-pricing.svg";
import Order from "../../images/ShopDetails/order.svg";
import Return from "../../images/ShopDetails/return.svg";
import Inventory from "../../images/ShopDetails/inventory.svg";
import Payment from "../../images/ShopDetails/payment.svg";
import PriceRecommendation from "../../images/ShopDetails/price.svg";
// import notification from "../../images/ShopDetails/notification.svg";
import Support from "../../images/ShopDetails/support.svg";
import Scanner from "../../images/ShopDetails/business-dashboard.svg";
import API from "../../api";
import { get } from "lodash";
import { GET_USER, GENRATE_DEEPLINK } from "../../api/apiList";
import { handleError, handleLogout, notify, } from "../../utils";
import icMenu from "../../images/Dashboard/hamburger.svg";
import leftArrow from "../../images/Categories/left-arrow.svg";
import axios from "axios";
import { saveAs } from "file-saver";
// import InstantLoan from "../InstantLoan/component";
import InstantLoan from '../../images/instantloan.svg'
const SideBar = () => {
  const qrRef = useRef();
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const getAdminDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "");
    } catch (error) {
      return null;
    }
  };


  const location = useLocation();
  const navigate = useNavigate();
  const [ondcVerified, setOndcVerified] = useState(false);
  const [logout, setLogout] = useState(false);
  const [itcLogout, setItcLogout] = useState(false);
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const [componentMounted, setComponentMounted] = useState(false);
  const [user_data, setuser_data] = useState({});
  const [admin_data] = useState(getAdminDetails());
  const [hamBurgurMenu, setHamBurgurMenu] = useState(false);
  const [shareQr, setShareQr] = useState(false);
  const [deepLinkData, setDeepLinkData] = useState({});
  const [loadingDeeplink, setLoadingDeeplink] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useState([]);
  const [historyLength, setHistoryLength] = useState(-1);

  const userData = getSellerDetails();
  useEffect(() => {
    if (window.flutter_inappwebview) {
      setVisitedRoutes((prevRoutes) => [...prevRoutes, location.pathname]);
      const alreayVisited = visitedRoutes.includes(location.pathname);
      if (!alreayVisited) {
        setHistoryLength((prevLength) => prevLength + 1);
      }
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   if (window.flutter_inappwebview) {
  //     const handlePopState = () => {
  //       // console.log("NAVIGATE : ====== handlePopState", historyLength);
  //     };
  //     window.addEventListener("popstate", handlePopState);
  //     return () => {
  //       window.removeEventListener("popstate", handlePopState);
  //     };
  //   }
  // }, [visitedRoutes]);

  const flutterLogout = () => {
    setVisitedRoutes((prevRoutes) => prevRoutes.slice(0, -1));
    setHistoryLength((prevLength) => Math.max(prevLength - 1, 1));
    navigate(-1);
    // if (historyLength === 1 && window.flutter_inappwebview) {
    //   setBackButtonVisible(false)
    // } else {
    //   navigate(-1);
    //   setBackButtonVisible(true)
    // }
  };

  useEffect(() => {
    if (componentMounted) {
      getUser();
    } else {
      setComponentMounted(true);
    }

    if (historyLength === 1) {
      setBackButtonVisible(false)
    }
    else {
      setBackButtonVisible(true)
    }

  }, [componentMounted, historyLength]);

  useEffect(() => {
    if (!get(userData, "_id", "") || get(userData, "_id", "") === "") {
      handleLogout();
      navigate("/");
    }
  }, []);


  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      navigate("/shopdetails")
    }
  }, []);

  const getUser = async () => {
    const userData = getSellerDetails();
    try {
      const response = await API.post(GET_USER, {
        _id: userData && userData._id,
      });
      if (response) {
        setuser_data(response?.data?.result);
        setOndcVerified(response?.data?.result?.ondcVerified);
        localStorage.setItem("user", JSON.stringify(response?.data?.result));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const generateDeeplink = async () => {
    const userData = getSellerDetails();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO}${GENRATE_DEEPLINK}`,
      data: {
        "deepLinkType": "sellerCatalogSearch",
        providerId: userData && userData._id
      },
    };
    try {
      setLoadingDeeplink(true)
      setShareQr(!shareQr);
      const response = await axios(options);
      if (response?.data?.success) {
        setDeepLinkData(response?.data)
      } else {
        notify(
          "error",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );
      }
      setLoadingDeeplink(false)
    } catch (error) {
      handleError(error);
    }
  };

  const downloadQRCode = () => {
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "store_qr_code.png");
      });
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  //before Modification/optimization
  // const updateVendorProfile = async (status) => {
  //   setOndcVerified(status);
  //   let body = {
  //     ondcVerified: status ? "online" : "offline",
  //     userId: user_data && user_data._id ? user_data._id : "",
  //   };
  //   try {
  //     const response = await API.post(UPDATE_VENDOR_PROFILE_DETAIL, body);
  //     if (response?.data?.success) {
  //       localStorage.setItem("user", JSON.stringify(response?.data?.data));
  //       getUser();
  //       notify("success", response?.data?.message);
  //     } else {
  //       notify("error", response?.data?.message);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  return (
    <>
      <div>
        <div className={hamBurgurMenu ? "sideBar showmenu" : "sideBar"}>
          <div className="headersection">
            {/* {user_data?.storeLogo?<img src={user_data?.storeLogo} className="profile-img" />: ""} */}
            {user_data?.storeLogo ? (
              <img src={user_data?.storeLogo} alt="" className="profile-img" />
            ) : (
              <div className="profile-img">
                <p>{user_data?.name ? user_data.name.charAt(0) : ""}</p>
              </div>
            )}
            <h6>
              {user_data?.storeName
                ? user_data?.storeName.length > 15
                  ? user_data?.storeName.substring(0, 14) + "..."
                  : user_data?.storeName
                : ""}
            </h6>
            {(!admin_data || !window.flutter_inappwebview) &&
              !window.flutter_inappwebview && (
                <button
                  className="logout-icon"
                  onClick={() => {
                    setLogout(true);
                  }}
                >
                  {" "}
                  <img src={Logout} alt="" />
                </button>
              )}
          </div>
          <div className="sidebarList" onClick={() => setHamBurgurMenu(false)}>
            <ul>
              <li
                className={
                  location?.pathname === "/shopdetails" ? "active" : ""
                }
              >
                <Link
                  to={
                    user_data?.isProfileSkip ? "/registration" : "/shopdetails"
                  }
                >
                  {" "}
                  <img src={Profile} alt="" /> Profile
                </Link>
              </li>
              {user_data?.brandName !== "B2B" && <li
                className={
                  location?.pathname === "/addsinglecatalog" ||
                    location?.pathname === "/categories"
                    ? "active"
                    : ""
                }
              >
                <Link to="/addsinglecatalog">
                  {" "}
                  <img src={Product} alt="" />
                  Add New Products
                </Link>
              </li>}
              {/* <li className={location?.pathname === "/fb-categories" ? "active" : ""}>
                <Link to="/fb-categories">
                  {" "}
                  <img src={Inventory} alt="" />
                  F&B Product
                </Link>
              </li> */}
              {user_data?.brandName !== "B2B" && <li
                className={location?.pathname === "/inventory" ? "active" : ""}
              >
                <Link to="/inventory">
                  {" "}
                  <img src={Inventory} alt="" />
                  Inventory
                </Link>
              </li>}
              {/* <li className={location?.pathname === "/orders" ? "active" : ""}>
                <Link to="/orders">
                  {" "}
                  <img src={Order} alt="" />
                  ONDC Orders
                </Link>
              </li> */}
              {user_data?.brandName !== "B2B" && <li className={location?.pathname === "/orders" ? "active" : ""}>
                <Link to="/orders">
                  {" "}
                  <img src={Order} alt="" />
                  ONDC Orders
                </Link>
              </li>}
              {user_data?.brandName === "B2B" && <li className={location?.pathname === "/create-orders" ? "active" : ""}>
                <Link to="/create-orders">
                  {" "}
                  <img src={Order} alt="" />
                  Shipments
                </Link>
              </li>}
              {/* <li className={location?.pathname === "/return" ? "active" : ""}>
                <Link to="/return">
                  {" "}
                  <img src={Return} alt="" />
                  ONDC Return
                </Link>
              </li> */}
              {user_data?.brandName !== "B2B" && <li className={location?.pathname === "/return" ? "active" : ""}>
                <Link to="/return">
                  {" "}
                  <img src={Return} alt="" />
                  ONDC Return
                </Link>
              </li>}
              {user_data?.brandName !== "B2B" && <li
                className={
                  location?.pathname === "/ondc-settlement" ? "active" : ""
                }
              >
                <Link to="/ondc-settlement">
                  <img src={Payment} alt="" />
                  ONDC Settlement
                </Link>
              </li>}
              {user_data?.brandName !== "B2B" && <li
                className={
                  location?.pathname === "/kiko-orders" ? "active" : ""
                }
              >
                <Link to="/kiko-orders">
                  {" "}
                  <img src={Order} alt="" />
                  Website Orders
                </Link>
              </li>}
              {user_data?.brandName !== "B2B" && <li
                className={
                  location?.pathname === "/website-settlement" ? "active" : ""
                }
              >
                <Link to="/website-settlement">
                  <img src={Payment} alt="" />
                  Website Settlement
                </Link>
              </li>}
              {<li className={location?.pathname === "/wallet" ? "active" : ""}>
                <Link to="/wallet">
                  <img src={PriceRecommendation} alt="Wallet" />
                  Wallet
                </Link>
              </li>}
              {/* <li>
                <a href="/">
                  <img src={PriceRecommendation} />
                  Create New Order
                </a>
              </li> */}
              {/* <li>
                <a href="/">
                  <img src={notification} />
                  Notification
                </a>
              </li> */}
              <li className={location?.pathname === "/instant-loan" ? "active" : ""}>
                <Link to="/instant-loan">
                  <img src={InstantLoan} alt="" />
                  Instant Loan
                </Link>
              </li>
              <li className={location?.pathname === "/support" ? "active" : ""}>
                <Link to="/support">
                  <img src={Support} alt="" />
                  FAQ & Support
                </Link>
              </li>
              {/* <li className={shareQr? "active" : ""}>
                <Link
                onClick={(e) => {
                  e.preventDefault();
                  generateDeeplink()
                
                }}
                >
                  <img src={Scanner} alt="" />
                Share Store
                </Link>
              </li> */}

              {/*  <li>
                <a href="/">
                  <img src={Catalog} />
                  Catalog Uploads
                </a>
              </li>
              <li>
                <a href="/">
                  <img src={Advertisement} />
                  Advertisement
                </a>
              </li>
              <li>
                <a href="/">
                  <img src={Promotions} />
                  Promotions
                </a>
              </li>
           
              <li>
                <a href="/">
                  <img src={BusinessDashboard} />
                  Business Dashboard
                </a>
              </li>
              <li>
                <a href="/">
                  <img src={QualityDashboard} />
                  Quality Dashboard
                </a>
              </li>
              <li>
                <a href="/">
                  <img src={ImageBulk} />
                  Image Bulk Upload
                </a>
              </li> */}
            </ul>
          </div>
          <div className="bottomtext">
            {admin_data && (
              <div className="switchBtn">
                <p>You impersonated this store...</p>
                <img
                  src={Logout}
                  onClick={() => {
                    handleLogout();
                    navigate("/");
                  }}
                  alt=""
                />
              </div>
            )}
            <div className="switchBtn">
              <p>Your Store is</p>
              <label className="switch">
                <input
                  type="checkbox"
                  // defaultChecked={ondcVerified}
                  checked={ondcVerified}
                  disabled={true}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="footersection">
              <img src={brandLogo} alt="" />
            </div>
          </div>
        </div>
        <div
          className={hamBurgurMenu ? "bodywrapper" : ""}
          onClick={() => setHamBurgurMenu(!hamBurgurMenu)}
        ></div>
      </div>
      <div
        className="mobileviewHeader"
        style={{ display: isAppView === "true" ? "none" : "" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {window.flutter_inappwebview && backButtonVisible && (
              <img
                src={leftArrow}
                className="hamburgerIcon"
                style={{
                  marginRight: "10px",
                  padding: "7px 16px 7px 0",
                  maxWidth: "30px",
                }}
                alt=""
                onClick={() => flutterLogout()}
              />
            )}
            <img
              src={icMenu}
              className="hamburgerIcon"
              alt=""
              onClick={() => setHamBurgurMenu(!hamBurgurMenu)}
            />
          </div>
          {(user_data?.storeName && !window?.flutter_inappwebview) && (
            <div className="headersection p-0 border-0">
              {user_data?.storeLogo ? (
                <img
                  src={user_data?.storeLogo}
                  alt=""
                  className="profile-img"
                />
              ) : (
                <div className="profile-img">
                  <p>{user_data?.name ? user_data.name.charAt(0) : ""}</p>
                </div>
              )}
              <h6 className="user-text">
                {user_data ? user_data?.storeName : ""}
              </h6>
              {(!user_data?.brandProviderId ||
                user_data?.brandProviderId === "") && (
                  <button
                    className="logout-icon"
                    onClick={() => {
                      setLogout(true);
                    }}
                  >
                    {" "}
                    <img src={LogoutBlack} alt="" />
                  </button>
                )}
            </div>
          )}
          {window.flutter_inappwebview && (
            <div className="headersection p-0 border-0">
              <h6 className="user-text">
                {user_data ? user_data?.storeName : ""}
              </h6>
              <button
                className="logout-icon"
                onClick={() => {
                  setItcLogout(true)
                }}
              >
                {" "}
                <img src={LogoutBlack} alt="" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={logout}
        size="sm"
        onClose={() => {
          setLogout(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="pt-2 pb-4">
            <h4 className="edit-title text-center mb-0">
              Are you sure you want to Logout?
            </h4>
            <div className="options-block"></div>
          </div>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                handleLogout();
                navigate("/");
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setLogout(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={itcLogout}
        size="sm"
        onClose={() => {
          setItcLogout(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="pt-2 pb-4">
            <h4 className="edit-title text-center mb-0">
              Are you sure you want to Exit?
            </h4>
            <div className="options-block"></div>
          </div>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                window.flutter_inappwebview.callHandler("closeWebView");
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setItcLogout(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={shareQr}
        size="sm"
        onClose={() => {
          setItcLogout(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader className="modal-header">
          Scan the Store QR Code
          <div>
            <img
              src={crossIcon}
              alt=""
              onClick={() => {
                setShareQr(false);
              }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          {!loadingDeeplink ? <>
            <QRCode
              ref={qrRef}
              className="w-100"
              title="Kiko"
              value={deepLinkData?.deepLinkUrl}
              bgColor={"#FFFFFF"}
              fgColor={"#000000"}
              size={256}
            />
            {/* <CopyToClipboard text={deepLinkData?.deepLinkUrl}>
              <div
                onClick={() => {
                  notify("success", "Copied");
                }}
              >
                 {deepLinkData?.deepLinkUrl}
                 <Copy className="me-1" />
              </div>
            </CopyToClipboard> */}

            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-primary btn-sm" onClick={downloadQRCode}>
                Download QR Code
              </button>
            </div>
          </>
            : <p>Loading QR...</p>}
        </ModalBody>
      </Modal>
    </>
  );
};
export default SideBar;