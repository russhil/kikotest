import React, { useState, useEffect } from "react";
import ondcNetwork from "../../images/ondc-network.png";
import { useLocation } from "react-router-dom";
import Logout from "../../images/ShopDetails/logout.svg";
import igmCover from "../../images/Inventry/igmCover.svg";
import kikoLogo from "../../images/Inventry/kikoLogo.svg";
import mail from "../../images/Inventry/mail.svg";
import phone from "../../images/Inventry/phone.svg";
import { LOGIN } from "../../api/apiList";
import "./styles.scss";
import API from "../../api";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { handleError, notify } from "../../utils";
import { useNavigate } from "react-router-dom";
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";

function IgmLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginEror, setLoginError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  //   useEffect(() => {
  //     let user = getSellerDetails();
  //     if (!mobile || mobile.length < 10 || mobile === 0) {
  //       navigate("/");
  //     } else if (user && user?.isProfileComplete) {
  //       navigate("/orders");
  //     } else if (user) {
  //       navigate("/registration");
  //     }
  //   }, []);

  const verifyOtp = async () => {
    setLoading(true);
    const obj = { userName, password };
    await API.post(LOGIN, obj)
      .then(({ data }) => {
        if (data?.success) {
          localStorage.setItem("igmUser", JSON.stringify(data?.result?.user));
          localStorage.setItem("token", JSON.stringify(data?.result?.token));
          localStorage.removeItem("user");
          navigate("/igm-manager");
          setLoading(false);
        } else {
          setLoading(false);
          setLoginError(true);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  };

  return (
    <>
      <div className="ticket-heading">
        <h3 className="heading-text">Kiko Live | IGM Panel</h3>
      </div>
      <div className="igm_login_container">
        <div className="igm_main_container">
          <div className="left_container">
            <h2>
              Optimize your business operations <br />
              with the Kiko Live IGM Panel
            </h2>
            <img src={igmCover} alt="img" />
          </div>
          <div className="right_container">
            <div className="logo-wrapper">
              <img src={kikoLogo} alt="logo" />
            </div>
            <h2 className="igm-login-title">Login To Your Support Desk</h2>
            <div className="igm-login-feild">
              <div className="igm-input-feild">
                <input
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setLoginError(false);
                  }}
                  className={loginEror ? "errorUserId" : "userId "}
                  type="text"
                  placeholder="User ID"
                  required
                />
                {loginEror && (
                  <div className="errorUserIdText">Invalid User ID</div>
                )}
              </div>
              <div className="igm-input-feild">
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(false);
                  }}
                  className={loginEror ? "errorUserId" : "userId "}
                  type="password"
                  placeholder="Password"
                  required
                />
                {loginEror && (
                  <div className="errorUserIdText">Invalid Password</div>
                )}
              </div>

              <button
                disabled={userName === "" || password === ""}
                onClick={() => {
                  verifyOtp();
                }}
              >
                {loading ? (
                  <Spin
                    indicator={antIcon}
                    style={{ margin: "15px", color: "white" }}
                  />
                ) : (
                  "Log In"
                )}
              </button>
              <div className="unable-to-login">
                <span>Unable To Login, Reach us at</span>
              </div>
              <div className="contactBlock">
                <div className="contactDetail">
                  <a href="mailto:help@kiko.media" className="contact-link">
                    help@kiko.media
                  </a>
                </div>
                <span>|</span>
                <div className="contactDetail">
                  <a href="#" className="contact-link">
                    +91 8108211231
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="ondc-otp-container">
        <div className="ondc-otp-block">
          <div className="otp-section">
            <h1>
              Welcome To{" "}
              <img src={ondcNetwork} alt="" />
            </h1>
            <div >
              <div >
                <input
                  onChange={(e) => { setUserName(e.target.value) }}
                  name='userName'
                  type='text'
                  placeholder='Enter Username'
                  size='lg'
                  style={{ width: "215px" }}
                  required
                />
                <input
                  onChange={(e) => { setPassword(e.target.value) }}
                  name='password'
                  type='password'
                  placeholder='Enter Password'
                  size='lg'
                  style={{ width: "215px" }}
                  required
                />
                <div className="ondc-proceed-btn">
                  {loading ? <Spin indicator={antIcon} style={{ margin: "15px" }} /> :
                    <button
                      disabled={userName === "" || password === ""}
                      onClick={() => {
                        verifyOtp();
                      }}
                      className="btn btn-primary w-100">
                      Submit</button>}
                </div>
              </div>
            </div>
            <div className="brand-logo">
              <img src={kikoOndcLogo} alt="" />
            </div>
          </div>


        </div>

      </div> */}
    </>
  );
}
export default IgmLogin;
