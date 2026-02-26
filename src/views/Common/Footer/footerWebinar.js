import React from "react";
import KikoLogo from "../../../images/kiko-seller-footer-logo.svg";
import "./footer-styles-w.scss";
const Footer = (props) => {
    return (
        <>
            <footer className="page-footer footer-webinar-container">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3">
                            <div className="footer-widget-area">
                                <div className="widget widget_text">
                                    <div className="textwidget">
                                        <div className="kiko-logo">
                                            <img src={KikoLogo} alt="" />
                                        </div> 
                                    </div>
                                </div>
                              
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <div className="footer-widget-area">
                                <div className="widget widget_text">
                                    <div className="textwidget"> 
                                        <p style={{ color: "white !important" }}>
                                        Mulund W, Mumbai 400080.
                                        </p>
                                        <p>
                                            <a href="mailto:support@kiko.media">support@kiko.media</a>
                                        </p>
                                    </div>
                                </div>
                              
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <div className="footer-widget-area">
                                <div className="menu-footer-container">
                                    <ul className="menu">
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
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <div className="footer-widget-area">
                                <div className="menu-footer-container">
                                    <ul className="menu"> 
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
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
export default Footer;