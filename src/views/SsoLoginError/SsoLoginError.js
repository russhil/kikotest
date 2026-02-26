import React from "react";
import "./styles.scss"
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";

function SsoLoginError() {

  const flutterLogout = () => {
    window.flutter_inappwebview.callHandler("closeWebView")
  }

  return (
    <>
      <div className="sso-container">
        <div className="sso-login-wrapper">
          <div className="sso-login-text">
            <h1>Seller Already registered with kiko Live</h1>
            <h4>Please login through kiko live app or <a href="https://sellers.kiko.live/" >sellers.kiko.live</a></h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button type="button" onClick={() => flutterLogout()} className="btn btn-primary btn-md">Go Back home</button>
          </div>
        </div>
        <div className="sso-kiko-logo">
          <img src={kikoOndcLogo} alt=""/>
        </div>
      </div>
    </>
  );
}
export default SsoLoginError;
