import React, { useState, useEffect } from "react";
import shopName from "../../images/Registration/shop-name.svg";
import CardDetail from "../../images/Registration/card-details.svg";
import BankDetail from "../../images/Registration/bank-proof.svg";
import UploadImage from "../../images/Registration/upload-image.svg";
import { useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Space, Spin } from "antd";
import { REQUEST_OTP, SELLER_LOGIN } from "../../api/apiList";
import API from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, notify } from "../../utils";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { analytics } from "../../firebase/FirebaseConfig"
import { logEvent } from 'firebase/analytics';
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";

function OtpVerify(props) {
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
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(60);
  const [tearms_cond, settearms_cond] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendDisable, setResendDisable] = useState(false);
  const [otpNew, setotpNew] = useState("");
  const location = useLocation();
  const state = location.state;
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [mobile] = useState(state ? state.mobile : null);

  useEffect(() => {
    let user = getSellerDetails();
    let admin = getAdminDetails();
    if (!mobile || mobile.length < 10 || mobile === 0) {
      navigate("/");
    } else if (user && user?.isProfileComplete) {
      navigate("/shopdetails");
    } else if (admin && admin?.role === "superadmin") {
      navigate("/admin-access");
    } else if (user) {
      navigate("/registration");
    }
  }, []);

  const verifyOtp = async () => {
    logEvent(analytics, 'Get_OTP_button', { mobile_number: 'WebsiteMobileLogin' });
    const data = {
      loginType: "browser",
      phone: `+91${mobile}`,
      countryCode: "+91",
      mobile: mobile,
      code: otpNew,
    };
    setLoading(true)
    await API.post(SELLER_LOGIN, data)
      .then(({ data }) => {
        if (data?.status) {
          if (data?.result?.user?.role === "superadmin"||data?.result?.user?.role === "chainadmin") {
            localStorage.setItem("admin", JSON.stringify(data?.result?.user));
            localStorage.setItem(
              "adminToken",
              JSON.stringify(data.result.token)
            );
          } else {
            localStorage.setItem("user", JSON.stringify(data?.result?.user));
            localStorage.setItem("token", JSON.stringify(data?.result?.token));
          }
          navigate("/")
        } else {
          notify("error", data?.message);
        }
        setLoading(false)
      })
      .catch((error) => {
        handleError(error);
      });
  };

  let timer;

  const startTimer = () => {
    timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timer);
    };
  }, []);

  const resendOtpFunc = async (event) => {
    event.preventDefault();
    if (countdown !== 0) {
      return;
    }
    try {
      setResendDisable(true)
      const response = await API.post(REQUEST_OTP, { phone: `+91${mobile}` });
      if (response?.data?.success) {
        notify("success", response?.data?.result?.message);
      }
      setResendDisable(false)
      clearInterval(timer);
      setCountdown(60);
      startTimer();
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
      <div className="registrationWrapper">
        <div className="registrationBlock">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-5">
                <div className="brandlogo">
                  <img src={kikoOndcLogo} />
                </div>
                <h2>Welcome to kiko</h2>
                <h6>Create your account to start selling</h6>
                <form>
                  <div className="row">
                    <div className="col-7">
                      <div className="otpsendText">OTP sent to +91{mobile}</div>
                    </div>
                    <div className="col-5">
                      <Link to="/" className="btn btn-primary">
                        {" "}
                        Change Number
                      </Link>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="InputFlex">
                        <div className="inputflexBlock">
                          <OtpInput
                            value={otpNew}
                            pattern="[0-9]*"
                            // inputType="number"
                            inputType="tel"
                            onChange={(otp) => {
                              if (/^\d*$/.test(otp)) {
                                setotpNew(otp);
                              }
                            }}
                            numInputs={6}
                            renderSeparator={<span></span>}
                            renderInput={(props) => <input {...props} />}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems:"center", justifyContent: "space-between", marginTop:"10px" }}>
                        <p
                          type="submit"
                          className="resend-otp"
                        >
                          Resend OTP in {countdown} sec.
                        </p>
                        <button
                          disabled={countdown !== 0 ||resendDisable}
                          onClick={resendOtpFunc}
                          className="btn btn-primary"
                          style={{ width: "110px", height: "40px", alignSelf: "center", cursor: "pointer" }}
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <button
                  disabled={otpNew.length < 6 || otpNew === "" || !tearms_cond}
                  onClick={() => {
                    verifyOtp();
                  }}
                  className="btn btn-primary"
                >
                  {loading ? <Spin indicator={antIcon} style={{ color: "white" }} />
                    : "Proceed"}
                </button>
                <div className="checkboxBlock">
                  <input
                    type="checkbox"
                    checked={tearms_cond}
                    onChange={(e) => settearms_cond(e.target.checked)}
                  />
                  <label className="terms-condition">
                    {" "}
                    By clicking you agree to our{" "}
                    <a
                      href="#"
                      target="_blank"
                      onClick={(e) => { e.preventDefault(); window.open("/terms-condition", "_blank") }}
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="https://kiko.live/privacy-policy/">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 right-section">
                <div>
                  <h4 className="mb-1">
                    Grow your business faster by selling on Kiko Live
                  </h4>
                  <h6>All you need to sell on Kiko live is:</h6>
                  <div className="row growBusiness">
                    <div className="col-md-6">
                      <div className="cardDetails">
                        <img src={shopName} alt="" />
                        <div className="card-text">
                          <p>Enter Shop Name and select category.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="cardDetails">
                        <img src={CardDetail} alt="" />
                        <div className="card-text">
                          <p>Upload Aadhar/PAN card Details.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="cardDetails">
                        <img src={BankDetail} alt="" />
                        <div className="card-text">
                          <p>Enter Account number and Bank Proof.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="cardDetails">
                        <img src={UploadImage} alt="" />
                        <div className="card-text">
                          <p>Upload images and product information</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default OtpVerify;
