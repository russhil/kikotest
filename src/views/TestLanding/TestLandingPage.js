import React, {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ADD_WEBINAR_PARTICIPANT, FETCH_SETTINGS } from "../../api/apiList";
import API from "../../api";
import { handleError, notify } from "../../utils";
import { Modal } from "reactstrap";

import FooterWebinar from "../Common/Footer/footerWebinar";

import FirstSlide from "../../images/HomeNew/kirana_hero.webp";
import CalendarIcon2 from "../../images/HomeNew/calendar-icon.png";
import WebsiteIcon from "../../images/HomeNew/website-icon.png";
import Catalogicon from "../../images/HomeNew/catalog-icon.png";
import SupportIcon from "../../images/HomeNew/support-icon.png";
import WhatsAppIcon from "../../images/HomeNew/whats-app-icon.png";
import DiscountsIcon from "../../images/HomeNew/discounts-icon.png";
import attendIcon from "../../images/HomeNew/attend-icon.png";
import shopsIcon from "../../images/HomeNew/shops-icon.png";
import outletsIcon from "../../images/HomeNew/outlets-icon.png";
import warehouseIcon from "../../images/HomeNew/warehouse-icon.png";
import videoPlaceholder from "../Webinar/img/video-placeholder.webp";
import meetImg from "../Webinar/img/meet-img.webp";
import pointSale from "../Webinar/img/point_of_sale.svg";
import infoIcon from "../Webinar/img/info-icon.svg";
import growingIcon from "../Webinar/img/growing-icon.svg";
import partIcon from "../Webinar/img/part-icon.svg";
import YellowClockIcon from "../../images/HomeNew/yellow-clock-icon.svg";

import "./testlanding.css";

const WebinarModal = lazy(() => import("../Webinar/WebinarModal"));
const SuccessModal = lazy(() => import("../Webinar/SuccessModel"));
const PreRazorpay = lazy(() => import("../WebinarRazorPay/PreRazorpay"));

/* ─── static data ─── */
const articles = [
    {
        image: "https://images.the-captable.com/cs/158/a1c35720cce711efabacb7b767fb7698/KiranaKart2Square-1750661884437.jpg?ar=16:9",
        title: "How kiranas are fighting back against quick commerce",
        excerpt: "Kiranas have realised the scale of the threat from the quick commerce juggernaut and are transforming themselves into micro-fulfillment centres to remain relevant and survive.",
        source: "The Captable",
        date: "June 10, 2025",
    },
    {
        image: "https://img.etimg.com/thumb/msid-121290306,width-400,height-230,imgsize-214860,resizemode-75/quick-commerce-platforms-sees-little-impact-in-border-towns-and-cities.jpg",
        title: "Kiko Live starts cash-on-delivery for online grocery orders, driving 30% surge in kirana revenues",
        excerpt: "Neighborhood stores that activated the COD feature reported a 30% increase in daily online orders, directly translating into a 30% rise in online revenue for participating sellers.",
        source: "The Economic Times",
        date: "May 20, 2025",
    },
    {
        image: "https://www.financeoutlookindia.com/uploaded_images/newstransfer/6tyg70jmgtrszancndia.png",
        title: "Kiko Live Drives 30% Surge in Kirana Revenues - Launches COD",
        excerpt: "Kiko Live has introduced a Cash-on-Delivery option for online grocery orders for the first time, bringing the trusted offline experience of Kirana stores into the digital era.",
        source: "Finance Outlook India",
        date: "May 20, 2025",
    },
    {
        image: "https://startupnews.fyi/wp-content/uploads/2025/04/Kiko-social.jpg",
        title: "Can Kiko Live Help Kiranas Strike Back At Quick Commerce Giants?",
        excerpt: "As Indian quick commerce platforms tried to gather speed — from fast to ultra-fast delivery — the topline for the Q-Com Big Three became loftier, soaring past $1 Bn in FY24.",
        source: "Inc42",
        date: "April 02, 2025",
    },
];

