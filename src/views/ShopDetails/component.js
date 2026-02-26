import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import profileImg from "../../images/ShopDetails/kiko-shop.png";
import ScannerIcon from "../../components/svgIcons/ScannerIcon";
import GSTInfoIcon from "../../images/gst-info-icon.svg";
import defaultImage from "../../images/defaultImage.jpg";
import pdfFile from "../../images/pdfFile.png";
import Copy from "../../components/svgIcons/Copy";
import Edit from "../../components/svgIcons/Edit";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
import Camera from "../../components/svgIcons/Camera";
import dateExpired from "../../images/date-expired-icon 1.svg";
import dateExpiredClose from "../../images/date-expired-close-icon.svg";
import contactIcon from "../../images/ShopDetails/contact.svg";
import emailIcon from "../../images/ShopDetails/gmail-logo.svg";
import whatsaapIcon from "../../images/ShopDetails/whatsaap.svg";
import ShopDetails from "../../components/svgIcons/ShopDetail";
import SellerDetails from "../../components/svgIcons/SellerDetails";
import BankDetails from "../../components/svgIcons/BankDetails";
import StoreServiceable from "../../components/svgIcons/StoreServiceable";
import DownArrow from "../../images/black-down-arrow.svg";
import successfullImg from "../../images/wallet/successfull.png";
import rejectImg from "../../images/wallet/rejection.png";
import premiumImg from "../../images/wallet/premium_type.svg";
import {
  UPDATE_VENDOR_PROFILE_DETAIL,
  GET_USER,
  CHECK_SLUG,
  ODNC_COUPON,
  SEARCH_AUTOCOMPLETE_CATELOGUE,
  CREATE_ODNC_COUPON,
  DELETE_ODNC_COUPON,
  FETCH_COUPON_CATELOGUE,
} from "../../api/apiList";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Modal } from "reactstrap";
import { get, debounce } from "lodash";
import { Space, Spin, Popover } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import API from "../../api";
import crossIcon from "../../images/cross-icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import {
  handleError,
  notify,
  nomenclature,
  handleLogout,
  flutterfetchCameraPermission,
  copyToClipboard,
} from "../../utils";
import axios from "axios";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { InfoIcon } from "../../components/svgIcons";
import RightArrow from "../../images/right-arrow.svg";
import QRCode from "react-qr-code";
import PermissionAlertP from "../../components/Modal/PermissionAlertPopup";
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";
import SubscriptionIcon from "../../components/svgIcons/SubscriptionIcon";
import AddCoupon from "../../components/svgIcons/AddCoupon";
// import ImageItem from "../Common/ImageItem/ImageItem";

