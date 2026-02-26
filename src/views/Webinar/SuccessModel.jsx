import React, { useEffect } from "react";
import successful from '../Webinar/img/successful.svg';
import successBg from "../Webinar/img/success-bg.png"; // Ensure correct path
import "./styles-w.scss"; // Link custom styles
import whatsAppIcon from "../../images/whatsaapIcon.svg"

const SuccessModal = ({ whatsAppUrl, amount = 9, onClose, isFromLeadWithForm, pixelId}) => {
  // useEffect(() => {
  //       const noscript = document.createElement("noscript");
  //   const img = document.createElement("img");
  //   img.height = 1;
  //   img.width = 1;
  //   img.style.display = "none";
  //   img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  //   noscript.appendChild(img);
  //   document.body.appendChild(noscript);
  //   // Load Meta Pixel script if not already present
  //   // if (process.env.NODE_ENV !== "development") {
  //     if (!window.fbq) {
  //                 const noscript = document.createElement("noscript");
  //         const img = document.createElement("img");
  //         img.height = 1;
  //         img.width = 1;
  //         img.style.display = "none";
  //         img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  //         noscript.appendChild(img);
  //       document.body.appendChild(noscript);

  //       (function (f, b, e, v, n, t, s) {
  //         if (f.fbq) return;
  //         n = f.fbq = function () {
  //           n.callMethod
  //             ? n.callMethod.apply(n, arguments)
  //             : n.queue.push(arguments);
  //         };
  //         if (!f._fbq) f._fbq = n;
  //         n.push = n;
  //         n.loaded = true;
  //         n.version = "2.0";
  //         n.queue = [];
  //         t = b.createElement(e);
  //         t.async = true;
  //         t.src = v;
  //         s = b.getElementsByTagName(e)[0];
  //         s.parentNode.insertBefore(t, s);
  //       })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  //       // if (!window.fbqInitialized) {
  //         window.fbq("init", pixelId);
  //         window.fbqInitialized = true;
  //         window.fbq('set', 'autoConfig', false, pixelId);
  //       // }
  //       // window.fbq("init", pixelId);
  //       // window.fbq("init", "264771596216811"); // Pixel 2
  //     }

  //     // Fire tracking events
  //     window.fbq("track", "PageView");
  //     window.fbq("track", "Purchase", {
  //       value: amount.toFixed(2),
  //       currency: "INR",
  //     });
  //   // }
  // }, [amount]);

  useEffect(() => {
    if (!pixelId) return;

    import("./successPixel").then((module) => {
      module.initializeFacebookPixel(pixelId, amount);
    });
  }, [amount])


  return (
    <div className="modal-overlay success-modal-container">
      <div
        className="modal-w"
        style={{ backgroundImage: `url(${successBg})` }}
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Thank you for Registration</h2>
        <img
          src={successful}
          className="card-icon-modal"
          alt="Card Logo"
          width={50}
        />

        {
          !isFromLeadWithForm && <> <div className="amount">₹ {amount.toFixed(2)}</div>
            <div className="status">Payment Successful</div>
          </>}

        <p className="message">
          Our joining link will be sent on your email and WhatsApp. <br />
          Please block the date in your calendar 😊 <br />
          Looking forward to see you.
        </p>
        <button onClick={() => window.open(whatsAppUrl ? whatsAppUrl : "https://chat.whatsapp.com/CSt5Uq9KBmj96FmaJYYYfk?mode=ems_copy_t", "_blank")} className="whats-app-btn">
          <img src={whatsAppIcon} alt="WhatsApp" width={20} />
          Join our WhatsApp community
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
