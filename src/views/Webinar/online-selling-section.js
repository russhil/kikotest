import "./styles-w.scss";
import OnlineStore from "./img/online-store.png";

function OnlineSellingSection() {
  return (
    <section className="online-selling-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="webinar-title-lg">
              Unlock Your Online Selling Potential Today
            </div>
            <p>
              Join our exclusive webinar tailored specifically for small
              business owners! Discover the essential strategies to
              seamlessly transition your offline store into the thriving
              digital marketplace. Don't miss this opportunity to enhance
              your business presence online!
            </p>
            <div className="online-selling-list">
              <div className="online-selling-items">
                <div className="webinar-title-sm">Easy Onboarding</div>
                <p>
                  No technical skills required—start selling online
                  effortlessly with our expert guidance.
                </p>
              </div>
              <div className="online-selling-items">
                <div className="webinar-title-sm">Boost Sales</div>
                <p>
                  Learn strategies to increase your customer reach and
                  enhance your sales performance.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <img
              className="img-fluid"
              src={OnlineStore}
              alt="Online Store"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OnlineSellingSection;
