import React from "react";
import Footer from "../Footer/footer"
import { useNavigate } from "react-router-dom";
const DeliveryPolicy = (props) => {
    const navigate= useNavigate();
    return (
        <>
            <header className="page-header">
                <div className="container">
                    <span className="ltx-before"></span>
                    <h1>Delivery Policy</h1><ul className="breadcrumbs" typeof="BreadcrumbList" vocab="https://schema.org/">
                        <li className="home"><span property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" title="Go to Home." href="#" onClick={()=>navigate("/")} className="home"><span property="name">Home</span></a><meta property="position" content="1" /></span></li>
                        <li className="post post-page current-item"><span property="itemListElement" typeof="ListItem"><span property="name">Delivery Policy</span><meta property="position" content="2" /></span></li>
                    </ul>
                    <span className="ltx-after"></span>
                    <div className="ltx-header-icon"></div>

                </div>
            </header>
            <div className="container main-wrapper">

                <div className="inner-page text-page margin-default">
                    <div className="row justify-content-center">
                        <div className="col-xl-9 col-lg-8 col-md-12 col-xs-12 text-page">
                            <article id="post-9907" className="post-9907 page type-page status-publish hentry">
                                <div className="entry-content clearfix" id="entry-div">

                                    <p>This delivery policy, together with the terms of Use, describes KIKO LIVE policies and procedures towards the delivery of Products purchased through the Platforms. KIKO LIVE makes all commercially reasonable endeavors to ensure that the Products are delivered to Users in a timely fashion.</p>
                                    <p>Users are required to peruse and understand the terms of this Delivery Policy. If you do not agree to the terms contained in the Delivery Policy, you are advised not to accept the Terms of Use and the Delivery Policy and may forthwith leave and stop using the Platforms. The terms contained in this Delivery Policy shall be accepted without modification and accordingly, you agree to be bound by the terms contained herein.</p>
                                    <p><strong>TERMS OF DELIVERY</strong></p>
                                    <ol>
                                        <li>KIKO LIVE partners with third party logistic service providers in order to effectuate Product delivery to Users(“Logistic Partners”). Details of the Logistic Partner who will be processing the delivery of the purchased Product(s) will be provided to the User upon the purchased Product(s) being handed over to the Logistic Partner by Sellers partnered with KIKO LIVE. The User will also be provided with an approximate time of delivery of the purchased Product on the order confirmation page. Sellers partnered with KIKO LIVE may also effectuate Product delivery to Users on its own without engaging with our delivery partner.</li>
                                        <li>While KIKO LIVE aims to provide its services through the Platform and ensure the delivery of the Products all across India, currently, KIKO LIVE has a select list of areas and products for which delivery can be undertaken. At the time of placing an order for the purchase of Products through the Platforms, Users are required to enter their address details to verify if deliveries can be carried out in their areas. If the product weight and area where the User wishes that the purchased Products be delivered is not within KIKO LIVE’s recognised delivery agreement, KIKO LIVE will not be able to process the order further from their end. Sellers partnered with KIKO LIVE may or may not be able to deliver the product depending upon their constraints. </li>
                                        <li>Prior to making payments on the Platforms for the purchase of Products, the User will be prompted to provide a shipping address. While entering shipping address details, the User should ensure to provide correct, complete, and accurate information along with sufficient landmarks in order to aid identification of the address. Any failure in delivering the purchased Products arising out of the User’s failure to provide correct, complete, and accurate information shall not hold KIKO LIVE liable at any point in time.</li>
                                        <li>While KIKO LIVE shall make reasonable endeavors in ensuring that purchased Products are delivered to its Users in a timely manner, the delivery may be delayed on account of:<br /><br />
                                            <ol>
                                                <li>logistical issues beyond KIKO LIVE’s control;</li>
                                                <li>unsuitable weather conditions;</li>
                                                <li>political disruptions, strikes, employee lockouts, etc.;</li>
                                                <li>acts of God such as floods, earthquakes, etc.; and</li>
                                                <li>other unforeseen circumstances.</li>
                                            </ol>
                                        </li>
                                        <li>In such events of delay, KIKO LIVE shall make reasonable attempts at proactively intimating the User by writing to the User on his/her registered email account and/or mobile number. KIKO LIVE disclaims all liabilities that may arise on account of its failure to intimate the User of anticipated delays in the delivery of purchased Products through the Platforms. Further, KIKO LIVE shall be under no obligation to compensate the User for any mental agony or any tortious claim that may otherwise arise on account of a delay in the shipment and delivery or use of the purchased Products.</li>
                                        <li>KIKO LIVE, as an internal process, undertakes multiple diligence to ensure that the individuals employed by their Logistic Partners are individuals with the highest regard for ethics and integrity. However, it is not possible for KIKO LIVE to ensure that employees of its Logistic Partners behave in a fashion that exudes thorough professionalism, competence, and good mannerism. It is expressly clarified that any ill-mannerism, impoliteness, discourtesy, or offensiveness shown by the employees of the Logistic Partners is beyond KIKO LIVE’s control and any issue arising between a User and an employee of the Logistic Provider will have to be resolved by the User, independently.</li>
                                        <li>Upon the successful placing of an order through the Platforms and after the seller partnered with KIKO LIVE has successfully handed over the purchased Product(s) to its Logistic Partner, the User will receive a unique tracking identity number, which will enable the User in tracking the status of delivery of the purchased Products. The User may use the tracking identity number on the Platforms to check the whereabouts of the purchased Product and the estimated time of its delivery. KIKO LIVE shall make reasonable attempts in ensuring that the tracking status of the purchased Products is updated in a timely manner. However, KIKO LIVE does not guarantee the accuracy of the tracking status since it is updated on a real-time basis and is subject to inconsistencies arising out of time-lags in updating the information and other technicalities beyond KIKO LIVE’s control.</li>
                                        <li>Seller partnered with KIKO LIVE reserves the right to charge shipping charges on Products of a value of lower than a specified amount and/or Products, the payment for which is made by way of cash on delivery or any other online mode of payment. If charged, such charges shall not be refunded to the User on cancellations or returns that are made after the shipping of the purchased Products, except in case of a Product having a defect at the time of delivery (for reasons attributable to, and accepted by the seller after due verification at its sole discretion). </li>
                                        <li>Return and exchange of purchased Products shall be carried out by the seller. Further details on how Users may process returns and exchanges of purchased Products have been set out under the Return and Refund Policy.</li>
                                    </ol>
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
export default DeliveryPolicy;