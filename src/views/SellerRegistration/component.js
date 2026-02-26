import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import { get } from "lodash";
import { useLocation } from "react-router-dom";
import {
  LoadingOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import pdfFile from "../../images/pdfFile.png";
import LogoutBlack from "../../images/ShopDetails/logout-black.svg";
import defaultImage from "../../images/defaultImage.jpg";
import WrappedMap from "../../components/Map/map";
import { Space, Spin, Popover } from "antd";
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";
import { useNavigate } from "react-router-dom";
import GrayShopDetails from "../../images/Kikoshop/gray shop.svg";
import BlueShopDetails from "../../images/Kikoshop/blue-shop.svg";
import GraySellerDetails from "../../images/Kikoshop/gray-bank.svg";
import BlueSellerDetails from "../../images/Kikoshop/blue-bank.svg";
import GrayBankDetails from "../../images/Kikoshop/gray-seller.svg";
import BlueBankDetails from "../../images/Kikoshop/blue-seller.svg";
import locationIcon from "../../images/location-icon.svg";
import Whitelocation from "../../images/Kikoshop/whitelocation.svg";
import searchIcon from "../../images/Dashboard/searchIcon.svg";
import blacksearchIcon from "../../images/blacksearchicon.svg";
import uploadImg from "../../images/Kikoshop/camra.svg";
import crossIcon from "../../images/cross-icon.svg";
import GSTInfoIcon from "../../images/gst-info-icon.svg";
import validator from "validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  UPDATE_VENDOR_PROFILE,
  GET_CATEGORY,
  GET_BRAND_NAME,
} from "../../api/apiList";
import API from "../../api";
import {
  handleError,
  notify,
  handleLogout,
  flutterfetchGeolocationCoords,
  flutterfetchCameraPermission,
} from "../../utils";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { analytics } from "../../firebase/FirebaseConfig";
import { logEvent } from "firebase/analytics";
import PermissionAlertP from "../../components/Modal/PermissionAlertPopup";
import SignatureCanvas from "react-signature-canvas";
import moment from "moment";
import RazorpayModule from "../Razorpay/Razorpay";
import PreRazorpay from "../Razorpay/PreRazorpay";

