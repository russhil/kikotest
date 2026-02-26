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
              Join our deep-dive webinar designed for restaurant owners. We'll
              explore the crucial steps to move away from high-commission
              aggregators and launch your own online ordering system on the ONDC
              platform. This session will give you the tools to boost your
              direct sales, own your customer data, and grow your restaurant's
              brand online.
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
                  Launch Your Own Branded Online Restaurant
                </div>
                <p>
                  Learn how to set up your branded website with your full menu
                  and start taking direct, commission-free orders.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={Catalogicon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Get Full Menu & Catalog Setup Support
                </div>
                <p>
                  Our team will help you create and list your complete menu,
                  with all your items, categories, and photos, to make your
                  online store look professional.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={SupportIcon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Get Marketing Support to Drive Direct Orders
                </div>
                <p>
                  Discover powerful strategies to run promotions, drive direct
                  traffic to your website, and grow your restaurant's online
                  brand.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="cover-webinar-image">
                  <img src={WhatsAppIcon} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Use WhatsApp to Drive Repeat Orders
                </div>
                <p>
                  Learn how to use the WhatsApp re-marketing panel to re-engage
                  your customers. Send them your new menu, daily specials, and
                  "order direct" reminders.
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
                  Attract more customers with special discounts funded by the
                  government through ONDC. You get to offer a deal, but you
                  still receive the full price for your food.
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
