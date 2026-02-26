import "./styles-w.scss";
import Blog1 from "./img/blog-1.png";
import Blog2 from "./img/blog-2.jpg";
import Blog3 from "./img/blog-3.jpg";
 
function WebinarBlogSection() {
  return (
    <section className="webinar-blog-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="webinar-title-lg">
              Unlock Your Digital Potential with Seamless Onboarding and
              Expert Support
            </div>

            <div className="webinar-blog-list">
              <div className="webinar-blog-items">
                <div className="webinar-blog-image">
                  <img src={Blog1} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  WhatsApp re-marketing panel to re-engage customers
                </div>
                <p>
                  The WhatsApp re-marketing panel re-engages customers with
                  personalized offers, updates, and reminders to boost
                  engagement and sales.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="webinar-blog-image">
                  <img src={Blog2} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Catalogue creation & product listing support from our team
                </div>
                <p>
                  Our team provides catalogue creation and product listing
                  support to help showcase products effectively and boost
                  online sales.
                </p>
              </div>
              <div className="webinar-blog-items">
                <div className="webinar-blog-image">
                  <img src={Blog3} alt="WhatsApp re-marketing panel" />
                </div>
                <div className="webinar-title-md">
                  Government-funded discounts for your customers
                </div>
                <p>
                  Government-funded discounts help your customers save more
                  while increasing trust, engagement, and sales for your
                  business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WebinarBlogSection;
