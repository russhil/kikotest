import "./styles-w.scss";

function WebinarFaqSection() {
  return (
    <section className="webinar-faq-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-title-lg">FAQs</div>
            <p>
              Find answers to common questions about the Kiko Live Seller webinar.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    What do I get from Webinar and Registration?
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    You get your own branded e-commerce website with 4,000+ items pre-listed, ONDC integration, AI-powered dashboard, COD & Khata support, delivery service option, and marketing tools. The entire setup is done for you and your store can be live within 2 hours.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    How does ONDC help me?
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Your products automatically appear on popular apps like Paytm, Ola MyStore, Digihaat and more. This brings you extra orders from new customers without you spending on marketing.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Do customers really get discounts?
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Yes, every customer gets a ₹40–₹50 discount on each order through ONDC, funded by the government. You still receive the full payment for your products.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Who delivers the orders?
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFour"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    You can either deliver yourself and collect payment directly, or use Kiko’s on-demand delivery riders. Both options are managed from the same dashboard.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFive">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseheadingFive"
                    aria-expanded="false"
                    aria-controls="collapseheadingFive"
                  >
                    Why is this better than others?
                  </button>
                </h2>
                <div
                  id="collapseheadingFive"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingheadingFive"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Other platforms only list your phone number for ₹5,000–₹10,000. For just ₹3,000, Kiko gives you a complete e-commerce store, ONDC sales, delivery support, marketing tools, and much more.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WebinarFaqSection;
