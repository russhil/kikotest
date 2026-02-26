import React from "react";
import KikoLogo from "../../../images/kiko--logo.svg";
import Facebook from "../../../images/facebook.svg";
import Insta from "../../../images/instagram.svg";
import Youtube from "../../../images/youtube.svg";
import LinkedIn from "../../../images/linkedin11.svg";
import AppStore from "../../../images/appstore.png";
import PlayStore from "../../../images/playstore.png";

const Footer = (props) => {
    return (
        <>
            <footer className="page-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="footer-widget-area">
                                <div className="widget widget_text">
                                    <div className="textwidget">
                                        <div className="kiko-logo">
                                            <img src={KikoLogo} alt="" />
                                        </div>
                                        <p style={{ color: "#ffffffbf" }}>
                                        Mulund W, Mumbai 400080.
                                        </p>
                                        <p>
                                            <a href="mailto:support@kiko.media">support@kiko.media</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="widget widget_text">
                                    <div className="textwidget">
                                        <ul>
                                            <li>
                                                <a
                                                    href="https://facebook.com/profile.php/?id=100090104332961"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="socialIcon"
                                                >
                                                    <img src={Facebook} alt="" />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://www.instagram.com/kikoliveapp/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="socialIcon"
                                                >
                                                    <img src={Insta} alt="" />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://in.linkedin.com/company/kikolive"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="socialIcon"
                                                >
                                                    <img src={LinkedIn} alt="LinkedIn" />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://www.youtube.com/@kikolive5631"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="socialIcon"
                                                >
                                                    <img src={Youtube} alt="" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="footer-widget-area">
                                <div className="menu-footer-container">
                                    <ul className="menu">
                                        <li className="menu-item">
                                            <a
                                                href="https://kiko.live/faq/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="menu-link"
                                            >
                                                FAQs
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <a
                                                href="#"
                                                rel="noreferrer"
                                                className="menu-link"
                                                onClick={(e) => { e.preventDefault(); window.open("/disclaimer", "_blank"); }}
                                            >
                                                Disclaimer
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <a
                                                href="#"
                                                rel="noreferrer"
                                                className="menu-link"
                                                onClick={(e) => { e.preventDefault(); window.open("/privacy-policy", "_blank"); }}
                                            >
                                                Privacy Policy
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <a
                                                href="#"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="menu-link"
                                                onClick={(e) => { e.preventDefault(); window.open("/delivery-policy", "_blank") }}
                                            >
                                                Delivery Policy
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <a
                                                href="#"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="menu-link"
                                                onClick={(e) => { e.preventDefault(); window.open("/return-policy", "_blank") }}
                                            >
                                                Return & Refund Policy
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <a
                                                href="#"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="menu-link"
                                                onClick={(e) => { e.preventDefault(); window.open("/terms-condition", "_blank") }}
                                            >
                                                Terms & Conditions
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="downloadAppButtons">
                                    <div className="AppButtons">
                                        <a
                                            href="https://apps.apple.com/in/app/kiko-live/id1567183166"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="downloadLink"
                                        >
                                            <img src={AppStore} alt="" />
                                        </a>
                                    </div>
                                    <div className="AppButtons">
                                        <a
                                            href="https://play.google.com/store/apps/details?id=live.kiko.user&pcampaignid=web_share"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="downloadLink"
                                        >
                                            <img src={PlayStore} alt="" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
export default Footer;