import React, { useState } from "react";
import "./style.scss";
import kikoLogo from "../../images/kiko-seller-footer-logo.svg"; // replace with your logo path
import axios from "axios";
import { INSURANCE_OFFER } from "../../api/apiList";

const InsuranceOffer = () => {
  const [form, setForm] = useState({
    storeName: "",
    ownerName: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.storeName || !form.ownerName || !form.mobile) {
      alert("Please fill all fields");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);
      try {
        const options = {
          method: "post",
          url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}${INSURANCE_OFFER}`,
          headers: {
            desktop: true,
          },
          data: {
            storeName: form.storeName,
            storeOwnerName: form.ownerName,
            mobileNumber: form.mobile,
          },
        };
        const response = await axios(options);

        alert(response.data.message);

        setForm({
          storeName: "",
          ownerName: "",
          mobile: "",
        });
      } catch (error) {}
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insurance-container">
      {/* LEFT CONTENT */}
      <div className="left-section">
        <div className="left-content">
          <h1>
            KIKO LIVE LAYA HAI AAPKE DUKAN KE LIYE
            <br />
            <span>EK JABARDAST INSURANCE OFFER</span>
          </h1>

          <p>
            Aapki dukaan ki poori insurance, Aag, Chori, Flood, Baarish ke Paani
            se damage aur bahut kuch.
          </p>

          <div className="price-box">
            <span>SIRF</span>
            <strong>Rs.200 se</strong>
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="form-card">
          <img src={kikoLogo} alt="Kiko Live" className="logo" />

          <h3>Kiko Live Insurance</h3>

          <div className="input-group">
            <label>Store Name*</label>
            <input
              type="text"
              name="storeName"
              placeholder="Enter Store Name"
              value={form.storeName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Store Owner Name*</label>
            <input
              type="text"
              name="ownerName"
              placeholder="Enter Name"
              value={form.ownerName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Mobile Number*</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
            />
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "APPLY"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceOffer;
