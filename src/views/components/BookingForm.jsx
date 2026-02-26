import React, { useState } from 'react';

const BookingForm = ({ selectedPlan, onClose }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    sellerName: '',
    location: '',
    mobile: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate mobile number
    if (formData.mobile.length !== 10) {
      alert('कृपया 10 अंकों का सही मोबाइल नंबर डालें!');
      return;
    }

    // Store booking details
    const bookingData = {
      plan: selectedPlan,
      ...formData,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Get plan details
    const planDetails = selectedPlan === 'plan1' 
      ? { coverage: '5 Lakh', price: '₹999' }
      : { coverage: '10 Lakh', price: '₹1,999' };

    onClose();

    const confirmMessage = `
✅ बुकिंग Successful!

📋 Plan Details:
Coverage: ${planDetails.coverage} Insurance
Booking Amount: ₹99 Paid

💰 Final Payment Required:
Amount: ${planDetails.price}

अगले Page पर आप Final Payment Complete कर सकते हैं।

धन्यवाद! 🙏
    `;

    alert(confirmMessage);
  };

  const planTitle = selectedPlan === 'plan1' ? '70% OFF' : '75% OFF';

  return (
    <>
      <div className="modal-header">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="modal-title">🎉 {planTitle} Unlock करें!</div>
        <div className="modal-subtitle">अभी सिर्फ ₹99 देकर अपना Insurance Book करें</div>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">दुकान का नाम (Store Name) *</label>
            <input
              type="text"
              className="form-input"
              id="storeName"
              placeholder="अपनी दुकान का नाम डालें"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">आपका नाम (Seller Name) *</label>
            <input
              type="text"
              className="form-input"
              id="sellerName"
              placeholder="अपना नाम डालें"
              value={formData.sellerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">लोकेशन (Location) *</label>
            <input
              type="text"
              className="form-input"
              id="location"
              placeholder="शहर और राज्य"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">मोबाइल नंबर (Mobile Number) *</label>
            <input
              type="tel"
              className="form-input"
              id="mobile"
              placeholder="10 अंकों का मोबाइल नंबर"
              pattern="[0-9]{10}"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="payment-button">
            💰 Pay ₹99 & Book Now
          </button>
        </form>
      </div>
    </>
  );
};

export default BookingForm;
