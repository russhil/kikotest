import React from "react";
import Footer from "../Footer/footer"
import { useNavigate } from "react-router-dom";
const ReturnRefundPolicy = (props) => {
    const navigate= useNavigate();
    return (
        <>
            <header class="page-header">
                <div class="container">
                    <span class="ltx-before"></span>
                    <h1>Return &amp; Refund Policy</h1><ul class="breadcrumbs" typeof="BreadcrumbList" vocab="https://schema.org/">
                        <li class="home"><span property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" title="Go to Home." href="#" onClick={()=>navigate("/")} class="home"><span property="name">Home</span></a><meta property="position" content="1" /></span></li>
                        <li class="post post-page current-item"><span property="itemListElement" typeof="ListItem"><span property="name">Return &amp; Refund Policy</span><meta property="position" content="2" /></span></li>
                    </ul>
                    <span class="ltx-after"></span>
                    <div class="ltx-header-icon"></div>

                </div>
            </header>
            <div class="container main-wrapper">

                <div class="inner-page text-page margin-default">
                    <div class="row justify-content-center">
                        <div class="col-xl-9 col-lg-8 col-md-12 col-xs-12 text-page">
                            <article id="post-9909" class="post-9909 page type-page status-publish hentry">
                                <div class="entry-content clearfix" id="entry-div">

                                    <p><strong>Definitions and Key Terms</strong></p>
                                    <p>To help explain things as clearly as possible in this Return &amp; Refund Policy, every time any of these terms are referenced, are strictly defined as:</p>
                                    <ol>
                                        <li>Company: when this policy mentions “Company,” “we,” “us,” or “our,” it refers to Kiko Live, which is responsible for your information under this Return &amp; Refund Policy.</li>
                                        <li>Customer: refers to the company, organization or person that signs up to use the Kiko Live Service to manage the relationships with your consumers or service users.</li>
                                        <li>Device: any internet connected device such as a phone, tablet, computer or any other device that can be used to visit Kiko Live and use the services.</li>
                                        <li>Service: refers to the service provided by Kiko Live as described in the relative terms (if available) and on this platform.</li>
                                        <li>Website: Kiko Live.”’s” site, which can be accessed via this URL: www.kiko.media</li>
                                        <li>You: a person or entity that is registered with Kiko Live to use the Services.</li>
                                    </ol>
                                    <p><strong>Return &amp; Refund Policy</strong></p>
                                    <p>Thanks for shopping at Kiko Live. We appreciate the fact that you like shopping through our platform. We also want to make sure you have a rewarding experience while you’re exploring, evaluating, and purchasing from Kiko Live.</p>
                                    <p>As with any shopping experience, there are terms and conditions that apply to transactions at Kiko Live. We’ll be as brief as our attorneys will allow. The main thing to remember is that by placing an order or making a purchase at Kiko Live, you agree to the terms set forth below along with the Policy.</p>
                                    <p>Kiko serves as a platform to connect buyers with sellers and a store discovery platform. We provide a listing platform where stores can list themselves and be available for video calls. Buyers can connect with sellers on a video call and transact with them over the call. Sellers can ship goods to buyers using their own delivery service and also charge customers directly. Delivery service and payment gateway are offered to sellers as optional services.</p>
                                    <p>Kiko does not charge any commission to sellers, nor does it list their products or generate invoices. Kiko only provides a listing to stores and buyers can search for stores and connect with them and transact with them directly.</p>
                                    <p>If there’s something wrong with the product/service you bought, or if you are not happy with it, you need to contact the seller directly for a resolution. Kiko will share seller details with buyers to enable direct buyer-seller to connect.</p>
                                    <p><strong>Returns and Refunds:</strong></p>
                                    <p>We serve our customers with the best services. Every single service that you choose is thoroughly planned and executed. We do this to ensure that you fall in love with our services.</p>
                                    <p>Sadly, there are times when sellers may not be able to provide you with what you choose or may face some issues with the inventory and quality check of their goods. In such cases, the seller may have to cancel your order. You will be intimated about it in advance so that you don’t have to worry unnecessarily about your order. If you have purchased via Online payment (not Cash on Delivery), then you will be refunded from the seller’s end after they confirm the cancellation with any or no cancellation fee involved. In any case, orders and cancellations are done directly between buyers and sellers, and not through the Kiko Live platform. </p>
                                    <p>Please note that Kiko Live is not liable for damages that are caused to the items during transit or transportation. For any damages, contact the seller directly.</p>
                                    <p>We follow certain policies to ensure transparency, efficiency, and quality customer care:</p>
                                    <ul>
                                        <li>We do not enable returns from our end, although you can cancel your order by contacting the seller with specified reasons</li>
                                        <li>Returns and refunds have to be processed by directly contacting the seller.</li>
                                    </ul>
                                    <p>For any issue or support to reach out to a seller, please connect with our support team and they will assist you with connecting with the seller in case you are not able to reach out to them with the information provided on the app.</p>
                                    <p><strong>Your Consent</strong></p>
                                    <p>By using our website/app, registering an account, or making a purchase, you hereby consent to our Return &amp; Refund Policy and agree to its terms.</p>
                                    <p><strong>Changes To Our Return &amp; Refund Policy</strong></p>
                                    <p>Should we update, amend or make any changes to this document so that they accurately reflect our Service and policies? Unless otherwise required by law, those changes will be prominently posted here. Then, if you continue to use the Service, you will be bound by the updated Return &amp; Refund Policy. If you do not want to agree to this or any updated Return &amp; Refund Policy, you can delete your account.</p>
                                    <p><strong>Contact Us</strong></p>
                                    <p>If, for any reason, You are not completely satisfied with any good or service that we provide, don’t hesitate to contact us and we will discuss any of the issues you are going through with our product.</p>
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
export default ReturnRefundPolicy;