const faqs = [
    { q: "What do I get from Webinar and Registration?", a: "You get your own branded e-commerce website with 4,000+ items pre-listed, ONDC integration, AI-powered dashboard, COD & Khata support, delivery service option, and marketing tools. The entire setup is done for you and your store can be live within 2 hours." },
    { q: "How does ONDC help me?", a: "Your products automatically appear on popular apps like Paytm, Ola MyStore, Digihaat and more. This brings you extra orders from new customers without you spending on marketing." },
    { q: "Do customers really get discounts?", a: "Yes, every customer gets a ₹40–₹50 discount on each order through ONDC, funded by the government. You still receive the full payment for your products." },
    { q: "Who delivers the orders?", a: "You can either deliver yourself and collect payment directly, or use Kiko's on-demand delivery riders. Both options are managed from the same dashboard." },
    { q: "Why is this better than others?", a: "Other platforms only list your phone number for ₹5,000–₹10,000. For just ₹3,000, Kiko gives you a complete e-commerce store, ONDC sales, delivery support, marketing tools, and much more." },
];

const videoUrls = [
    "https://kiko.live/wp-content/uploads/2024/03/video-1.mp4",
    "https://kiko.live/wp-content/uploads/2024/03/video-2.mp4",
];

const DEFAULT_WHATSAPP_URL = "https://chat.whatsapp.com/CSt5Uq9KBmj96FmaJYYYfk?mode=ems_copy_t";

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        utm_content: params.get("utm_content") || "",
    };
};

const formatWebinarDate = (value) => {
    const parsedDate = value ? new Date(value) : new Date();
    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(parsedDate);
};

const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5v14l11-7L8 5z" fill="#6c3ff5" />
    </svg>
);

