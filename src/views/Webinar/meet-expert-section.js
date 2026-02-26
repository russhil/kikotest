import "./styles-w.scss";
import meetImg from "./img/meet-img.webp";

function MeetExpertSection() {
  return (
    <section className="online-selling-section meet-expert-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="webinar-title-lg">
              Meet Our Expert: Your Guide to Digital Success
            </div>
            <p>
              Imran Alam is a seasoned professional with over 20 years of experience in Sales & Marketing, Business Development, Product Management, and Distribution Management. He has successfully led large teams, expanded markets, and built scalable sales networks across India. His expertise includes Key Account Management, Market Research, Marcom, and channel development, driving consistent business growth. Imran has spearheaded strategic initiatives in both B2B and B2C environments, managing sales operations and customer engagement. Known for fostering strong client relationships and designing effective go-to-market strategies, he focuses on creating customer-first, growth-oriented solutions.
            </p>
            <div className="online-selling-list">
              <div className="online-selling-items">
                <div className="webinar-title-sm">Expert Guidence</div>
                <p>
                  No technical skills? No problem! Our expert guidance for ONDC makes starting your online selling journey easy and confident.
                </p>
              </div>
              <div className="online-selling-items">
                <div className="webinar-title-sm">Proven success</div>
                <p>
                  Prepare to elevate your offline store! Transform it into a thriving online business. Embrace the digital world and watch your success soar!
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <img className="img-fluid" src={meetImg} alt="Online Store" width={616} height={577} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetExpertSection;
