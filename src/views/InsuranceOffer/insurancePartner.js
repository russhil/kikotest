import React, { useState } from "react";
import "./style.scss";
import kikoLogo from "../../images/kiko-seller-footer-logo.svg"; // replace with your logo path
import axios from "axios";
import { INSURANCE_FREELANCER } from "../../api/apiList";

const InsurancePartner = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
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
    if (!form.name || !form.email || !form.mobile) {
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
          url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}${INSURANCE_FREELANCER}`,
          headers: {
            desktop: true,
          },
          data: {
            name: form.name,
            email: form.email,
            mobileNumber: form.mobile,
          },
        };
        const response = await axios(options);

        alert(response.data.message);

        setForm({
          name: "",
          email: "",
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
    <div className="insurance-freelancer-section">
      <div className="content-wrapper">
        <h1 className="title-text">Kiko Live Insurance Partner Program</h1>
        <div className="form-card">
          <img src={kikoLogo} alt="Kiko Live" className="logo" />

          <h3>Join as a Freelancer Partner</h3>

          <div className="input-group">
            <label>Candidate Name*</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={form.name}
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

          <div className="input-group">
            <label>Candidate Email*</label>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
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

export default InsurancePartner;
