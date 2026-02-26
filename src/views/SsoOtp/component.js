import React, { useState, useEffect } from "react";
import ondcNetwork from "../../images/ondc-network.png";
import OtpInput from "react-otp-input";
import { useLocation } from 'react-router-dom';
import { REQUEST_OTP, SELLER_LOGIN } from "../../api/apiList";
import "./styles.scss";
import API from "../../api";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { handleError, notify } from "../../utils";
import { useNavigate } from "react-router-dom";
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";

function OndcOtp() {
  const [otpNew, setOtpNew] = useState("");
  const [tearms_cond, settearms_cond] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(20);
  const queryParams = new URLSearchParams(location.search);
  const mobileNumber = queryParams.get('mobile');
  const brandProviderId = queryParams.get("brandProviderId");
  const [mobile] = useState(mobileNumber ? mobileNumber : null);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  // const getAdminDetails = () => {
  //   try {
  //     return JSON.parse(localStorage.getItem("admin") || "");
  //   } catch (error) {
  //     return null;
  //   }
  // };

  useEffect(() => {
    let user = getSellerDetails();
    // let admin = getAdminDetails();
    if (!mobile || mobile.length < 10 || mobile === 0) {
      navigate("/");
    } else if (user && user?.isProfileComplete) {
      navigate("/orders");
    } else if (user) {
      navigate("/registration");
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timer);
    };
  }, []);


  const verifyOtp = async () => {
    setLoading(true)
    const data = {
      loginType: "browser",
      phone: `+91${mobile}`,
      countryCode: "+91",
      mobile: mobile,
      code: otpNew,
      brandProviderId: brandProviderId,
      brandName: "ITC"
    };
    await API.post(SELLER_LOGIN, data)
      .then(({ data }) => {
        if (data?.success) {
          localStorage.setItem("user", JSON.stringify(data?.result?.user));
          localStorage.setItem("token", JSON.stringify(data?.result?.token));
          navigate("/")
          setLoading(false)
          // window.location.reload();
        } else {
          setLoading(false)
          notify("error", data?.message);
        }
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

  const resendOtpFunc = async (event) => {
    event.preventDefault();
    if (countdown !== 0) {
      return;
    }
    try {
      setResendLoading(true)
      const response = await API.post(REQUEST_OTP, { phone: `+91${mobile}` });
      if (response?.data?.success) {
        notify("success", response?.data?.result?.message);
      }
      clearInterval(timer);
      setCountdown(20);
      setResendLoading(false)
      startTimer();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="ondc-otp-container">
        <div className="ondc-otp-block">
          <div className="otp-section">
            <h1>
              Welcome To{" "}
              <img src={ondcNetwork} alt=""/>
            </h1>
            <p>OTP sent to +91{mobile}</p>
            <div className="InputFlex">
              <div className="inputflexBlock">
                <OtpInput
                  className="otp-input"
                  value={otpNew}
                  inputType="number"
                  onChange={(event) => {
                    setOtpNew(event);
                  }}
                  numInputs={6}
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input {...props} />}
                />
                {resendLoading ? <Spin indicator={antIcon} style={{margin:"15px"}} />: <p className="RecievedOtp" onClick={resendOtpFunc} >RESEND OTP ({countdown})</p>}
                <div className="ondc-proceed-btn">
                {loading ? <Spin indicator={antIcon} style={{margin:"15px"}} />:
                  <button
                    disabled={otpNew.length < 6 || otpNew === "" || !tearms_cond ||loading}
                    onClick={() => {
                      verifyOtp();
                    }}
                    className="btn btn-primary w-100">
                    Proceed</button>}
                </div>

              </div>
              <div className="checkboxBlock">
                <input
                  type="checkbox"
                  checked={tearms_cond}
                  onChange={(e) => settearms_cond(e.target.checked)}
                />
                <label className="terms-condition">
                  By clicking you agree to our <a
                    href="/terms-condition"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => { e.preventDefault(); window.open("/terms-condition", "_blank") }}
                  >Terms & Conditions</a> and <a href="https://kiko.live/privacy-policy/"  rel="noreferrer" target="_blank">Privacy Policy</a>
                </label>
              </div>
            </div>
            <div className="brand-logo">
              <img src={kikoOndcLogo} alt=""/>
            </div>
          </div>


        </div>

      </div>
    </>
  );
}
export default OndcOtp;
