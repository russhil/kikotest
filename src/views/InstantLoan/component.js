import { useEffect, useState } from "react";
import "./LoanCard.scss";
import contactIcon from "../../images/ShopDetails/contact.svg";
import emailIcon from "../../images/ShopDetails/gmail-logo.svg";
import whatsaapIcon from "../../images/ShopDetails/whatsaap.svg";


export default function InstantLoan() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // const hasReloaded = sessionStorage.getItem("hasReloaded");
    // if (!hasReloaded) {
    //   sessionStorage.setItem("hasReloaded", "true");
    //   navigate("/shopdetails");
    // }
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <div className="RightBlock">
      <div className="loan-container">
        <div className="section-title mb-3">
          <h1 className="mb-0">Instant Loan</h1>
        </div>
        <div className="loan-ui-wrapper">
          <h1 className="loan-ui-title">
            Instant Capital.
            <br />
            Zero Hassle.
          </h1>

          <p className="loan-ui-subtitle">
            Get the funding you need to grow your business without the wait
          </p>

          <div className="loan-ui-card">
            <div className="loan-ui-card-top">
              <p className="loan-ui-eligibility">
                🚀 You are eligible for a loan up to
              </p>

              <h2 className="loan-ui-amount">5,00,000*</h2>

              <span className="loan-ui-interest-badge">
                Interest starting at just 1.25%*
              </span>
            </div>

            <div className="loan-ui-card-bottom">
              <button
                onClick={() => {
                  isMobile
                    ? (window.location.href =
                        "https://www.aspirenbfc.in/login?code=ASPKK6MEWI")
                    : window.open(
                        "https://www.aspirenbfc.in/login?code=ASPKK6MEWI"
                      );
                }}
                className="loan-ui-cta-btn"
              >
                Get Now
              </button>

              <p className="loan-ui-note">
                * Terms and conditions apply. Interest rates subject to
                eligibility.
              </p>
            </div>
          </div>
        </div>
        <div className="loan-footer">
          <div className="contact-us-headline">
            In case of any Changes/Update <img src={contactIcon} alt="" />{" "}
            <button id="popover-trigger">Contact Us</button>
            <div id="popover-content">
              <p>
                <a href="mailto:support@kiko.media" className="mb-2">
                  <img src={emailIcon} alt="" />
                  support@kiko.media{" "}
                </a>
                <button
                  className="whatsappButton"
                  // onClick={() => copyToClipboard("+918108211231")}
                >
                  <img src={whatsaapIcon} alt="" />
                  +91 8108211231{" "}
                </button>
              </p>
            </div>
          </div>
          {/* {activeTabId === "#home-v" && ( */}
          {/* <div className="button-wrapper">
            <button
              className="btn btn-md btn-primary p-0 uploadBtn"
              style={{ maxWidth: "300px" }}
              onClick={() => {
                window.location.href =
                  "https://d1yd3a2ik8ypqd.cloudfront.net/uploads/pos-spaniel-Kiko-20250523.msi";
              }}
            >
              <p className="upload-img">Download POS Software</p>
            </button>
          </div> */}
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
