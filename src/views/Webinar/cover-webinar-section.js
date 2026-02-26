import "./styles-w.scss";
import Icon1 from "./img/icon-1.png";
import Icon2 from "./img/icon-2.png";
import Icon3 from "./img/icon-3.png";
import WebsiteIcon from "../../images/HomeNew/website-icon.png";
import Catalogicon from "../../images/HomeNew/catalog-icon.png";
import SupportIcon from "../../images/HomeNew/support-icon.png";
import WhatsAppIcon from "../../images/HomeNew/whats-app-icon.png";
import DiscountsIcon from "../../images/HomeNew/discounts-icon.png";
// import _ from "lodash";

function CoverWebinarSection() {
  return (
    <section className="webinar-blog-section cover-webinar-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="webinar-title-lg">
              Here’s What You'll Learn in the Webinar
            </div>
            <p>
              Here's What You'll Learn Join us for a deep dive into the crucial steps needed to transition your Kirana store to the ONDC platform. This webinar will equip you with the essential knowledge and tools to boost your online presence. Gain insights from industry experts and gather tips to thrive in the digital marketplace.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-blog-list">
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={WebsiteIcon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Launch Your Branded E-Commerce Website
                </div>
                <p>
                  Learn how to successfully set up your own branded e-commerce website and start your online selling journey.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={Catalogicon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Get a Pre-Listed Catalog with Thousands of Items
                </div>
                <p>
                  This is your biggest time-saver! Get instant access to a pre-listed catalog of thousands of grocery items, so you don't have to add them one by one.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={SupportIcon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Get Digital Marketing Support
                </div>
                <p>
                  Discover powerful strategies to boost sales and grow your online e-commerce brand. Implementing these tactics can lead to significant revenue increases.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={WhatsAppIcon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Use a WhatsApp
                  Re-marketing Panel
                </div>
                <p>
                  Enhance customer engagement with WhatsApp marketing tools. Use personalized messages to boost your communication today!
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={DiscountsIcon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Offer Government-Funded Discounts
                </div>
                <p>
                  Learn how your customers can receive discounts funded by the government, while you still receive your full payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoverWebinarSection;
