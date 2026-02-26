import "./styles-w.scss";
import yourWebinarImage1 from "./img/community-img1.png";
import RestaurantOwner from "../../images/HomeNew/restaurant-owner.png";
import R1 from "../../images/HomeNew/restaurant-w1.png";
import R2 from "../../images/HomeNew/restaurant-w2.png";
import R3 from "../../images/HomeNew/restaurant-w3.png";
import R4 from "../../images/HomeNew/restaurant-w4.png";
import R5 from "../../images/HomeNew/restaurant-w5.png";
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
              This webinar is designed specifically for owners and managers in
              the food service industry who want to increase their profits by
              moving to a direct-to-customer (D2C) online sales model.{" "}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="your-webinar-list">
              <div className="your-webinar-inner-list">
                <div>
                  <div className="your-webinar-icon">
                    <img src={R1} alt="" />
                  </div>
                  <div className="webinar-title-sm">Restaurants</div>
                </div>
                <div>
                  <div className="your-webinar-icon">
                    <img src={R2} alt="" />
                  </div>
                  <div className="webinar-title-sm">F&B Outlets</div>
                </div>
                 <div>
                  <div className="your-webinar-icon">
                    <img src={R3} alt="" />
                  </div>
                  <div className="webinar-title-sm">Cloud Kitchens</div>
                </div>
              </div>
              
              <div className="your-webinar-inner-list list-img">
                <div className="webinar-image">
                  <img src={RestaurantOwner} alt="" />
                </div>
              </div>
              <div className="your-webinar-inner-list">
                <div>
                  <div className="your-webinar-icon">
                    <img src={R4} alt="" />
                  </div>
                  <div className="webinar-title-sm">Cafes</div>
                 
                </div>
                <div>
                  <div className="your-webinar-icon">
                    <img src={R5} alt="" />
                  </div>
                  <div className="webinar-title-sm">Quick Service Restaurants</div>
                
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
