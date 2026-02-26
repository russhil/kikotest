import React, { useState, useEffect } from "react";
import { handleError, notify, handleLogout, flutterDailPadHandler } from "../../utils";
import { ADD_ENQUIRY } from "../../api/apiList";
import validator from "validator";
import { get } from "lodash";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import lngTranslator from "../../json/support.json"
// import SupportImg from "../../images/Support/support-img.svg";
import "./styles.scss";

const Support = (props) => {
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState("")
  const [univError, setUnivError] = useState(false)
  const [message, setMessage] = useState("")
  const [queryRelatedTo, setQueryRelatedTo] = useState("")
  const [langSelect, setLangSelect] = useState("ENG")
  const navigate = useNavigate();
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const user_data = getSellerDetails();

  useEffect(() => {
    const userData = getSellerDetails();
    if (!get(userData, "_id", "") && get(userData, "_id", "") === "") {
      handleLogout();
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      navigate("/support")
      // window.location.reload();
    }
  }, []);

  const createCallEnquiry = async () => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * +5.5));
    const ist = nd.toLocaleString();
    const date = ist.split(",");
    let body = {
      enquiryNumber: Date.now().toString(36) + Math.random().toString(36).substr(2),
      enquiryType: "enquiry",
      mobile: getSellerDetails().mobile,
      email: email,
      storeName: getSellerDetails().name,
      queryRelatedTo: queryRelatedTo,
      queryDetails: message,
      date: date[0],
      time: date[1],
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    try {
      const response = await API.post(ADD_ENQUIRY, body);
      if (response?.data?.success) {
        notify("success", "Enquiry Added Successfully...")
        setIsValid("")
        setEmail("")
        setMessage("")
        setQueryRelatedTo("")
      }
    } catch (error) {
      handleError(error);
    }
  };


  const emailValidator = (value) => {
    if (!validator.isEmail(value)) {
      return <span className="error">Invalid email format.</span>;
    }
  };

  const validation = () => {
    const emailValidationError = emailValidator(email);
    if (emailValidationError) {
      setIsValid("email")
      setUnivError(true)
      return;
    }
    if (queryRelatedTo === "") {
      setIsValid("queryRelatedTo")
      setUnivError(true)
      return;
    }
    createCallEnquiry();
  };

  const getCollapseId = (index) => `flush-collapse${index + 1}`;

  const getSupportData = () => {
    switch (langSelect) {
      case "ENG":
        return lngTranslator?.ENG;
      case "HND":
        return lngTranslator?.HND;
      default:
        return lngTranslator?.ENG;
    }
  };

  return (
    <>
      <div className="RightBlock">
        <div className="section-title">
          <h1 className="mb-0">FAQ & Support</h1>
        </div>
        <div className="container-main pt-3">
          <div className="row">
            {user_data?.brandName !== "B2B" && <div className="col-lg-11 support-accordian">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="m-0">Frequently Asked Questions </h1>
                <div className="language-option">
                  <label>Language</label>
                  <select className="form-select selectpicker" onChange={(e) => { setLangSelect(e.target.value) }}>
                    <option value={"ENG"} data-content='<span class="flag-icon flag-icon-us"></span> English'>Eng</option>
                    <option value={"HND"} data-content='<span class="flag-icon flag-icon-in"></span> Hindi'>Hindi</option>
                  </select>
                </div>
              </div>
              <div className="accordion accordion-flush" id="accordionFlushExample">

                {getSupportData().map((item, index) => {
                  return (
                    <>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id={`flush-heading${index}`}>
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${getCollapseId(index)}`} aria-expanded="false" aria-controls={getCollapseId(index)}>
                            {item.title}
                          </button>
                        </h2>
                        <div id={getCollapseId(index)} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
                          <div className="accordion-body">
                            {item.subTitle}
                            <div>
                              <div dangerouslySetInnerHTML={{ __html: item.value }} />
                              <p dangerouslySetInnerHTML={{ __html: item.footer }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>}
            <div className="col-lg-11">
              <div className="row">
                <div className="col-lg-5">
                  <h1 className="main-title">
                    Can’t find an answer to your question ?
                  </h1>
                  <p className="sub-title">
                    Please fill in the details and we will be in touch shortly
                    or send us email.
                  </p>
                  <div className="support">
                    <a href="mailto:help@kiko.live" className="support-email">
                      help@kiko.live
                    </a>
                  </div>
                  <div className="support">
                    <button onClick={() => {
                      if (window && window.flutter_inappwebview) {
                        const args = ["+918108211231"];
                        flutterDailPadHandler(args);
                      } else {
                        window.location.href = `tel:+918108211231`;
                      }
                    }} className="support-phone">
                      +91 8108211231
                    </button>
                  </div>
                </div>
                <div className="col-lg-6">
                  <form className="support-form">
                    <div className="mb-3">
                      <label className="form-label">
                        Seller Name<span>*</span>
                      </label>
                      <label className="form-control">{getSellerDetails().name} </label>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Mobile Number<span>*</span>
                      </label>
                      <label className="form-control">{getSellerDetails().mobile} </label>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Email ID<span>*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email "
                        className="form-control"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setIsValid(''); }}
                      />
                      {((!emailValidator(email)?._store?.validated && isValid === "email") || (univError && email === "")) && <p className="error">Required*</p>}
                    </div>
                    <div className="mb-3">
                      <div className="accordion accordion-flush" id="accordionFlushExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingCategoryList">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseCategoryList" aria-expanded="false" aria-controls="flush-collapseCategoryList">
                              Select Issue category<span>*</span>
                            </button>
                          </h2>
                          <div id="flush-collapseCategoryList" className="accordion-collapse collapse" aria-labelledby="flush-headingCategoryList" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body p-0">
                              <div className="catgory-list">
                                <div className="form-group">
                                  <div onClick={() => { setQueryRelatedTo("account"); setIsValid(''); }}>
                                    <input type="checkbox" value="yes" checked={queryRelatedTo === "account"} />
                                    <label for="Account">Account</label>
                                  </div>
                                  <div onClick={() => { setQueryRelatedTo("inventory"); setIsValid(''); }}>
                                    <input type="checkbox" value="yes" checked={queryRelatedTo === "inventory"} />
                                    <label for="Inventory">Inventory</label>
                                  </div>
                                  <div onClick={() => { setQueryRelatedTo("order"); setIsValid(''); }}>
                                    <input type="checkbox" value="yes" checked={queryRelatedTo === "order"} />
                                    <label for="Orders & Delivery">Orders & Delivery</label>
                                  </div>
                                  <div onClick={() => { setQueryRelatedTo("payment"); setIsValid(''); }}>
                                    <input type="checkbox" value="yes" checked={queryRelatedTo === "payment"} />
                                    <label for="Payments">Payments</label>
                                  </div>
                                  <div onClick={() => { setQueryRelatedTo("return"); setIsValid(''); }}>
                                    <input type="checkbox" value="yes" checked={queryRelatedTo === "return"} />
                                    <label for="Returns/RTO & Exchange">Returns/RTO & Exchange</label>
                                  </div>
                                  <div onClick={() => { setQueryRelatedTo("queryRelatedToOtherText"); setIsValid(''); }}>
                                    <input type="checkbox" value="yes" checked={queryRelatedTo === "queryRelatedToOtherText"} />
                                    <label for="Others">Others</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {((isValid === "queryRelatedTo") || (univError && queryRelatedTo === "")) && <p className="error">Required*</p>}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Write your message: </label>
                      <textarea rows="4" onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                    <div className="mb-3 text-center">
                      <div className="btn btn-md btn-primary" onClick={() => validation()}>
                        Send your message
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
export default Support;
