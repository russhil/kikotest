import React from "react";
import Footer from "../Footer/footer"
import { useNavigate } from "react-router-dom";
const PrivacyPolicy = (props) => {
    const navigate =useNavigate();
    return (
        <>
            <header className="page-header">
                <div className="container">
                    <span className="ltx-before"></span>
                    <h1>Privacy Policy</h1><ul className="breadcrumbs" typeof="BreadcrumbList" vocab="https://schema.org/">
                        <li className="home"><span property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" title="Go to Home." href="#" onClick={()=> navigate("/")} className="home"><span property="name">Home</span></a><meta property="position" content="1" /></span></li>
                        <li className="post post-page current-item"><span property="itemListElement" typeof="ListItem"><span property="name">Privacy Policy</span><meta property="position" content="2" /></span></li>
                    </ul>
                    <span className="ltx-after"></span>
                    <div className="ltx-header-icon"></div>

                </div>
            </header>
            <div className="container main-wrapper">

                <div className="inner-page text-page margin-default">
                    <div className="row justify-content-center">
                        <div className="col-xl-9 col-lg-8 col-md-12 col-xs-12 text-page">
                            <article id="post-9917" className="post-9917 page type-page status-publish hentry">
                                <div className="entry-content clearfix" id="entry-div">
                                <p>Privacy Policy for Kiko Live</p>
                                    <p>Welcome to Kiko Live, a Software as a Service (SaaS) platform designed to assist and provide services for merchants. This Privacy Policy outlines how Kiko Live collects, uses, maintains, and protects information collected from users (referred to as "Sellers") of the Kiko Live mobile application available on the Google Play Store.</p>
                                    <p>Information We Collect</p>
                                    <p><strong>Information Provided by Merchants:</strong> When Merchants register or interact with Kiko Live, we may collect personal identification information such as name, email address, phone number, business information, payment details, and other relevant data necessary to provide our services.</p>
                                    <p><strong>Merchant’s Customers Information:</strong> In the course of providing services, Kiko Live may collect and process information provided by Sellers’ customers. This may include transactional data, contact information, purchase history, preferences, and any other data necessary for the provision of the service by the Seller using our platform.</p>
                                    <p>How We Use Collected Information</p>
                                    <p><strong>Personal Information:</strong> Collected personal information may be used for various purposes, including:</p>
                                    <ul className="p-0 " style={{ listStyle: "none" }}>
                                        <li>To provide and maintain services for Sellers</li>
                                        <li>To personalize user experience and improve our services</li>
                                        <li>To communicate with Sellers, providing updates and information related to the services</li>
                                        <li>To process transactions and payments</li>
                                        <li>To respond to inquiries, questions, and support needs</li>
                                        <li>Seller’s Customers Information: Information collected from Merchants’ customers will be used solely for the purpose of providing the services as per the agreement with the Merchant. This includes processing payments, providing customer support, improving services, and analyzing trends to enhance user experience.</li>
                                    </ul>
                                    <p><strong>Data Security</strong></p>
                                    <p>We are committed to ensuring the security of data and employ industry-standard measures to protect against unauthorized access, alteration, disclosure, or destruction of personal information stored within Kiko Live. This includes encryption of data, regular security assessments, and strict access controls.</p>
                                    <p><strong>Sharing of Information</strong></p>
                                    <p>We do not sell, trade, or rent Seller’s’ personal identification information to others. However, we may share aggregated and anonymized data that does not directly identify individuals with our business partners, trusted affiliates, and advertisers for analytics, marketing, or other legitimate purposes related to improving our services.</p>
                                    <p><strong>Compliance with Laws and Regulations</strong></p>
                                    <p>Kiko Live operates in compliance with applicable data protection laws and regulations concerning the collection, use, and retention of personal information.</p>
                                    <p><strong>Changes to This Privacy Policy</strong></p>
                                    <p>Kiko Live reserves the right to update this privacy policy at any time. We encourage Merchants to review this policy periodically for any changes. The date of the last update will be indicated at the bottom of this page.</p>
                                    <p><strong>Your Acceptance of These Terms</strong></p>
                                    <p>By using Kiko Live, Sellers signify their acceptance of this policy. If Sellers do not agree to this policy, they should not use our services.</p>
                                    <p><strong>Contact Us</strong></p>
                                    <p>If you have any questions about this Privacy Policy or the practices of Kiko Live, please contact us at help@kiko.live.</p>
                                    <p>This document was last updated on 19 December 2023.</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default PrivacyPolicy;