function SellerRegistration(props) {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const getSellerToken = () => {
    try {
      return JSON.parse(localStorage.getItem("token") || "");
    } catch (error) {
      return null;
    }
  };

  function searchcloseModal() {
    setlocations([]);
    setmap(false);
  }
  function closeModal() {
    setSearchmodal(false);
  }
  function agreementModal() {
    setagreement(false);
  }
  const [tableLoading, setTableloading] = useState(false);
  const [Searchmodal, setSearchmodal] = useState(false);
  const [agreement, setagreement] = useState(false);
  const editLocation = useLocation();
  const edit = editLocation.state;
  const navigate = useNavigate();
  const [user_data] = useState(getSellerDetails);
  const [token] = useState(getSellerToken);
  const [shopName, setShopName] = useState(
    user_data ? user_data?.storeName : ""
  );
  const [shopOwnerName, setShopOwnerName] = useState(
    user_data ? user_data?.name : ""
  );
  const [whatsApp, setWhatsApp] = useState(
    user_data ? user_data?.whatsAppNumber : ""
  );
  const [isDisable, setisDisable] = useState(false);
  const [isSpin, setisSpin] = useState("");
  const [locations, setlocations] = useState([]);
  const [ShopMobile] = useState(user_data?.mobile || "");
  const [shopEmail, setShopEmail] = useState(user_data?.email || "");
  const [shopCategory, setShopCategory] = useState(
    user_data ? user_data?.mainCategory : ""
  );
  const [brandName, setBrandName] = useState(
    user_data ? user_data?.brandName : "KIKO"
  );
  const [shopImage, setShopImage] = useState(
    user_data ? user_data?.storeLogo : ""
  );
  const [sellerDetailActive, setsellerDetailActive] = useState(
    edit && edit?.field === "sellerDetail" ? true : false
  );
  const [latitude, setlatitude] = useState(
    user_data ? user_data.storeAddress?.latitude : 0.0
  );
  const [longitude, setlongitude] = useState(
    user_data ? user_data.storeAddress?.longitude : 0.0
  );
  const [bankDetailActive, setbankDetailActive] = useState(
    edit && edit?.field === "bankDetail" ? true : false
  );
  const [shopDetailActive, setshopDetailActive] = useState(
    edit && (edit?.field === "sellerDetail" || edit?.field === "bankDetail")
      ? false
      : true
  );
  const [skipProfile, setskipProfile] = useState(false);
  const [pincode, setPincode] = useState(
    user_data ? user_data?.storeAddress?.pincode : ""
  );
  const [location, setLocation] = useState(
    user_data ? user_data?.storeAddress?.city : ""
  );
  const [state, setState] = useState(
    user_data ? user_data?.storeAddress?.state : ""
  );
  const [address_line1, setAddress_line1] = useState(
    user_data ? user_data.storeAddress?.address1 : ""
  );
  const [address_line2, setAddress_line2] = useState(
    user_data ? user_data.storeAddress?.address2 : ""
  );
  const [companyName, setCompanyName] = useState(
    user_data ? user_data.kycDetail?.companyName : ""
  );
  const [city, setcity] = useState(
    user_data ? user_data.storeAddress?.city : ""
  );
  const [hearAboutUs, setHearAboutUs] = useState(
    user_data ? user_data?.hearAboutUs : ""
  );
  const [fssaiLicense, setFssaiLicense] = useState(
    user_data ? get(user_data, "fssaiLicense", "") : ""
  );
  const [mainRestaurantId, setMainRestaurantId] = useState(
    user_data ? get(user_data, "mainRestaurantId", "") : ""
  );
  const [aadharPanNumber, setAadharPanNumber] = useState(
    user_data ? user_data.kycDetail?.aadharNumber : ""
  );
  const [aadharPanImage, setAadharPanImage] = useState(
    user_data ? user_data.kycDetail?.aadharImage : ""
  );
  const [gstNumberPic, setGstNumberPic] = useState(
    user_data ? user_data?.gstNumberPic : ""
  );
  const [shopPanImage, setShopPanImage] = useState(
    user_data ? user_data?.shopPanImage : ""
  );
  const [addressProofImg, setaddressProofImg] = useState(
    user_data ? user_data?.addressProofPic : ""
  );
  const [gstNumber, setGstNumber] = useState(
    user_data ? user_data.kycDetail?.gstNumber : ""
  );
  const [gstEnrollmentNumber, setGstEnrollmentNumber] = useState(
    user_data?.kycDetail ? user_data?.kycDetail?.gstEnrollmentNumber : ""
  );
  const [panNumber, setPanNumber] = useState(
    user_data ? user_data.kycDetail?.panNumber : ""
  );
  const [accountHolderName, setAccountHolderName] = useState(
    user_data ? user_data.bankDetails?.accountName : ""
  );
  const [accountNumber, setAccountNumber] = useState(
    user_data ? user_data.bankDetails?.accountNumber : ""
  );
  const [bankDetail, setBankDetail] = useState(
    user_data ? user_data.bankDetails?.accountBankName : ""
  );
  const [ifscCode, setIfscCode] = useState(
    user_data ? user_data.bankDetails?.accountIfscCode : ""
  );
  const [bankDetailProof, setBankDetailProof] = useState(
    user_data.bankDetails?.accountCancleCheque
      ? user_data.bankDetails?.accountCancleCheque
      : ""
  );
  const [bankDetailProofImg, setBankDetailProofImg] = useState(
    user_data ? user_data?.accountCancleChequeUpload : ""
  );
  const [tittle, settittle] = useState("");
  const [superValidation, setsuperValidation] = useState(false);
  const [isshopEmailValid, setshopEmailValid] = useState(false);
  const [map, setmap] = useState(false);
  const [isFormOneComplete, setisFormOneComplete] = useState(false);
  const [isFormTwoComplete, setisFormTwoComplete] = useState(false);
  const [categoriesList, setcategoriesList] = useState([]);
  const [brandNameList, setBrandNameList] = useState([]);
  const [tearms_cond, settearms_cond] = useState(false);
  const [gst_cond, setGst_cond] = useState(false);
  const [haveGstNumber, setHaveGstNumber] = useState(false);
  const [gstPopup, setGstPopup] = useState(true);

  const [isOpenSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [isOpenPreRazorpayModal, setOpenPreRazorpayModal] = useState(false);
  function closeSubscriptionModal() {
    setOpenSubscriptionModal(false);
  }
  const shopMenuLinkRef = useRef(null);
  const sellerMenuLinkRef = useRef(null);
  const bankMenuLinkRef = useRef(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({
    permission: false,
    type: "",
  });
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const signatureCanvasRef = useRef();

  useEffect(() => {
    if (
      user_data &&
      get(user_data, "_id", "") &&
      get(user_data, "_id", "") !== ""
    ) {
      if (!get(user_data, "subscriptionActive", false))
        setOpenSubscriptionModal(true);
    }

    // if (user_data && !get(user_data, "subscriptionActive", false)) {
    //   setOpenSubscriptionModal(true);
    // }
    if (!get(user_data, "_id", "") && get(user_data, "_id", "") === "") {
      handleLogout();
      navigate("/");
    }
  }, []);

  const clearCanvas = () => {
    signatureCanvasRef.current.clear();
    setSignatureCanvas(null);
  };
  const retryCanvas = () => {
    // signatureCanvasRef.current.clear();
    setSignatureCanvas(null);
  };

  const trimCanvas = () => {
    if (signatureCanvasRef.current.isEmpty()) {
      notify("error", "Please provide a signature first.");
    } else {
      // const canvas = signatureCanvasRef.current.getTrimmedCanvas();
      // canvas.toBlob((blob) => {
      //   const file = new File([blob], "signature.png", { type: "image/png" });
      //   addUpdateImage(file, "signature");
      // });
      const canvas = signatureCanvasRef.current.getCanvas();
      const ctx = canvas.getContext("2d");
      // ctx.clearRect(0, canvas.height  +20, canvas.width, 20);
      ctx.font = "8px Arial";
      ctx.fillStyle = "black";
      const text = `${moment(new Date().toLocaleString()).format(
        "DD-MMM-YYYY  hh:mm:ss A"
      )}`;
      const textWidth = ctx.measureText(text).width;
      const x = (canvas.width - textWidth) / 2;
      const y = canvas.height - 10;
      ctx.fillText(text, x, y);
      canvas.toBlob((blob) => {
        const file = new File([blob], "signature.png", { type: "image/png" });
        addUpdateImage(file, "signature");
      });
    }
  };

  useEffect(() => {
    if (user_data && user_data?.isProfileComplete && edit && !edit?.edit) {
      navigate("/shopdetails");
    }
  }, [user_data]);

  const getCategories = async () => {
    try {
      const response = await API.get(GET_CATEGORY);
      if (response.data?.success) {
        setcategoriesList(response?.data?.data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getBrandName = async () => {
    try {
      const response = await API.get(GET_BRAND_NAME);
      if (response.data?.success) {
        setBrandNameList(response?.data?.data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getCategories();
    getBrandName();
  }, []);

  const required = (value) => {
    if (!value || value === undefined || value === null || value === "") {
      return <span className="error">This field is required.</span>;
    }
  };
  const requiredNumber = (value) => {
    if (value?.length > 1 && (value?.length ?? 0) < 10) {
      return <span className="error">This field is required.</span>;
    }
  };
  const requiredIfsc = (value) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (
      !value ||
      value === undefined ||
      value === null ||
      value === "" ||
      !ifscRegex.test(value)
    ) {
      return <span className="error">This field is required.</span>;
    }
  };
  const getPlacesDetails = async (obj) => {
    const body = {
      latitude: obj.latitude,
      longitude: obj.longitude,
    };
    var config = {
      method: "post",
      url: "https://ondc.kiko.live/api/v1/maps/getlocation-ola",
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: body,
    };
    let response = await axios(config);
    const place_detail = response?.data?.data?.results[0];

    const postal_code = place_detail.address_components.findIndex((ele) =>
      ele.types.includes("postal_code")
    );
    const zipcode =
      postal_code !== -1
        ? place_detail.address_components[postal_code].long_name
        : "";
    const administrative_area_level_3 =
      place_detail.address_components.findIndex((ele) =>
        ele.types.includes("administrative_area_level_3")
      );
    const administrative_area_level_1 =
      place_detail.address_components.findIndex((ele) =>
        ele.types.includes("administrative_area_level_1")
      );
    const city =
      administrative_area_level_3 !== -1
        ? place_detail.address_components[administrative_area_level_3].long_name
        : "";
    const state =
      administrative_area_level_1 !== -1
        ? place_detail.address_components[administrative_area_level_1].long_name
        : "";
    setlatitude(obj.latitude);
    setlongitude(obj.longitude);
    setState(state);
    setcity(city);
    setPincode(zipcode);
    setLocation(city);
    settittle(place_detail.formatted_address);
    setAddress_line2(place_detail.formatted_address);
    setSearchmodal(true);
    setmap(false);
    setlocations([]);
  };

  const kikoDashboard = async () => {
    const isShopNameValid = required(shopName);
    const isWhatsAppValid = requiredNumber(whatsApp);
    const ishopOwnerNameValid = required(shopOwnerName);
    const isshopEmailValid = required(shopEmail);
    const isshopCategoryValid = required(shopCategory);
    const ispincodeValid = required(pincode);
    const islocationValid = required(location);
    const isstateValid = required(state);
    const isshopImageValid = required(shopImage);
    const isaddress_line1Valid = required(address_line1);
    const isaddress_line2Valid = required(address_line2);
    const iscityValid = required(city);
    const ishearAboutUsValid = required(hearAboutUs);
    if (
      isShopNameValid ||
      isWhatsAppValid ||
      ishopOwnerNameValid ||
      isWhatsAppValid ||
      isshopEmailValid ||
      isshopCategoryValid ||
      ispincodeValid ||
      islocationValid ||
      isstateValid ||
      isshopImageValid ||
      isaddress_line1Valid ||
      isaddress_line2Valid ||
      iscityValid ||
      ishearAboutUsValid
    ) {
      setshopDetailActive(true);
      setsellerDetailActive(false);
      setbankDetailActive(false);
      setsuperValidation(true);
    } else {
      await updateVendorProfile();
      window.location.reload();
    }
  };

  useEffect(() => {
    if (shopDetailActive) {
      shopMenuLinkRef.current.click();
    }
    if (sellerDetailActive) {
      sellerMenuLinkRef.current.click();
    }
    if (bankDetailActive) {
      bankMenuLinkRef.current.click();
    }
  }, [sellerDetailActive, bankDetailActive, shopDetailActive]);

  const email = (value) => {
    if (!validator.isEmail(value)) {
      return <span className="error">Invalid email format.</span>;
    }
  };

  const mapTokenGenerator = async () => {
    const options = {
      method: "get",
      url: `https://ondc.kiko.live/api/v1/maps/gettoken`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
    };
    return axios(options)
      .then(({ data }) => {
        if (data) {
          return data?.data;
        } else {
          throw new Error("Token data is missing");
        }
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleAddress = async (event) => {
    const address = event.target.value;
    const mapToken = await mapTokenGenerator();
    setlocations([]);
    if (address.length > 2) {
      try {
        const options = {
          method: "post",
          url: `https://ondc.kiko.live/api/v1/maps/autocomplete-v2-ola`,
          headers: {
            Authorization: `${token}`,
            desktop: true,
          },
          data: { search: address, token: mapToken },
        };
        const { data } = await axios(options);
        if (data?.success) {
          setlocations(data.data);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleShopDetail = () => {
    const isShopNameValid = required(shopName);
    const isWhatsAppValid = requiredNumber(whatsApp);
    const ishopOwnerNameValid = required(shopOwnerName);
    const isshopEmailValid = validator.isEmail(shopEmail);
    const isshopCategoryValid = required(shopCategory);
    const ispincodeValid = required(pincode);
    const islocationValid = required(location);
    const isstateValid = required(state);
    const isshoplocationValid = required(latitude);
    const isshopImageValid = required(shopImage);
    const isaddress_line1Valid = required(address_line1);
    const isaddress_line2Valid = required(address_line2);
    const iscityValid = required(city);
    const ishearAboutUsValid = required(hearAboutUs);
    if (
      isShopNameValid ||
      ishopOwnerNameValid ||
      isWhatsAppValid ||
      isshopCategoryValid ||
      ispincodeValid ||
      islocationValid ||
      isstateValid ||
      isshoplocationValid ||
      isshopImageValid ||
      isaddress_line1Valid ||
      isaddress_line2Valid ||
      iscityValid ||
      ishearAboutUsValid
    ) {
      setsuperValidation(true);
      // return;
    } else if (!isshopEmailValid) {
      setshopEmailValid(true);
      setsuperValidation(true);
      return;
    }
    !tearms_cond && !edit && !edit?.edit
      ? setagreement(true)
      : updateVendorProfile();
  };

  const handleSellerDetail = () => {
    if (fssaiLicense.length !== 14 && fssaiLicense.length !== 0) {
      notify("error", "Please put valid Fssai Number");
      return;
    }
    const isaddressProofImgValid = required(addressProofImg);
    const isaadharPanImageValid = required(aadharPanImage);
    const isaadharPanNumberValid = required(aadharPanNumber);
    const ispanNumber = required(panNumber);
    const isshopOwnerNameValid = required(shopOwnerName);
    const isgstNumberValid = gstNumber;
    const isgstEnrollmentNumberValid = (gstEnrollmentNumber);
    if (
      isaddressProofImgValid ||
      isaadharPanImageValid ||
      isaadharPanNumberValid ||
      isshopOwnerNameValid ||
      // (isgstNumberValid && isgstEnrollmentNumberValid) ||
      ispanNumber
    ) {
      setsuperValidation(true);
      return;
    }
    // if (
    //   gstNumber &&
    //   gstNumber !== "" &&
    //   !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    //     gstNumber
    //   )
    // ) {
    //   setsuperValidation(true);
    //   return;
    // }
    // if (
    //   gstEnrollmentNumber &&
    //   gstEnrollmentNumber !== "" &&
    //   !/^[a-zA-Z0-9]{15}$/.test(gstEnrollmentNumber)
    // ) {
    //   setsuperValidation(true);
    //   return;
    // }
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      setsuperValidation(true);
      return;
    }
    if (
      aadharPanNumber &&
      !(
        /^\d{12}$/.test(aadharPanNumber) ||
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(aadharPanNumber)
      )
    ) {
      setsuperValidation(true);
      return;
    }
    if (!edit && !edit?.edit) {
      setisFormTwoComplete(true);
      setbankDetailActive(true);
      setsuperValidation(false);
    }
    updateVendorProfile();
  };

  const handleBankDetail = () => {
    const isaccountHolderNameValid = required(accountHolderName);
    const isaccountNumberValid = required(accountNumber);
    const isbankDetailValid = required(bankDetail);
    const isifscCodeValid = requiredIfsc(ifscCode);
    const isbankDetailProofValid = required(bankDetailProof);
    const isbankDetailProofImgValid = required(bankDetailProofImg);
    if (
      isaccountHolderNameValid ||
      isaccountNumberValid ||
      isbankDetailValid ||
      isifscCodeValid ||
      isbankDetailProofValid ||
      isbankDetailProofImgValid
    ) {
      setsuperValidation(true);
      return;
    }
    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setsuperValidation(true);
      return;
    }
    if (!edit && !edit?.edit) {
      setsuperValidation(false);
      setsellerDetailActive(true);
    }
    updateVendorProfile();
  };

  const updateVendorProfile = async () => {
    logEvent(analytics, "Retailer_Regisration_Button", {
      mobile_number: "WebsiteMobileLogin",
    });
    if (!edit && !edit?.edit) {
      setsuperValidation(false);
      setisFormOneComplete(true);
      setsellerDetailActive(true);
    }
    setTableloading(true);
    let body = {
      userType: "semivendor",
      role: "semivendor",
      email: shopEmail,
      userId: user_data && user_data._id ? user_data._id : "",
      token: token && token ? token : "",
      name: shopOwnerName ? shopOwnerName : shopName,
      storeName: shopName,
      phone: ShopMobile.includes("+91") ? ShopMobile : `+91${ShopMobile}`,
      countryCode: "+91",
      mobile: ShopMobile.includes("+91")
        ? ShopMobile.replace("+91", "")
        : ShopMobile,
      mainCategory: shopCategory,
      storeLogo: shopImage,
      whatsAppNumber: whatsApp,
      storeAddress: {
        pincode: pincode,
        address1: address_line1,
        address2: address_line2,
        nearBy: "",
        state: state,
        city: city === "Mumbai Suburban" ? "Mumbai" : city,
        country: "India",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        contactPersonName: shopOwnerName ? shopOwnerName : shopName,
        contactPersonMobile: ShopMobile.includes("+91")
          ? ShopMobile.replace("+91", "")
          : ShopMobile,
      },
      hearAboutUs: hearAboutUs,
      hearAboutUsOtherText: "sellerApp",
      kycDetail: {
        gstNumber: gstNumber ? gstNumber : "",
        gstEnrollmentNumber: gstEnrollmentNumber ? gstEnrollmentNumber : "",
        aadharNumber: aadharPanNumber ? aadharPanNumber : "",
        aadharImage: aadharPanImage ? aadharPanImage : "",
        panNumber: panNumber ? panNumber : "",
        companyName: companyName ? companyName : "",
        signature: signatureCanvas ? signatureCanvas : "",
      },
      bankDetails: {
        accountName: accountHolderName ? accountHolderName : "",
        accountNumber: accountNumber ? accountNumber : "",
        accountBankName: bankDetail ? bankDetail : "",
        accountIfscCode: ifscCode ? ifscCode : "",
        accountCancleCheque: bankDetailProof ? bankDetailProof : "",
      },
      gstNumberPic: gstNumberPic ? gstNumberPic : "",
      shopPanImage: shopPanImage ? shopPanImage : "",
      fssaiLicense: fssaiLicense ? fssaiLicense : "",
      mainRestaurantId: mainRestaurantId ? mainRestaurantId : "",
      accountCancleChequeUpload: bankDetailProofImg ? bankDetailProofImg : "",
      addressProofPic: addressProofImg,
      upiId: "",
      qrCodeImage: "",
    };
    if (bankDetailProofImg) {
      body.isProfileComplete = true;
      body.isProfileSkip = false;
    } else if (skipProfile) {
      body.isProfileComplete = false;
      body.isProfileSkip = true;
    }
    try {
      const response = await API.post(UPDATE_VENDOR_PROFILE, body);
      if (response?.data?.success) {
        notify("success", response?.data?.message);
        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        let respondData = response?.data?.data;
        if (respondData?.isProfileComplete && !respondData?.isProfileSkip) {
          navigate("/shopdetails");
        }
        setTableloading(false);
      } else {
        setTableloading(false);
        notify("error", response?.data?.message);
      }
    } catch (error) {
      setTableloading(false);
      handleError(error);
    }
  };

  const addUpdateImage = (selectedFile, data) => {
    const formData = new FormData();
    setisDisable(true);
    setisSpin(data);
    formData.append(`file`, selectedFile);
    axios
      .post(`${process.env.REACT_APP_KIKO_API_V1}/products/upload`, formData)
      .then((res) => {
        if (data === "shopImage") {
          setShopImage(res?.data?.file_url);
          setisDisable(false);
        }
        if (data === "aadharPanImage") {
          setAadharPanImage(res?.data?.file_url);
          setisDisable(false);
        }
        if (data === "gstNumberPic") {
          setGstNumberPic(res?.data?.file_url);
          setisDisable(false);
        }
        if (data === "shopPanImage") {
          setShopPanImage(res?.data?.file_url);
          setisDisable(false);
        }
        if (data === "addressProofImg") {
          setaddressProofImg(res?.data?.file_url);
          setisDisable(false);
        }
        if (data === "bankDetailProofImg") {
          setBankDetailProofImg(res?.data?.file_url);
          setisDisable(false);
        }
        if (data === "signature") {
          setSignatureCanvas(res?.data?.file_url);
          setisDisable(false);
        }
      });
  };

  const placeDetail = async (placeId) => {
    try {
      const mapToken = await mapTokenGenerator();
      const options = {
        method: "post",
        url: `https://ondc.kiko.live/api/v1/maps/getdetails-ola`,
        headers: {
          Authorization: `${token}`,
          desktop: true,
        },
        data: { placeId, token: mapToken },
      };
      const { data } = await axios(options);
      if (data.data.result["geometry"]) {
        const obj = {
          latitude: data?.data?.result?.geometry?.location?.lat,
          longitude: data?.data?.result?.geometry?.location?.lng,
        };
        getPlacesDetails(obj);
        setmap(false);
      } else {
        placeDetail(placeId);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const SearchResult = () => {
    const searchLocations = locations.map((item) => (
      <div
        className="resultList"
        onClick={() => {
          placeDetail(item?.place_id);
        }}
      >
        <img src={blacksearchIcon} alt="" />
        <div className="resultText">
          <h4>{item?.structured_formatting?.main_text}</h4>
          <p>{item?.description}</p>
        </div>
      </div>
    ));

    return <>{searchLocations}</>;
  };

  const handleGetCurrentLocation = async () => {
    if (window && window.flutter_inappwebview) {
      const latLong = await flutterfetchGeolocationCoords();
      if (latLong && latLong !== undefined && latLong !== "") {
        const latTemp = latLong.split(",");
        if (latTemp.length > 1) {
          const obj = {
            latitude: parseFloat(latTemp[0]),
            longitude: parseFloat(latTemp[1]),
          };
          getPlacesDetails(obj);
        } else {
          setPermissionAlertPopUp({ permission: true, type: "Geolocation" });
        }
      } else {
        setPermissionAlertPopUp({ permission: true, type: "Geolocation" });
      }
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const obj = { latitude, longitude };
          getPlacesDetails(obj);
        },
        (error) => {
          notify("error", error.message);
        }
      );
    } else {
      notify("error", "Geolocation is not supported by this browser.");
    }
  };

  function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    };
  }

  const onChange = (e) => {
    if (e.target.value !== "") {
      handleAddress(e);
    } else {
      setlocations([]);
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
  const debouncedOnChange = debounce(onChange, 500);

  const handlePaymentResponse = async (payload) => {
    try {
      if (payload?.paymentResponse?.razorpay_payment_id && payload?.success) {
        closeSubscriptionModal();
        setOpenPreRazorpayModal(false);
        const user = JSON.parse(localStorage.getItem("user")) || {};
        user.subscriptionActive = true;
        localStorage.setItem("user", JSON.stringify(user));
        notify("success", "Subscription Activated");
      } else {
        closeSubscriptionModal();
        setOpenPreRazorpayModal(false);
        notify("error", payload?.message);
      }
    } catch (error) {}
  };
  return (
    <>
      <div
        className={
          user_data?.isProfileSkip || (edit && edit?.edit)
            ? "kikoshopWrapper showWrapper"
            : "kikoshopWrapper"
        }
      >
        <div className="container">
          <div className="row ">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center">
                <div className="brandlogo">
                  <img src={kikoOndcLogo} alt="" />
                </div>
                {!sellerDetailActive &&
                !bankDetailActive &&
                !user_data?.isProfileSkip &&
                !edit &&
                !edit?.edit &&
                !window?.flutter_inappwebview ? (
                  <button
                    className="skipBtn"
                    onClick={() => {
                      handleLogout();
                      navigate("/");
                    }}
                  >
                    <img src={LogoutBlack} alt="" />
                  </button>
                ) : (
                  edit &&
                  edit?.edit &&
                  !window?.flutter_inappwebview && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        navigate("/shopdetails");
                      }}
                    >
                      Cancel
                    </button>
                  )
                )}
                {sellerDetailActive &&
                  !bankDetailActive &&
                  !user_data?.isProfileSkip &&
                  !edit &&
                  !edit?.edit && (
                    <div className="skipBtn">
                      {" "}
                      <button
                        className="skipBtn"
                        onClick={() => {
                          setskipProfile(true);
                          setbankDetailActive(true);
                          setisFormTwoComplete(true);
                        }}
                      >
                        Skip
                      </button>
                      <button
                        className="skipBtn"
                        onClick={() => {
                          handleLogout();
                          navigate("/");
                        }}
                      >
                        <img src={LogoutBlack} alt="" />
                      </button>
                    </div>
                  )}
                {bankDetailActive &&
                  !user_data?.isProfileSkip &&
                  !edit &&
                  !edit?.edit && (
                    <div className="skipBtn">
                      {" "}
                      <button
                        className="skipBtn"
                        onClick={() => {
                          kikoDashboard();
                        }}
                      >
                        Skip
                      </button>
                      {!user_data?.isProfileSkip && !edit && !edit?.edit && (
                        <button
                          className="skipBtn"
                          onClick={() => {
                            handleLogout();
                            navigate("/");
                          }}
                        >
                          <img src={LogoutBlack} alt="" />
                        </button>
                      )}
                    </div>
                  )}
              </div>
              <div className="shopDetailsBlock">
                <ul className="nav nav-pills" role="tablist">
                  {((edit && edit?.field === "shopDetail") || !edit) && (
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-bs-toggle={shopDetailActive ? "pill" : ""}
                        href={shopDetailActive ? "#home" : ""}
                        onClick={() => {
                          setshopDetailActive(true);
                          setsellerDetailActive(false);
                          setbankDetailActive(false);
                        }}
                        ref={shopMenuLinkRef}
                      >
                        <img src={GrayShopDetails} className="gray" alt="" />
                        <img src={BlueShopDetails} className="blue" alt="" />
                        <h6>Shop Details</h6>
                      </a>
                    </li>
                  )}
                  {((edit && edit?.field === "sellerDetail") || !edit) && (
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle={sellerDetailActive ? "pill" : ""}
                        href={sellerDetailActive ? "#menu1" : "#"}
                        onClick={() => {
                          if (isFormOneComplete) {
                            setshopDetailActive(false);
                            setsellerDetailActive(true);
                            setbankDetailActive(false);
                          }
                        }}
                        ref={sellerMenuLinkRef}
                      >
                        <img src={GrayBankDetails} className="gray" alt="" />
                        <img src={BlueBankDetails} className="blue" alt="" />
                        <h6>Seller Details</h6>
                      </a>
                    </li>
                  )}
                  {((edit && edit?.field === "bankDetail") || !edit) && (
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle={bankDetailActive ? "pill" : ""}
                        href={bankDetailActive ? "#menu2" : "#"}
                        onClick={() => {
                          if (isFormOneComplete && isFormTwoComplete) {
                            setshopDetailActive(false);
                            setsellerDetailActive(false);
                            setbankDetailActive(true);
                          }
                        }}
                        ref={bankMenuLinkRef}
                      >
                        <img src={GraySellerDetails} className="gray" alt="" />
                        <img src={BlueSellerDetails} className="blue" alt="" />

                        <h6>Bank Details</h6>
                      </a>
                    </li>
                  )}
                </ul>
                <div className="tab-content">
                  <div id="home" className="container tab-pane active">
                    {tableLoading ? (
                      <Spin
                        indicator={antIcon}
                        className="loader"
                        size="large"
                      />
                    ) : (
                      <div className="shopDetailsWrapper">
                        <div className="shopDetails-list">
                          <form>
                            <div className="row">
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    shopName
                                      ? shopName
                                      : "Shop Name / Brand Name*"
                                  }
                                  value={shopName}
                                  onChange={(e) => {
                                    setShopName(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !shopName && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    shopOwnerName
                                      ? shopOwnerName
                                      : "Shop Owner Name*"
                                  }
                                  value={shopOwnerName}
                                  onChange={(e) => {
                                    setShopOwnerName(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !shopOwnerName && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <label className="form-control">
                                  +91{ShopMobile}
                                </label>
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  pattern="[0-9]*"
                                  className="form-control"
                                  inputMode="numeric"
                                  maxLength={10}
                                  placeholder={
                                    whatsApp
                                      ? whatsApp
                                      : "Alternate Number / WhatsApp Number"
                                  }
                                  value={whatsApp}
                                  onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    if (/^\d*$/.test(enteredValue)) {
                                      setWhatsApp(enteredValue);
                                    }
                                  }}
                                  validations={[required]}
                                />
                                {whatsApp?.length > 1 &&
                                  (whatsApp?.length ?? 0) < 10 && (
                                    <p className="error">Required*</p>
                                  )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    shopEmail ? shopEmail : "Enter Email Id*"
                                  }
                                  value={shopEmail}
                                  onChange={(e) => {
                                    setShopEmail(e.target.value);
                                  }}
                                  validations={[required, email]}
                                />
                                {(isshopEmailValid ||
                                  (superValidation && !shopEmail)) && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <select
                                  className="form-select form-control"
                                  aria-label="Shop Category"
                                  value={shopCategory}
                                  onChange={(e) => {
                                    setShopCategory(e.target.value);
                                  }}
                                  validations={[required]}
                                >
                                  <option value="">Shop Category</option>
                                  {categoriesList.map((category, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={category.title}
                                      >
                                        {category.title}
                                      </option>
                                    );
                                  })}
                                </select>
                                {superValidation && !shopCategory && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              {!edit && (
                                <div className="col-12 mb-3">
                                  <select
                                    className="form-select form-control"
                                    aria-label="Shop Category"
                                    value={brandName}
                                    onChange={(e) => {
                                      setBrandName(e.target.value);
                                    }}
                                    validations={[required]}
                                  >
                                    <option value="">Brand Name</option>
                                    {brandNameList.map((brand, index) => {
                                      return (
                                        <option key={index} value={brand}>
                                          {brand}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {superValidation && !brandName && (
                                    <p className="error">Required*</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </form>
                          <div className="uploadImgBlock upload_img">
                            <div className="ImgPreview">
                              {shopImage &&
                              typeof shopImage === "string" &&
                              [".pdf", ".PDF"].some((ext) =>
                                shopImage.endsWith(ext)
                              ) ? (
                                <img
                                  src={
                                    !pdfFile || pdfFile === ""
                                      ? defaultImage
                                      : pdfFile
                                  }
                                  className="logoimg"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={
                                    !shopImage || shopImage === ""
                                      ? defaultImage
                                      : shopImage
                                  }
                                  className="logoimg"
                                  alt=""
                                />
                              )}
                            </div>
                            <button
                              className="btn btn-md p-0 btn-primary uploadBtn"
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
                                        "shopImage"
                                      );
                                    };
                                    input.click();
                                  }
                                } else {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.onchange = async (e) => {
                                    addUpdateImage(
                                      e.target.files[0],
                                      "shopImage"
                                    );
                                  };
                                  input.click();
                                }
                              }}
                            >
                              <p className="upload-img">
                                {isDisable && isSpin === "shopImage" ? (
                                  <Space
                                    size="middle"
                                    className="Loader"
                                    style={{ left: "-30px" }}
                                  >
                                    <div>
                                      {" "}
                                      <Spin size="medium" className="spiner" />
                                    </div>
                                  </Space>
                                ) : (
                                  ""
                                )}
                                Upload Shop Image <img src={uploadImg} alt="" />
                              </p>
                            </button>
                          </div>
                          {superValidation && !shopImage && (
                            <p className="error">Required*</p>
                          )}
                        </div>
                        <div className="shopDetails-list">
                          <div className="share-location">
                            <div className="location-btn">
                              <button
                                className="btn btn-md btn-primary"
                                onClick={() => {
                                  setmap(true);
                                }}
                              >
                                Select Shop Location{" "}
                                <img src={Whitelocation} alt="" />
                              </button>
                            </div>

                            <div className="location-btn">
                              <button
                                className="btn btn-md btn-primary"
                                onClick={() => {
                                  setmap(true);
                                }}
                              >
                                Change Location
                              </button>
                            </div>
                          </div>
                          {superValidation && !latitude && (
                            <p className="error">Required*</p>
                          )}
                          <p className="mt-4">
                            Select exact location of shop on map.Product will be
                            picked up from this location for delivery
                          </p>
                          <form>
                            <div className="row">
                              <div className="col-7 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                  maxLength={6}
                                  placeholder={pincode ? pincode : "Pin code"}
                                  value={pincode}
                                  onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    if (
                                      /^\d*$/.test(enteredValue) &&
                                      enteredValue.length <= 6
                                    ) {
                                      setPincode(enteredValue);
                                    }
                                  }}
                                  validations={[required]}
                                />

                                {superValidation && !pincode && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-5 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={location ? location : "Location"}
                                  value={location}
                                  onChange={(e) => {
                                    setLocation(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !location && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  placeholder={state ? state : "State"}
                                  value={state}
                                  className="form-control"
                                  onChange={(e) => {
                                    setState(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !state && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  placeholder={
                                    address_line1
                                      ? address_line1
                                      : "Flat, House No. Building ,Company"
                                  }
                                  value={address_line1}
                                  className="form-control"
                                  onChange={(e) => {
                                    setAddress_line1(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !address_line1 && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  placeholder={
                                    address_line2
                                      ? address_line2
                                      : "Address line"
                                  }
                                  value={address_line2}
                                  className="form-control"
                                  onChange={(e) => {
                                    setAddress_line2(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !address_line2 && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  placeholder={city ? city : "city"}
                                  value={city}
                                  className="form-control"
                                  onChange={(e) => {
                                    setcity(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !city && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              {!edit && (
                                <div className="col-12 mb-3">
                                  <select
                                    className="form-select form-control"
                                    aria-label="How did you hear about us?"
                                    value={hearAboutUs}
                                    onChange={(e) => {
                                      setHearAboutUs(e.target.value);
                                    }}
                                    validations={[required]}
                                  >
                                    <option value="">
                                      How did you hear about us?
                                    </option>
                                    <option value="instagram">Instagram</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="KikoTeam">KikoTeam</option>
                                    <option value="ITC">ITC</option>
                                    <option value="other">Other</option>
                                  </select>
                                  {superValidation && !hearAboutUs && (
                                    <p className="error">Required*</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </form>
                          <div className="text-center  mt-4 mb-5">
                            <button
                              className="btn btn-md btn-primary submitBtn"
                              disabled={isDisable}
                              onClick={handleShopDetail}
                            >
                              SAVE & PROCEED
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div id="menu1" className="container tab-pane fade">
                    {tableLoading ? (
                      <Spin
                        indicator={antIcon}
                        className="loader"
                        size="large"
                      />
                    ) : (
                      <div className="shopDetailsWrapper">
                        <div className="shopDetails-list">
                          <form>
                            <div className="row">
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    shopOwnerName
                                      ? shopOwnerName
                                      : "Shop Owner Name/Company Name*"
                                  }
                                  value={shopOwnerName}
                                  onChange={(e) => {
                                    setShopOwnerName(e.target.value);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation && !shopOwnerName && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    aadharPanNumber
                                      ? aadharPanNumber
                                      : "Aadhar Card Number*"
                                  }
                                  value={aadharPanNumber}
                                  maxLength={12}
                                  onChange={(e) => {
                                    setAadharPanNumber(e.target.value);
                                    setsuperValidation(false);
                                  }}
                                  validations={[required]}
                                />
                                {superValidation ? (
                                  !aadharPanNumber ? (
                                    <p className="error">Required*</p>
                                  ) : aadharPanNumber &&
                                    !(
                                      /^\d{12}$/.test(aadharPanNumber) ||
                                      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
                                        aadharPanNumber
                                      )
                                    ) ? (
                                    <p className="error">
                                      please enter valid Aadhar Card number
                                    </p>
                                  ) : null
                                ) : null}
                              </div>
                              <div className="col-12 mb-3">
                                <input
                                  type="number"
                                  placeholder={
                                    fssaiLicense
                                      ? fssaiLicense
                                      : "Fssai License"
                                  }
                                  className="form-control"
                                  maxlength="14"
                                  value={fssaiLicense}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (
                                      (inputValue === "" ||
                                        Number(inputValue) >= 0) &&
                                      /^\d*$/.test(inputValue) &&
                                      inputValue.length <= 14
                                    ) {
                                      setFssaiLicense(inputValue);
                                    }
                                  }}
                                />
                              </div>
                              {(shopCategory === "F&B" ||
                                shopCategory === "Food & Beverage") && (
                                <div className="col-12 mb-3">
                                  <input
                                    type="text"
                                    placeholder={
                                      mainRestaurantId
                                        ? mainRestaurantId
                                        : "Petpooja Restaurant ID"
                                    }
                                    className="form-control"
                                    value={mainRestaurantId}
                                    maxLength={30}
                                    onChange={(e) => {
                                      const inputValue =
                                        e.target.value.trimStart();
                                      setMainRestaurantId(inputValue);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </form>
                          <div className="uploadImgBlock upload_img">
                            <div className="ImgPreview">
                              {aadharPanImage &&
                              typeof aadharPanImage === "string" &&
                              [".pdf", ".PDF"].some((ext) =>
                                aadharPanImage.endsWith(ext)
                              ) ? (
                                <img
                                  src={
                                    !pdfFile || pdfFile === ""
                                      ? defaultImage
                                      : pdfFile
                                  }
                                  className="logoimg"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={
                                    !aadharPanImage || aadharPanImage === ""
                                      ? defaultImage
                                      : aadharPanImage
                                  }
                                  className="logoimg"
                                  alt=""
                                />
                              )}
                            </div>
                            <button
                              className="btn btn-md p-0 btn-primary uploadBtn"
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
                                        "aadharPanImage"
                                      );
                                    };
                                    input.click();
                                  }
                                } else {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.onchange = async (e) => {
                                    addUpdateImage(
                                      e.target.files[0],
                                      "aadharPanImage"
                                    );
                                  };
                                  input.click();
                                }
                              }}
                            >
                              <p className="upload-img">
                                {isDisable && isSpin === "aadharPanImage" ? (
                                  <Space
                                    size="middle"
                                    className="Loader"
                                    style={{ left: "-30px" }}
                                  >
                                    <div>
                                      {" "}
                                      <Spin size="medium" className="spiner" />
                                    </div>
                                  </Space>
                                ) : (
                                  ""
                                )}
                                Upload Aadhar <img src={uploadImg} alt="" />
                              </p>
                            </button>
                          </div>
                          {superValidation && !aadharPanImage && (
                            <p className="error">Required*</p>
                          )}
                          <div className="uploadImgBlock upload_img mt-3">
                            <div className="ImgPreview">
                              {addressProofImg &&
                              typeof addressProofImg === "string" &&
                              [".pdf", ".PDF"].some((ext) =>
                                addressProofImg.endsWith(ext)
                              ) ? (
                                <img
                                  src={
                                    !pdfFile || pdfFile === ""
                                      ? defaultImage
                                      : pdfFile
                                  }
                                  className="logoimg"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={
                                    !addressProofImg || addressProofImg === ""
                                      ? defaultImage
                                      : addressProofImg
                                  }
                                  className="logoimg"
                                  alt=""
                                />
                              )}
                            </div>
                            <button
                              className="btn btn-md p-0 btn-primary uploadBtn"
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
                                        "addressProofImg"
                                      );
                                    };
                                    input.click();
                                  }
                                } else {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.onchange = async (e) => {
                                    addUpdateImage(
                                      e.target.files[0],
                                      "addressProofImg"
                                    );
                                  };
                                  input.click();
                                }
                              }}
                            >
                              <p className="upload-img">
                                {isDisable && isSpin === "addressProofImg" ? (
                                  <Space
                                    size="middle"
                                    className="Loader"
                                    style={{ left: "-30px" }}
                                  >
                                    <div>
                                      {" "}
                                      <Spin size="medium" className="spiner" />
                                    </div>
                                  </Space>
                                ) : (
                                  ""
                                )}
                                Shop Address Proof{" "}
                                <img src={uploadImg} alt="" />
                              </p>
                            </button>
                          </div>
                          {superValidation && !addressProofImg && (
                            <p className="error">Required*</p>
                          )}
                        </div>
                        <div className="shopDetails-list ">
                          <div className="title">
                            <h6 className="m-0">Update your Tax Details</h6>
                          </div>
                          <div className="switchBtn">
                            <p style={{ color: "black" }}>
                              Do you Have GST Number?
                            </p>
                            <div class="can-toggle">
                              <span class="switcher switcher-1">
                                <input
                                  type="checkbox"
                                  id="switcher-1"
                                  checked={gstEnrollmentNumber === ""}
                                  onClick={() => {
                                    if (haveGstNumber) {
                                      setHaveGstNumber(false);
                                      setGstPopup(true);
                                      setGstEnrollmentNumber("");
                                    } else {
                                      setHaveGstNumber(true);
                                      setGstPopup(false);
                                      setGstEnrollmentNumber(" ");
                                    }
                                  }}
                                />
                                <label for="switcher-1"></label>
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3"></div>
                          <form>
                            <div className="row">
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    gstNumber ? gstNumber : "GSTIN Number"
                                  }
                                  disabled={
                                    gstEnrollmentNumber ||
                                    gstEnrollmentNumber !== ""
                                  }
                                  maxLength={15}
                                  value={gstNumber}
                                  onChange={(e) => {
                                    setGstNumber(e.target.value);
                                    setsuperValidation(false);
                                  }}
                                />
                                {/* {superValidation &&
                                gstEnrollmentNumber === "" ? (
                                  !gstNumber ? (
                                    <p className="error">Required*</p>
                                  ) : gstNumber &&
                                    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
                                      gstNumber
                                    ) ? (
                                    <p className="error">
                                      please enter valid GSTIN number
                                    </p>
                                  ) : null
                                ) : null} */}
                              </div>
                              {gstEnrollmentNumber &&
                                gstEnrollmentNumber !== "" && (
                                  <div className="col-12 mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={"GST Enrollment Number"}
                                      maxLength={15}
                                      value={
                                        !gstEnrollmentNumber ||
                                        gstEnrollmentNumber === " "
                                          ? ""
                                          : gstEnrollmentNumber
                                      }
                                      onChange={(e) => {
                                        setGstEnrollmentNumber(e.target.value);
                                        setGstNumber("");
                                        setsuperValidation(false);
                                      }}
                                    />
                                    {/* {superValidation && gstNumber === "" ? (
                                      !gstEnrollmentNumber ? (
                                        <p className="error">Required*</p>
                                      ) : gstEnrollmentNumber &&
                                        !/^[a-zA-Z0-9]{15}$/.test(
                                          gstEnrollmentNumber
                                        ) ? (
                                        <p className="error">
                                          please enter valid GST Enrollment
                                          number
                                        </p>
                                      ) : null
                                    ) : null} */}
                                  </div>
                                )}
                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  maxLength={10}
                                  placeholder={
                                    panNumber ? panNumber : "PAN Card Number *"
                                  }
                                  value={panNumber}
                                  onChange={(e) => {
                                    setPanNumber(e.target.value);
                                    setsuperValidation(false);
                                  }}
                                />
                              </div>
                              {superValidation ? (
                                !panNumber ? (
                                  <p className="error">Required*</p>
                                ) : panNumber &&
                                  !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
                                    panNumber
                                  ) ? (
                                  <p className="error">
                                    please enter valid PAN Card number
                                  </p>
                                ) : null
                              ) : null}

                              <div className="col-12 mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={
                                    companyName
                                      ? companyName
                                      : "Company/Entity Name"
                                  }
                                  value={companyName}
                                  onChange={(e) => {
                                    setCompanyName(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="uploadImgBlock upload_img">
                                <div className="ImgPreview">
                                  {gstNumberPic &&
                                  typeof gstNumberPic === "string" &&
                                  [".pdf", ".PDF"].some((ext) =>
                                    gstNumberPic.endsWith(ext)
                                  ) ? (
                                    <img
                                      src={
                                        !pdfFile || pdfFile === ""
                                          ? defaultImage
                                          : pdfFile
                                      }
                                      className="logoimg"
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={
                                        !gstNumberPic || gstNumberPic === ""
                                          ? defaultImage
                                          : gstNumberPic
                                      }
                                      className="logoimg"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <button className="btn btn-md p-0 btn-primary uploadBtn">
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      addUpdateImage(
                                        e.target.files[0],
                                        "gstNumberPic"
                                      );
                                    }}
                                    validations={[required]}
                                  />
                                  <p className="upload-img">
                                    {isDisable && isSpin === "gstNumberPic" ? (
                                      <Space
                                        size="middle"
                                        className="Loader"
                                        style={{ left: "-30px" }}
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
                                    Upload Gst certificate{" "}
                                    <img src={uploadImg} alt="" />
                                  </p>
                                </button>
                              </div>

                              <div className="uploadImgBlock upload_img mt-3">
                                <div className="ImgPreview">
                                  {shopPanImage &&
                                  typeof shopPanImage === "string" &&
                                  [".pdf", ".PDF"].some((ext) =>
                                    shopPanImage.endsWith(ext)
                                  ) ? (
                                    <img
                                      src={
                                        !pdfFile || pdfFile === ""
                                          ? defaultImage
                                          : pdfFile
                                      }
                                      className="logoimg"
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={
                                        !shopPanImage || shopPanImage === ""
                                          ? defaultImage
                                          : shopPanImage
                                      }
                                      className="logoimg"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <button className="btn btn-md p-0 btn-primary uploadBtn">
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      addUpdateImage(
                                        e.target.files[0],
                                        "shopPanImage"
                                      );
                                    }}
                                    validations={[required]}
                                  />
                                  <p className="upload-img">
                                    {isDisable && isSpin === "shopPanImage" ? (
                                      <Space
                                        size="middle"
                                        className="Loader"
                                        style={{ left: "-30px" }}
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
                                    Upload Shop Pan certificate{" "}
                                    <img src={uploadImg} alt="" />
                                  </p>
                                </button>
                              </div>
                            </div>
                          </form>
                          <div className="text-center">
                            <button
                              className="btn btn-md btn-primary submitBtn mb-5 mt-5"
                              disabled={isDisable}
                              onClick={handleSellerDetail}
                            >
                              SAVE &amp; PROCEED
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div id="menu2" className="container tab-pane fade">
                    {tableLoading ? (
                      <Spin
                        indicator={antIcon}
                        className="loader"
                        size="large"
                      />
                    ) : (
                      <div className="shopDetailsWrapper">
                        <div className="shopDetails-list">
                          <div className="title mb-5">
                            <h6 className="mb-0">*Required Information</h6>
                          </div>
                          <div className="tab-content" id="nav-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="nav-home"
                              role="tabpanel"
                              aria-labelledby="nav-home-tab"
                            >
                              <form>
                                <div className="row">
                                  <div className="col-12 mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={
                                        accountHolderName
                                          ? accountHolderName
                                          : "Account Holder’s Name*"
                                      }
                                      value={accountHolderName}
                                      onChange={(e) => {
                                        setAccountHolderName(e.target.value);
                                      }}
                                    />
                                    {superValidation && !accountHolderName && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                  <div className="col-12 mb-3">
                                    <input
                                      type="number"
                                      className="form-control"
                                      onFocus={(e) =>
                                        e.target.addEventListener(
                                          "wheel",
                                          function (e) {
                                            e.preventDefault();
                                          },
                                          { passive: false }
                                        )
                                      }
                                      inputType="number"
                                      placeholder={
                                        accountNumber
                                          ? accountNumber
                                          : "Account Number*"
                                      }
                                      value={accountNumber}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (
                                          inputValue === "" ||
                                          Number(inputValue) >= 0
                                        ) {
                                          setAccountNumber(inputValue);
                                        }
                                      }}
                                      validations={[required]}
                                    />

                                    {superValidation && !accountNumber && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                  <div className="col-12 mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={
                                        bankDetail ? bankDetail : "Bank Name*"
                                      }
                                      value={bankDetail}
                                      onChange={(e) => {
                                        setBankDetail(e.target.value);
                                      }}
                                    />
                                    {superValidation && !bankDetail && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                  <div className="col-12 mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={
                                        ifscCode ? ifscCode : "IFSC Code*"
                                      }
                                      value={ifscCode}
                                      onChange={(e) => {
                                        const enteredValue = e.target.value;
                                        if (enteredValue.length <= 11) {
                                          setIfscCode(
                                            enteredValue.toUpperCase()
                                          );
                                          setsuperValidation(false);
                                        }
                                      }}
                                    />
                                    {superValidation ? (
                                      !ifscCode ? (
                                        <p className="error">Required*</p>
                                      ) : ifscCode &&
                                        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
                                          ifscCode
                                        ) ? (
                                        <p className="error">
                                          please enter valid IFSC code
                                        </p>
                                      ) : null
                                    ) : null}
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>

                        <div className="shopDetails-list">
                          <div>
                            <form>
                              <div className="row">
                                <div className="col-12 mb-3">
                                  <select
                                    className="form-select form-control"
                                    aria-label="Shop Category"
                                    value={bankDetailProof}
                                    onChange={(e) => {
                                      setBankDetailProof(e.target.value);
                                    }}
                                  >
                                    <option value="" disabled hidden>
                                      Proof of Bank Detail
                                    </option>
                                    <option value="cancelledCheque">
                                      Cancelled Cheque
                                    </option>
                                    <option value="passbook">Passbook</option>
                                    <option value="bankStatement">
                                      Bank Statement
                                    </option>
                                  </select>
                                  {superValidation && !bankDetailProof && (
                                    <p className="error">Required*</p>
                                  )}
                                </div>
                              </div>
                            </form>
                            <div className="uploadImgBlock upload_img">
                              <div className="ImgPreview">
                                {bankDetailProofImg &&
                                typeof bankDetailProofImg === "string" &&
                                [".pdf", ".PDF"].some((ext) =>
                                  bankDetailProofImg.endsWith(ext)
                                ) ? (
                                  <img
                                    src={
                                      !pdfFile || pdfFile === ""
                                        ? defaultImage
                                        : pdfFile
                                    }
                                    className="logoimg"
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    src={
                                      !bankDetailProofImg ||
                                      bankDetailProofImg === ""
                                        ? defaultImage
                                        : bankDetailProofImg
                                    }
                                    className="logoimg"
                                    alt=""
                                  />
                                )}
                              </div>
                              <button
                                className="btn btn-md p-0 btn-primary uploadBtn"
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
                                          "bankDetailProofImg"
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
                                        "bankDetailProofImg"
                                      );
                                    };
                                    input.click();
                                  }
                                }}
                              >
                                <p className="upload-img mb-0">
                                  {isDisable &&
                                  isSpin === "bankDetailProofImg" ? (
                                    <Space
                                      size="middle"
                                      className="Loader"
                                      style={{ left: "-30px" }}
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
                                  Upload Proof <img src={uploadImg} alt="" />
                                </p>
                              </button>
                            </div>
                            {superValidation && !bankDetailProofImg && (
                              <p className="error">Required*</p>
                            )}
                            <div className="text-center  mt-5 mb-5">
                              <button
                                className="btn btn-md btn-primary submitBtn"
                                disabled={isDisable}
                                onClick={handleBankDetail}
                              >
                                SAVE & PROCEED
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={map}
        contentLabel="Example Modal"
        onRequestClose={searchcloseModal}
        centered
      >
        <div className="addressmodalBlock">
          <ModalBody>
            <h2>Search Location</h2>
            <img
              src={crossIcon}
              style={{
                position: "absolute",
                right: "23px",
                maxWidth: "15px",
                top: "16px",
                cursor: "pointer",
              }}
              alt=""
              onClick={searchcloseModal}
            />
            <div className="searchBlock">
              <img src={searchIcon} alt="" />
              <input
                type="search"
                placeholder="Search shop via area, location ,name "
                onChange={debouncedOnChange}
              />
            </div>
            <div className="currenLocation">
              <img src={locationIcon} alt="" />
              <button
                className="AddAddress"
                onClick={() => {
                  handleGetCurrentLocation();
                }}
              >
                Use Current Location{" "}
              </button>
            </div>
            <div className={locations.length > 0 && "redultListBlock"}>
              {locations.length > 0 && SearchResult()}
            </div>
          </ModalBody>
        </div>
      </Modal>
      <PermissionAlertP
        permissionAlertPopUp={permissionAlertPopUp}
        setPermissionAlertPopUp={setPermissionAlertPopUp}
      />
      <Modal
        isOpen={Searchmodal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        centered
      >
        <div className="DropLocationModal">
          <ModalBody>
            <h2>Set Shop Location</h2>
            <img
              src={crossIcon}
              style={{
                position: "absolute",
                right: "23px",
                maxWidth: "15px",
                top: "16px",
                cursor: "pointer",
              }}
              alt=""
              onClick={closeModal}
            />
            <div className="DroMapBlock">
              {
                <WrappedMap
                  currLatlong1={{ latitude, longitude }}
                  func={(obj) => {
                    getPlacesDetails(obj);
                  }}
                />
              }
            </div>
            <div className="apartmentBlock mb-3">
              <div className="apartmentText">
                <div>
                  <p>{tittle}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchmodal(false);
              }}
            >
              Proceed to add details
            </button>
          </ModalBody>
        </div>
      </Modal>
      <Modal
        isOpen={agreement}
        onRequestClose={agreementModal}
        toggle={() => {
          setagreement(false);
        }}
        centered
      >
        <ModalHeader className="agreement-modal-header">
          <div className="text-center">
            <img src={kikoOndcLogo} alt="" />
            <h6 className="m-0">Seller Agreement</h6>
          </div>
          <img
            src={crossIcon}
            style={{ position: "absolute", right: "23px", maxWidth: "15px" }}
            alt=""
            onClick={() => {
              setagreement(false);
            }}
          />
        </ModalHeader>
        <ModalBody className="agreement-body-modal">
          <div className="agreement-body">
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
              {shopName} at {address_line1},{address_line2},{pincode}, an
              individual/entity registered on the the Kiko Live platform and
              selling its products on multiple buyer apps of ONDC as well as the
              website provided by Kiko Live, and having its address at{" "}
              {address_line1},{address_line2},{pincode}, hereinafter referred to
              as the "Seller."
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
              company. 
              
              The company may additionally charge variable fees in the
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
              with those orders. The Seller must provide valid delivery proofs
              for any order at any time upon the Company’s request. Failure to
              provide the requested delivery proofs within the stipulated
              timeframe will obligate the Seller to refund the entire settlement
              amount for the questioned orders back to the Company. In case of
              refunds initiated to the customer due to any reason that deems the
              order cancelled, the seller will be liable to return any settled
              funds for such cancelled orders back to the company. The Seller
              will be fully liable for any discrepancies or issues arising from
              the fraudulent orders or misbehavioral patterns, and the Company
              holds the right to pursue further legal action if necessary. In
              cases where a refund is required, the Seller must process the
              refund within the specified timeframe of the Company’s
              notification, and failure to comply may result in additional
              penalties or legal actions. The Company reserves the right to
              amend these terms and conditions at any time, and the Seller's
              continued participation in the Company's platform constitutes
              acceptance of the updated terms.
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
              IN WITNESS WHEREOF, the parties hereto have executed this Seller
              Agreement as of the Effective Date.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-between align-items-center border-0 agreement-footer">
          <div className="form-group m-0">
            <input
              type="checkbox"
              id="html"
              onChange={(e) => settearms_cond(e.target.checked)}
            />
            <label for="html">
              I Agree To The Smooth Tag Technologies Agreement
            </label>
          </div>
          <button
            className={tearms_cond ? "btn btn-primary" : "btn"}
            disabled={!tearms_cond}
            onClick={() => {
              updateVendorProfile();
              setagreement(false);
            }}
          >
            I Accept
          </button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={haveGstNumber && !gstPopup}
        onRequestClose={() => {
          setHaveGstNumber(true);
          setGstPopup(true);
        }}
        toggle={() => {
          setHaveGstNumber(true);
          setGstPopup(true);
          setGstEnrollmentNumber("");
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
            alt=""
            onClick={() => {
              setHaveGstNumber(true);
              setGstPopup(true);
              setSignatureCanvas(null);
              setGstEnrollmentNumber("");
            }}
          />
        </ModalHeader>
        <ModalBody className="declaration-body-modal">
          <div className="declaration-body">
            <p>
              I/we, <span>{shopOwnerName}</span>, proprietor/partner/director of{" "}
              <span>{shopName}</span> with GST{" "}
              <div className="gst-declation-input">
                <input
                  type="search"
                  placeholder="Enrollment Number"
                  maxLength={15}
                  onChange={(e) => {
                    setGstEnrollmentNumber(e.target.value);
                    setGstNumber("");
                  }}
                />
                <div>
                  <Popover content={GSTInfo} trigger="hover">
                    <img src={GSTInfoIcon} alt="" />
                  </Popover>
                </div>
              </div>{" "}
              having its registered office at {address_line1},{address_line2},
              {pincode}, hereby declare and confirm the following:
            </p>
            <p>
              1.That I/we am/are have obtained a valid enrollment number from
              the GST common portal, which is{" "}
              <div className="gst-declation-input">
                <div
                  className="gst-enroll-no"
                  style={{
                    color: `${
                      !gstEnrollmentNumber || gstEnrollmentNumber === " "
                        ? "grey"
                        : "black"
                    }`,
                  }}
                >
                  {!gstEnrollmentNumber || gstEnrollmentNumber === " "
                    ? "Enrollment Number"
                    : gstEnrollmentNumber}
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
              5.That I undertake to promptly inform {shopName} in case my
              turnover exceeds threshold limit for registering under GST.
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
              {isDisable && isSpin === "signature" ? (
                <Space size="middle" className="Loader">
                  <div>
                    <Spin size="medium" className="spiner" />
                  </div>
                </Space>
              ) : signatureCanvas ? (
                <>
                  <div className="signature-captcha">
                    <p>Saved Signature:</p>
                    <img src={signatureCanvas} alt="Saved Signature" />
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-primary signature-save-btn"
                      onClick={retryCanvas}
                    >
                      Retry
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{
                      width: 250,
                      height: 100,
                      className: "sigCanvas",
                    }}
                    ref={signatureCanvasRef}
                  />
                  <button onClick={clearCanvas} className=" cross-icon-btn">
                    <img src={crossIcon} className="cross-icon" alt="" />
                  </button>
                  <div className="mt-2">
                    <button
                      className="btn btn-primary signature-save-btn"
                      onClick={trimCanvas}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
            <br></br>
            <br></br>
            <div className="form-group m-0">
              <input
                type="checkbox"
                id="html"
                onChange={(e) => setGst_cond(e.target.checked)}
              />
              <label for="html">
                I hereby declare that the details provided are accurate,
                correct, and reflective of the actual facts and information.
              </label>
            </div>
            <div className="text-center w-100">
              <button
                className="btn btn-primary "
                disabled={!gst_cond || !gstEnrollmentNumber || !signatureCanvas}
                onClick={() => {
                  // updateVendorProfile();
                  setHaveGstNumber(true);
                  setGstPopup(true);
                  setGst_cond(false);
                }}
              >
                Save & Proceed
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isOpenSubscriptionModal}
        onRequestClose={closeSubscriptionModal}
        contentLabel="Subscription Modal"
        centered
      >
        <div className="DropLocationModal">
          <ModalBody>
            <div className="subscription-modal-header d-flex justify-content-center">
              <h2>Subscription Plan</h2>
              <img
                src={crossIcon}
                style={{
                  position: "absolute",
                  right: "23px",
                  maxWidth: "15px",
                  top: "16px",
                  cursor: "pointer",
                }}
                alt=""
                onClick={closeSubscriptionModal}
              />
            </div>
            <div className="subscription-options">
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
                    onClick={() => {
                      setOpenPreRazorpayModal(true);
                    }}
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
                      Promotional activities - banners, leaflets, standees
                    </li>
                    <li>
                      <CheckCircleFilled className="me-2 green-check" />
                      On-ground team support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="subscription-content-block">
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
                <RazorpayModule
                  paymentMethod={"subsciption"}
                  paymentFrom={"sellerRegistration"}
                  transactionFee={0}
                  orderAmount={2999}
                  paymentType={"FirstTime"}
                  subscriptionType={"Premium"}
                  subscriptionPlan={"OneYear"}
                  onPaymentResponse={handlePaymentResponse}
                />
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
                    Promotional activities - banners, leaflets, standees
                  </li>
                  <li>
                    <CheckCircleFilled className="me-2 green-check" />
                    On-ground team support
                  </li>
                </ul>
              </div>
            </div> */}
          </ModalBody>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenPreRazorpayModal}
        onRequestClose={() => {
          setOpenPreRazorpayModal(false);
        }}
      >
        <div className="subscribe-modal-payment">
          <PreRazorpay
            coinAmount={2999}
            paymentType={"FirstTime"}
            subscriptionType={"Premium"}
            subscriptionPlan={"OneYear"}
            amount={2999}
            from={"Registration"}
            onPaymentResponse={handlePaymentResponse}
            setOpenPreRazorpayModal={setOpenPreRazorpayModal}
          />
        </div>
      </Modal>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
    </>
  );
}
export default SellerRegistration;
