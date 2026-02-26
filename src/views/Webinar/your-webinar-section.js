import "./styles-w.scss";
import yourWebinarImage1 from "./img/community-img1.webp";
import attendIcon from "../../images/HomeNew/attend-icon.png";
import shopsIcon from "../../images/HomeNew/shops-icon.png";
import outletsIcon from "../../images/HomeNew/outlets-icon.png";
import warehouseIcon from "../../images/HomeNew/warehouse-icon.png";

function YourWebinarSection() {
  return (
    <section className="your-webinar-section successful-sellers-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-title-lg">
              Is This Webinar Right for You?
            </div>
            <p>
              This webinar is designed for anyone looking to transition from offline to online sales. If you are<br /> a retailer, you'll find valuable insights to help you succeed. This includes:
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="your-webinar-list">
              <div className="your-webinar-inner-list">
                <div>
                  <div className="your-webinar-icon">
                    <img src={attendIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">Who Should Attend?</div>
                  <p>
                    Retailers looking to expand their reach and sales through digital platforms.
                  </p>
                </div>
                <div>
                  <div className="your-webinar-icon">
                    <img src={shopsIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">Kirana Shops</div>
                  <p>
                    Kirana shop owners eager to embrace e-commerce and enhance customer engagement.
                  </p>
                </div>
              </div>
              <div className="your-webinar-inner-list list-img">
                <div className="webinar-image">
                  <img src={yourWebinarImage1} alt="" width={540} height={540} />
                </div>
              </div>
              <div className="your-webinar-inner-list">
                <div>
                  <div className="your-webinar-icon">
                    <img src={outletsIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">F&B Outlets</div>
                  <p>
                    Food and beverage outlets wanting to reach a broader audience through online sales.
                  </p>
                </div>
                <div>
                  <div className="your-webinar-icon">
                    <img src={warehouseIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">Distributors</div>
                  <p>
                    Distributors seeking innovative ways to connect with retailers and streamline their operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default YourWebinarSection;
