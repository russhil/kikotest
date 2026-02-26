import "./styles-w.scss"; // Link to the CSS file

export default function WebinarModal({
  onClose,
  userData,
  handleChange,
  onsubmit,
  disabled,
  isFromLeadWithForm,
  isWebinarRS9,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-w">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Register now for ONDC webinar</h2>
        {/* <div>Amount 9</div> */}
        <form className="modal-form">
          <label>
            Seller Name*
            <input
              name="sellerName"
              value={userData.sellerName}
              onChange={handleChange}
              type="text"
              placeholder="Enter your full name"
            />
          </label>

          <label>
            Email*
            <input
              name="email"
              value={userData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
            />
          </label>

          <label>
            Phone*
            <div className="phone-input">
              <span className="country-code">🇮🇳 +91</span>
              <input
                name="phone"
                type="number"
                value={userData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </label>
          <label>
            Store or Restaurant Name*
            <input
              type="text"
              name="storeName"
              value={userData.storeName}
              onChange={handleChange}
              placeholder="Enter your Store or Restaurant Name"
            />
          </label>
          <label>
            City / Town / Village*
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleChange}
              placeholder="Enter your City / Town / Village"
            />
          </label>

          <button
            disabled={disabled}
            onClick={(e) => onsubmit(e)}
            type="submit"
            className="submit-button"
          >
            {disabled
              ? "Please wait..."
              : isFromLeadWithForm
              ? "Submit"
              : isWebinarRS9
              ? "PAY ₹9 & SUBMIT"
              : "PAY ₹49 & SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
}