const ShopDetailsComponent = (props) => {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const getAdminDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "");
    } catch (error) {
      return null;
    }
  };
  const disableContrast = () => {
    let admin = getAdminDetails();
    if (admin && admin?.role === "superadmin") {
      return false;
    } else {
      return true;
    }
  };
  const getWebToken = () => {
    try {
      return JSON.parse(localStorage.getItem("webToken") || "");
    } catch (error) {
      return null;
    }
  };
  function agreementModal() {
    setagreement(false);
  }
  const tatTiming = [
    { label: "5 mins", value: "PT5M" },
    { label: "10 mins", value: "PT10M" },
    { label: "20 mins", value: "PT20M" },
    { label: "30 mins", value: "PT30M" },
    { label: "45 mins", value: "PT45M" },
    { label: "1 hr", value: "PT1H" },
    { label: "2 hrs", value: "PT2H" },
    { label: "3 hrs", value: "PT3H" },
    { label: "6 hrs", value: "PT6H" },
    { label: "12 hrs", value: "PT12H" },
    { label: "18 hrs", value: "PT18H" },
    { label: "24 hrs", value: "PT24H" },
  ];
  function findByValue(tatTiming, value) {
    const foundItem = tatTiming.find((item) => item.value === value);
    return foundItem ? foundItem : { label: "24 hrs", value: "PT24H" };
  }
  const userData = getSellerDetails();
  const modalContentRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const payment = location.state;
  const [user_data, setuser_data] = useState({});
  const [imageEdit, setimageEdit] = useState(false);
  const [newStoreLogo, setnewStoreLogo] = useState("");
  const [availability, setavailability] = useState(true);
  const [isDisable, setisDisable] = useState(true);
  const [isSpin, setisSpin] = useState("");
  const [viewImage, setViewImage] = useState("");
  const [CouponDetails, setCouponDetails] = useState("");
  const [selectedDays, setSelectedDays] = useState(
    userData?.storeTiming ? userData?.storeTiming?.availability : []
  );
  const [holidayDate, setholidayDate] = useState([]);
  const [storeTime, setstoreTime] = useState([]);
  const [buyerAppLink, setBuyerAppLink] = useState([
    // {
    //   key: "paytm",
    //   value: "",
    // },
    {
      key: "mystore",
      value: "",
    },
    {
      key: "digihaat",
      value: "",
    },
  ]);
  const [breakTime, setbreakTime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [websiteFreeDelivery, setWebsiteFreeDelivery] = useState(
    userData?.websiteOrderServiceability
      ? userData?.websiteOrderServiceability?.freeDelivery
      : false
  );
  const [websiteFreeDeliveryMinValue, setWebsiteFreeDeliveryMinValue] =
    useState("");
  const [ondcFreeDeliveryMinValue, setOndcFreeDeliveryMinValue] = useState("");
  const [websitePanIndiaDelivery, setWebsitePanIndiaDelivery] = useState(
    userData?.websiteOrderServiceability
      ? userData?.websiteOrderServiceability?.panIndiaDelivery
      : false
  );
  const [ondcFreeDelivery, setOndcFreeDelivery] = useState(
    userData?.ondcOrderServiceability
      ? userData?.ondcOrderServiceability?.freeDelivery
      : false
  );
  const [ondcPanIndiaDelivery, setOndcPanIndiaDelivery] = useState(
    userData?.ondcOrderServiceability
      ? userData?.ondcOrderServiceability?.panIndiaDelivery
      : false
  );
  const [websiteDeliveryAmount, setWebsiteDeliveryAmount] = useState("");
  const [ondcDeliveryAmount, setOndcDeliveryAmount] = useState("");
  const [dayTimeTat, setDayTimeTat] = useState({});
  const [nightTimeTat, setNightTimeTat] = useState({});
  const [pageLoading, setpageLoading] = useState(false);
  const [deliveryRadius, setdeliveryRadius] = useState(
    userData?.deliveryRadius ? userData?.deliveryRadius : 5
  );
  const [deliveryMode, setdeliveryMode] = useState(
    userData?.deliveryMode ? userData?.deliveryMode : "self-delivery"
  );
  const [hyperDeliveryCharges, setHyperDeliveryCharges] = useState(
    userData?.hyperLocalDeliveryCharges
      ? userData?.hyperLocalDeliveryCharges
      : "20"
  );
  const [deliveryRadiusCharges, setDeliveryRadiusCharges] = useState(
    userData?.deliveryRadiusCharges?.length > 0
      ? userData?.deliveryRadiusCharges
      : [
          {
            "0-3": "20",
          },
          {
            "3.1-5": "20",
          },
        ]
  );
  const [paymentMode, setPaymentMode] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [minimumOrderValue, setMinimumOrderValue] = useState("");
  const [slug, setSlug] = useState("");
  const [slugloading, setslugLoading] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [urlChecked, seturlChecked] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [slugNotify, setSlugNotify] = useState("");
  const [slugExist, setSlugExist] = useState();
  const [hasSpecialChars, setHasSpecialChars] = useState(false);
  const [description, setdescription] = useState("");
  const [editPopup, setEditPopup] = useState(false);
  const [editField, setEditField] = useState("");
  const [agreement, setagreement] = useState(false);
  const [coupounData, setCoupounData] = useState([]);
  const [submitCoupoun, setSubmitCoupoun] = useState(false);
  const [subscriptionExpiringModal, setSubscriptionExpiringModal] =
    useState(false);
  const [sEndinginDays, setSendinginDays] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [coupoun, setCoupoun] = useState({
    applicability: { items: [] },
    kikoOffer: false,
    verified: false,
    images: [],
    userId: "",
    offerId: "",
    offerType: "",
    status: "active",
    description: "",
    offerQualifiers: {
      minValue: "",
    },
    offerBenefit: {
      value: "",
      valueType: "",
      valueCap: "",
    },
    applicableForAll: false,
    expiry_date: "",
  });
  const [search, setSearch] = useState("");
  const [searchCatelogueData, setSearchCatelogueData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [activeTabId, setActiveTabId] = useState("#home-v");
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [value, setValue] = useState("");
  const [qrPopUp, setQrPopUp] = useState(false);
  const [gstDec, setGstDec] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({
    permission: false,
    type: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("OneMonth");
  const [subscriptionType, setSubscriptionType] = useState(
    user_data?.subscriptionId?.subscriptionType || "Standard"
  );
  const [digihaatUrl, setDigihaatUrl] = useState("");

  useEffect(() => {
    const digihaatLink = buyerAppLink?.find(
      (item) => item.key === "digihaat"
    )?.value;
    if (digihaatLink) {
      setDigihaatUrl(digihaatLink);
    } else {
      const domain =
        userData?.mainCategory === "Food & Beverage" ||
        userData?.mainCategory === "F&B"
          ? "ONDC:RET11"
          : userData?.mainCategory === "Grocery"
          ? "ONDC:RET10"
          : "ondc:default";

      const providerId = userData?._id || "";
      setDigihaatUrl(
        `https://digihaat.in/store?domain=${domain}&provider_id=${providerId}&bpp_id=ondc.kiko.live/ondc-seller`
      );
    }
  }, [buyerAppLink]);
  useEffect(() => {
    if (userData?.subscriptionId?.subscriptionType) {
      setSubscriptionType(userData?.subscriptionId?.subscriptionType);
    }
  }, [userData?.subscriptionId?.subscriptionType]);

  useEffect(() => {
    if (user_data?.subscriptionId?.subscriptionType) {
      setSubscriptionType(user_data?.subscriptionId?.subscriptionType);
    }
  }, [user_data?.subscriptionId?.subscriptionType]);

  const pricing = {
    OneMonth: 199,
    ThreeMonths: 499,
    SixMonths: 999,
  };

  const manageState = () => {
    setSelectedDays(userData?.storeTiming?.availability);
    setuser_data(userData);
    setholidayDate(userData?.storeTiming?.holidays);
    setstoreTime(userData?.storeTiming?.storeTime);
    setBuyerAppLink(userData?.buyerAppLink);
    setbreakTime(userData?.storeTiming?.breakTime);
    setdeliveryRadius(userData?.deliveryRadius ? userData?.deliveryRadius : 5);
    setdeliveryMode(
      userData?.deliveryMode ? userData?.deliveryMode : "self-delivery"
    );
    setWhatsApp(userData?.whatsAppNumber);
    setMinimumOrderValue(userData?.minimumOrderValue);
    setdescription(userData?.description);
    setPaymentMode(userData?.paymentMode);
    setSlug(userData?.slug);
    setpageLoading(false);
    setavailability(true);
    setWebsiteFreeDelivery(userData?.websiteOrderServiceability?.freeDelivery);
    setWebsiteFreeDeliveryMinValue(
      userData?.websiteOrderServiceability?.freeDeliveryMinValue
    );
    setWebsitePanIndiaDelivery(
      userData?.websiteOrderServiceability?.panIndiaDelivery
    );
    setWebsiteDeliveryAmount(
      userData?.websiteOrderServiceability?.panIndiaDeliveryCharges
    );
    setOndcFreeDelivery(userData?.ondcOrderServiceability?.freeDelivery);
    setOndcFreeDeliveryMinValue(
      userData?.ondcOrderServiceability?.freeDeliveryMinValue
    );
    setOndcPanIndiaDelivery(
      userData?.ondcOrderServiceability?.panIndiaDelivery
    );
    setOndcDeliveryAmount(
      userData?.ondcOrderServiceability?.panIndiaDeliveryCharges
    );
    setDayTimeTat(
      userData?.ondcOrderServiceability?.dayTimeTat
        ? findByValue(tatTiming, userData?.ondcOrderServiceability?.dayTimeTat)
        : { label: "24 hrs", value: "PT24H" }
    );
    setNightTimeTat(
      userData?.ondcOrderServiceability?.nightTimeTat
        ? findByValue(
            tatTiming,
            userData?.ondcOrderServiceability?.nightTimeTat
          )
        : { label: "24 hrs", value: "PT24H" }
    );
  };

  useEffect(() => {
    const webToken = getWebToken();
    if (!userData?.isProfileComplete || userData?.isProfileSkip) {
      navigate("/registration");
    }
    if (userData?._id && get(userData, "_id", "") !== "") {
      manageState();
    } else {
      handleLogout();
      navigate("/");
    }
    if (
      !userData?.webDeviceToken ||
      userData?.webDeviceToken === "" ||
      userData?.webDeviceToken !== webToken
    ) {
      updateVendorWebtoken(userData, webToken);
    }
  }, []);

  useEffect(() => {
    if (user_data && Object.keys(user_data).length !== 0) {
      const subscription = get(user_data, "subscriptionId", false);
      const isSubscribed = user_data?.subscriptionActive ?? false;
      const isOndcVerified = user_data?.ondcVerified;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let endDate = subscription?.endDate
        ? new Date(subscription.endDate)
        : new Date("2025-04-04"); // Default expiry is March 31, 2025
      endDate.setHours(0, 0, 0, 0); // Ensure midnight
      const timeDiff = endDate.getTime() - currentDate.getTime();

      const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      setSendinginDays(daysRemaining);
      const popupAlreadyShown = sessionStorage.getItem(
        "subscriptionPopupShown"
      );
      if (
        (!subscription || !isSubscribed) &&
        popupAlreadyShown !== "true" &&
        isOndcVerified &&
        daysRemaining <= 10 // Show only if not shown before
      ) {
        setSubscriptionExpiringModal(true);
        sessionStorage.setItem("subscriptionPopupShown", "true");
      }
    }
  }, [user_data]);

  const updateVendorWebtoken = async (userData, webToken) => {
    let body = {
      userId: userData && userData._id ? userData._id : "",
      webDeviceToken: webToken,
    };
    try {
      if (body?.userId !== "") {
        const response = await API.post(UPDATE_VENDOR_PROFILE_DETAIL, body);
        if (response?.data?.success) {
          localStorage.setItem("user", JSON.stringify(response?.data?.data));
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const GSTInfo = (
    <ul className="GSTinfoText">
      <li>
        To Generate Enrolement Number Click Here{" "}
        <a href="https://reg.gst.gov.in/registration/" target="Blank">
          https://reg.gst.gov.in/registration/
        </a>
      </li>
    </ul>
  );

  const getCoupouns = async () => {
    try {
      setCouponLoading(true);
      let body = {
        userId: user_data && user_data._id ? user_data._id : "",
      };
      const response = await API.post(ODNC_COUPON, body);
      setCouponLoading(false);
      if (response.data?.success) {
        setCoupounData(response?.data?.result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCheckboxChange = (event) => {
    const day = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedDays((prevSelectedDays) => [...prevSelectedDays, day]);
    } else {
      setSelectedDays((prevSelectedDays) =>
        prevSelectedDays.filter((selectedDay) => selectedDay !== day)
      );
    }
  };

  const timingCheck = (startTime, event) => {
    let endTime = event.target.value;
    if (moment(startTime, "HHmm") > moment(endTime, "HHmm")) {
      notify("error", "End time is not equal or less than start time ");
    } else if (moment(endTime, "HHmm") > moment(startTime, "HHmm")) {
      if (startTime === storeTime[0]) {
        storeTimeChange(1, event);
      } else if (startTime === breakTime[0]) {
        breakTimeChange(1, event);
      }
    } else {
      notify("error", "End time is not equal or less than start time ");
    }
  };

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      navigate("/shopdetails");
    }
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const holidayDateChange = (index, event) => {
    const updatedDates = [...holidayDate];
    updatedDates[index] = event.target.value;
    setholidayDate(updatedDates);
  };

  const getUser = async () => {
    const webToken = getWebToken();
    setpageLoading(true);
    try {
      setimageEdit(false);
      const response = await API.post(GET_USER, {
        _id: userData && userData._id,
      });
      if (response) {
        if (
          !response?.data?.result?.webDeviceToken ||
          response?.data?.result?.webDeviceToken === "" ||
          response?.data?.result?.webDeviceToken !== webToken
        ) {
          updateVendorWebtoken(response?.data?.result, webToken);
        }
        setuser_data(response?.data?.result);
        setSelectedDays(response?.data?.result?.storeTiming?.availability);
        setholidayDate(response?.data?.result?.storeTiming?.holidays);
        setstoreTime(response?.data?.result?.storeTiming?.storeTime);
        setBuyerAppLink(response?.data?.result?.buyerAppLink);
        setbreakTime(response?.data?.result?.storeTiming?.breakTime);
        setdeliveryRadius(
          response?.data?.result?.deliveryRadius
            ? response?.data?.result?.deliveryRadius
            : 5
        );
        setdeliveryMode(
          userData?.deliveryMode ? userData?.deliveryMode : "self-delivery"
        );
        setWhatsApp(response?.data?.result?.whatsAppNumber);
        setMinimumOrderValue(response?.data?.result?.minimumOrderValue);
        setdescription(response?.data?.result?.description);
        setPaymentMode(response?.data?.result?.paymentMode);
        setSlug(response?.data?.result?.slug);
        setpageLoading(false);
        setavailability(true);
        setWebsiteFreeDelivery(
          response?.data?.result?.websiteOrderServiceability?.freeDelivery
        );
        setWebsiteFreeDeliveryMinValue(
          response?.data?.result?.websiteOrderServiceability
            ?.freeDeliveryMinValue
        );
        setWebsitePanIndiaDelivery(
          response?.data?.result?.websiteOrderServiceability?.panIndiaDelivery
        );
        setWebsiteDeliveryAmount(
          response?.data?.result?.websiteOrderServiceability
            ?.panIndiaDeliveryCharges
        );
        setOndcFreeDelivery(
          response?.data?.result?.ondcOrderServiceability?.freeDelivery
        );
        console.log(ondcFreeDelivery, "ondcFreeDelivery");
        setOndcFreeDeliveryMinValue(
          response?.data?.result?.ondcOrderServiceability?.freeDeliveryMinValue
        );
        setOndcPanIndiaDelivery(
          response?.data?.result?.ondcOrderServiceability?.panIndiaDelivery
        );
        setDayTimeTat(
          response?.data?.result?.ondcOrderServiceability?.dayTimeTat
            ? findByValue(
                tatTiming,
                response?.data?.result?.ondcOrderServiceability?.dayTimeTat
              )
            : { label: "24 hrs", value: "PT24H" }
        );
        setNightTimeTat(
          response?.data?.result?.ondcOrderServiceability?.nightTimeTat
            ? findByValue(
                tatTiming,
                response?.data?.result?.ondcOrderServiceability?.nightTimeTat
              )
            : { label: "24 hrs", value: "PT24H" }
        );
        setOndcDeliveryAmount(
          response?.data?.result?.ondcOrderServiceability
            ?.panIndiaDeliveryCharges
        );

        localStorage.setItem("user", JSON.stringify(response?.data?.result));
        if (
          !response?.data?.result?.isProfileComplete ||
          response?.data?.result?.isProfileSkip
        ) {
          navigate("/registration");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const storeTimeChange = (index, event) => {
    const updatedTime = [...storeTime];
    const inputTime = event.target.value;
    updatedTime[index] = moment(inputTime, "HH:mm").format("HHmm");
    setstoreTime(updatedTime);
  };

  const breakTimeChange = (index, event) => {
    const updatedTime = [...breakTime];
    const inputTime = event.target.value;
    updatedTime[index] = moment(inputTime, "HH:mm").format("HHmm");
    setbreakTime(updatedTime);
  };

  const addUpdateImage = (selectedFile, data) => {
    const formData = new FormData();
    setisDisable(true);
    setisSpin(data);
    formData.append(`file`, selectedFile);
    axios
      .post(`${process.env.REACT_APP_KIKO_API_V1}/products/upload`, formData)
      .then((res) => {
        if (data === "shopLogo") {
          setnewStoreLogo(res?.data?.file_url);
          setisDisable(false);
          setimageEdit(true);
        }
        if (data === "coupon") {
          setCoupoun((prevState) => ({
            ...prevState,
            images: [...prevState.images, res?.data?.file_url],
          }));
          setisDisable(false);
        }
      });
  };

  const deleteCoupoun = async (coupon) => {
    try {
      const response = await API.post(DELETE_ODNC_COUPON, { _id: coupon?._id });
      if (response.data?.success) {
        notify("success", "Coupon deleted Successfully");
        getCoupouns();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const couponCatelog = async (coupon) => {
    try {
      const listOfIds = coupon?.applicability?.items;
      const response = await API.post(FETCH_COUPON_CATELOGUE, { listOfIds });
      if (response?.data?.success) {
        setSelectedItem(response?.data?.result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const createCoupoun = async () => {
    setSubmitCoupoun(true);
    if (
      coupoun.offerId === "" ||
      coupoun.offerType === "" ||
      (coupoun.applicability.items?.length === 0 && !coupoun.applicability) ||
      coupoun.images?.length === 0 ||
      coupoun.description === "" ||
      coupoun.offerQualifiers.minValue === "" ||
      coupoun.offerBenefit.value === "" ||
      coupoun.offerBenefit.valueType === "" ||
      coupoun.offerBenefit.valueCap === "" ||
      coupoun.expiry_date === ""
    ) {
      return;
    }
    try {
      if (coupoun._id && coupoun._id !== "") {
        delete coupoun.createdAt;
        delete coupoun.updatedAt;
        delete coupoun.__v;
        delete coupoun.createdAt;
      }
      const response = await API.post(CREATE_ODNC_COUPON, coupoun);
      if (response.data?.success) {
        if (coupoun._id && coupoun._id !== "") {
          notify("success", "Coupon update Successfully");
        } else {
          notify("success", "Coupon added Successfully");
        }
        setCouponDetails("");
        setSelectedItem([]);
        setSubmitCoupoun(false);
        couponReset();
        getCoupouns();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const couponReset = () => {
    setCoupoun({
      applicability: { items: [] },
      kikoOffer: false,
      verified: false,
      images: [],
      userId: "",
      offerId: "",
      offerType: "",
      status: "active",
      description: "",
      offerQualifiers: {
        minValue: "",
      },
      offerBenefit: {
        value: "",
        valueType: "",
        valueCap: "",
      },
      expiry_date: "",
    });
  };

  const checkSlug = async () => {
    setslugLoading(true);
    let body = {
      userId: user_data && user_data._id ? user_data._id : "",
      slug: slug,
    };
    try {
      const response = await API.post(CHECK_SLUG, body);
      if (response?.data?.success) {
        // setSlugPresent(!response?.data?.result?.isPresent)
        setSlugNotify(response?.data?.result?.userResults?.message);
        setHasSpecialChars(false);
        setSlug(response?.data?.result?.userResults?.slug);
        setSlugExist(response?.data?.result?.userResults?.slugExist);
        setslugLoading(false);
        seturlChecked(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isChecked = (key) => {
    return deliveryRadiusCharges.some(
      (charge) => Object.keys(charge)[0] === key
    );
  };

  const handleValueChange = (key, newValue) => {
    const intValue = Math.floor(newValue);
    if (intValue <= 99) {
      setDeliveryRadiusCharges((prevCharges) =>
        prevCharges.map((charge) =>
          charge[key] !== undefined ? { [key]: newValue } : charge
        )
      );
    }
  };
  // const handleDeliveryCheckboxChange = (key) => {
  //   // Check if the selected radius is already in the array
  //   const existingCharge = deliveryRadiusCharges.find(charge => Object.keys(charge)[0] === key);
  //   if (existingCharge) {
  //     setDeliveryRadiusCharges(prevCharges =>
  //       prevCharges.filter(charge => !charge.hasOwnProperty(key))
  //     );
  //   }

  //   else {
  //     setDeliveryRadiusCharges(prevCharges => [
  //       ...prevCharges,
  //       { [key]: "20" }
  //     ]);
  //   }
  // };

  const updateVendorProfile = async () => {
    if (
      (storeTime && storeTime?.length === 1) ||
      (breakTime && breakTime?.length === 1) ||
      (holidayDate && holidayDate?.length === 1)
    ) {
      return notify("error", "Please fill both Start Time and End Time");
    }
    if ((!urlChecked || slugExist) && user_data?.slug !== slug) {
      return notify("error", "Please check Slug Url");
    }
    if (!selectedDays?.length) {
      return notify("error", "Please select store availablility days");
    }
    let body = {
      userId: user_data && user_data._id ? user_data._id : "",
      storeLogo: newStoreLogo ? newStoreLogo : user_data?.storeLogo,
      storeTiming: {
        availability: selectedDays.sort((a, b) => {
          return parseInt(a) - parseInt(b);
        }),
        holidays: holidayDate,
        // storeTime:
        // user_data?.mainCategory === "Grocery" ? ["0000", "2359"] : storeTime,
        storeTime: storeTime,
        breakTime: breakTime,
      },
      websiteOrderServiceability: {
        freeDelivery: websiteFreeDelivery,
        freeDeliveryMinValue: websiteFreeDeliveryMinValue,
        panIndiaDelivery: websitePanIndiaDelivery,
        panIndiaDeliveryCharges: parseInt(websiteDeliveryAmount),
      },
      ondcOrderServiceability: {
        freeDelivery: ondcFreeDelivery,
        freeDeliveryMinValue: ondcFreeDeliveryMinValue,
        panIndiaDelivery: ondcPanIndiaDelivery,
        panIndiaDeliveryCharges: parseInt(ondcDeliveryAmount),
        dayTimeTat: dayTimeTat?.value,
        nightTimeTat: nightTimeTat?.value,
      },
      hyperLocalDeliveryCharges: hyperDeliveryCharges,
      deliveryRadius,
      deliveryMode,
      whatsAppNumber: whatsApp,
      description,
      paymentMode,
      deliveryRadiusCharges,
      slug,
      buyerAppLink,
    };
    // if (minimumOrderValue !== "") {
    body.minimumOrderValue = minimumOrderValue;
    // } else {
    //   body.minimumOrderValue = ""; // explicitly send empty when cleared
    // }
    if (
      selectedDays.every(
        (value, index) => value !== user_data?.storeTiming?.availability[index]
      ) ||
      storeTime.every(
        (value, index) => value !== user_data?.storeTiming?.storeTime[index]
      ) ||
      breakTime.every(
        (value, index) => value !== user_data?.storeTiming?.breakTime[index]
      )
    ) {
      body.storeTimingChangedAt = new Date();
    }
    try {
      setLoading(true);
      const response = await API.post(UPDATE_VENDOR_PROFILE_DETAIL, body);
      if (response?.data?.success) {
        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        setLoading(false);
        getUser();
        notify("success", response?.data?.message);
        setavailability(true);
        setEditUrl("");
        setSlugNotify("");
        setShowDropdown(false);
      } else {
        setLoading(false);
        setavailability(true);
        notify("error", response?.data?.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const searchUserdebouncer = debounce((search) => {
    searchUser(search);
  }, 400);

  const searchUser = async (search) => {
    if (search?.length === 0) {
      setSearchCatelogueData([]);
    }
    if (search?.length > 3) {
      API.post(SEARCH_AUTOCOMPLETE_CATELOGUE, {
        search,
        userId: user_data?._id,
      })
        .then(({ data }) => {
          if (data.success) {
            setSearchCatelogueData(get(data, "result", []));
          }
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  const convertServiceableArea = (unit) => {
    switch (JSON.stringify(unit)) {
      case "3":
        return "0 KM - 3 KMs";
      case "5":
        return "0 KM - 5 KMs";
      // case "7":
      //   return "0 KM - 7 KMs";
      // case "10":
      //   return "0 KM - 10 KMs";
      // case "15":
      //   return "0 KM - 15 KMs";
      default:
        return "0 KM - 5 KMs";
    }
  };
  const getLastNumberFromLastKey = (charges) => {
    // Get the last object in the array
    const lastObject = charges[charges?.length - 1];

    // Get the last key from the last object
    const lastKey = lastObject ? Object?.keys(lastObject)[0] : "0-0";

    // Split the key by '-' and get the last number
    const lastNumber = lastKey?.split("-")?.pop();

    return lastNumber;
  };

  const isSubscribed = user_data?.subscriptionActive ?? false;
  const isOndcVerified = user_data?.ondcVerified;
  const handleSubscription = (amount, type, duration = "OneMonth") => {
    navigate("/preRazorpay", {
      state: {
        coinAmount: amount,
        paymentType: "FirstTime",
        subscriptionType: type,
        subscriptionPlan: duration,
        amount: amount,
      },
    });
  };

  // Update renewal function to pass correct parameters too
  const handleRenewal = (amount) => {
    navigate("/preRazorpay", {
      state: {
        coinAmount: amount,
        paymentType: "Renewal",
        subscriptionType,
        subscriptionPlan: selectedDuration,
        amount: amount,
      },
    });

    setSubscriptionDetails({
      ...subscriptionDetails,
      amount: amount,
    });
  };
  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div
        className="RightBlock"
        style={
          isMobile
            ? {
                width: "100%",
                left: "0",
                top: isAppView === "true" ? "0px" : "68px",
              }
            : {}
        }
      >
        <div
          className="section-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              margin: 0,
            }}
          >
            Profile
            {user_data?.subscriptionId?.subscriptionType === "Premium" ||
              (userData?.subscriptionId?.subscriptionType === "Premium" && (
                <img src={premiumImg} alt="Premium" />
              ))}
          </h1>
          {isSubscribed &&
            (() => {
              const endDate = moment.utc(user_data?.subscriptionId?.endDate);
              const today = moment.utc();
              const daysRemaining = endDate.diff(today, "days");

              if (daysRemaining < 0) {
                return (
                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginBottom: "0px",
                    }}
                  >
                    Your Subscription Has Been Expired
                  </p>
                );
              }

              return daysRemaining <= 7 ? (
                <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Subscription Ends in:{" "}
                  <span style={{ color: "red", fontSize: "16px" }}>
                    {daysRemaining} {daysRemaining === 1 ? "Day" : "Days"}
                  </span>{" "}
                </p>
              ) : null;
            })()}
        </div>
        {pageLoading ? (
          <Spin indicator={antIcon} className="loader" />
        ) : (
          <div className="shopDetailsWrapper ">
            <div className="leftBlock">
              <ul className="nav nav-tabs tabs-left sideways">
                <li className={activeTab !== "#Subscription-v" ? "active" : ""}>
                  <a
                    href="#home-v"
                    data-toggle="tab"
                    onClick={() => setActiveTabId("#home-v")}
                  >
                    <ShopDetails />
                    Shop Details
                  </a>
                </li>
                <li>
                  <a
                    href="#profile-v"
                    data-toggle="tab"
                    onClick={() => setActiveTabId("#profile-v")}
                  >
                    <SellerDetails />
                    Seller Details
                  </a>
                </li>
                <li>
                  <a
                    href="#messages-v"
                    data-toggle="tab"
                    onClick={() => setActiveTabId("#messages-v")}
                  >
                    <BankDetails />
                    Bank Details
                  </a>
                </li>
                {user_data?.brandName !== "B2B" && (
                  <>
                    {" "}
                    <li>
                      <a
                        href="#settings-v"
                        data-toggle="tab"
                        onClick={() => setActiveTabId("#settings-v")}
                      >
                        <ShopDetails />
                        Store Timing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#settings-vi"
                        data-toggle="tab"
                        onClick={() => setActiveTabId("#settings-vi")}
                      >
                        <StoreServiceable />
                        Store Serviceable Area
                      </a>
                    </li>
                    <li>
                      <a
                        href="#Additional-v"
                        data-toggle="tab"
                        onClick={() => setActiveTabId("#Additional-v")}
                      >
                        <InfoIcon />
                        Additional Details
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        getCoupouns();
                      }}
                    >
                      <a
                        href="#Coupon-v"
                        data-toggle="tab"
                        onClick={() => setActiveTabId("#Coupon-v")}
                      >
                        <AddCoupon />
                        Add Coupon
                      </a>
                    </li>
                    <li
                      className={
                        activeTab === "#Subscription-v" ? "active" : ""
                      }
                    >
                      <a
                        href="#Subscription-v"
                        data-toggle="tab"
                        onClick={() => setActiveTabId("#Subscription-v")}
                      >
                        <SubscriptionIcon />
                        Subscription
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="rightBlock">
              <div className="row">
                <div className="tab-content col-lg-12">
                  <div
                    className={`tab-pane ${
                      activeTab !== "#Subscription-v" ? "active" : ""
                    }`}
                    id="home-v"
                  >
                    <div className="row">
                      <div className="col-xl-8 col-lg-7">
                        <div className="d-flex justify-content-between align-items-center">
                          <h1>Shop Details</h1>
                          {((!user_data?.isVerified &&
                            !user_data?.ondcVerified) ||
                            !disableContrast()) && (
                            <button
                              onClick={() => {
                                setEditPopup(true);
                                setEditField("shopDetail");
                              }}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        <div className="detailsForm">
                          <ul className="formBlock">
                            <li>
                              <h6>Shop Name / Brand Name</h6>
                              <p>{user_data?.storeName}</p>
                            </li>
                            <li>
                              <h6>Shop Owner Name</h6>
                              <p>{user_data?.name}</p>
                            </li>
                            <li>
                              <h6>Phone Number</h6>
                              <p>+91 {user_data?.mobile}</p>
                            </li>
                            <li>
                              <h6>Email Id</h6>
                              <p>{user_data?.email}</p>
                            </li>
                            <li>
                              <h6>Shop Category</h6>
                              <p>{user_data?.mainCategory}</p>
                            </li>
                            <li>
                              <h6>Shop Address</h6>
                              <p>
                                {user_data?.storeAddress?.address1},{" "}
                                {user_data?.storeAddress?.address2}
                              </p>
                            </li>
                            {user_data?.storeAddress?.latitude &&
                              user_data?.storeAddress?.longitude && (
                                <li>
                                  <h6>Store Lat Long</h6>
                                  <p>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <span>
                                        {user_data?.storeAddress?.latitude},{" "}
                                        {user_data?.storeAddress?.longitude}
                                      </span>
                                      <a
                                        href={`https://www.google.com/maps?q=${user_data?.storeAddress?.latitude},${user_data?.storeAddress?.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                          padding: "4px 10px",
                                          fontSize: "12px",
                                          textDecoration: "none",
                                        }}
                                      >
                                        Go To Maps
                                      </a>
                                    </div>
                                  </p>
                                </li>
                              )}
                            <li>
                              <h6>How did you you hear about us?</h6>
                              <p>{user_data?.hearAboutUs}</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5">
                        <div className="ImgPreview">
                          {user_data?.storeLogo &&
                          typeof user_data?.storeLogo === "string" &&
                          [".pdf", ".PDF"].some((ext) =>
                            user_data?.storeLogo.endsWith(ext)
                          ) ? (
                            <img src={pdfFile} className="logoimg" alt="" />
                          ) : (
                            <img
                              src={
                                user_data?.storeLogo
                                  ? user_data?.storeLogo
                                  : profileImg
                              }
                              className="logoimg"
                              alt=""
                            />
                          )}
                        </div>
                        <div className="edit--btns">
                          <button
                            className="btn btn-md btn-primary p-0 uploadBtn"
                            onClick={async () => {
                              if (window && window.flutter_inappwebview) {
                                const tempV =
                                  await flutterfetchCameraPermission();
                                if (!tempV) {
                                  setPermissionAlertPopUp({
                                    permission: true,
                                    type: "cameraPermission",
                                  });
                                } else {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.onchange = async (e) => {
                                    addUpdateImage(
                                      e.target.files[0],
                                      "shopLogo"
                                    );
                                  };
                                  input.click();
                                }
                              } else {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.onchange = async (e) => {
                                  addUpdateImage(e.target.files[0], "shopLogo");
                                };
                                input.click();
                              }
                            }}
                          >
                            {isDisable && isSpin === "shopLogo" ? (
                              <Space
                                size="middle"
                                className="Loader"
                                style={{ left: "10px", top: "8px" }}
                              >
                                <div>
                                  {" "}
                                  <Spin size="medium" className="spiner" />
                                </div>
                              </Space>
                            ) : (
                              ""
                            )}
                            <p className="upload-img">
                              Change Image <Camera className="me-1 icon" />
                            </p>
                          </button>
                          <input
                            id="profile_image_input"
                            type="file"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              addUpdateImage(e.target.files[0], "shopLogo");
                            }}
                          />
                          <button
                            className="btn btn-outline p-0 sellercontact "
                            onClick={() => {
                              setagreement(true);
                            }}
                          >
                            <p>View Seller Contract</p>
                          </button>
                        </div>
                        <div className="eligible-card">
                          <div className="eligible-title">
                            Instant Capital. Zero Hassle.
                          </div>
                          <div className="eligible-card-inner">
                            <div className="eligible-sub-title">
                              🚀 You are eligible for a loan up to
                            </div>
                            <div className="eligible-amount">5,00,000*</div>
                            <div className="interest-rate">
                              Interest starting at just 1.25%*
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              isMobile
                                ? (window.location.href =
                                    "https://www.aspirenbfc.in/login?code=ASPKK6MEWI")
                                : window.open(
                                    "https://www.aspirenbfc.in/login?code=ASPKK6MEWI"
                                  );
                            }}
                            className="interest-get-now-btn"
                          >
                            Get Now
                          </button>
                          <div className="terms-title">
                            * Terms and conditions apply. Interest rates subject
                            to eligibility.
                          </div>
                        </div>
                        {imageEdit && newStoreLogo && (
                          <div className="upload-image-modal">
                            <h4 className="mb-3 text-center">Change Images</h4>
                            <div className="uploaded-images">
                              <div className="imagesPreview">
                                <img src={user_data?.storeLogo} alt="" />
                              </div>
                              <div className="imagesPreview">
                                <img src={newStoreLogo} alt="" />
                              </div>
                            </div>
                            <div className="Btnflex">
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                  setimageEdit(false);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn-sm btn"
                                onClick={() => {
                                  updateVendorProfile();
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="profile-v">
                    <div className="d-flex justify-content-between align-items-center">
                      <h1>Seller Details</h1>
                      {((!user_data?.isVerified && !user_data?.ondcVerified) ||
                        !disableContrast()) && (
                        <button
                          onClick={() => {
                            setEditPopup(true);
                            setEditField("sellerDetail");
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="detailsForm">
                      <ul className="formBlock">
                        <li>
                          <h6>Aadhar Card Number</h6>
                          <p>{user_data?.kycDetail?.aadharNumber}</p>
                        </li>
                        <li>
                          <h6>PAN Card Number</h6>
                          <p>{user_data?.kycDetail?.panNumber}</p>
                        </li>
                        <li>
                          <h6>GSTIN Number</h6>
                          <p>{user_data?.kycDetail?.gstNumber}</p>
                        </li>
                        {user_data?.kycDetail?.gstEnrollmentNumber && (
                          <li>
                            <h6>GST Enrollment Number</h6>
                            <p>{user_data?.kycDetail?.gstEnrollmentNumber}</p>
                          </li>
                        )}
                        <li>
                          <h6>PAN Card Number of Company</h6>
                          <p>{user_data?.kycDetail?.panNumber}</p>
                        </li>
                        <li>
                          <h6>Company Name</h6>
                          <p>{user_data?.kycDetail?.companyName}</p>
                        </li>
                        {(user_data?.mainCategory === "F&B" ||
                          user_data?.mainCategory === "Food & Beverage") && (
                          <li>
                            <h6>Petpooja Restaurant ID</h6>
                            <p>{user_data?.petPoojaRestaurantId}</p>
                          </li>
                        )}
                        {(user_data?.mainCategory === "F&B" ||
                          user_data?.mainCategory === "Food & Beverage") && (
                          <li>
                            <h6>Petpooja Menu ID</h6>
                            <p>{user_data?.mainRestaurantId}</p>
                          </li>
                        )}
                      </ul>
                      {(!user_data?.kycDetail?.gstEnrollmentNumber ||
                        user_data?.kycDetail?.gstEnrollmentNumber === " ") && (
                        <div className="downloadFile">
                          <div className="filePreview">
                            {user_data?.gstNumberPic &&
                            typeof user_data?.gstNumberPic === "string" &&
                            [".pdf", ".PDF"].some((ext) =>
                              user_data?.gstNumberPic.endsWith(ext)
                            ) ? (
                              <img
                                src={pdfFile}
                                alt=""
                                className="filePreview"
                              />
                            ) : (
                              <img
                                src={
                                  user_data?.gstNumberPic === ""
                                    ? defaultImage
                                    : user_data?.gstNumberPic
                                }
                                alt=""
                                className="filePreview"
                              />
                            )}
                          </div>
                          {user_data?.gstNumberPic &&
                          user_data?.gstNumberPic !== " " &&
                          typeof user_data?.gstNumberPic === "string" &&
                          [".pdf", ".PDF"].some((ext) =>
                            user_data?.gstNumberPic.endsWith(ext)
                          ) ? (
                            <button className="btn btn-md btn-primary">
                              {" "}
                              <a target="blank" href={user_data?.gstNumberPic}>
                                View GST Certificate
                              </a>
                            </button>
                          ) : (
                            <button
                              className="btn btn-md btn-primary"
                              onClick={() => {
                                setViewImage(user_data?.gstNumberPic);
                              }}
                            >
                              {" "}
                              View GST Certificate
                            </button>
                          )}
                        </div>
                      )}
                      {user_data?.kycDetail?.gstEnrollmentNumber && (
                        <div className="downloadFile">
                          <div className="filePreview">
                            {user_data?.kycDetail?.signature && (
                              <img
                                src="https://kikonewapi.s3.ap-south-1.amazonaws.com/uploads/user_images/Z4kXx3Gp6.png"
                                alt=""
                                className="filePreview"
                              />
                            )}
                          </div>
                          <button
                            className="btn btn-md btn-primary"
                            onClick={() => {
                              setGstDec(true);
                            }}
                          >
                            View GST Declaration
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="tab-pane" id="messages-v">
                    <div className="d-flex justify-content-between align-items-center">
                      <h1>Bank Details</h1>
                      {((!user_data?.isVerified && !user_data?.ondcVerified) ||
                        !disableContrast()) && (
                        <button
                          onClick={() => {
                            setEditPopup(true);
                            setEditField("bankDetail");
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="detailsForm">
                      <ul className="formBlock">
                        <li>
                          <h6>Account Holder Name</h6>
                          <p>{user_data?.bankDetails?.accountName}</p>
                        </li>
                        <li>
                          <h6>Account Number</h6>
                          <p>{user_data?.bankDetails?.accountNumber}</p>
                        </li>
                        <li>
                          <h6>Bank Name</h6>
                          <p>{user_data?.bankDetails?.accountBankName}</p>
                        </li>
                        <li>
                          <h6>IFSC Code</h6>
                          <p>{user_data?.bankDetails?.accountIfscCode}</p>
                        </li>
                        <li>
                          <h6>Proof Of Bank Details</h6>
                          <p>
                            {user_data?.bankDetails?.accountCancleCheque
                              ? nomenclature(
                                  user_data?.bankDetails?.accountCancleCheque
                                )
                              : ""}
                          </p>
                        </li>
                      </ul>
                      <div className="downloadFile">
                        <div className="filePreview">
                          {user_data.accountCancleChequeUpload &&
                          typeof user_data.accountCancleChequeUpload ===
                            "string" &&
                          [".pdf", ".PDF"].some((ext) =>
                            user_data?.accountCancleChequeUpload.endsWith(ext)
                          ) ? (
                            <img src={pdfFile} className="filePreview" alt="" />
                          ) : (
                            <img
                              src={
                                user_data?.accountCancleChequeUpload === ""
                                  ? defaultImage
                                  : user_data?.accountCancleChequeUpload
                              }
                              className="filePreview"
                              alt=""
                            />
                          )}
                        </div>
                        {user_data?.accountCancleChequeUpload &&
                        typeof user_data?.accountCancleChequeUpload ===
                          "string" &&
                        [".pdf", ".PDF"].some((ext) =>
                          user_data?.accountCancleChequeUpload.endsWith(ext)
                        ) ? (
                          <button className="btn btn-md btn-primary">
                            {" "}
                            <a
                              target="blank"
                              href={user_data?.accountCancleChequeUpload}
                            >
                              View Bank Proof
                            </a>
                          </button>
                        ) : (
                          <button
                            className="btn btn-md btn-primary"
                            onClick={() => {
                              setViewImage(
                                user_data?.accountCancleChequeUpload
                              );
                            }}
                          >
                            {" "}
                            View Bank Proof
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="settings-v">
                    <h1>Store Timing</h1>
                    <div className="row storetiming">
                      <div className="col-lg-12">
                        <div className="row mb-3">
                          <div className="col-lg-4">
                            <h6>
                              Type <span>*</span>
                            </h6>
                          </div>
                          <div className="col-lg-8">
                            <form className="nav nav-tabs justify-content-between border-0">
                              <div className="active Cancellable">
                                <a
                                  href={
                                    availability ? "#availability" : "#holiday"
                                  }
                                  data-toggle="tab"
                                >
                                  <input
                                    type="radio"
                                    id="Availability"
                                    name="radio-group"
                                    onClick={() => {
                                      setavailability(true);
                                    }}
                                    checked={availability}
                                  />
                                  <label
                                    htmlFor="Availability"
                                    onClick={() => {
                                      setavailability(true);
                                    }}
                                  >
                                    Availability
                                  </label>
                                </a>
                              </div>
                              <div className="Cancellable">
                                <a
                                  href={
                                    availability ? "#availability" : "#holiday"
                                  }
                                  data-toggle="tab"
                                >
                                  <input
                                    type="radio"
                                    id="Holiday"
                                    name="radio-group"
                                    onClick={() => {
                                      setavailability(false);
                                    }}
                                    checked={!availability}
                                  />
                                  <label
                                    htmlFor="Holiday"
                                    onClick={() => {
                                      setavailability(false);
                                    }}
                                  >
                                    Holiday
                                  </label>
                                </a>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="tab-content">
                              <div
                                className="tab-pane active"
                                id="availability"
                              >
                                <div className="row store-timing">
                                  <div className="col-lg-4">
                                    <h6 className="m-0">
                                      Days <span>*</span>
                                    </h6>
                                  </div>
                                  <div className="col-lg-8">
                                    <div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="1"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("1")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test2">Monday</label>
                                      </div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="2"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("2")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test3">Tuesday</label>
                                      </div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="3"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("3")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test4">Wednesday</label>
                                      </div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="4"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("4")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test5">Thursday</label>
                                      </div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="5"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("5")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test6">Friday</label>
                                      </div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="6"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("6")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test7">Saturday</label>
                                      </div>
                                      <div className="select-day">
                                        <input
                                          type="checkbox"
                                          id="7"
                                          onChange={handleCheckboxChange}
                                          defaultChecked={
                                            selectedDays
                                              ? selectedDays.includes("7")
                                              : false
                                          }
                                        />
                                        <label htmlFor="test8">Sunday</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 mt-4">
                                    <div className="row mb-5">
                                      <div className="col-lg-6 col-sm-12 borderRight">
                                        <h5 className="mb-3">Store Timing</h5>
                                        <div className="row mb-4">
                                          <h6 className="col-lg-4 col-sm-12">
                                            Start Time<span>*</span>
                                          </h6>
                                          <div className="col-lg-8 col-sm-12">
                                            <input
                                              type="time"
                                              className="form-control time-picker"
                                              value={
                                                storeTime &&
                                                moment(
                                                  storeTime[0],
                                                  "HHmm"
                                                ).format("HH:mm")
                                              }
                                              onChange={(event) =>
                                                storeTimeChange(0, event)
                                              }
                                              disabled={disableContrast()}
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-4">
                                          <h6 className="col-lg-4 col-sm-12">
                                            End Time<span>*</span>
                                          </h6>
                                          <div className="col-lg-8 col-sm-12">
                                            <input
                                              type="time"
                                              className="form-control time-picker"
                                              value={
                                                storeTime &&
                                                moment(
                                                  storeTime[1],
                                                  "HHmm"
                                                ).format("HH:mm")
                                              }
                                              // onChange={(event) =>
                                              //   timingCheck(storeTime[0], event)
                                              // }
                                              onChange={(event) =>
                                                storeTimeChange(1, event)
                                              }
                                              disabled={disableContrast()}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-12">
                                        <h5 className="mb-3">Break Timing</h5>
                                        <div className="row mb-4">
                                          <h6 className="col-lg-4 col-sm-12">
                                            Start Time
                                          </h6>
                                          <div className="col-lg-8 col-sm-12">
                                            <input
                                              type="time"
                                              className="form-control time-picker"
                                              value={
                                                breakTime &&
                                                moment(
                                                  breakTime[0],
                                                  "HHmm"
                                                ).format("HH:mm")
                                              }
                                              onChange={(event) =>
                                                breakTimeChange(0, event)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-4">
                                          <h6 className="col-lg-4 col-sm-12">
                                            End Time
                                          </h6>
                                          <div className="col-lg-8 col-sm-12">
                                            <input
                                              type="time"
                                              className="form-control time-picker"
                                              value={
                                                breakTime &&
                                                moment(
                                                  breakTime[1],
                                                  "HHmm"
                                                ).format("HH:mm")
                                              }
                                              onChange={(event) =>
                                                timingCheck(breakTime[0], event)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                          <button
                                            className="btn-outline"
                                            disabled={breakTime?.length === 0}
                                            onClick={() => {
                                              setbreakTime([]);
                                            }}
                                          >
                                            Clear
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-lg-6 col-sm-12 borderRight">
                                        <h5 className="mb-3">
                                          Day Time Store TAT
                                        </h5>
                                        <div className="row mb-4">
                                          <h6 className="col-lg-4 col-sm-12">
                                            Delivery Time*
                                          </h6>
                                          <div className="col-lg-8 col-sm-12">
                                            <div className="dropdown select-time-dropdown">
                                              <button
                                                className=" dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                disabled={disableContrast()}
                                              >
                                                {dayTimeTat === ""
                                                  ? "Select Time"
                                                  : dayTimeTat?.label}
                                              </button>
                                              <form
                                                action="#"
                                                className="dropdown-menu p-0"
                                              >
                                                {tatTiming.map(
                                                  (time, index) => {
                                                    return (
                                                      <p key={index}>
                                                        <input
                                                          type="radio"
                                                          id={`testDay${index}`}
                                                          name="radio-group"
                                                          onClick={() => {
                                                            setDayTimeTat(time);
                                                          }}
                                                          defaultChecked={
                                                            dayTimeTat?.label ===
                                                            time.label
                                                          }
                                                        />
                                                        <label
                                                          htmlFor={`testDay${index}`}
                                                        >
                                                          {time?.label}
                                                        </label>
                                                      </p>
                                                    );
                                                  }
                                                )}
                                              </form>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-12">
                                        <h5 className="mb-3">
                                          Night Time Store TAT
                                        </h5>
                                        <div className="row mb-4">
                                          <h6 className="col-lg-4 col-sm-12">
                                            Delivery Time*
                                          </h6>
                                          <div className="col-lg-8 col-sm-12">
                                            <div className="dropdown select-time-dropdown">
                                              <button
                                                className=" dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                disabled={disableContrast()}
                                              >
                                                {nightTimeTat === ""
                                                  ? " Select Time"
                                                  : nightTimeTat?.label}
                                              </button>
                                              <form
                                                action="#"
                                                className="dropdown-menu p-0"
                                              >
                                                {tatTiming.map(
                                                  (time, index) => {
                                                    return (
                                                      <p key={index}>
                                                        <input
                                                          type="radio"
                                                          id={`testNight${index}`}
                                                          onClick={() => {
                                                            setNightTimeTat(
                                                              time
                                                            );
                                                          }}
                                                          name="radio-group"
                                                          defaultChecked={
                                                            nightTimeTat?.label ===
                                                            time.label
                                                          }
                                                        />
                                                        <label
                                                          htmlFor={`testNight${index}`}
                                                        >
                                                          {time?.label}
                                                        </label>
                                                      </p>
                                                    );
                                                  }
                                                )}
                                              </form>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="tab-pane" id="holiday">
                                <div className="row store-timing">
                                  <div className="col-lg-4 col-sm-12">
                                    <h6 className="m-0">Select Date</h6>
                                  </div>
                                  <div className="col-lg-8 col-sm-12">
                                    <div className="row justify-content-between gap-3">
                                      <div className="col-lg-5 col-sm-12">
                                        <label className="form-label">
                                          From
                                        </label>
                                        {/* <input type="date" className="form-control date-picker" value={holidayDate && holidayDate[0]}
                                        onChange={(event) => holidayDateChange(0, event)} /> */}
                                        <input
                                          type="date"
                                          className="form-control date-picker"
                                          value={
                                            holidayDate && holidayDate[0]
                                              ? holidayDate[0]
                                              : ""
                                          }
                                          min={
                                            new Date()
                                              .toISOString()
                                              .split("T")[0]
                                          }
                                          onChange={(event) => {
                                            const selectedDate =
                                              event.target.value;
                                            const currentDate = new Date()
                                              .toISOString()
                                              .split("T")[0];
                                            if (selectedDate >= currentDate) {
                                              holidayDateChange(0, event);
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="col-lg-5 col-sm-12">
                                        <label className="form-label">to</label>
                                        <input
                                          type="date"
                                          className="form-control date-picker"
                                          disabled={holidayDate?.length < 1}
                                          value={
                                            holidayDate && holidayDate[1]
                                              ? holidayDate[1]
                                              : ""
                                          }
                                          min={
                                            holidayDate?.length > 0
                                              ? holidayDate[0]
                                              : ""
                                          }
                                          onChange={(event) => {
                                            const selectedDate =
                                              event.target.value;
                                            const currentDate = holidayDate[0];
                                            if (selectedDate >= currentDate) {
                                              holidayDateChange(1, event);
                                            }
                                          }}
                                          //onChange={(event) => holidayDateChange(1, event)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 d-flex justify-content-center mt-4">
                                    <button
                                      className="btn-outline"
                                      disabled={holidayDate?.length === 0}
                                      onClick={() => {
                                        setholidayDate([]);
                                      }}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mt-4 gap-3">
                        <button
                          className="btn btn-md btn-primary"
                          // disabled={
                          //   selectedDays.length === 0 ||
                          //   storeTime.length < 2 ||
                          //   (selectedDays.every(
                          //     (value, index) =>
                          //       value ===
                          //       user_data?.storeTiming?.availability[index]
                          //   ) &&
                          //     storeTime.every(
                          //       (value, index) =>
                          //         value ===
                          //         user_data?.storeTiming?.storeTime[index]
                          //     ) &&
                          //     breakTime.length ===
                          //     user_data?.storeTiming?.breakTime?.length &&
                          //     breakTime.every(
                          //       (value, index) =>
                          //         value ===
                          //         user_data?.storeTiming?.breakTime[index]
                          //     ) &&
                          //     availability === true)
                          // }
                          onClick={() => {
                            updateVendorProfile();
                          }}
                        >
                          {loading && <Spin indicator={antIcon} />}Update
                          Schedule
                        </button>
                        {/* <button className="btn-outline">Cancel</button> */}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="settings-vi">
                    <div className="serviceable-flex">
                      <div className="serviceable-radius-feild">
                        <h1>Store Serviceable Area</h1>
                        <div className="store-serviceable-area">
                          <div className="store-serviceable-flex">
                            <label className="store-serviceable-label">
                              Store Serviceable Radius<span>*</span>
                            </label>
                            <div className="w-100">
                              <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="serviceable-radius"
                              >
                                {" "}
                                {convertServiceableArea(deliveryRadius)}
                                <img
                                  src={DownArrow}
                                  style={{
                                    maxWidth: "14px",
                                    marginLeft: "10px",
                                  }}
                                />
                              </div>
                              <div
                                className={`serviceable-radius-dropdown serviceable-dropdown-${
                                  showDropdown ? "show" : "hide"
                                }`}
                              >
                                <ul className="type serviceable-list">
                                  <li>
                                    <input
                                      type="radio"
                                      id="test1"
                                      defaultChecked={deliveryRadius === 3}
                                      onClick={() => {
                                        setdeliveryRadius(3);
                                        setDeliveryRadiusCharges([
                                          {
                                            "0-3": "20",
                                          },
                                        ]);
                                        setShowDropdown(!showDropdown);
                                      }}
                                      name="radio-group"
                                    />
                                    <label htmlFor="test1"> 0 KM - 3 KMs</label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="test2"
                                      defaultChecked={deliveryRadius === 5}
                                      onClick={() => {
                                        setdeliveryRadius(5);
                                        setDeliveryRadiusCharges([
                                          {
                                            "0-3": "20",
                                          },
                                          {
                                            "3.1-5": "20",
                                          },
                                        ]);
                                        setShowDropdown(!showDropdown);
                                      }}
                                      name="radio-group"
                                    />
                                    <label htmlFor="test2"> 0 KM - 5 KMs</label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div>
                            <hr></hr>
                            <label className="hyperlocal-delivery-label">
                              Hyperlocal Delivery Charges<span>*</span>
                            </label>
                            <br></br>
                            <div className="table-responsive hyperlocal-delivery-table">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Serviceable Radius</th>
                                    <th>Delivery Charges</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th>
                                      <label className="deliveryCharges">
                                        <input
                                          type="radio"
                                          // onClick={() => handleDeliveryCheckboxChange("0-3")}
                                          // disabled
                                          checked={isChecked("0-3")}
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                    </th>
                                    <td>0 KM - 3 KMs</td>
                                    <td>
                                      <div>
                                        <input
                                          type="number"
                                          disabled={!isChecked("0-3")}
                                          value={
                                            deliveryRadiusCharges.find(
                                              (charge) =>
                                                charge.hasOwnProperty("0-3")
                                            )?.["0-3"] || "0"
                                          }
                                          onChange={(e) =>
                                            handleValueChange(
                                              "0-3",
                                              e.target.value
                                            )
                                          }
                                          onKeyPress={(e) => {
                                            // Allow only digits and control characters (like backspace)
                                            if (
                                              !/[0-9]/.test(e.key) &&
                                              e.key !== "Backspace"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          min="0"
                                          max="99"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      <label className="deliveryCharges">
                                        <input
                                          type="radio"
                                          // onClick={() => handleDeliveryCheckboxChange("3.1-5")}
                                          // disabled
                                          checked={isChecked("3.1-5")}
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                    </th>
                                    <td>3.1 KM - 5 KMs</td>
                                    <td>
                                      <div>
                                        <input
                                          type="number"
                                          disabled={!isChecked("3.1-5")}
                                          value={
                                            deliveryRadiusCharges.find(
                                              (charge) =>
                                                charge.hasOwnProperty("3.1-5")
                                            )?.["3.1-5"] || "0"
                                          }
                                          onChange={(e) =>
                                            handleValueChange(
                                              "3.1-5",
                                              e.target.value
                                            )
                                          }
                                          onKeyPress={(e) => {
                                            // Allow only digits and control characters (like backspace)
                                            if (
                                              !/[0-9]/.test(e.key) &&
                                              e.key !== "Backspace"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          min="0"
                                          max="99"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {(user_data?.mainCategory === "F&B" ||
                        user_data?.mainCategory === "Food & Beverage") && (
                        <div style={{ marginLeft: "13px" }}>
                          <h1>Delivery Mode</h1>
                          <div className="deliveryModeInput">
                            <div className="deliveryModeOption">
                              <input
                                type="radio"
                                id="selfDelivery"
                                name="deliveryMode"
                                checked={deliveryMode === "self-delivery"}
                                onClick={() => setdeliveryMode("self-delivery")}
                              />
                              <label htmlFor="selfDelivery">
                                Self Delivery
                              </label>
                            </div>
                            <div className="deliveryModeOption">
                              <input
                                type="radio"
                                id="kikoDelivery"
                                name="deliveryMode"
                                checked={deliveryMode === "on-logistic"}
                                onClick={() => setdeliveryMode("on-logistic")}
                              />
                              <label htmlFor="kikoDelivery">
                                Kiko Delivery
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="store-local-order">
                      <div className="orders-list">
                        <label className="order-title mb-4">
                          Website Orders
                        </label>
                        <div className="d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Free Delivery*
                          </label>
                          <div className="d-flex gap-3 cancellable-btns col-md-6">
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="yes"
                                defaultChecked={websiteFreeDelivery}
                                onClick={() => {
                                  setWebsiteFreeDelivery(true);
                                }}
                                disabled={disableContrast()}
                                name="radio-group1"
                              />
                              <label htmlFor="yes">Yes</label>
                            </div>
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="no"
                                defaultChecked={!websiteFreeDelivery}
                                onClick={() => {
                                  setWebsiteFreeDelivery(false);
                                }}
                                disabled={disableContrast()}
                                name="radio-group1"
                              />
                              <label htmlFor="no">No</label>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Free Delivery on Order Above*
                          </label>
                          <div className="DeliveryCharges">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              className="form-control"
                              maxLength={3}
                              value={
                                websiteFreeDelivery
                                  ? websiteFreeDeliveryMinValue
                                  : 0
                              }
                              disabled={
                                !websiteFreeDelivery || disableContrast()
                              }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (
                                  inputValue === "" ||
                                  Number(inputValue) > 0
                                ) {
                                  setWebsiteFreeDeliveryMinValue(inputValue);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Pan India Delivery*
                          </label>
                          <div className="d-flex gap-3 cancellable-btns col-md-6">
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="panIndia"
                                defaultChecked={websitePanIndiaDelivery}
                                onClick={() => {
                                  setWebsitePanIndiaDelivery(true);
                                }}
                                disabled={disableContrast()}
                                name="radio-group2"
                              />
                              <label htmlFor="panIndia">Yes</label>
                            </div>
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="panIndiaNo"
                                defaultChecked={!websitePanIndiaDelivery}
                                onClick={() => {
                                  setWebsitePanIndiaDelivery(false);
                                }}
                                disabled={disableContrast()}
                                name="radio-group2"
                              />
                              <label htmlFor="panIndiaNo">No</label>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Pan India Delivery Charges*
                          </label>
                          <div className="DeliveryCharges">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              className="form-control"
                              maxLength={3}
                              value={
                                !websiteFreeDelivery && websitePanIndiaDelivery
                                  ? websiteDeliveryAmount
                                  : 0
                              }
                              disabled={
                                (websiteFreeDelivery &&
                                  !websitePanIndiaDelivery) ||
                                disableContrast()
                              }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (
                                  inputValue === "" ||
                                  Number(inputValue) > 0
                                ) {
                                  setWebsiteDeliveryAmount(inputValue);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="orders-list">
                        <label className="order-title mb-4">Ondc Orders</label>
                        <div className=" d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Free Delivery*
                          </label>
                          <div className="d-flex gap-3 cancellable-btns col-md-6">
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="ondcYes"
                                checked={ondcFreeDelivery === true}
                                onClick={() => {
                                  setOndcFreeDelivery(true);
                                }}
                                disabled={disableContrast()}
                                name="radio-group3"
                              />
                              <label htmlFor="ondcYes">Yes</label>
                            </div>
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="ondcNo"
                                checked={ondcFreeDelivery === false}
                                onClick={() => {
                                  setOndcFreeDelivery(false);
                                }}
                                disabled={disableContrast()}
                                name="radio-group3"
                              />
                              <label htmlFor="ondcNo">No</label>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Free Delivery on Order Above*
                          </label>
                          <div className="DeliveryCharges">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              className="form-control"
                              maxLength={3}
                              value={
                                ondcFreeDelivery ? ondcFreeDeliveryMinValue : 1
                              }
                              disabled={!ondcFreeDelivery || disableContrast()}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (
                                  inputValue === "" ||
                                  Number(inputValue) > 0
                                ) {
                                  setOndcFreeDeliveryMinValue(inputValue);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className=" d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Pan India Delivery*
                          </label>
                          <div className="d-flex gap-3 cancellable-btns col-md-6">
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="ondcPanIndia"
                                defaultChecked={ondcPanIndiaDelivery}
                                onClick={() => {
                                  setOndcPanIndiaDelivery(true);
                                }}
                                disabled={disableContrast()}
                                name="radio-group4"
                              />
                              <label htmlFor="ondcPanIndia">Yes</label>
                            </div>
                            <div className="Cancellable">
                              <input
                                type="radio"
                                id="noOndcPanIndia"
                                defaultChecked={!ondcPanIndiaDelivery}
                                onClick={() => {
                                  setOndcPanIndiaDelivery(false);
                                }}
                                disabled={disableContrast()}
                                name="radio-group4"
                              />
                              <label htmlFor="noOndcPanIndia">No</label>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between mb-3 align-items-center flex-wrap">
                          <label style={{ maxWidth: "152px" }}>
                            Pan India Delivery Charges*
                          </label>
                          <div className="DeliveryCharges">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              className="form-control"
                              maxLength={3}
                              value={
                                ondcPanIndiaDelivery ? ondcDeliveryAmount : 0
                              }
                              disabled={
                                !ondcPanIndiaDelivery || disableContrast()
                              }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (
                                  inputValue === "" ||
                                  Number(inputValue) > 0
                                ) {
                                  setOndcDeliveryAmount(inputValue);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                      <button
                        className="btn btn-md btn-primary"
                        onClick={() => {
                          updateVendorProfile();
                        }}
                        disabled={!deliveryRadius}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <div className="tab-pane" id="Additional-v">
                    <h1>Additional Details</h1>

                    <div className="detailsForm">
                      <ul className="list-unstyled">
                        {process.env.REACT_APP_ONDC_APP_KIKO_API_V2 ===
                          "https://ondc-api.kiko.live/ondc-seller-v2" && (
                          <li>
                            <span>Minimum Order Value</span>
                            <input
                              type="text"
                              pattern="[0-9]*"
                              inputMode="numeric"
                              maxLength="10"
                              placeholder="Minimum Order Value"
                              value={minimumOrderValue}
                              className="w-100"
                              onChange={(e) => {
                                const enteredValue = e.target.value;
                                if (/^\d*$/.test(enteredValue)) {
                                  setMinimumOrderValue(enteredValue);
                                }
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <input
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            maxLength="10"
                            placeholder="Whatsapp Number"
                            value={whatsApp}
                            className="w-100"
                            onChange={(e) => {
                              const enteredValue = e.target.value;
                              if (/^\d*$/.test(enteredValue)) {
                                setWhatsApp(enteredValue);
                              }
                            }}
                          />
                        </li>
                        <li>
                          <textarea
                            className="pt-2 description"
                            placeholder="Tell us about your shop"
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            maxLength={300}
                          />
                        </li>
                        <span>Store Link</span>
                        <li className="additionaldetail">
                          {editUrl !== "slug" && (
                            <div className="CopyUrl">
                              <p className="m-0">
                                shops.kiko.live/<span>{slug}</span>
                              </p>
                            </div>
                          )}
                          {editUrl === "slug" && (
                            <div className="CopyUrl">
                              <p className="m-0">
                                shops.kiko.live/
                                <input
                                  type="text"
                                  placeholder=""
                                  value={slug}
                                  onChange={(e) => {
                                    setHasSpecialChars(false);
                                    seturlChecked(false);
                                    setSlugNotify("");
                                    const inputText = e.target.value;
                                    const hasSpecialChars =
                                      /[*+~.()',|_%$&#;?/"=[\]\\{}<>`^!:@]/g.test(
                                        inputText
                                      );
                                    if (!hasSpecialChars) {
                                      setSlug(inputText);
                                    }
                                    setHasSpecialChars(hasSpecialChars);
                                  }}
                                />
                              </p>
                            </div>
                          )}
                          <div className="additional-details-btn">
                            {editUrl !== "slug" && (
                              <>
                                <CopyToClipboard
                                  text={`https://shops.kiko.live/${slug}`}
                                >
                                  <button
                                    className="btn btn-xs btn-primary"
                                    onClick={() => {
                                      notify("success", "Copied");
                                    }}
                                  >
                                    <Edit className="me-1" />
                                    Copy
                                  </button>
                                </CopyToClipboard>
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={() => {
                                    setEditUrl("slug");
                                  }}
                                >
                                  <Copy className="me-1" />
                                  Edit
                                </button>
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={() => {
                                    setValue(`https://shops.kiko.live/${slug}`);
                                    setQrPopUp(true);
                                  }}
                                >
                                  <ScannerIcon className="me-1" /> Scan
                                </button>
                              </>
                            )}
                            {editUrl === "slug" && (
                              <button
                                className="btn btn-sm btn-primary"
                                disabled={user_data?.slug === slug}
                                onClick={() => {
                                  checkSlug();
                                }}
                              >
                                {slugloading && <Spin indicator={antIcon} />}
                                Check URL
                              </button>
                            )}
                          </div>
                        </li>
                        <br />
                        {userData?.ondcVerified && (
                          <>
                            <span>
                              {userData?.mainCategory === "Food & Beverage" ||
                              userData?.mainCategory === "F&B"
                                ? "Tabe ONDC Link"
                                : "Kiko ONDC Link"}
                            </span>
                            <li className="additionaldetail">
                              {editUrl !== "slug" && (
                                <div className="CopyUrlNotEdit">
                                  <p className="m-0">
                                    {userData?.mainCategory ===
                                      "Food & Beverage" ||
                                    userData?.mainCategory === "F&B"
                                      ? `tabe.in/share-restaurant/${
                                          userData?._id
                                        }+${userData?.storeName?.replace(
                                          /\s+/g,
                                          "-"
                                        )}`
                                      : `kikoshop.in/seller?pid=${userData?._id}`}
                                  </p>
                                </div>
                              )}
                              <div className="additional-details-btn">
                                {editUrl !== "slug" && (
                                  <>
                                    <CopyToClipboard
                                      text={`${
                                        userData?.mainCategory ===
                                          "Food & Beverage" ||
                                        userData?.mainCategory === "F&B"
                                          ? `https://tabe.in/share-restaurant/${
                                              userData?._id
                                            }+${userData?.storeName?.replace(
                                              /\s+/g,
                                              "-"
                                            )}`
                                          : `https://kikoshop.in/seller?pid=${userData?._id}`
                                      }`}
                                    >
                                      <button
                                        className="btn btn-xs btn-primary"
                                        onClick={() => {
                                          notify("success", "Copied");
                                        }}
                                      >
                                        <Edit className="me-1" />
                                        Copy
                                      </button>
                                    </CopyToClipboard>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setValue(
                                          userData?.mainCategory ===
                                            "Food & Beverage" ||
                                            userData?.mainCategory === "F&B"
                                            ? `https://tabe.in/share-restaurant/${
                                                userData?._id
                                              }+${userData?.storeName?.replace(
                                                /\s+/g,
                                                "-"
                                              )}`
                                            : `https://kikoshop.in/seller?pid=${userData?._id}`
                                        );
                                        setQrPopUp(true);
                                      }}
                                    >
                                      <ScannerIcon className="me-1" /> Scan
                                    </button>
                                  </>
                                )}
                              </div>
                            </li>
                            <br />
                            <span>Digihaat Link</span>
                            <li className="additionaldetail">
                              {editUrl !== "digihaat" && (
                                <div className="CopyUrl">
                                  <p className="m-0">
                                    {(
                                      buyerAppLink?.find(
                                        (item) => item.key === "digihaat"
                                      )?.value ||
                                      (() => {
                                        const domain =
                                          userData?.mainCategory ===
                                            "Food & Beverage" ||
                                          userData?.mainCategory === "F&B"
                                            ? "ONDC:RET11"
                                            : userData?.mainCategory ===
                                              "Grocery"
                                            ? "ONDC:RET10"
                                            : "ondc:default";
                                        const providerId = userData?._id || "";
                                        return `https://digihaat.in/store?domain=${domain}&provider_id=${providerId}&bpp_id=ondc.kiko.live/ondc-seller`;
                                      })()
                                    ).replace(/"/g, "")}
                                  </p>
                                </div>
                              )}
                              {/* {editUrl === "digihaat" && (
                              <div className="CopyUrl">
                              <p className="m-0">
                              <input
                              type="text"
                              placeholder=""
                              value={
                                buyerAppLink?.find((item) => item.key === "digihaat")?.value ||
                              (() => {
                              const domain =  userData?.mainCategory === "Food & Beverage"
                              ? "ONDC:RET11"
                              : userData?.mainCategory === "Grocery"
                              ? "ONDC:RET10"
                              : "ondc:default"; // fallback
                              const providerId = userData?._id || "";
                              return `https://digihaat.in/store?domain=${domain}&provider_id=${providerId}&bpp_id=ondc.kiko.live/ondc-seller`;
                            })()
                            }
                            onChange={(e) => {
                            const newValue = e.target.value;
                            const updatedBuyerAppLink = buyerAppLink.map((item) => {
                            if (item.key === "digihaat") {
                            return {
                            ...item,
                            value: newValue,
                            };
                            }
                            return item;
                            });
                            if (
                            !updatedBuyerAppLink.some((item) => item.key === "digihaat")
                            ) {
                             updatedBuyerAppLink.push({
                            key: "digihaat",
                            value: newValue,
                            });
                            }
                            setBuyerAppLink(updatedBuyerAppLink);
                            }}
                            />
                            </p>
                            </div>
                            )} */}
                              {editUrl === "digihaat" && (
                                <div className="CopyUrl">
                                  <p className="m-0">
                                    <input
                                      type="text"
                                      value={digihaatUrl?.replace(/"/g, "")}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        setDigihaatUrl(newValue); // local update

                                        const exists = buyerAppLink?.some(
                                          (item) => item.key === "digihaat"
                                        );
                                        const updatedBuyerAppLink = exists
                                          ? buyerAppLink.map((item) =>
                                              item.key === "digihaat"
                                                ? { ...item, value: newValue }
                                                : item
                                            )
                                          : [
                                              ...buyerAppLink,
                                              {
                                                key: "digihaat",
                                                value: newValue,
                                              },
                                            ];

                                        setBuyerAppLink(updatedBuyerAppLink); // global update
                                      }}
                                    />
                                  </p>
                                </div>
                              )}
                              <div className="additional-details-btn">
                                {editUrl !== "digihaat" && (
                                  <>
                                    <CopyToClipboard
                                      text={(
                                        buyerAppLink?.find(
                                          (item) => item.key === "digihaat"
                                        )?.value || digihaatUrl
                                      ).replace(/"/g, "")}
                                    >
                                      <button
                                        className="btn btn-xs btn-primary"
                                        onClick={() => {
                                          notify("success", "Copied");
                                        }}
                                      >
                                        <Edit className="me-1" />
                                        Copy
                                      </button>
                                    </CopyToClipboard>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setEditUrl("digihaat");
                                      }}
                                    >
                                      <Copy className="me-1" />
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setValue(
                                          buyerAppLink?.find(
                                            (item) => item.key === "digihaat"
                                          )?.value || "-"
                                        );
                                        setQrPopUp(true);
                                      }}
                                    >
                                      <ScannerIcon className="me-1" /> Scan
                                    </button>
                                  </>
                                )}
                              </div>
                            </li>
                            <br />
                            {/* <span>PayTM Link</span>
                            <li className="additionaldetail">
                              {editUrl !== "paytm" && (
                                <div className="CopyUrl">
                                  <p className="m-0">
                                    {
                                      buyerAppLink?.find(
                                        (item) => item.key === "paytm"
                                      )?.value
                                    }
                                  </p>
                                </div>
                              )}
                              {editUrl === "paytm" && (
                                <div className="CopyUrl">
                                  <p className="m-0">
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={
                                        buyerAppLink?.find(
                                          (item) => item.key === "paytm"
                                        )?.value
                                      }
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedBuyerAppLink =
                                          buyerAppLink.map((item) => {
                                            if (item.key === "paytm") {
                                              return {
                                                ...item,
                                                value: newValue,
                                              };
                                            }
                                            return item;
                                          });
                                        if (
                                          !updatedBuyerAppLink.some(
                                            (item) => item.key === "paytm"
                                          )
                                        ) {
                                          updatedBuyerAppLink.push({
                                            key: "paytm",
                                            value: newValue,
                                          });
                                        }
                                        setBuyerAppLink(updatedBuyerAppLink);
                                      }}
                                    />
                                  </p>
                                </div>
                              )}
                              <div className="additional-details-btn">
                                {editUrl !== "paytm" && (
                                  <>
                                    <CopyToClipboard
                                      text={
                                        buyerAppLink?.find(
                                          (item) => item.key === "paytm"
                                        )?.value || "-"
                                      }
                                    >
                                      <button
                                        className="btn btn-xs btn-primary"
                                        onClick={() => {
                                          notify("success", "Copied");
                                        }}
                                      >
                                        <Edit className="me-1" />
                                        Copy
                                      </button>
                                    </CopyToClipboard>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setEditUrl("paytm");
                                      }}
                                    >
                                      <Copy className="me-1" />
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setValue(
                                          buyerAppLink?.find(
                                            (item) => item.key === "paytm"
                                          )?.value || "-"
                                        );
                                        setQrPopUp(true);
                                      }}
                                    >
                                      <ScannerIcon className="me-1" /> Scan
                                    </button>
                                  </>
                                )}
                              </div>
                            </li>
                            <br /> */}
                            {/* <span>Mystore Link</span>
                            <li className="additionaldetail">
                              {editUrl !== "mystore" && (
                                <div className="CopyUrl">
                                  <p className="m-0">
                                    {
                                      buyerAppLink?.find(
                                        (item) => item.key === "mystore"
                                      )?.value
                                    }
                                  </p>
                                </div>
                              )}
                              {editUrl === "mystore" && (
                                <div className="CopyUrl">
                                  <p className="m-0">
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={
                                        buyerAppLink?.find(
                                          (item) => item.key === "mystore"
                                        )?.value
                                      }
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedBuyerAppLink =
                                          buyerAppLink?.map((item) => {
                                            if (item.key === "mystore") {
                                              return {
                                                ...item,
                                                value: newValue,
                                              };
                                            }
                                            return item;
                                          });
                                        if (
                                          !updatedBuyerAppLink.some(
                                            (item) => item.key === "mystore"
                                          )
                                        ) {
                                          updatedBuyerAppLink.push({
                                            key: "mystore",
                                            value: newValue,
                                          });
                                        }
                                        setBuyerAppLink(updatedBuyerAppLink);
                                      }}
                                    />
                                  </p>
                                </div>
                              )}
                              <div className="additional-details-btn">
                                {editUrl !== "mystore" && (
                                  <>
                                    <CopyToClipboard
                                      text={
                                        buyerAppLink?.find(
                                          (item) => item.key === "mystore"
                                        )?.value || "-"
                                      }
                                    >
                                      <button
                                        className="btn btn-xs btn-primary"
                                        onClick={() => {
                                          notify("success", "Copied");
                                        }}
                                      >
                                        <Edit className="me-1" />
                                        Copy
                                      </button>
                                    </CopyToClipboard>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setEditUrl("mystore");
                                      }}
                                    >
                                      <Copy className="me-1" />
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-xs btn-outline"
                                      onClick={() => {
                                        setValue(
                                          buyerAppLink?.find(
                                            (item) => item.key === "mystore"
                                          )?.value || "-"
                                        );
                                        setQrPopUp(true);
                                      }}
                                    >
                                      <ScannerIcon className="me-1" /> Scan
                                    </button>
                                  </>
                                )}
                              </div>
                            </li> */}
                          </>
                        )}
                        {slugNotify !== "" && (
                          <p className={slugExist ? "error" : "green"}>
                            {slugNotify}
                          </p>
                        )}
                        {hasSpecialChars && (
                          <p className="error">
                            Please enter URL excluding *+~.()'"!:@ characters
                          </p>
                        )}
                      </ul>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                      <button
                        className="btn btn-md btn-primary"
                        disabled={
                          user_data?.description === description &&
                          user_data?.whatsAppNumber === whatsApp &&
                          user_data?.slug === slug &&
                          user_data?.buyerAppLink === buyerAppLink &&
                          user_data?.minimumOrderValue === minimumOrderValue
                        }
                        onClick={() => {
                          whatsApp && whatsApp?.length < 10
                            ? notify("error", "Please Enter Valid Number")
                            : updateVendorProfile();
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <div className="tab-pane" id="Coupon-v">
                    <div className="add-coupons-flex">
                      <h3>Coupons List</h3>
                      <button
                        className="btn"
                        onClick={() => {
                          setCouponDetails("CreateCoupon");
                          setCoupoun((prevState) => ({
                            ...prevState,
                            userId: user_data?._id,
                          }));
                        }}
                      >
                        + ADD COUPON
                      </button>
                      <Modal
                        isOpen={CouponDetails === "" ? false : true}
                        aria-labelledby="contained-modal-title-vcenter"
                        toggle={() => {
                          setCouponDetails("");
                          couponReset();
                          setSubmitCoupoun(false);
                          setSelectedItem([]);
                        }}
                        centered
                        size="lg"
                      >
                        <div className="container pb-3 pt-3">
                          <p className="coupons-main-heading">
                            <span className="CouponsActive">Coupons</span>{" "}
                            <img
                              src={RightArrow}
                              alt=""
                              style={{ maxWidth: "12px" }}
                            />{" "}
                            {CouponDetails == "CreateCoupon" ? (
                              <span>Create</span>
                            ) : (
                              <span>Edit</span>
                            )}
                          </p>
                          <div className="coupon-details-form">
                            <h6>COUPON DETAILS</h6>
                            <div className="row">
                              <div className="col-lg-12 mb-4">
                                <label
                                  className="form-label"
                                  style={{ display: "block" }}
                                >
                                  Coupon Image*
                                </label>

                                {submitCoupoun &&
                                  coupoun?.images?.length === 0 && (
                                    <p className="error">Required*</p>
                                  )}
                                {coupoun.images?.length > 0 && (
                                  <>
                                    <div className="coupon-img">
                                      <img
                                        src={coupoun?.images[0]}
                                        width={"80px"}
                                        height={"50px"}
                                        alt=""
                                      />
                                      <div className="cross-icon">
                                        <img
                                          onClick={() => {
                                            setCoupoun((prevState) => ({
                                              ...prevState,
                                              images: [],
                                            }));
                                          }}
                                          src="/static/media/image-cross.59040358984eec18fe4280cfcce717a8.svg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                <button
                                  className="btn btn-md btn-primary p-0 uploadBtn"
                                  disabled={coupoun.images?.length > 0}
                                  onClick={async () => {
                                    if (window && window.flutter_inappwebview) {
                                      const tempV =
                                        await flutterfetchCameraPermission();
                                      if (!tempV) {
                                        setPermissionAlertPopUp({
                                          permission: true,
                                          type: "cameraPermission",
                                        });
                                      } else {
                                        const input =
                                          document.createElement("input");
                                        input.type = "file";
                                        input.onchange = async (e) => {
                                          addUpdateImage(
                                            e.target.files[0],
                                            "coupon"
                                          );
                                        };
                                        input.click();
                                      }
                                    } else {
                                      const input =
                                        document.createElement("input");
                                      input.type = "file";
                                      input.onchange = async (e) => {
                                        addUpdateImage(
                                          e.target.files[0],
                                          "coupon"
                                        );
                                      };
                                      input.click();
                                    }
                                  }}
                                >
                                  {isDisable && isSpin === "coupon" ? (
                                    <Space
                                      size="middle"
                                      className="Loader"
                                      style={{ left: "10px", top: "8px" }}
                                    >
                                      <div>
                                        {" "}
                                        <Spin
                                          size="medium"
                                          className="spiner"
                                        />
                                      </div>
                                    </Space>
                                  ) : (
                                    ""
                                  )}
                                  <p className="upload-img">Upload Image</p>
                                </button>
                              </div>
                            </div>
                            <div className="row">
                              <h5>DISCOUNT DETAILS</h5>
                              <div className="col-lg-12 mb-2">
                                <div className="mb-2">
                                  <label>Discount Type*</label>
                                  <div className="discount-Type">
                                    <div className="radio">
                                      <input
                                        id="radio-1"
                                        name="radio"
                                        type="radio"
                                        defaultChecked={
                                          coupoun.offerType === "disc_amt"
                                        }
                                        onClick={() => {
                                          setCoupoun((prevState) => ({
                                            ...prevState,
                                            offerType: "disc_amt",
                                          }));
                                          setCoupoun((prevState) => ({
                                            ...prevState,
                                            offerBenefit: {
                                              ...prevState.offerBenefit,
                                              valueType: "amount",
                                            },
                                          }));
                                        }}
                                      />
                                      <label
                                        htmlFor="radio-1"
                                        className="radio-label"
                                      >
                                        Flat
                                      </label>
                                    </div>
                                    <div className="radio">
                                      <input
                                        id="radio-2"
                                        name="radio"
                                        type="radio"
                                        defaultChecked={
                                          coupoun.offerType === "disc_pct"
                                        }
                                        onClick={() => {
                                          setCoupoun((prevState) => ({
                                            ...prevState,
                                            offerType: "disc_pct",
                                          }));
                                          setCoupoun((prevState) => ({
                                            ...prevState,
                                            offerBenefit: {
                                              ...prevState.offerBenefit,
                                              valueType: "percent",
                                            },
                                          }));
                                        }}
                                      />
                                      <label
                                        htmlFor="radio-2"
                                        className="radio-label"
                                      >
                                        Percentage
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                {submitCoupoun && coupoun?.offerType === "" && (
                                  <p className="error" style={{ color: "red" }}>
                                    Required*
                                  </p>
                                )}
                              </div>
                            </div>
                            <form className="form">
                              <div className="row">
                                <div className="col-lg-6 mb-3">
                                  <label>Coupon Code*</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Eg-DEAL50"
                                    value={coupoun?.offerId}
                                    onChange={(e) => {
                                      const value = e.target.value
                                        .replace(/[^a-zA-Z0-9]/g, "")
                                        .toUpperCase();
                                      setCoupoun((prevState) => ({
                                        ...prevState,
                                        offerId: value,
                                      }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                  {submitCoupoun && coupoun?.offerId === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                  <span>
                                    Coupon Code that users will enter during
                                    checkout(16 characters)
                                  </span>
                                </div>
                                <div className="col-lg-6 mb-3">
                                  <label>Min Order Amount*</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={coupoun.offerQualifiers.minValue}
                                    onChange={(e) => {
                                      const newValue = e.target.value.trim();
                                      if (
                                        newValue === "" ||
                                        Number(newValue) > 0
                                      ) {
                                        setCoupoun((prevState) => ({
                                          ...prevState,
                                          offerQualifiers: {
                                            ...prevState.offerQualifiers,
                                            minValue: newValue,
                                          },
                                        }));
                                      }
                                    }}
                                  />
                                  {submitCoupoun &&
                                    coupoun?.offerQualifiers.minValue ===
                                      "" && (
                                      <p
                                        className="error"
                                        style={{ color: "red" }}
                                      >
                                        Required*
                                      </p>
                                    )}
                                  <span>
                                    Type minimum order amount to be eligible for
                                    the discount.
                                  </span>
                                </div>
                                <div className="Extras-list pb-0">
                                  <div className="row">
                                    <div className="col-lg-6 mb-3">
                                      <label
                                        className="form-label"
                                        style={{ display: "block" }}
                                      >
                                        {" "}
                                        Enter your Percent/Amount value*
                                      </label>
                                      <input
                                        type="text"
                                        value={coupoun.offerBenefit.value}
                                        onChange={(e) => {
                                          const newValue =
                                            e.target.value.trim();
                                          if (
                                            newValue === "" ||
                                            Number(newValue) > 0
                                          ) {
                                            setCoupoun((prevState) => ({
                                              ...prevState,
                                              offerBenefit: {
                                                ...prevState.offerBenefit,
                                                value: newValue,
                                              },
                                            }));
                                          }
                                        }}
                                      />

                                      {submitCoupoun &&
                                        coupoun?.offerBenefit.value === "" && (
                                          <p
                                            className="error"
                                            style={{ color: "red" }}
                                          >
                                            Required*
                                          </p>
                                        )}
                                      <span>
                                        Type Percent/Amount value to be eligible
                                        for the discount.
                                      </span>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                      <label
                                        className="form-label"
                                        style={{ display: "block" }}
                                      >
                                        {" "}
                                        Offer Apply Upto*
                                      </label>
                                      <input
                                        type="text"
                                        value={coupoun.offerBenefit.valueCap}
                                        onChange={(e) => {
                                          const newValue =
                                            e.target.value.trim();
                                          if (
                                            newValue === "" ||
                                            Number(newValue) > 0
                                          ) {
                                            setCoupoun((prevState) => ({
                                              ...prevState,
                                              offerBenefit: {
                                                ...prevState.offerBenefit,
                                                valueCap: newValue,
                                              },
                                            }));
                                          }
                                        }}
                                      />
                                      {submitCoupoun &&
                                        coupoun?.offerBenefit.valueCap ===
                                          "" && (
                                          <p
                                            className="error"
                                            style={{ color: "red" }}
                                          >
                                            Required*
                                          </p>
                                        )}
                                      <span>
                                        Type maximum order amount to be eligible
                                        for the discount.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6  mb-3">
                                  <label>Description*</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={coupoun?.description}
                                    onChange={(e) => {
                                      setCoupoun((prevState) => ({
                                        ...prevState,
                                        description: e.target.value,
                                      }));
                                    }}
                                    placeholder="Eg- Get upto 20% off pn 1499 and above. Max discount 1200. Describe the coupon briefly, it wil be visible to Customers"
                                  />
                                  {submitCoupoun &&
                                    coupoun?.description === "" && (
                                      <p className="error">Required*</p>
                                    )}
                                  <span>
                                    Describe the coupon briefly, it will be
                                    visible to Customers
                                  </span>
                                </div>
                                <div className="col-lg-6 mb-3">
                                  <label>Expiry Date*</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    min={getTodayDateString()}
                                    value={coupoun?.expiry_date}
                                    onChange={(e) => {
                                      setCoupoun((prevState) => ({
                                        ...prevState,
                                        expiry_date: e.target.value,
                                      }));
                                    }}
                                  />
                                  {submitCoupoun &&
                                    coupoun?.expiry_date === "" && (
                                      <p className="error">Required*</p>
                                    )}
                                  <span>
                                    No expiry date if you keep it empty
                                  </span>
                                </div>
                              </div>
                            </form>
                            <div className="switchBtn">
                              <label
                                className="form-label"
                                style={{ display: "block" }}
                              >
                                Apply For All{""}
                              </label>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  defaultChecked={coupoun.applicableForAll}
                                  onChange={() => {
                                    setCoupoun((prevState) => ({
                                      ...prevState,
                                      applicableForAll:
                                        !prevState.applicableForAll,
                                    }));
                                  }}
                                />
                                <span className="slider round"></span>
                              </label>
                            </div>

                            {!coupoun.applicableForAll && (
                              <div className="row">
                                <div className="col-lg-6 mb-3">
                                  <label
                                    className="form-label"
                                    style={{ display: "block" }}
                                  >
                                    Applies To*:-{" "}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter Catelogue"
                                    value={search}
                                    onChange={(e) => {
                                      searchUserdebouncer(e.target.value);
                                      setSearch(e.target.value);
                                    }}
                                    className="bonus-search select_style"
                                  />
                                  <div className="search-listing-container">
                                    <ul>
                                      {search !== "" &&
                                        searchCatelogueData.map(
                                          (catelogueData) => {
                                            return (
                                              <li
                                                key={get(catelogueData, "_id")}
                                                className="search--list"
                                              >
                                                <span
                                                  onClick={() => {
                                                    setSelectedItem(
                                                      (prevItems) => {
                                                        if (
                                                          !prevItems?.find(
                                                            (item) =>
                                                              item._id ===
                                                              catelogueData._id
                                                          )
                                                        ) {
                                                          return [
                                                            ...prevItems,
                                                            catelogueData,
                                                          ];
                                                        }
                                                        return prevItems;
                                                      }
                                                    );

                                                    setCoupoun((prevState) => {
                                                      if (
                                                        !prevState.applicability.items.includes(
                                                          catelogueData._id
                                                        )
                                                      ) {
                                                        return {
                                                          ...prevState,
                                                          applicability: {
                                                            ...prevState.applicability,
                                                            items: [
                                                              ...prevState
                                                                .applicability
                                                                .items,
                                                              catelogueData._id,
                                                            ],
                                                          },
                                                        };
                                                      }
                                                      return prevState;
                                                    });
                                                    setSearch("");
                                                  }}
                                                >
                                                  {get(
                                                    catelogueData,
                                                    "productName",
                                                    ""
                                                  )}
                                                  {" (" +
                                                    get(
                                                      catelogueData,
                                                      "categoryId",
                                                      ""
                                                    ) +
                                                    ")"}
                                                  {" (" +
                                                    get(
                                                      catelogueData,
                                                      "subCategoryId",
                                                      ""
                                                    ) +
                                                    ")"}
                                                </span>
                                              </li>
                                            );
                                          }
                                        )}
                                    </ul>
                                  </div>
                                  {submitCoupoun &&
                                    coupoun?.applicability?.items?.length ===
                                      0 && (
                                      <p
                                        className="error"
                                        style={{ color: "red" }}
                                      >
                                        Required*
                                      </p>
                                    )}
                                </div>
                                {selectedItem?.length > 0 && (
                                  <div className="col-lg-6 mb-3">
                                    <label>Selected Catelogue</label>
                                    <ul className="Selected-Catelogue-list">
                                      {selectedItem.map(
                                        (catelogueData, index) => {
                                          const catelogueId = get(
                                            catelogueData,
                                            "_id",
                                            ""
                                          );
                                          const handleDelete = () => {
                                            setSelectedItem((prevItems) =>
                                              prevItems.filter(
                                                (_, i) => i !== index
                                              )
                                            );
                                            setCoupoun((prevState) => ({
                                              ...prevState,
                                              applicability: {
                                                ...prevState.applicability,
                                                items:
                                                  prevState.applicability.items.filter(
                                                    (id) => id !== catelogueId
                                                  ),
                                              },
                                            }));
                                          };
                                          return (
                                            <li key={get(catelogueData, "_id")}>
                                              <span>
                                                {get(
                                                  catelogueData,
                                                  "productName",
                                                  ""
                                                )}
                                                {" (" +
                                                  get(
                                                    catelogueData,
                                                    "categoryId",
                                                    ""
                                                  ) +
                                                  ")"}
                                                {" (" +
                                                  get(
                                                    catelogueData,
                                                    "subCategoryId",
                                                    ""
                                                  ) +
                                                  ")"}
                                              </span>{" "}
                                              <button
                                                className="btn"
                                                onClick={handleDelete}
                                              >
                                                <img
                                                  src="/static/media/delete-icon.5075a7b985282e54a4b8530f463a4aa0.svg"
                                                  alt=""
                                                />
                                              </button>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="d-flex justify-content-end align-item-center">
                              <button
                                className="btn btn-outline me-2 btn-sm"
                                onClick={() => {
                                  setCouponDetails("");
                                  setSubmitCoupoun(false);
                                  couponReset();
                                  setSelectedItem([]);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  createCoupoun();
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>
                    {couponLoading ? (
                      <Spin indicator={antIcon} className="loader" />
                    ) : (
                      <div className="table-responsive">
                        <table className="table coupons-table">
                          <thead>
                            <tr>
                              <th scope="col">Sr No.</th>
                              <th scope="col">Offer Id</th>
                              <th scope="col">Offer Type</th>
                              <th scope="col">Status</th>
                              <th scope="col">Description</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coupounData.map((coupon, index) => {
                              return (
                                <tr key={index}>
                                  <th scope="row">{index + 1}</th>
                                  <td>{get(coupon, "offerId")}</td>
                                  <td>{get(coupon, "offerType")}</td>
                                  <td>{get(coupon, "status")}</td>
                                  <td>{get(coupon, "description")}</td>
                                  <td>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                      <button
                                        onClick={() => {
                                          setCouponDetails("EditCoupon");
                                          setCoupoun(coupon);
                                          couponCatelog(coupon);
                                        }}
                                        className="btn btn-primary btn-xs"
                                      >
                                        Edit
                                      </button>{" "}
                                      <button
                                        onClick={() => {
                                          deleteCoupoun(coupon);
                                        }}
                                        className="btn btn-outline btn-xs"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  {/* <div className="tab-pane" id="Subscription-v"> */}
                  <div
                    className={`tab-pane ${
                      activeTab === "#Subscription-v" ? "active" : ""
                    }`}
                    id="Subscription-v"
                  >
                    <div className="subscription-content">
                      <div className="recharged-renewal-container">
                        <h2>Subscriptions</h2>
                        {isSubscribed && (
                          <div className="recharged-renewal-list">
                            <div className="recharged-renewal-item">
                              <strong>Last Recharged On:</strong>{" "}
                              {moment
                                .utc(user_data?.subscriptionId?.startDate)
                                .format("DD/MM/YYYY")}
                            </div>
                            <div className="recharged-renewal-item divider">
                              |
                            </div>
                            <div className="recharged-renewal-item">
                              <strong>Renewal Date:</strong>{" "}
                              {moment
                                .utc(user_data?.subscriptionId?.endDate)
                                .format("DD/MM/YYYY")}
                            </div>
                          </div>
                        )}
                      </div>

                      <br />

                      <p>
                        Choose from Standard or Premium plans. Both include
                        store visibility on the ONDC network, cataloging, and
                        order operations support. The Premium plan adds
                        promotional activities and on-ground team support to
                        boost your business.
                      </p>
                      {!isSubscribed && !isOndcVerified ? (
                        <div className="subscription-options">
                          {/* <div className="subscription-option">
                            <div className="subscription-content-block">
                              <div className="left-pricing-block">
                                <h2>Standard</h2>
                                <p style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "30px" }}>
                                  ₹299</p>
                                <p style={{ fontSize: "12px" }}>
                                  First month Free
                                </p>
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleSubscription(299, "Standard")
                                  }
                                >
                                  Subscribe
                                </button>
                              </div>
                              <div className="right-pricing-details">
                                <ul>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Store Visibility on the ONDC Network
                                  </li>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Cataloging Support
                                  </li>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Order Operations Support
                                  </li>
                                  <li>
                                    <CloseCircleFilled className="me-2 red-cross" />
                                    Promotional activities - banners, leaflets,
                                    standees
                                  </li>
                                  <li>
                                    <CloseCircleFilled className="me-2 red-cross" />
                                    On-ground team support
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div> */}

                          <div className="subscription-option">
                            <div className="subscription-content-block">
                              <div className="left-pricing-block">
                                <h2>Premium</h2>
                                <p
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "30px",
                                  }}
                                >
                                  ₹2999{" "}
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "#888",
                                      fontSize: "20px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ₹6000
                                  </span>
                                </p>
                                <span className="save-text">
                                  {" "}
                                  Save up to 50%, One Year Plan{" "}
                                </span>
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleSubscription(
                                      2999,
                                      "Premium",
                                      "OneYear"
                                    )
                                  }
                                >
                                  Subscribe
                                </button>
                              </div>
                              <div className="right-pricing-details">
                                <ul>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Store Visibility on the ONDC Network
                                  </li>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Cataloging Support
                                  </li>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Order Operations Support
                                  </li>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    Promotional activities - banners, leaflets,
                                    standees
                                  </li>
                                  <li>
                                    <CheckCircleFilled className="me-2 green-check" />
                                    On-ground team support
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {subscriptionType === "Premium" ? (
                            <div className="subscription-option">
                              <div className="subscription-duration">
                                {[
                                  {
                                    value: "OneMonth",
                                    label: "1 Month (60% Off)",
                                  },
                                  {
                                    value: "ThreeMonths",
                                    label: "3 Months (66% Off)",
                                  },
                                  {
                                    value: "SixMonths",
                                    label: "6 Months (67% Off)",
                                  },
                                ].map(({ value, label }) => (
                                  <button
                                    key={value}
                                    className={`duration-btn ${
                                      selectedDuration === value ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedDuration(value)}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>

                              <div className="subscription-content-block">
                                <div className="left-pricing-block">
                                  <h2>Premium</h2>
                                  <p
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      fontSize: "30px",
                                    }}
                                  >
                                    ₹{pricing[selectedDuration]}{" "}
                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        color: "#888",
                                        fontSize: "20px",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {selectedDuration === "OneMonth"
                                        ? "₹500"
                                        : selectedDuration === "ThreeMonths"
                                        ? "₹1500"
                                        : selectedDuration === "SixMonths"
                                        ? "₹3000"
                                        : ""}
                                    </span>
                                  </p>
                                  <span className="save-text">
                                    {selectedDuration === "OneMonth"
                                      ? "Save up to 60%"
                                      : selectedDuration === "ThreeMonths"
                                      ? "Save up to 66%"
                                      : selectedDuration === "SixMonths"
                                      ? "Save up to 67%"
                                      : ""}
                                  </span>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      handleRenewal(pricing[selectedDuration])
                                    }
                                  >
                                    Renew
                                  </button>
                                </div>
                                <div className="right-pricing-details">
                                  <ul>
                                    <li>
                                      <CheckCircleFilled className="me-2 green-check" />
                                      Store Visibility on the ONDC Network
                                    </li>
                                    <li>
                                      <CheckCircleFilled className="me-2 green-check" />
                                      Cataloging Support
                                    </li>
                                    <li>
                                      <CheckCircleFilled className="me-2 green-check" />
                                      Order Operations Support
                                    </li>
                                    <li>
                                      <CheckCircleFilled className="me-2 green-check" />
                                      Promotional activities - banners,
                                      leaflets, standees
                                    </li>
                                    <li>
                                      <CheckCircleFilled className="me-2 green-check" />
                                      On-ground team support
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="subscription-options">
                              <div className="subscription-option">
                                <div className="subscription-duration">
                                  {[
                                    {
                                      value: "OneMonth",
                                      label: "1 Month (60% Off)",
                                    },
                                    {
                                      value: "ThreeMonths",
                                      label: "3 Months (66% Off)",
                                    },
                                    {
                                      value: "SixMonths",
                                      label: "6 Months (67% Off)",
                                    },
                                  ].map(({ value, label }) => (
                                    <button
                                      key={value}
                                      className={`duration-btn ${
                                        selectedDuration === value
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() => setSelectedDuration(value)}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                                <div className="subscription-content-block">
                                  <div className="left-pricing-block">
                                    <h2>Standard</h2>
                                    <p
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "30px",
                                      }}
                                    >
                                      ₹{pricing[selectedDuration]}{" "}
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "#888",
                                          fontSize: "20px",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {selectedDuration === "OneMonth"
                                          ? "₹500"
                                          : selectedDuration === "ThreeMonths"
                                          ? "₹1500"
                                          : selectedDuration === "SixMonths"
                                          ? "₹3000"
                                          : ""}
                                      </span>
                                    </p>
                                    <span className="save-text">
                                      {selectedDuration === "OneMonth"
                                        ? "Save up to 60%"
                                        : selectedDuration === "ThreeMonths"
                                        ? "Save up to 66%"
                                        : selectedDuration === "SixMonths"
                                        ? "Save up to 67%"
                                        : ""}
                                    </span>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        handleRenewal(pricing[selectedDuration])
                                      }
                                    >
                                      Renew
                                    </button>
                                  </div>
                                  <div className="right-pricing-details">
                                    <ul>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Store Visibility on the ONDC Network
                                      </li>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Cataloging Support
                                      </li>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Order Operations Support
                                      </li>
                                      <li>
                                        <CloseCircleFilled className="me-2 red-cross" />
                                        Promotional activities - banners,
                                        leaflets, standees
                                      </li>
                                      <li>
                                        <CloseCircleFilled className="me-2 red-cross" />
                                        On-ground team support
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div className="subscription-option">
                                <div className="subscription-content-block">
                                  <div className="left-pricing-block">
                                    <h2>Premium</h2>
                                    <p
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "30px",
                                      }}
                                    >
                                      ₹2999{" "}
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "#888",
                                          fontSize: "20px",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        ₹6000
                                      </span>
                                    </p>
                                    <span className="save-text">
                                      {" "}
                                      Save up to 50%, One Year Plan{" "}
                                    </span>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        handleSubscription(
                                          2999,
                                          "Premium",
                                          "OneYear"
                                        )
                                      }
                                    >
                                      Upgrade
                                    </button>
                                  </div>
                                  <div className="right-pricing-details">
                                    <ul>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Store Visibility on the ONDC Network
                                      </li>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Cataloging Support
                                      </li>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Order Operations Support
                                      </li>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        Promotional activities - banners,
                                        leaflets, standees
                                      </li>
                                      <li>
                                        <CheckCircleFilled className="me-2 green-check" />
                                        On-ground team support
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <Modal
                    isOpen={subscriptionExpiringModal}
                    onClose={() => setSubscriptionExpiringModal(false)}
                    onRequestClose={() => setSubscriptionExpiringModal(false)}
                    centered
                  >
                    <div className="border-none d-flex justify-content-end px-3 pt-3">
                      <img
                        src={crossIcon}
                        alt="cross"
                        onClick={() => setSubscriptionExpiringModal(false)}
                      />
                    </div>
                    <div className="wallet-modal">
                      {sEndinginDays >= 0 ? (
                        <img src={dateExpired} alt="Not Expired" />
                      ) : (
                        <img src={dateExpiredClose} alt="Expired" />
                      )}

                      <div className="subscription-modal">
                        {sEndinginDays >= 0 ? (
                          <>
                            <h5 className="modal-title-subcription">
                              Your ONDC Subscription is ending in{" "}
                              {sEndinginDays} days,{" "}
                            </h5>

                            <h5 className="modal-title-subcription">
                              Please renew to continue your services
                            </h5>
                            {user_data?.subscriptionId ? (
                              <p className="modal-para-content">
                                <span>
                                  Last Renewed On:{" "}
                                  {moment
                                    .utc(user_data?.subscriptionId?.startDate)
                                    .format("DD/MM/YYYY")}
                                </span>{" "}
                                |{" "}
                                <span>
                                  Subscription End Date:{" "}
                                  {moment
                                    .utc(user_data?.subscriptionId?.endDate)
                                    .format("DD/MM/YYYY")}
                                </span>
                              </p>
                            ) : (
                              <p>
                                {/* <span>Last Renewed On:  {}</span> |  */}
                                <span>
                                  Subscription End Date: {"04/04/2025"}
                                </span>
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <h5 className="modal-title-subcription">
                              Your ONDC Subscription has been expired,
                            </h5>
                            <h5 className="modal-title-subcription">
                              Please renew to continue your services
                            </h5>
                            {user_data?.subscriptionId ? (
                              <p className="modal-para-content">
                                <span>
                                  Last Renewed On:{" "}
                                  {moment
                                    .utc(user_data?.subscriptionId?.startDate)
                                    .format("DD/MM/YYYY")}
                                </span>{" "}
                                |{" "}
                                <span>
                                  Subscription End Date:{" "}
                                  {moment
                                    .utc(user_data?.subscriptionId?.endDate)
                                    .format("DD/MM/YYYY")}
                                </span>
                              </p>
                            ) : (
                              <p>
                                <span>
                                  Subscription End Date: {"04/04/2025"}
                                </span>
                              </p>
                            )}
                          </>
                        )}
                        <div className="d-block w-100">
                          <button
                            className="modal-btn-new btn"
                            onClick={() => {
                              setActiveTab("#Subscription-v");
                              setSubscriptionExpiringModal(false);
                            }}
                          >
                            Renew Subscription
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <Modal
                    isOpen={payment?.transection === "success"}
                    onClose={() => {
                      navigate("/shopdetails");
                    }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <div className="wallet-modal">
                      <h1 className="success-heading">Congratulations!</h1>
                      <div className="center-img">
                        <img
                          className="modal-success-image"
                          src={successfullImg}
                          alt="Success"
                        />
                      </div>
                      <h6 className="wallet-para">
                        Subscription Done Successfully!
                      </h6>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            setActiveTab("#Subscription-v");
                            getUser();
                            navigate("/shopdetails");
                          }}
                        >
                          View Subscription
                        </button>
                      </div>
                    </div>
                  </Modal>
                  <Modal
                    isOpen={payment?.transection === "fail"}
                    onClose={() => {
                      navigate("/shopdetails");
                    }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <div className="wallet-modal">
                      <h1 className="reject-heading">Oh..Sorry!</h1>
                      <div className="center-img">
                        <img src={rejectImg} alt="" />
                      </div>
                      <h6 className="wallet-para">Something Went wrong.</h6>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setActiveTab("#Subscription-v");
                            navigate("/shopdetails");
                          }}
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div className="contact-us-headline">
                In case of any Changes/Update <img src={contactIcon} alt="" />{" "}
                <button id="popover-trigger">Contact Us</button>
                <div id="popover-content">
                  <p>
                    <a href="mailto:support@kiko.media" className="mb-2">
                      <img src={emailIcon} alt="" />
                      support@kiko.media{" "}
                    </a>
                    <button
                      className="whatsappButton"
                      onClick={() => copyToClipboard("+918108211231")}
                    >
                      <img src={whatsaapIcon} alt="" />
                      +91 8108211231{" "}
                    </button>
                  </p>
                </div>
              </div>
              {activeTabId === "#home-v" && (
                <div className="button-wrapper">
                  <button
                    className="btn btn-md btn-primary p-0 uploadBtn"
                    style={{ maxWidth: "300px" }}
                    onClick={() => {
                      window.location.href =
                        "https://d1yd3a2ik8ypqd.cloudfront.net/uploads/pos-spaniel-Kiko-20250523.msi";
                    }}
                  >
                    <p className="upload-img">Download POS Software</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <PermissionAlertP
        permissionAlertPopUp={permissionAlertPopUp}
        setPermissionAlertPopUp={setPermissionAlertPopUp}
      />
      <Modal
        isOpen={viewImage === "" ? false : true}
        toggle={() => {
          setViewImage("");
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="sm"
      >
        <div className="container pb-3 pt-3">
          <img
            src={viewImage}
            style={{ width: "100%", height: "100%" }}
            alt=""
          />
        </div>
      </Modal>
      <Modal
        isOpen={editPopup}
        onClose={() => {
          setEditPopup(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container p-4">
          <div className="pt-2 pb-3">
            <h4 className="edit-title text-center mb-0">
              If you want to update any profile information, your profile will
              require re-verification.
            </h4>
            <div className="edit-para mt-3 mb-1 text-center">
              It will take 3-4 hours for reverification by Kiko team.
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-1">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                navigate("/registration", {
                  state: { edit: true, field: editField },
                });
              }}
            >
              Proceed
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEditPopup(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={agreement}
        // style={agreementStyles}
        onRequestClose={agreementModal}
        toggle={() => {
          setagreement(false);
        }}
        style={{ maxWidth: "700px" }}
        centered
      >
        <ModalHeader className="agreement-modal-header">
          <div className="text-center">
            <img src={kikoOndcLogo} alt="" />
            <h6>Seller Agreement</h6>
          </div>
          <img
            src={crossIcon}
            alt=""
            style={{ position: "absolute", right: "23px", maxWidth: "15px" }}
            onClick={() => {
              setagreement(false);
            }}
          />
        </ModalHeader>
        <ModalBody className="agreement-body-modal">
          <div
            id="element-to-print"
            className="agreement-body"
            ref={modalContentRef}
          >
            <div className="text-center">
              <p className="mb-0">CONTRACT FOR SELLERS </p>
              <p>
                (Featuring on ONDC network and building own website with Kiko
                Live)
              </p>
            </div>
            <p>
              This Seller Agreement ("Agreement") is entered into by and between
              Smooth Tag Technologies Pvt Ltd - the Company Live, a company
              having its registered office at A/603 Emrold Court Indore, Madhya
              Pradesh 452001, hereinafter referred to as the "Company,"
            </p>
            <p>AND</p>
            <p>
              {user_data?.storeName} at {user_data?.storeAddress?.address1},
              {user_data?.storeAddress?.address2},
              {user_data?.storeAddress?.pincode}, an individual/entity
              registered on the the Kiko Live platform and selling its products
              on multiple buyer apps of ONDC as well as the website provided by
              Kiko Live, and having its address at{" "}
              {user_data?.storeAddress?.address1},
              {user_data?.storeAddress?.address2},
              {user_data?.storeAddress?.pincode}, hereinafter referred to as the
              "Seller."
            </p>
            <p>
              <strong>1. Listing and Visibility</strong>
            </p>
            <p>
              By listing products on the ONDC platform through the Company, the
              Seller agrees that their shop will be made visible on various
              buyer apps associated with ONDC, including but not limited to
              PayTM, Phonepe Pincode, Magicpin, Mystore, and others.
            </p>
            <p>
              <strong>2. Product Listing </strong>
            </p>
            <p>
              The Seller understands that creating and managing catalogue on the
              the Kiko Live platform along with the updation of inventory and
              MRP are required on a regular basis and the Seller agrees to be
              responsible for the same.
            </p>
            <p>
              <strong>3. Exclusive Partnership with the Company</strong>
            </p>
            <p>
              3.1 The Seller agrees to work exclusively with the Company
              focusing on growing their business on the ONDC platform.
            </p>
            <p>
              3.2 The company commits to collaborating with loyal sellers,
              providing promotional support, guidance on enhancing seller
              ratings, sales support, call center assistance, delivery support,
              and the provision of an e-commerce website for the seller with the
              same listed inventory.
            </p>
            <p>
              3.3 In the event of solicitations from other seller apps to list
              with them for ONDC, post onboarding with the Company, the Seller
              agrees to contact the Company for guidance before proceeding.
            </p>
            <p>
              <strong>4. Restriction on Listing with Other Platforms </strong>
            </p>
            <p>
              During the term of this Agreement, the Seller acknowledges that
              the Company will undertake substantial efforts in cataloguing,
              storing & sharing data with buyer apps and promoting the Seller's
              products on the ONDC platform. In exchange for receiving these
              services from the Company, the Seller agrees not to list their
              products on any other seller apps within the ONDC ecosystem for
              the purpose of ONDC business.
            </p>
            <p>
              <strong>
                5. Compensation for Listing with Other Seller Apps
              </strong>
            </p>
            <p>
              5.1 In the event that the Seller chooses to list their products on
              other seller apps within the ONDC ecosystem during the term of
              this Agreement, the Seller shall compensate the Company for its
              substantial efforts in cataloguing, promotions and sharing data.
              Such compensation shall be determined by the Company and shall be
              payable within 30 days from the date of listing on other
              platforms.
            </p>
            <p>
              5.2 The Seller acknowledges that the Company may invest resources
              in the form of promotions, offers, and other marketing initiatives
              on different buyer apps for the exclusive benefit of the Seller.
              In the event of a breach of exclusivity, the Seller agrees to
              compensate the company for such investments.
            </p>
            <p>
              5.3 The Seller acknowledges that any offers or benefits provided
              by the Company for operational efficiency, including but not
              limited to subsidies on specified services, are intended to
              enhance the Seller's profitability by facilitating cost-effective
              operations. These offers and benefits shall become null and void
              if the Seller lists their products on other seller apps within the
              ONDC ecosystem.{" "}
            </p>
            <p>
              5.4 In the event of nullification as per Section 5.3, the Seller
              agrees that the Company reserves the right to reclaim any expenses
              incurred on behalf of the Seller.{" "}
            </p>
            <p>
              <strong>6. Terms & Termination</strong>
            </p>
            <p>
              This agreement shall continue until either party provides a
              written notice of termination to the other party. In the event of
              termination, a minimum notice period of 30 days is required. The
              termination notice shall be delivered in writing and will be
              effective 30 days from the date of receipt by the other party.
            </p>
            <p>
              In case of breach of any terms on this agreement, the Company may
              terminate the agreement without notice.
            </p>
            <p>
              <strong>7. Notwithstanding Termination</strong>
            </p>
            <p>
              Even after termination, all other clauses and obligations outlined
              in this Agreement shall continue to hold, and the seller will be
              required for reimbursement of costs to the Company as set out in
              clause 5.
            </p>
            <p>
              <strong>8. Miscellaneous</strong>
            </p>
            <p>
              8.1 This Agreement constitutes the entire understanding between
              the Company and the Seller, supersedes any prior agreements or
              understandings, and may only be amended in writing and signed by
              both parties
            </p>
            <p>
              8.2 This Agreement shall be governed by and construed in
              accordance with the laws of Mumbai, India
            </p>
            <p>
              <strong>9. Commission and Fees</strong>
            </p>
            <p>
              9.1 Commission Structure: The Commission structure shall vary
              based on ONDC's prevailing rules and policies. For the grocery
              category, the commission percentage shall be 5%, exclusive of
              taxes. For the Food & Beverages Category, the commission
              percentage shall be 10%, exclusive of taxes. The determined
              commission includes the Buyer App Finder's Fee and the Seller App
              commission. Deductions apart from commission will include taxes
              including but not limited to Goods and Service Tax (GST) and Tax
              Deducted at Source (TDS)
            </p>
            <p>
              9.2 Fees: The company may charge setup fees and subscription fees
              for use of the technology platform provided. All such paid fees
              whether for one time setup or for monthly or annual subscription
              are non refundable. All fixed fees paid are purely for the setup
              and technology service provided, and is in no way a guarantee of
              receiving orders or business. The company provides a solution and
              platform for sellers to promote their shops and products and
              assists with best practices for building and growing the online
              business. The seller understands and agrees that building and
              growing their online business and orders is their own
              responsibility. No refund is possible for the sellers inability
              for any reason to use the software solution provided by the
              company. The company may additionally charge variable fees in the
              form of a commission on successful sales and the rate for such
              commission will be notified to the sellers. Such commissions may
              be refunded in case of genuine cases of order cancellations or
              returns based on the discretion of the company.
            </p>
            <p>
              <strong>10. Payment and Settlement Terms</strong>
            </p>
            <p>
              The Company is committed to promptly settling the order amount for
              successfully completed orders. In accordance with the specified
              settlement terms, orders completed successfully on Fridays,
              Saturdays, Sundays, and Mondays shall be settled on the subsequent
              Tuesday. Similarly, Orders concluded on Tuesdays, Wednesdays, and
              Thursdays shall be settled on the subsequent Friday. It is
              acknowledged and understood that settlement timelines may vary
              based on dynamic circumstances, allowing for the possibility of
              earlier processing of settlements, subject to the following
              conditions:
            </p>
            <p>
              10.1 Orders are considered successfully completed upon
              fulfillment, delivery, and confirmation of receipt by the
              customer. If any orders are identified by the Company as
              fraudulent or exhibiting a misbehavioral pattern, the Company
              reserves the right to reclaim the settlement amount associated
              with those orders.
            </p>
            <p>
              The Seller must provide valid delivery proofs for any order at any
              time upon the Company’s request. Failure to provide the requested
              delivery proofs within the stipulated timeframe will obligate the
              Seller to refund the entire settlement amount for the questioned
              orders back to the Company. In case of refunds initiated to the
              customer due to any reason that deems the order cancelled, the
              seller will be liable to return any settled funds for such
              cancelled orders back to the company.
            </p>
            <p>
              The Seller will be fully liable for any discrepancies or issues
              arising from the fraudulent orders or misbehavioral patterns, and
              the Company holds the right to pursue further legal action if
              necessary.
            </p>
            <p>
              In cases where a refund is required, the Seller must process the
              refund within the specified timeframe of the Company’s
              notification, and failure to comply may result in additional
              penalties or legal actions.
            </p>
            <p>
              The Company reserves the right to amend these terms and conditions
              at any time, and the Seller's continued participation in the
              Company's platform constitutes acceptance of the updated terms.
            </p>
            <p>
              10.2 The Company reserves the right to verify and validate orders
              before initiating the settlement process.
            </p>
            <p>
              10.3 Merchants are required to provide accurate and up-to-date
              bank account details for seamless payment processing.
            </p>
            <p>
              10.4 Any changes or updates to the bank account information should
              be promptly communicated to the Company to avoid payment
              disruptions.
            </p>
            <p>
              10.5 Delays in settlement may occur due to unforeseen
              circumstances, such as banking holidays, technical issues, or
              force majeure events. The Company will make reasonable efforts to
              minimise such occurrences and inform affected merchants
              accordingly.
            </p>
            <p>
              10.6 The Company reserves the right to modify, update, or amend
              these payment and settlement terms as deemed necessary. Merchants
              will be duly notified of any such changes.
            </p>
            <p>
              <strong>11. Consequences of Non-Compliance:</strong>
            </p>
            <p>
              In the event of the Seller's failure to meet the established
              performance standards outlined in Section 8.1, 8.2 and 8.3,
              consequences may be imposed at the Company's discretion. Such
              consequences may include, but are not limited to:
            </p>
            <p>
              11.1 Warning Notices: The Company reserves the right to issue
              written warning notices to the Seller, indicating the areas of
              non-compliance and providing a reasonable timeframe for
              rectification.
            </p>
            <p>
              11.2 Temporary Suspension: Should the Seller persistently fail to
              rectify non-compliance issues following the issuance of warning
              notices, the Company may, at its discretion, impose a temporary
              suspension of the Seller's services for a specified duration.
            </p>
            <p>
              11.3 Termination: In cases of severe or repeated non-compliance,
              the Company reserves the right to terminate this Agreement with
              the Seller. Termination shall be effective upon the expiration of
              a notice period specified by the Company, providing the Seller
              with an opportunity to address and rectify the non-compliance
              concerns.
            </p>
            <p>
              <strong>12. Intellectual Property</strong>
            </p>
            <p>
              12.1 Licence: The Seller hereby grants the platform a
              non-exclusive, royalty-free, worldwide licence to use, reproduce,
              and display the Seller's intellectual property for the sole
              purpose of marketing and promotional activities on the platform.
            </p>
            <p>
              <strong>13. Confidentiality</strong>
            </p>
            <p>
              13.1 Confidential Information: For the purposes of this Agreement,
              confidential information shall include any non-public information,
              data, or materials disclosed by either party to the other party,
              whether orally or in writing, that is not generally known to the
              public.
            </p>
            <p>
              13.2 Obligations: Both parties agree to treat all confidential
              information with the utmost confidentiality and to take all
              necessary measures to prevent unauthorised disclosure or use of
              such information.
            </p>
            <p>
              13.3 Exceptions: The obligations of confidentiality shall not
              apply to information that is publicly available or becomes
              publicly available without a breach of this Agreement, or
              information that is rightfully obtained by a party from a third
              party without a duty of confidentiality.
            </p>
            <p>
              <strong>14. Non-Disclosure</strong>
            </p>
            <p>
              The Seller agrees not to disclose, directly or indirectly, any
              confidential information obtained during the term of this
              Agreement to any third party or use such information for any
              purpose other than the performance of its obligations under this
              Agreement.
            </p>
            <p>
              <strong>15. Governing Law</strong>
            </p>
            <p>
              This Agreement shall be governed by and construed in accordance
              with the laws of the courts of Mumbai, India. The parties agree
              that any legal action or proceeding arising out of or relating to
              this Agreement shall be instituted in the courts of Mumbai, India.
            </p>
            <p>
              <strong>16. Operational Intelligence and Enablement</strong>
            </p>
            <p>
              To enhance operational efficiency, business visibility, and
              strategic growth across both online and offline channels, the
              Company may, from time to time, deploy certain proprietary tools,
              software modules, or intelligence systems at the Seller’s store
              and POS systems. These solutions are designed to assist in
              inventory alignment, demand forecasting, and improved service
              delivery. Such enablement shall be provided with the objective of
              supporting the Seller's business performance and digital
              transformation journey. IP of any such data will belong to the
              company, and company may use it with their partners for various
              analysis purposes.
            </p>
            <p>
              IN WITNESS WHEREOF, the parties hereto have executed this Seller
              Agreement as of the Effective Date.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-between align-items-center mt-3 agreement-footer">
          {/* <div className="form-group m-0">
            <input type="checkbox" id="html" onChange={(e) => settearms_cond(e.target.checked)} />
            <label htmlFor="html">I Agree To The Smooth Tag Technologies Agreement</label>
          </div>
          <button className={tearms_cond ? "btn btn-primary" : "btn"} disabled={!tearms_cond} onClick={() => { updateVendorProfile(); setagreement(false) }}>I Accept</button> */}
          {/* <button onClick={() => (downloadAsPDF())}>Download as PDF</button> */}
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={qrPopUp}
        toggle={() => {
          setQrPopUp(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="sm"
      >
        <ModalHeader className="modal-header">
          Scan the Store QR Code
          <div>
            <img
              src={crossIcon}
              alt=""
              onClick={() => {
                setQrPopUp(false);
              }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <QRCode
            className="w-100"
            title="Kiko"
            value={value}
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            size={256}
          />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={gstDec}
        onRequestClose={() => setGstDec(false)}
        toggle={() => {
          setGstDec(false);
        }}
        centered
        size="lg"
      >
        <ModalHeader className="agreement-modal-header ps-0 pe-0">
          <div className="text-center">
            <h6 className="m-0">NON GST DECLARATION</h6>
          </div>
          <img
            src={crossIcon}
            style={{
              position: "absolute",
              right: "23px",
              maxWidth: "15px",
              top: "16px",
            }}
            onClick={() => {
              setGstDec(false);
            }}
            alt=""
          />
        </ModalHeader>
        <ModalBody className="declaration-body-modal">
          <div className="declaration-body">
            <p>
              I/we, <span>{user_data?.name}</span>, proprietor/partner/director
              of <span>{user_data?.storeName}</span> with GST{" "}
              <div className="gst-declation-input">
                <div className="gst-enroll-no">
                  {!user_data?.kycDetail?.gstEnrollmentNumber ||
                  user_data?.kycDetail?.gstEnrollmentNumber === " "
                    ? "Enrollment Number"
                    : user_data?.kycDetail?.gstEnrollmentNumber}
                </div>
                <div>
                  <Popover content={GSTInfo} trigger="hover">
                    <img src={GSTInfoIcon} alt="" />
                  </Popover>
                </div>
              </div>{" "}
              having its registered office at {user_data.storeAddress?.address1}
              ,{user_data.storeAddress?.address2},
              {user_data?.storeAddress?.pincode}, hereby declare and confirm the
              following:
            </p>
            <p>
              1.That I/we am/are have obtained a valid enrollment number from
              the GST common portal, which is{" "}
              <div className="gst-declation-input">
                <div className="gst-enroll-no">
                  {!user_data?.kycDetail?.gstEnrollmentNumber ||
                  user_data?.kycDetail?.gstEnrollmentNumber === " "
                    ? "Enrollment Number"
                    : user_data?.kycDetail?.gstEnrollmentNumber}
                </div>
                <div>
                  <Popover content={GSTInfo} trigger="hover">
                    <img src={GSTInfoIcon} alt="" />
                  </Popover>
                </div>
              </div>
            </p>
            <p>
              2.Our aggregate turnover in the preceding financial year did not
              exceed the threshold limit prescribed (20lakh/40lakh) for
              registering under GST.
            </p>
            <p>
              3.We do not engage in inter-state supplies of goods and/or
              services.
            </p>
            <p>
              4.We will be issuing tax invoices for the goods sold by us through
              the E-Commerce platform.
            </p>
            <p>
              5.That I undertake to promptly inform {user_data?.storeName} in
              case my turnover exceeds threshold limit for registering under
              GST.
            </p>
            <p>
              6.That I understand that any false declaration or non-compliance
              with the GST Act may attract penal consequences under the law.
            </p>

            <p>
              I further undertake to comply with all the provisions of the GST
              Act and abide by the rules and regulations laid down by the GST
              authorities. Any changes in the eligibility criteria or
              circumstances that may affect our eligibility for the unregister
              taxpayer will be promptly communicated to the concerned
              authorities.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="declaration-footer">
          <div className="w-100">
            <div className="signature-box">
              {
                <>
                  <div className="signature-captcha">
                    <p>Saved Signature:</p>
                    <img
                      src={user_data?.kycDetail?.signature}
                      alt="Saved Signature"
                    />
                    <div className="mt-2"></div>
                  </div>
                </>
              }
            </div>
            <br></br>
            <br></br>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default ShopDetailsComponent;
