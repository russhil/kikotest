import React from "react";
import "./styles-w.scss";
import rightArrowBlack from "./img/right-arrow-black.svg";
import YellowClockIcon from "../../images/HomeNew/yellow-clock-icon.svg";

// import blogImg from "./img/blog-img.png";

const articles = [
  {
    image:
      "https://images.the-captable.com/cs/158/a1c35720cce711efabacb7b767fb7698/KiranaKart2Square-1750661884437.jpg?ar=16:9",
    title: "How kiranas are fighting back against quick commerce",
    excerpt:
      "Kiranas have realised the scale of the threat from the quick commerce juggernaut and are transforming themselves into micro-fulfillment centres to remain relevant and survive, but the shift will not be easy for all.",
    source: "The Captable",
    date: "June 10, 2025",
    url: "https://the-captable.com/2025/06/how-kiranas-fighting-back-quick-commerce/",
  },
  {
    image:
      "https://img.etimg.com/thumb/msid-121290306,width-400,height-230,imgsize-214860,resizemode-75/quick-commerce-platforms-sees-little-impact-in-border-towns-and-cities.jpg",
    title:
      "Kiko Live starts cash-on-delivery for online grocery orders, driving 30% surge in kirana revenues",
    excerpt:
      "Kiko ran a pilot before the launch wherein the neighborhood stores that activated the COD feature reported a 30% increase in daily online orders. This surge has directly translated into a 30% rise in online revenue for participating sellers. The company enables local retailers to set up their own",
    source: "The Economic Times",
    date: "May 20, 2025",
    url: "https://economictimes.indiatimes.com/industry/services/retail/kiko-live-starts-cash-on-delivery-for-online-grocery-orders-driving-30-surge-in-kirana-revenues/articleshow/121290337.cms?from=mdr",
  },
  {
    image:
      "https://www.financeoutlookindia.com/uploaded_images/newstransfer/6tyg70jmgtrszancndia.png",
    title: "Kiko Live Drives 30% Surge in Kirana Revenues - Launches COD",
    excerpt:
      "Kiko Live, a leading quick commerce firm supporting Kirana stores, has introduced a Cash-on-Delivery (COD) option for online grocery orders for the first time, bringing the trusted offline experience of Kirana stores into the digital era.",
    source: "Finance Outlook India",
    date: "May 20, 2025",
    url: "https://www.financeoutlookindia.com/news/kiko-live-drives-30-surge-in-kirana-revenues-launches-cod-nwid-5212.html",
  },
  {
    image:
      "https://startupnews.fyi/wp-content/uploads/2025/04/Kiko-social.jpg",
    title: "Can Kiko Live Help Kiranas Strike Back At Quick Commerce Giants?",
    excerpt:
      "Are dark stores getting darker for quick commerce? As Indian quick commerce platforms tried to gather speed – from fast to ultra-fast delivery – the topline for the Q-Com Big Three became loftier, soaring past $1 Bn in FY24, but the bottomline for Blinkit, Zepto, and Swiggy Instamart slumped with cracks showing up in their business models. Costs are scorching their coffers and deliveries turning slower as they promise to outpace reality.",
    source: "Inc42",
    date: "April 02, 2025",
    url: "https://inc42.com/startups/can-kiko-live-help-kiranas-strike-back-at-quick-commerce-giants/",
  },
];

function WebinarProofSection() {
  return (
    <section className="webinar-proof-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-title-lg">Media Spotlight</div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-proof-list">
              {articles.map((article, index) => {
                return (
                  <div key={index} className="webinar-proof-list-item">
                    <div className="webinar-proof-img">
                      <img
                        className="img-fluid"
                        src={article.image}
                        alt="Article featured"
                      />
                    </div>
                    <div className="webinar-proof-header">
                      <div className="webinar-proof-header-title">
                        {article.source}
                      </div>
                      <div className="webinar-proof-header-date">
                        <img src={YellowClockIcon} alt=""/>{article.date}
                      </div>
                    </div>
                    <div className="webinar-proof-content">
                      <div className="webinar-proof-title">{article.title}</div>
                      <p>{article.excerpt}</p>
                      {/* <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="webinar-read-more-btn"
                      >
                        Read More
                        <img src={rightArrowBlack} alt="Navigate to article" />
                      </a> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WebinarProofSection;
