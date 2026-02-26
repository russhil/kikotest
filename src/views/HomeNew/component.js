import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import ShopDetails from "../../images/Home/shop-details.svg";
import PersonalDetails from "../../images/Home/personal-details.svg";
import BankDetails from "../../images/Home/bank-details.svg";
import UploadCatalog from "../../images/Home/upload-catalog.svg";
//import HomeBanner from "../../images/Home/home-banner.png";
import ONDC from "../../images/HomeNew/ondc.png";
import Commission from "../../images/HomeNew/commission.png";
import Website from "../../images/HomeNew/website.png";
import Management from "../../images/HomeNew/management.png";
import Gateway from "../../images/HomeNew/gateway.png";
import Delivery from "../../images/HomeNew/delivery.png";
import Tool from "../../images/HomeNew/tool.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import firstSlide from "../../images/HomeNew/first-slide.png";
import SecondSlide from "../../images/HomeNew/second-slide.png";
import ThirdSlide from "../../images/HomeNew/third-slide.png";
import FourthSlide from "../../images/HomeNew/fourth-slide.png";
import FifthSlide from "../../images/HomeNew/fifth-slide.png";
import CustomerSupport from "../../images/HomeNew/support.png";
import RightArrow from "../../components/svgIcons/RIghtArrow";
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";
import WhatsApp from "../../images/HomeNew/whatsaapIcon.svg";
import phoneIcon from "../../images/HomeNew/phoneIcon.svg";
import KikoLogo from "../../images/kiko--logo.svg";
import Facebook from "../../images/facebook.svg";
import Insta from "../../images/instagram.svg";
import LinkedIn from "../../images/linkedin11.svg";
import Youtube from "../../images/youtube.svg";
import indiaIcon from "../../images/Home/india.svg";
import AppStore from "../../images/appstore.png";
import PlayStore from "../../images/playstore.png";
import Footer from "../Common/Footer/footer";
import { GET_ORDER_COUNT, REQUEST_OTP } from "../../api/apiList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, notify } from "../../utils";
import API from "../../api";
import { LoadingOutlined } from "@ant-design/icons";
import { Space, Spin } from "antd";
import "./styles.scss";
import SlotCounter from "react-slot-counter";
import APIKIKO from "../../api/api_kiko";
import axios from "axios";
import { analytics } from "../../firebase/FirebaseConfig"
import { logEvent } from 'firebase/analytics';

