
import "./styles-w.scss";
import pointSale from "./img/point_of_sale.svg";
import infoIcon from "./img/info-icon.svg";
import growingIcon from "./img/growing-icon.svg";
import partIcon from "./img/part-icon.svg";
import communityImg from "./img/community-img.png";
import videoPlaceholder from "./img/video-placeholder.webp";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Modal } from "reactstrap";
import { useState } from "react";

function JoinCommunitySection() {
  const [showVideo, setShowVideo] = useState(false);
  let videoUrl = "https://kiko.live/wp-content/uploads/2024/03/video-1.mp4"; // Replace with your video URL

  return (
    <section className="your-webinar-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-title-lg">
              Join a Community of Successful Sellers
            </div>
            <p>
              Join the ranks of satisfied sellers who have transformed their businesses with ONDC. Experience firsthand how our platform empowers you to thrive in the digital marketplace.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="your-webinar-list">
              <div className="your-webinar-inner-list">
                <div>
                  <div className="your-webinar-icon">
                    <img src={pointSale} alt="" />
                  </div>
                  <div className="webinar-title-sm">What Our
                    Sellers Say</div>
                  <p>
                    “ONDC has revolutionized my sales approach and expanded my customer base significantly.”
                  </p>
                </div>
                <div>
                  <div className="your-webinar-icon">
                    <img src={infoIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">More Success Stories</div>
                  <p>
                    “The support from ONDC helped me navigate the digital landscape with ease.”
                  </p>
                </div>
              </div>
              <div className="your-webinar-inner-list list-img">
                {/* <div className="webinar-image">
                  <img src={communityImg} alt="" />
                </div> */}
                <div className="slider-container">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={28}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    className="spotlight-swiper"
                  >
                    {/* Slide 1 */}
                    <SwiperSlide>
                      <div className="slide-wrapper">
                        <img
                          src={videoPlaceholder} // replace with your image
                          alt="Seller Spotlight"
                          className="slide-image"
                          width={740}
                          height={460}
                        />
                        <button
                          className="play-btn"
                          onClick={() => {
                            setShowVideo(true);
                            videoUrl =
                              "https://kiko.live/wp-content/uploads/2024/03/video-1.mp4";
                          }}
                        >
                          <svg
                            width={85}
                            height={85}
                            viewBox="0 0 85 85"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="42.4211"
                              cy="42.4211"
                              r="42.4211"
                              fill="white"
                            />
                            <path
                              d="M34.2109 30.0118V54.8213C34.2109 56.7131 36.2944 57.8626 37.8988 56.8329L57.392 44.4281C58.8767 43.4942 58.8767 41.3389 57.392 40.381L37.8988 28.0002C36.2944 26.9705 34.2109 28.12 34.2109 30.0118Z"
                              fill="#7459AF"
                            />
                          </svg>
                        </button>
                      </div>
                    </SwiperSlide>

                    {/* Slide 2 */}
                    <SwiperSlide>
                      <div className="slide-wrapper">
                        <img
                          src={videoPlaceholder}
                          alt="Seller Spotlight"
                          className="slide-image"
                          width={740}
                          height={460}
                        />
                        <button
                          className="play-btn"
                          onClick={() => {
                            setShowVideo(true);
                            videoUrl =
                              "https://kiko.live/wp-content/uploads/2024/03/video-2.mp4";
                          }}
                        >
                          <svg
                            width={85}
                            height={85}
                            viewBox="0 0 85 85"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="42.4211"
                              cy="42.4211"
                              r="42.4211"
                              fill="white"
                            />
                            <path
                              d="M34.2109 30.0118V54.8213C34.2109 56.7131 36.2944 57.8626 37.8988 56.8329L57.392 44.4281C58.8767 43.4942 58.8767 41.3389 57.392 40.381L37.8988 28.0002C36.2944 26.9705 34.2109 28.12 34.2109 30.0118Z"
                              fill="#7459AF"
                            />
                          </svg>
                        </button>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
              <div className="your-webinar-inner-list">
                <div>
                  <div className="your-webinar-icon">
                    <img src={growingIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">
                    Join Our Growing Network
                  </div>
                  <p>
                    “I never knew going online could be this simple and effective!”
                  </p>
                </div>
                <div>
                  <div className="your-webinar-icon">
                    <img src={partIcon} alt="" />
                  </div>
                  <div className="webinar-title-sm">Be Part of It</div>
                  <p>
                    “Thanks to ONDC, my business is thriving in the digital age!”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="video-seller-modal-main"
        centered
        isOpen={showVideo}
        onRequestClose={() => {
          setShowVideo(false);
        }}
      >
        <div className="video-seller-modal">
          <button
            className="close-btn"
            onClick={() => {
              setShowVideo(false);
            }}
          >
            X
          </button>
          {/* <video width="100%" height="100%" controls autoPlay src={videoUrl}>
            Your browser does not support the video tag.
            <src></src>
          </video> */}
          <video width="100%" height="100%" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Modal>
    </section>
  );
}

export default JoinCommunitySection;