/* ─── component ─── */
function TestLandingPage(props) {
    const isFromLead = props.isFromLead;
    const pixelId = props?.pixelId;
    const isWebinarRS9 = props.isWebinarRS9;
    const isFromLeadWithForm = props.isFromLeadWithForm;

    const [isOpenModal, setOpenModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showRazorpay, setShowRazorpay] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState("");

    const [userData, setUserData] = useState({
        email: "",
        phone: "",
        city: "",
        status: "inactive",
        sellerName: "",
        storeName: "",
        webinarDate: "",
        paymentRazorPayId: "",
        paymentOrderId: "",
        paymentStatus: "unpaid",
        isFromLeadWithForm: false,
    });

    const [settingData, setSettingData] = useState({});
    const utms = useMemo(() => getUTMParams(), []);
    const trackingLoadedRef = useRef(false);

    /* ─── API & tracking ─── */
    const getSetting = async () => {
        const response = await API.get(FETCH_SETTINGS);
        if (response?.data?.success) {
            setSettingData(response?.data?.result || {});
        } else {
            notify("error", response?.data?.message);
        }
    };

    const saveUtms = useCallback(async () => {
        try {
            await fetch(`${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/save-utms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    desktop: "true",
                },
                body: JSON.stringify(utms),
                keepalive: true,
            });
        } catch (error) {
            // no-op: analytics failures should not break the page
        }
    }, [utms]);

    const initializeTracking = useCallback(async () => {
        if (process.env.NODE_ENV === "development" || trackingLoadedRef.current) {
            return;
        }
        trackingLoadedRef.current = true;
        saveUtms();

        if (pixelId) {
            try {
                const module = await import("../Webinar/pixel");
                module.initializeFacebookPixel(pixelId);
                if (window.fbq) {
                    window.fbq("track", "PageView", utms);
                }
            } catch (error) {
                // no-op
            }
        }

        if (!window.__kikoClarityLoaded) {
            window.__kikoClarityLoaded = true;
            (function (c, l, a, r, i, t, y) {
                c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "sr3m95np08");
        }
    }, [pixelId, saveUtms, utms]);

    useEffect(() => {
        getSetting();
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            return undefined;
        }

        let timeoutId;
        let idleId;
        const events = ["pointerdown", "keydown", "touchstart", "scroll"];

        const cleanup = () => {
            events.forEach((eventName) => {
                window.removeEventListener(eventName, trigger, true);
            });
            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
            if (idleId !== undefined && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleId);
            }
        };

        const trigger = () => {
            initializeTracking();
            cleanup();
        };

        events.forEach((eventName) => {
            window.addEventListener(eventName, trigger, { passive: true, capture: true });
        });

        if ("requestIdleCallback" in window) {
            idleId = window.requestIdleCallback(trigger, { timeout: 3000 });
        } else {
            timeoutId = window.setTimeout(trigger, 3000);
        }

        return cleanup;
    }, [initializeTracking]);

    /* ─── form & payment handlers (same as original) ─── */
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handlePaymentResponse = async (payload) => {
        try {
            if (payload?.paymentResponse?.razorpay_payment_id && payload?.success) {
                const user = JSON.parse(localStorage.getItem("userDetails")) || {};
                user.paymentRazorPayId = payload?.paymentResponse?.razorpay_payment_id;
                user.paymentOrderId = payload?.paymentResponse?.razorpay_order_id;
                user.paymentStatus = "paid";
                user.status = "active";
                localStorage.setItem("userDetails", JSON.stringify(user));
                const response = await API.post(ADD_WEBINAR_PARTICIPANT, user);
                if (response?.data?.success) {
                    localStorage.setItem("userDetails", JSON.stringify(response?.data?.result));
                    import("../Webinar/pixel").then((module) => {
                        module.initializeFacebookPixel(pixelId, {
                            em: response?.data?.result?.email,
                            fn: response?.data?.result?.sellerName,
                            ln: response?.data?.result?.storeName,
                            ph: response?.data?.result?.phone,
                        });
                    });
                    setUserData(response?.data?.result);
                    setOpenModal(false);
                    setShowRazorpay(false);
                    setIsSuccess(true);
                } else {
                    notify("error", "Something went wrong!");
                }
            } else {
                setShowRazorpay(false);
                notify("error", payload?.message);
            }
        } catch (error) { }
    };

    const onsubmit = async (e) => {
        e.preventDefault();
        try {
            if (!userData?.sellerName) { notify("error", "Please Enter seller name!"); return; }
            if (!userData?.city) { notify("error", "Please Enter City / Town / Village"); return; }
            if (!userData?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) { notify("error", "Please enter a valid email address!"); return; }
            if (userData?.phone?.length < 10 || userData?.phone?.length > 10) { notify("error", "Please Enter valid number!"); return; }
            if (!userData?.storeName) { notify("error", "Please Enter store name!"); return; }
            const body = {
                ...userData,
                webinarDate: settingData?.webinarDate || "",
                isFromLeadWithForm: !!isFromLeadWithForm,
                utm_source: utms.utm_source,
                utm_medium: utms.utm_medium,
                utm_campaign: utms.utm_campaign,
                utm_content: utms.utm_content,
            };
            setDisabled(true);
            const response = await API.post(ADD_WEBINAR_PARTICIPANT, body);
            if (response?.data?.success) {
                localStorage.setItem("userDetails", JSON.stringify(response?.data?.result));
                resetUserData();
                setOpenModal(false);
                if (isFromLeadWithForm) { setIsSuccess(true); } else { setShowRazorpay(true); }
            } else {
                notify("error", "Something went wrong!");
            }
            setDisabled(false);
        } catch (error) {
            handleError(error);
        }
    };

    const resetUserData = () => {
        setUserData({
            email: "", phone: "", city: "", status: "inactive", sellerName: "", storeName: "",
            paymentRazorPayId: "", paymentOrderId: "", paymentStatus: "unpaid",
        });
    };

    const handleCTA = () => {
        if (isFromLead) {
            window.open(
                settingData?.webinarWhatsappUrl || DEFAULT_WHATSAPP_URL,
                "_blank"
            );
        } else {
            setOpenModal(true);
        }
    };

    const ctaLabel = isFromLead || isFromLeadWithForm ? "JOIN WEBINAR WHATSAPP GROUP" : "Register for Webinar";
    const webinarDate = formatWebinarDate(settingData?.webinarDate);

    /* ─── RENDER ─── */
    return (
        <div className="tl-page">
            {/* ══════ HERO ══════ */}
            <section className="tl-hero">
                <div className="tl-wrap">
                    <div className="tl-hero-inner">
                        <div className="tl-hero-content">
                            <div className="tl-badge">🔴 Live Webinar</div>
                            <h1>
                                Get Your Kirana Shop Online Within <span className="tl-highlight">2 Hours</span>
                            </h1>
                            <p className="tl-hero-sub">
                                Join our free webinar and learn the essential strategies to transition your Kirana store into a thriving digital marketplace on ONDC.
                            </p>
                            <div className="tl-date-row">
                                <img src={CalendarIcon2} alt="Calendar" width={20} height={20} />
                                {webinarDate} &nbsp;|&nbsp; 3:00 PM
                            </div>
                            <button className="tl-cta" onClick={handleCTA} id="hero-register-btn">
                                {ctaLabel}
                            </button>
                        </div>
                        <div className="tl-hero-img">
                            <img
                                src={FirstSlide}
                                alt="Kirana Shop Online"
                                width={539}
                                height={483}
                                fetchpriority="high"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ FEATURES ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <h2 className="tl-section-title">What You'll Learn in the Webinar</h2>
                    <p className="tl-section-sub">
                        A deep dive into the crucial steps to transition your Kirana store to the ONDC platform and thrive in the digital marketplace.
                    </p>
                    <div className="tl-features-grid">
                        {[
                            { icon: WebsiteIcon, title: "Launch Your Branded E-Commerce Website", desc: "Learn how to successfully set up your own branded e-commerce website and start your online selling journey." },
                            { icon: Catalogicon, title: "Pre-Listed Catalog with 4,000+ Items", desc: "Get instant access to a pre-listed catalog of thousands of grocery items — no manual entry needed." },
                            { icon: SupportIcon, title: "Digital Marketing Support", desc: "Discover powerful strategies to boost sales and grow your online e-commerce brand with expert guidance." },
                            { icon: WhatsAppIcon, title: "WhatsApp Re-marketing Panel", desc: "Enhance customer engagement with WhatsApp marketing tools. Use personalized messages to boost sales." },
                            { icon: DiscountsIcon, title: "Government-Funded Discounts", desc: "Your customers get ₹40–₹50 discount per order funded by the government — you still get full payment." },
                        ].map((f, i) => (
                            <div className="tl-feature-card" key={i}>
                                <div className="tl-feature-icon">
                                    <img src={f.icon} alt={f.title} width={26} height={26} loading="lazy" decoding="async" />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ COMMUNITY / VIDEOS ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <h2 className="tl-section-title">Join a Community of Successful Sellers</h2>
                    <p className="tl-section-sub">
                        Experience firsthand how our platform empowers sellers to thrive in the digital marketplace.
                    </p>
                    <div className="tl-videos">
                        <div className="tl-videos-grid">
                            {videoUrls.map((url, i) => (
                                <div
                                    className="tl-video-item"
                                    key={i}
                                    onClick={() => { setActiveVideoUrl(url); setShowVideo(true); }}
                                >
                                    <img
                                        src={videoPlaceholder}
                                        alt={`Seller success story ${i + 1}`}
                                        width={740}
                                        height={460}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="tl-play-overlay">
                                        <div className="tl-play-btn"><PlayIcon /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="tl-community-quotes">
                        {[
                            { icon: pointSale, title: "Seller Testimonial", quote: "\u201CONDC has revolutionized my sales approach and expanded my customer base significantly.\u201D" },
                            { icon: infoIcon, title: "More Success", quote: "\u201CThe support from ONDC helped me navigate the digital landscape with ease.\u201D" },
                            { icon: growingIcon, title: "Growing Network", quote: "\u201CI never knew going online could be this simple and effective!\u201D" },
                            { icon: partIcon, title: "Be Part of It", quote: "\u201CThanks to ONDC, my business is thriving in the digital age!\u201D" },
                        ].map((q, i) => (
                            <div className="tl-quote-card" key={i}>
                                <img className="tl-quote-icon" src={q.icon} alt="" width={28} height={28} loading="lazy" decoding="async" />
                                <h4>{q.title}</h4>
                                <p>{q.quote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ AUDIENCE ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <h2 className="tl-section-title">Is This Webinar Right for You?</h2>
                    <p className="tl-section-sub">
                        This webinar is designed for anyone looking to transition from offline to online sales.
                    </p>
                    <div className="tl-audience-grid">
                        {[
                            { icon: attendIcon, title: "Retailers", desc: "Looking to expand reach and sales through digital platforms." },
                            { icon: shopsIcon, title: "Kirana Shops", desc: "Eager to embrace e-commerce and enhance customer engagement." },
                            { icon: outletsIcon, title: "F&B Outlets", desc: "Wanting to reach a broader audience through online sales." },
                            { icon: warehouseIcon, title: "Distributors", desc: "Seeking innovative ways to connect with retailers online." },
                        ].map((a, i) => (
                            <div className="tl-audience-card" key={i}>
                                <img src={a.icon} alt={a.title} width={40} height={40} loading="lazy" decoding="async" />
                                <h3>{a.title}</h3>
                                <p>{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ TESTIMONIALS ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <h2 className="tl-section-title">Testimonials</h2>
                    <p className="tl-section-sub">Real feedback from sellers who transformed their businesses.</p>
                    <div className="tl-testimonials-grid">
                        {[
                            { initials: "SV", name: "SHASHIKANT VERMA", store: "JAI MATA DI TRADERS", text: "Since using Kiko Live, our orders have soared! The dashboard helps us track performance and secure deals we might have missed before." },
                            { initials: "SV", name: "Soman Kumar Verma", store: "Kamal Narayan Kirana Store", text: "Kiko Live has transformed our business! The intuitive dashboard allows us to monitor our sales and seize opportunities we previously overlooked." },
                            { initials: "ST", name: "SUNNY TANWANI", store: "SINDHI NAMKEEN & DRY FRUITS", text: "Since using Kiko Live, our orders have soared! The dashboard helps us track performance and secure deals we might have missed before." },
                        ].map((t, i) => (
                            <div className="tl-testimonial" key={i}>
                                <div className="tl-testimonial-header">
                                    <div className="tl-avatar">{t.initials}</div>
                                    <div className="tl-testimonial-info">
                                        <h4>{t.name}</h4>
                                        <p>{t.store}</p>
                                    </div>
                                    <div className="tl-stars">★★★★☆</div>
                                </div>
                                <blockquote>"{t.text}"</blockquote>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ EXPERT ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <div className="tl-expert">
                        <div className="tl-expert-inner">
                            <div className="tl-expert-text">
                                <h2>Meet Our Expert</h2>
                                <p>
                                    Imran Alam brings 20+ years of Sales, Marketing, and Business Development experience.
                                    He has led large teams, expanded markets, and built scalable sales networks across India,
                                    specializing in Key Account Management and go-to-market strategies.
                                </p>
                                <div className="tl-expert-highlights">
                                    <div>
                                        <h4>Expert Guidance</h4>
                                        <p>No technical skills needed — our expert guidance makes starting your online journey easy and confident.</p>
                                    </div>
                                    <div>
                                        <h4>Proven Success</h4>
                                        <p>Transform your offline store into a thriving online business. Embrace the digital world and watch your success soar!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="tl-expert-img">
                                <img src={meetImg} alt="Imran Alam - Expert" width={616} height={577} loading="lazy" decoding="async" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ MEDIA SPOTLIGHT ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <h2 className="tl-section-title">Media Spotlight</h2>
                    <p className="tl-section-sub">See what the press is saying about Kiko Live and the kirana revolution.</p>
                    <div className="tl-media-scroll">
                        {articles.map((a, i) => (
                            <div className="tl-media-card" key={i}>
                                <img src={a.image} alt={a.title} width={270} height={150} loading="lazy" decoding="async" />
                                <div className="tl-media-body">
                                    <div className="tl-media-meta">
                                        <span className="tl-media-source">{a.source}</span>
                                        <span className="tl-media-date">
                                            <img src={YellowClockIcon} alt="" width={12} height={12} style={{ marginRight: 4 }} />
                                            {a.date}
                                        </span>
                                    </div>
                                    <h4>{a.title}</h4>
                                    <p>{a.excerpt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ CTA STRIP ══════ */}
            <section className="tl-cta-strip tl-deferred-section">
                <div className="tl-wrap">
                    <h2>{isFromLead ? "Thank You For Registration" : "Join Our Exciting Webinar!"}</h2>
                    <p>Unlock the potential of your business by going online. Register now for invaluable insights!</p>
                    <button className="tl-cta" onClick={handleCTA} id="cta-strip-register-btn">
                        {ctaLabel}
                    </button>
                </div>
            </section>

            {/* ══════ FAQ ══════ */}
            <section className="tl-section tl-deferred-section">
                <div className="tl-wrap">
                    <h2 className="tl-section-title">FAQs</h2>
                    <p className="tl-section-sub">Find answers to common questions about the Kiko Live Seller webinar.</p>
                    <div className="tl-faq-list">
                        {faqs.map((f, i) => (
                            <details className="tl-faq-item" key={i} open={i === 0}>
                                <summary>{f.q}</summary>
                                <div className="tl-faq-answer">{f.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════ FOOTER ══════ */}
            <FooterWebinar />

            {/* ══════ STICKY BAR ══════ */}
            <div className="tl-sticky-bar">
                <div className="tl-wrap">
                    <div className="tl-sticky-inner">
                        {isFromLead || isFromLeadWithForm ? (
                            <div className="tl-sticky-text">
                                Thank You For Registration — <span>Join our WhatsApp group</span>
                            </div>
                        ) : (
                            <div className="tl-sticky-text">
                                Hurry! Only Few Seats Left For The <span>Webinar</span>
                            </div>
                        )}
                        <button
                            className={`tl-cta ${isFromLead || isFromLeadWithForm ? "tl-cta-green" : ""}`}
                            onClick={handleCTA}
                            id="sticky-register-btn"
                        >
                            {ctaLabel}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════ MODALS ══════ */}
            {showRazorpay && (
                <Modal isOpen={showRazorpay} toggle={() => setShowRazorpay(false)}>
                    <div className="subscribe-modal-payment">
                        <Suspense fallback={<div className="tl-modal-loader">Loading payment...</div>}>
                            <PreRazorpay
                                amount={isWebinarRS9 ? 9 : 49}
                                onPaymentResponse={handlePaymentResponse}
                                setOpenPreRazorpayModal={setShowRazorpay}
                                {...props}
                            />
                        </Suspense>
                    </div>
                </Modal>
            )}

            {isOpenModal && (
                <Suspense fallback={<div className="tl-modal-loader">Loading form...</div>}>
                    <WebinarModal
                        handleChange={handleChange}
                        disabled={disabled}
                        userData={userData}
                        onsubmit={onsubmit}
                        onClose={() => setOpenModal(false)}
                        isFromLeadWithForm={isFromLeadWithForm}
                        isWebinarRS9={isWebinarRS9}
                    />
                </Suspense>
            )}

            {isSuccess && (
                <Suspense fallback={<div className="tl-modal-loader">Loading details...</div>}>
                    <SuccessModal
                        whatsAppUrl={settingData?.webinarWhatsappUrl || DEFAULT_WHATSAPP_URL}
                        amount={isWebinarRS9 ? 9 : 49}
                        onClose={() => { resetUserData(); setIsSuccess(false); }}
                        pixelId={pixelId}
                        isFromLeadWithForm={isFromLeadWithForm}
                    />
                </Suspense>
            )}

            {/* ══════ VIDEO MODAL ══════ */}
            {showVideo && (
                <div className="tl-video-modal-overlay" onClick={() => setShowVideo(false)}>
                    <div className="tl-video-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="tl-video-close" onClick={() => setShowVideo(false)}>✕</button>
                        <video width="100%" controls autoPlay>
                            <source src={activeVideoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestLandingPage;
