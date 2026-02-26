import React from "react";

function TestimonialSection() {
  return (
    <div className="testimonial-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="webinar-title-lg">Testimonials</div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="testimonial-container">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">GS</div>
                  <div className="user-info">
                    <h3>Gurpreet singh</h3>
                    <p>Mr Sardar ji</p>
                  </div>
                  <div className="stars">★★★★☆</div>
                </div>

                <p className="testimonial-text">
                  "Since using Kiko Live, our orders have soared! The dashboard
                  helps us track performance and secure deals we might have
                  missed before."
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">HG</div>
                  <div className="user-info">
                    <h3>HILONI RAJIV GORADIA</h3>
                    <p>ZUMOS THE HEALTH CO</p>
                  </div>
                  <div className="stars">★★★★☆</div>
                </div>

                <p className="testimonial-text">
                  "Kiko Live has transformed our business! The intuitive
                  dashboard allows us to monitor our sales and seize
                  opportunities we previously overlooked."
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">PJ</div>
                  <div className="user-info">
                    <h3>Pratima Ganesh Janjalkar</h3>
                    <p>Nandini Food Service</p>
                  </div>
                  <div className="stars">★★★★☆</div>
                </div>

                <p className="testimonial-text">
                  "Since using Kiko Live, our orders have soared! The dashboard
                  helps us track performance and secure deals we might have
                  missed before."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialSection;