function HomeComponent(props) {
  const isFromItc = props.isFromItc
  const [mobile, setMobile] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const path = searchParams.get("path");
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [orderCount, setOrderCount] = useState("000000");
  const counterRef = useRef();

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
  const handleSignIn = async () => {
    try {
      logEvent(analytics, 'Landing_Page', { mobile_number: 'WebsiteMobileLogin' });
      if (mobile.length < 10) {
        notify("error", "Please Enter valid number!");
        return;
      }
      setDisabled(true);
      const response = await API.post(REQUEST_OTP, { phone: `+91${mobile}` });
      if (response?.data?.success) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        const stateData = { mobile: mobile };
        navigate("/verifyotp", { state: stateData });
      } else {
        notify("error", "Please Enter valid number!");
      }
      setDisabled(false);
    } catch (error) {
      handleError(error);
    }
  };

  // const handleKeyPress = (e) => {
  //     if (e.key === 'Enter') {
  //         handleSignIn();
  //     }
  // };

  useEffect(() => {
    let user = getSellerDetails();
    let admin = getAdminDetails();
    const userId = searchParams.get("userId");
    // localStorage.setItem("isAppView", false);
    if (user && !userId && (user?.isProfileComplete || user?.isProfileSkip)) {
      const path = searchParams.get("path");
      if (path && window.location.pathname !== path) {
        window.location.href = path;
      } else {
        navigate("/shopdetails");
      }
    } else if (user && !userId) {
      navigate("/registration");
    } else if (admin && !userId) {
      navigate("/admin-access");
    }
  }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    // 👇️ scroll to top on page load
    // getOrderCount();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const generateWhatsAppUrl = (phoneNumber, message) => {
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppButtonClick = (phoneNumber, message) => {
    const whatsappUrl = generateWhatsAppUrl(phoneNumber, message);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    //Implementing the setInterval method
    getOrderCount();
    const interval = setInterval(() => {
      getOrderCount();
    }, 10000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, []);

  const getOrderCount = async () => {
    const options = {
      method: "post",
      url: `https://api.kiko.live/api/v1/order/ondc-order-count`,
      headers: {
        desktop: true,
      },
      data: null,
    };
    try {
      const response = await axios(options);
      if (response?.data?.data) {
        setOrderCount(response?.data?.data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      {path || isFromItc ? (
        <Spin indicator={antIcon} className="loader" />
      ) : (
        <>
          <header className="py-3">
            <div className="container">
              <div className="header-container">
                <img src={kikoOndcLogo} className="kiko-logo" alt="" />
                <h1 className="m-0 header-title">SELL ON ONDC</h1>
              </div>
            </div>
          </header>
          <section className="NewbannerSection pt-2 largePAdding">
            <div className="container">
              <div className="ondc-recived">
                <div className="ondc-recived-flex">
                  <h4 className="mb-0">Orders received by Kiko Sellers:</h4>
                  <div>
                    <SlotCounter
                      ref={counterRef}
                      value={orderCount}
                      sequentialAnimationMode={true}
                      charClassName="char"
                      separatorClassName="sep"
                    />
                  </div>
                </div>
                <h6>
                  Kiko Live is the{" "}
                  <span className="purple">FASTEST GROWING</span> seller app for
                  retailers to sell on ONDC.{" "}

                  {/* <span> &nbsp;</span>to let us help you grow your{" "}
                  <span className="purple">business exponentially!</span> */}
                </h6>
                <p className="my-3 registration--btns">
                  <button
                    className="btn btn-primary"
                    style={{ padding: "7px 10px" }}
                    onClick={() => {
                      window.scrollTo({
                        top: 300,
                        left: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    RETAILER REGISTRATION
                  </button>
                  <a href="https://forms.gle/1QCXUJwyVmzwEYGx8" target="_blank" onClick={() => { logEvent(analytics, 'D2C_Registration_Button', { mobile_number: 'WebsiteMobileLogin' }) }} className="btn btn-primary btn-xs"> D2C REGISTRATION </a>
                </p>
              </div>
              <div className="row align-items-center justify-content-between">
                <div className="col-lg-6">
                  <Slider {...settings}>
                    <div className="slider-Img">
                      <img src={firstSlide} alt="" />
                    </div>
                    <div className="slider-Img">
                      <img src={SecondSlide} alt="" />
                    </div>
                    <div className="slider-Img">
                      <img src={ThirdSlide} alt="" />
                    </div>
                    <div className="slider-Img">
                      <img src={FourthSlide} alt="" />
                    </div>
                    <div className="slider-Img">
                      <img src={FifthSlide} alt="" />
                    </div>
                  </Slider>
                </div>
                <div className="col-lg-6">
                  <div className="rightSection">
                    <h2>
                      <span>Power</span> Up Your Business
                      <br />
                      <span>Expand</span> Your Reach &
                      <br />
                      <span>Unlock</span> Limitless Growth with Ease!
                    </h2>
                    <br />
                    <h3>Register Here</h3>
                    {/* <div className="registration" onKeyDown={handleKeyPress}> */}
                    <div className="registration mb-3">
                      <div className="countryBox">
                        <div className="contryicons">
                          <img src={indiaIcon} alt="" />
                        </div>
                        <span>+91</span>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength="10"
                          placeholder="Enter 10-digit number"
                          value={mobile === 0 ? "" : mobile}
                          onChange={(e) => {
                            const enteredValue = e.target.value;
                            if (/^\d*$/.test(enteredValue)) {
                              setMobile(enteredValue);
                            }
                          }}
                        />
                      </div>
                      {disabled ? <Spin indicator={antIcon} style={{ margin: "15px" }} />
                        : <button
                          className="btn"
                          disabled={mobile == 0 || disabled}
                          onClick={handleSignIn}
                        >
                          Get OTP
                          <RightArrow className="icon" />
                        </button>}
                    </div>
                    <h6 onClick={() => { logEvent(analytics, 'D2C_Registration_Button', { mobile_number: 'WebsiteMobileLogin' }) }} >Are you a D2C brand? <a style={{ color: "#7459af", fontWeight: "600" }} href="https://forms.gle/1QCXUJwyVmzwEYGx8" target="_blank">Click Here</a> </h6>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="benefits-section">
            <div className="container">
              <div className="text-center">
                <h2 className="benefites-heading">
                  Enjoy Multiple <span>Benefits</span>
                </h2>
                <p className="benefites-subheading">As a Seller</p>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={ONDC} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>Sell On ONDC</h2>
                      <p>Get orders from thousands of new customers.</p>
                      <p>Get visibility on multiple apps.</p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 600,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={Commission} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>Save On Commission</h2>
                      <p>Less than 5% commission.</p>
                      <p>Stop paying 30% commission to marketplaces.</p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 600,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={Website} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>E-Commerce Website</h2>
                      <p>Get a ₹2000/Mo website FREE</p>
                      <p>Zero commission: Promote,sell, earn – all yours.</p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 600,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={Management} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>Order Management</h2>
                      <p>
                        View and ship your orders from E-commerce website and
                        ONDC with a single click.
                      </p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 600,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3  col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={Gateway} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>Payment Gateway</h2>
                      <p>Accept online payments for no charges.</p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={Delivery} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>Hyperlocal Delivery</h2>
                      <p>
                        Deliver with online tracking from Rs12 using our
                        efficient delivery service.
                      </p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={Tool} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>AI Listing Tool</h2>
                      <p>
                        Effortless product listing with our AI tool for a
                        seamless product catalogue.
                      </p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-img">
                      <img src={CustomerSupport} alt="" />
                    </div>
                    <div className="card-contain">
                      <h2>Customer Support</h2>
                      <p>
                        Our agents are always available! Get listing and order
                        assistance from our agents.
                      </p>
                      <div className="d-flex justify-content-center ">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="ProcessSection largePAdding text-center">
            <div className="container">
              <h1>
                <span>Simple</span>
                <span> Process</span>
              </h1>
              <h3>Get your shop online in 4 simple steps</h3>
              <div className="row justify-content-between">
                <div className="col-lg-2 col-md-6">
                  <div className="processBlock">
                    <div className="counterProcess">01</div>
                    <div className="processImg">
                      <img src={ShopDetails} alt="" />
                    </div>
                    <h5>Shop Details</h5>
                    <div className="bottomText">
                      <p className="m-0">
                        Enter Shop Name and select category.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="processBlock">
                    <div className="counterProcess">02</div>
                    <div className="processImg">
                      <img src={PersonalDetails} alt="" />
                    </div>
                    <h5>Personal Details</h5>
                    <div className="bottomText">
                      <p className="m-0">Upload Aadhar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="processBlock">
                    <div className="counterProcess">03</div>
                    <div className="processImg">
                      <img src={BankDetails} alt="" />
                    </div>
                    <h5>Bank Details</h5>
                    <div className="bottomText">
                      <p className="m-0">
                        Enter Account number and Bank Proof.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <div className="processBlock">
                    <div className="counterProcess">04</div>
                    <div className="processImg">
                      <img src={UploadCatalog} alt="" />
                    </div>
                    <h5>Upload Catalog</h5>
                    <div className="bottomText">
                      <p className="m-0">
                        Upload images and product information
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="HelpSection sectionGradient largePAdding">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-4">
                  <h3>DO YOU NEED ANY HELP ?</h3>
                </div>
                <div className="col-lg-7">
                  <h5>
                    Get 25+ ONDC orders daily within 24 hours. Best ONDC
                    solution for Retailers. Easy 2 minute registration. Best
                    Customer Support. Free Ecommerce Website.
                  </h5>
                  <h5>
                    Kiko live support is available to solve all your doubts and
                    issues before and after you start your online selling
                    business.
                  </h5>
                  <div className="contactBlock">
                    <div className="contactDetail">
                      <a href="/">+91 8108211231</a>
                    </div>
                    <div className="contactDetail">
                      <a href="/">support@kiko.media</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="contact_section">
            <div
              className="zoom-in-out-box "
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                handleWhatsAppButtonClick(
                  "+918108211231",
                  "Hi I need your help"
                );
              }}
            >
              <img src={WhatsApp} alt="" />
            </div>
            <CopyToClipboard text={"+918108211231"}>
              <div
                className="zoom-in-out-box "
                onClick={() => {
                  notify("success", "+918108211231 Copied");
                }}
              >
                <img src={phoneIcon} alt="" />
              </div>
            </CopyToClipboard>
          </div>
          <Footer />
          <section className="copyright-block">
            <div className="container">
              <p>Kiko © All Rights Reserved - 2025</p>
            </div>
          </section>
        </>
      )}
    </>
  );
}
export default HomeComponent;
