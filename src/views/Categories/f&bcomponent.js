import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import moment from "moment";
import "./styles.scss";
import { flutterfetchCameraPermission, handleError, notify } from "../../utils";
import { countries } from "../../country";
import { Space, Spin, Popover } from "antd";
import { ToastContainer, toast } from "react-toastify";
import leftArrow from "../../images/Categories/left-arrow.svg";
import youtube from "../../images/ProductPricing/youtube-icon.svg";
import headphone from "../../images/Categories/headphones.svg";
import watermark from "../../images/Categories/watermark.png";
import fakebranded from "../../images/Categories/fake-branded.png";
import imagewithprice from "../../images/Categories/image-with-price.png";
import pixelatedimage from "../../images/Categories/pixelated.png";
import invertedimage from "../../images/Categories/inverted.png";
import blurunclear from "../../images/Categories/blur-unclear.png";
import incompletedimage from "../../images/Categories/incomplete.png";
import stretchedshrunk from "../../images/Categories/stretched.png";
import imagewithprops from "../../images/Categories/image-with-props.png";
import imagewithtext from "../../images/Categories/image-with-text.png";
import submitcatalogBg from "../../images/Categories/submit-catalog-bg.svg";
import crossIcon from "../../images/Categories/image-cross.svg";
import whiteSubmitBg from "../../images/Categories/submit-catalog-bg.png";
import BlueInfoIcon from "../../images/blue-info.svg";
import { LoadingOutlined } from "@ant-design/icons";
import UploadFile from "../../components/svgIcons/UploadFile";
import infoIcon from "../../images/Categories/info.svg";
import addImg from "../../images/Categories/add-img.svg";
import blockIcon from "../../images/Categories/block-icon.svg";
import BlockGray from "../../images/Categories/block-gray.svg";
import frontImg from "../../images/Categories/front-img.png";
import BackImg from "../../images/Categories/back-img.png";
import FaishionFront from "../../images/Categories/faishion-front.png";
import FaishionBack from "../../images/Categories/faishion-back.png";
import HealthFront from "../../images/Categories/health-front.png";
import HealthBack from "../../images/Categories/health-back.png";
import deleteIcon from "../../images/delete-icon.svg";
import CirclePlus from "../../images/circle-plus.svg";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  GET_CATEGORY,
  FETCH_MENU_LIST,
  CREATE_CATELOGUE,
  UPDATE_VENDOR_PROFILE_DETAIL,
  GET_CATELOGUE,
  GET_CATELOGUE_VARIENT,
  DELETE_VARIENT,
  CREATE_UPDATE_CUSTOM_MENU,
  CREATE_UPDATE_CUSTOM_GROUP,
  FETCH_CUSTOM_GROUP_LIST
} from "../../api/apiList";
import API from "../../api";
import defaultImage from "../../images/defaultImage.jpg";
import PermissionAlertP from "../../components/Modal/PermissionAlertPopup";
import { MultiSelect } from "react-multi-select-component";
import TimePicker from 'react-time-picker';
// import BarcodeScanner from "../../components/Scanner/barCodeScanner";
import { Select } from 'antd';
const Option = Select.Option;

function FBCategories(props) {
  const location = useLocation();
  const { state } = location;
  const platformIcon = (
    <ul className="platformContent">
      <li className="mb-3">
        The <span>Buyer and Seller platform applies a 5% transaction fee</span>,
        which is deducted from the selling price of your item.{" "}
      </li>
      <li>
        Eg.{" "}
        <span>
          Selling Price - Platform Fees = Settlement amount. ₹500 - 5% = ₹475
        </span>
      </li>
    </ul>
  );
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
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let user = getSellerDetails();
  const [catelogData, setCatelogData] = useState(
    state ? state?.catelogData : {}
  );
  const [user_data] = useState(user);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [superValidation, setsuperValidation] = useState(false);
  const [menuPopup, setMenuPopup] = useState(false);
  const [isReturnable, setisReturnable] = useState(
    catelogData?._id ? catelogData?.isReturnable : false
  );
  const [isCancellable, setisCancellable] = useState(
    catelogData?._id ? catelogData?.isCancellable : false
  );
  const [categoriesList, setcategoriesList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState({});
  const [openCatalog, setopencatalog] = useState(false);
  const [subCategoriesList, setsubCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    catelogData?._id ? catelogData?.categoryId : ""
  );
  const [selectedsubCategories, setselectedsubCategories] = useState(
    catelogData?._id ? catelogData?.subCategoryId : ""
  );
  const [productImage, setProductImage] = useState(
    catelogData?._id ? catelogData?.productImages : []
  );
  const [productName, setProductName] = useState(
    catelogData?._id ? catelogData?.productName : ""
  );
  const [productId, setProductId] = useState(
    catelogData?._id ? catelogData?.productId : ""
  );
  const [weight, setweight] = useState(
    catelogData?._id ? catelogData?.weight : ""
  );
  const [maxAvailableQuantity, setMaxAvailableQuantity] = useState(
    catelogData?._id ? catelogData?.maxAvailableQuantity : ""
  );
  const [itemLevelDeliveryCharges, setItemLevelDeliveryCharges] = useState(
    catelogData?._id ? catelogData?.itemLevelDeliveryCharges : ""
  );
  const [gst, setGst] = useState(catelogData?._id ? catelogData?.gst : 0);
  // const [imageLink, setimageLink] = useState("");
  const [weightUnit, setweightUnit] = useState(
    catelogData?._id ? catelogData?.weightUnit : "GRAMS"
  );
  const [quantity, setquantity] = useState(
    catelogData?._id ? catelogData?.availableQuantity : ""
  );
  const [skuCode, setSkuCode] = useState(
    catelogData?._id ? catelogData?.skuCode : ""
  );
  const [country, setcountry] = useState(
    catelogData?._id ? catelogData?.countryOfOrigin : "India"
  );
  const [description, setdescription] = useState(
    catelogData?._id ? catelogData?.description : ""
  );
  const [price, setprice] = useState(
    catelogData?._id ? catelogData?.price : ""
  );
  const [foodType, setfoodType] = useState(
    catelogData?._id ? catelogData?.foodType : "veg"
  );
  const [discount, setdiscount] = useState(
    catelogData?._id ? catelogData?.discountedPrice : ""
  );
  const [size, setsize] = useState(catelogData?._id ? catelogData?.size : "");
  const [color, setcolor] = useState(
    catelogData?._id ? catelogData?.color : ""
  );
  const [material, setmaterial] = useState(
    catelogData?._id ? catelogData?.material : ""
  );
  const [fssaiLicense, setFssaiLicense] = useState(
    user_data ? user_data?.fssaiLicense : ""
  );
  const [packagingCost, setpackagingCost] = useState(
    catelogData?._id ? catelogData?.packagingCost : ""
  );
  const [isDisable, setisDisable] = useState(false);
  const [isSpin, setisSpin] = useState("");
  const [submitDisable, setsubmitDisable] = useState(false);
  const [packagedFood, setpackagedFood] = useState(
    catelogData?._id ? catelogData?.packagedFood : true
  );
  const [loading, setLoading] = useState(false);
  const addProductLink = useRef(null);
  const [componentMounted, setComponentMounted] = useState(false);
  const [manufactureName, setManufactureName] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_packaged_commodities
        ?.manufacturer_or_packer_name
      : ""
  );
  const [commonName, setCommonName] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_packaged_commodities
        ?.common_or_generic_name_of_commodity
      : ""
  );
  const [mfgLicense, setMfgLicense] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_packaged_commodities?.mfg_license_no
      : ""
  );
  const [customModal, setAddCustomModal] = useState(false)
  const [submitCustomGroup, setSubmitCustomGroup] = useState(false)


  const [manufacturerDate, setManufacturerDate] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_packaged_commodities?.month_year_of_manufacture_packing_import
        .split("/")
        .reverse()
        .join("-")
      : ""
  );
  // const [energy, setEnergy] = useState(
  //   catelogData?._id ? catelogData?.nutritionalInfo?.energyPer100kg : ""
  // );
  const [bpcProps, setBpcProps] = useState(
    catelogData?._id
      ? catelogData?.bpcProps
      : {
        concerns: "",
        skinType: "",
        expiryDate: "",
        ingredients: "",
        formulation: "",
        gender: "",
        preference: [],
        conscious: "",
      }
  );
  const [hwProps, setHwProps] = useState(
    catelogData?._id
      ? catelogData?.hwProps
      : {
        expiryDate: "",
        usageInstruction: "",
        prescription: false,
      }
  );
  const [hkProps, setHkProps] = useState(
    catelogData?._id
      ? catelogData?.hkProps
      : {
        length: "",
        height: "",
        bredth: "",
        careInstruction: "",
        specialFeatures: "",
        Modal: "",
        assemblyRequired: false,
      }
  );
  const [manufactureFSSAILicense, setManufactureFSSAILicense] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_prepackaged_food?.brand_owner_FSSAI_license_no?.toString()
      : ""
  );
  const [importerFSSAILicense, setImporterFSSAILicense] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_prepackaged_food?.importer_FSSAI_license_no?.toString()
      : ""
  );
  const [manufacturerAddress, setManufacturerAddress] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_packaged_commodities
        ?.manufacturer_or_packer_address
      : ""
  );
  const [otherFSSAILicense, setOtherFSSAILicense] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_prepackaged_food?.other_FSSAI_license_no?.toString()
      : ""
  );
  const [additivesInformation, setAdditivesInformation] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_prepackaged_food?.additives_info
      : ""
  );
  const [nutritionalInfo, setNutritionalInfo] = useState(
    catelogData?._id
      ? catelogData?.statutory_reqs_prepackaged_food?.nutritional_info
      : ""
  );
  // const [proteinServing, setProteinServing] = useState(
  //   catelogData?._id ? catelogData?.nutritionalInfo?.proteinPerServing : ""
  // );
  // const [energyServing, setEnergyServing] = useState(
  //   catelogData?._id ? catelogData?.nutritionalInfo?.energyPerServing : ""
  // );
  const [openScanner, setOpenScanner] = useState(false);
  const [value, onChange] = useState('10:00');
  const [variants, setVariants] = useState([]);
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [submitMenu, setSubmitMenu] = useState(false);
  const [menu, setMenu] = useState({
    userId: user_data._id,
    timeFrom: "0000",
    timeTo: "2359",
    status: "active",
    menuName: "",
    dayFrom: "",
    dayTo: "",
    isActive: true
  });
  const [customGroupList, setCustomGroupList] = useState([])
  const [customGroup, setCustomGroup] = useState({
    userId: user_data._id,
    sequence: 1,
    input: "",
    status: "active",
    max: 1,
    min: 0,
    customGroupName: "",
    isActive: true
  });
  const navigate = useNavigate();
  const skinTypeArray = [
    "All",
    "Normal Skin",
    "Oily Skin",
    "Dry Skin",
    "Very Dry Skin"
  ]
  const genderArray = [
    "Male",
    "Female",
    "Others",
    "Unisex"
  ]
  const concernArray = [
    "acne blemish", "anti ageing", "anti pollution", "bad breath", "blackhead whitehead", "brightening", "cavity", "chapped lip", "cleansing", "colour protection", "cuticle care", "dandruff", "dark spot pigmentation", "dry frizzy hair", "dryness", "dullness", "fine lines wrinkle", "firming", "hair fall thinning", "heat protection", "hydration", "menstrual cycle", "odour, oil control", "plaque", "pores", "product build up", "soap free", "split end", "stretch mark", "sun protection", "tan removal", "tangled hair", "under eye", "uneven skin tone", "waterproof"
  ]
  const colorArray = [
    "Red",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Orange",
    "Lime",
    "Aqua",
    "Teal",
    "Black",
    "Brown",
    "Red",
    "Maroon",
    "Cyan",
    "NavyBlue",
    "Pink"
  ]
  const materialArray = [
    "alpha",
    "acetate",
    "acrylic",
    "acrylonitrile",
    "aluminium",
    "battery",
    "brass",
    "canvas",
    "carbon",
    "cellulose",
    "cork",
    "cotton",
    "elastane",
    "elastodiene",
    "elastolefin",
    "ethylene",
    "EVA",
    "expanded",
    "faux leather",
    "foamed",
    "glass",
    "grey",
    "iron",
    "jute",
    "leather",
    "linen",
    "lycra",
    "lyocell",
    "mesh",
    "modal",
    "nubuck",
    "nylon",
    "polyamide",
    "polycarbonate",
    "polyester",
    "polyethylene",
    "polymethylpentene",
    "polyoxymethylene",
    "polypropylene",
    "polyurethane",
    "polyvinyl",
    "PU",
    "PVC",
    "rayon",
    "rice",
    "rubber",
    "sand",
    "silicon",
    "silk",
    "stainless",
    "steel",
    "styrene",
    "suede",
    "synthetic",
    "textile",
    "thermo",
    "thermoplastic",
    "tritan",
    "velvet",
    "viscose",
    "water",
    "wood",
    "wool",
    "zinc"
  ]
  const options = [
    { label: "Alcohol Free", value: "Alcohol Free" },
    { label: "Allergy Free", value: "Allergy Free" },
    { label: "Ammonia Free", value: "Ammonia Free" },
    { label: "Animal Hair", value: "Animal Hair" },
    { label: "Anti Inflammatory", value: "Anti Inflammatory" },
    { label: "Anti Oxidants", value: "Anti Oxidants" },
    { label: "Clinically Proven", value: "Clinically Proven" },
    { label: "Collagen", value: "Collagen" },
    { label: "Cruelty Free", value: "Cruelty Free" },
    { label: "Dermatologically Tested", value: "Dermatologically Tested" },
    { label: "Formaldehyde Free", value: "Formaldehyde Free" },
    { label: "Fragrance free", value: "Fragrance free" },
    { label: "Gluten Free", value: "Gluten Free" },
    { label: "Halal Certified", value: "Halal Certified" },
    { label: "Herbal", value: "Herbal" },
    { label: "Hyaluronic Acid", value: "Hyaluronic Acid" },
    { label: "Hypoallergenic", value: "Hypoallergenic" },
    { label: "Mineral Oil Free", value: "Mineral Oil Free" },
    { label: "Natural", value: "Natural" },
    { label: "Niacinamide", value: "Niacinamide" },
    { label: "Nun Comedogenic", value: "Nun Comedogenic" },
    { label: "Nun Vegetarian", value: "Nun Vegetarian" },
    { label: "Nut Free", value: "Nut Free" },
    { label: "Oil Free", value: "Oil Free" },
    { label: "Ophthalmologically Tested", value: "Ophthalmologically Tested" },
    { label: "Organic", value: "Organic" },
    { label: "Paba Free", value: "Paba Free" },
    { label: "Paraben Free", value: "Paraben Free" },
    { label: "Paraffin Free", value: "Paraffin Free" },
    { label: "Petrochemical Free", value: "Petrochemical Free" },
    { label: "Propleyne Free", value: "Propleyne Free" },
    { label: "Pthalate Free", value: "Pthalate Free" },
    { label: "Salicylic Acid", value: "Salicylic Acid" },
    { label: "Silicone Free", value: "Silicone Free" },
    { label: "Sls Free", value: "Sls Free" },
    { label: "Soap Free", value: "Soap Free" },
    { label: "Squalane", value: "Squalane" },
    { label: "Sulphate Free", value: "Sulphate Free" },
    { label: "Sun Protection", value: "Sun Protection" },
    { label: "Synthetic", value: "Synthetic" },
    { label: "Synthetic Color Free", value: "Synthetic Color Free" },
    { label: "Vegan", value: "Vegan" },
    { label: "Vegetarian", value: "Vegetarian" },
    { label: "Vitamin A", value: "Vitamin A" },
    { label: "Vitamin C", value: "Vitamin C" },
    { label: "Vitamin E", value: "Vitamin E" },
    { label: "Water Resistat", value: "Water Resistat" },
    { label: "Water Proof", value: "Water Proof" },
    { label: "Waterless", value: "Waterless" },
  ];

  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({
    permission: false,
    type: "",
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedsubCategories && productImage?.length !== 0) {
      addProductLink.current.click();
    }
  }, [selectedsubCategories]);

  const required = (value) => {
    if (!value || value === undefined || value === null || value === "") {
      return true;
    }
    return false;
  };

  const getCategories = async () => {
    try {
      const response = await API.get(GET_CATEGORY);
      if (response.data?.success) {
        setcategoriesList(response?.data?.data);
        setsubCategoriesList(response?.data?.data[0].subCategories);
        !catelogData && setSelectedCategory(response?.data?.data[0].title)
      }
    } catch (error) {
      handleError(error);
    }
  };
  const getMenuList = async () => {
    try {
      const response = await API.post(FETCH_MENU_LIST, { userId: user_data._id });
      if (response.data?.success) {
        setMenuList(response?.data?.result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getCustomGroupList = async () => {
    try {
      const response = await API.post(FETCH_CUSTOM_GROUP_LIST, { userId: user_data._id });
      if (response.data?.success) {
        setCustomGroupList(response?.data?.result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  function compareObjects(obj1, obj2) {
    let isEqual = true;
    let isAvailableDifferent = false;

    for (let key in obj1) {
      if (key === "status") {
        continue;
      }
      if (key === "fssaiLicense") {
        continue;
      }
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        if (obj1[key] !== obj2[key]) {
          isEqual = false;
          if (key === "availableQuantity") {
            isAvailableDifferent = true;
          }
        }
      } else {
        isEqual = false;
      }
    }
    if (isAvailableDifferent) {
      obj1.status = obj2.status;
    }

    return isEqual;
  }

  useEffect(() => {
    if (componentMounted) {
      getCategories();
      getMenuList()
      getCustomGroupList()
    } else {
      setComponentMounted(true);
    }
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [componentMounted]);

  useEffect(() => {
    if (catelogData?._id && catelogData?.userId) {
      getCatelogueVarient();
    }
  }, []);

  const submitCatelog = async (status) => {
    const isselectedCategory = required(selectedCategory);
    const isselectedsubCategories = required(selectedsubCategories);
    const isproductImage = required(productImage);
    const isproductName = required(productName);
    const isweight = required(weight);
    const isquantity = required(quantity);
    const iscountry = required(country);
    const isdescription = required(description);
    const isprice = required(price);
    const isdiscount = parseInt(discount) > parseInt(price);

    if (
      !isselectedCategory &&
      !isselectedsubCategories &&
      !isproductImage &&
      !isproductName &&
      !isweight &&
      !isquantity &&
      !iscountry &&
      !isdescription &&
      !isprice &&
      !isdiscount
    ) {
      addCatelog(status);
    } else {
      setsuperValidation(true);
    }
  };

  const addCatelog = async (status) => {
    setsubmitDisable(true);
    const obj = {
      productImages: productImage,
      userId: user_data && user_data._id ? user_data._id : "",
      productName,
      categoryId: selectedCategory,
      productId,
      weight,
      subCategoryId: selectedsubCategories,
      weightUnit,
      availableQuantity: quantity,
      skuCode,
      countryOfOrigin: country,
      description,
      price,
      status,
      discountedPrice: discount,
      isReturnable,
      isCancellable,
      gst,
      variants,
      maxAvailableQuantity,
      itemLevelDeliveryCharges
    };
    if (catelogData?._id && catelogData?.userId) {
      obj._id = catelogData?._id;
    }
    if (selectedMenu?._id && selectedMenu?._id !== "") {
      obj.menuId = selectedMenu?._id;
    }
    if (selectedCategory === "Grocery" && productId === "") {
      setsuperValidation(true);
      return;
    }
    if (selectedCategory === "Beauty & Personal Care") {
      if (
        bpcProps.concerns === "" ||
        bpcProps.expiryDate === "" ||
        bpcProps.ingredients === "" ||
        bpcProps.formulation === "" ||
        bpcProps.gender === "" ||
        bpcProps.preference === "" ||
        color === ""
      ) {
        setsuperValidation(true);
        return;
      } else {
        obj.bpcProps = bpcProps;
        obj.color = color;
      }
    }
    if (selectedCategory === "Home & Kitchen") {
      const ismaterial = required(material);
      const iscolor = required(color);
      if (iscolor || ismaterial) {
        setsuperValidation(true);
        return;
      } else {
        obj.hkProps = hkProps;
        obj.material = material;
        obj.color = color;
      }
    }
    if (selectedCategory === "Health & Wellness") {
      if (hwProps?.expiryDate === "") {
        setsuperValidation(true);
        return;
      } else {
        obj.hwProps = hwProps;
      }
    }
    if (selectedCategory === "F&B" || selectedCategory === "Food & Beverage") {
      const isfssaiLicense = required(fssaiLicense);
      const ispackagingCost = required(packagingCost);
      if (isfssaiLicense || ispackagingCost) {
        setsuperValidation(true);
        return;
      }
      if (fssaiLicense?.length !== 14) {
        setsuperValidation(true);
        notify("error", "Please put valid Fssai Number");
        return;
      }
      obj.fssaiLicense = fssaiLicense;
      obj.foodType = foodType;
      obj.packagingCost = packagingCost;
      if (obj?.variants?.length > 0) {
        obj.isCustom = true
        obj.customGroupId = obj?.variants[0]?.customGroupId
        // let previouseChildVal = ""
        // let previouseCustomVal = obj?.variants[obj?.variants?.length-1]?.customGroupId
        // for(let i=obj?.variants?.length-1;i>=0;i--){
        //   if(previouseCustomVal != obj?.variants[i]?.customGroupId){
        //     obj.variants[i].childCustomGroupId = previouseCustomVal
        //     previouseCustomVal = obj.variants[i].customGroupId
        //   }else{
        //     obj.variants[i].childCustomGroupId = ""
        //     previouseCustomVal = obj?.variants[i]?.customGroupId
        //   }
        // }
      }
    }
    if (selectedCategory === "Fashion") {
      const ismaterial = required(material);
      const issize = required(size);
      const iscolor = required(color);
      if (issize || iscolor || ismaterial) {
        setsuperValidation(true);
        return;
      }
      obj.size = size;
      obj.color = color;
      obj.material = material;
    } else if (
      [
        "Health & Wellness",
        "Beauty & Personal Care",
        "Grocery",
        "Fashion",
      ].includes(selectedCategory) &&
      packagedFood
    ) {
      obj.packagedFood = packagedFood;
      if (productImage?.length < 2) {
        notify("error", "Please Put Back Image For Packaged Food");
        setsubmitDisable(false);
        return;
      }
      const ismanufactureName = required(manufactureName);
      const ismanufacturerAddress = required(manufacturerAddress);
      // const iscommonName = required(commonName);
      const ismanufacturerDate = required(manufacturerDate);
      if (
        ismanufactureName ||
        ismanufacturerAddress ||
        // iscommonName ||
        ismanufacturerDate
      ) {
        setsuperValidation(true);
        return;
      }
      obj.statutory_reqs_packaged_commodities = {
        manufacturer_or_packer_name: manufactureName,
        manufacturer_or_packer_address: manufacturerAddress,
        common_or_generic_name_of_commodity: commonName,
        net_quantity_or_measure_of_commodity_in_pkg: weight + weightUnit,
        month_year_of_manufacture_packing_import: manufacturerDate
          .split("-")
          .reverse()
          .join("/"),
        imported_product_country_of_origin: countries.find(
          (item) => item.name === country
        )?.code,
      };
      if (
        selectedCategory === "Health & Wellness" ||
        selectedCategory === "Beauty & Personal Care"
      ) {
        const ismfgLicense = required(mfgLicense);
        if (ismfgLicense) {
          setsuperValidation(true);
          return;
        }
        obj.statutory_reqs_packaged_commodities.mfg_license_no = mfgLicense;
      }
      if (
        [
          "Gourmet & World Foods",
          "Beverages",
          "Bakery, Cakes & Dairy",
          "Snacks & Branded Foods",
          "Dairy and Cheese",
          "Snacks, Dry Fruits, Nuts",
          "Cereals and Breakfast",
          "Sauces, Spreads and Dips",
          "Chocolates and Biscuits",
          "Tinned and Processed Food",
          "Energy and Soft Drinks",
          "Fruit Juices and Fruit Drinks",
          "Snacks and Namkeen",
          "Ready to Cook and Eat",
          "Pickles and Chutney",
          "Indian Sweets",
          "Frozen Snacks"
        ].includes(selectedsubCategories) &&
        packagedFood
      ) {
        const isnutritionalInfo = required(nutritionalInfo);
        const isadditivesInformation = required(additivesInformation);
        const ismanufactureFSSAILicense = required(manufactureFSSAILicense);
        if (
          isnutritionalInfo ||
          isadditivesInformation ||
          ismanufactureFSSAILicense
        ) {
          setsuperValidation(true);
          return;
        }
        if (
          manufactureFSSAILicense?.length !== 14 ||
          (otherFSSAILicense && otherFSSAILicense?.length !== 14 &&
            otherFSSAILicense?.length !== 0) ||
          (importerFSSAILicense && importerFSSAILicense?.length !== 14 &&
            importerFSSAILicense?.length !== 0)
        ) {
          setsuperValidation(true);
          notify("error", "Please put valid Fssai Number");
          return;
        }
        // obj.nutritionalInfo = {
        //   energyPer100kg: energy,
        //   energyPerServing: energyServing,
        //   proteinPer100kg: protein,
        //   proteinPerServing: proteinServing,
        // };
        obj.statutory_reqs_prepackaged_food = {
          // nutritional_info: `Energy(KCal)-(per 100kg) ${energy},(per serving 50g)${energyServing};Protein(g)-(per 100kg) ${protein},(per serving 50g) ${proteinServing}`,
          nutritional_info: nutritionalInfo,
          additives_info: additivesInformation,
          brand_owner_FSSAI_license_no: manufactureFSSAILicense,
          other_FSSAI_license_no: otherFSSAILicense,
          importer_FSSAI_license_no: importerFSSAILicense,
          imported_product_country_of_origin: countries.find(
            (item) => item.name === country
          )?.code,
        };
      }
    }
    try {
      if (
        selectedCategory === "F&B" ||
        (selectedCategory === "Food & Beverage" &&
          (!user_data?.fssaiLicense || user_data?.fssaiLicense === ""))
      ) {
        updateVendorProfile();
      }
      if (variantDisabled) {
        notify("error", "Please put valid variants.");
        setsuperValidation(true);
        return;
      }
      if (catelogData?._id && catelogData?._id !== "") {
        if (!compareObjects(obj, catelogData)) {
          const response = await API.post(CREATE_CATELOGUE, obj);
          if (response.data?.success) {
            if (status === "drafted") {
              navigate("/addsinglecatalog");
            } else {
              setopencatalog(true);
            }
          } else {
            notify("error", "Something Went Wrong!");
          }
        } else {
          notify("error", "Inventory value remains unchanged.");
          setsubmitDisable(false);
        }
      } else {
        const response = await API.post(CREATE_CATELOGUE, obj);
        if (response.data?.success) {
          if (status === "drafted") {
            navigate("/addsinglecatalog");
          } else {
            setopencatalog(true);
          }
        } else {
          notify("error", "Something Went Wrong!");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const updateVendorProfile = async () => {
    let body = {
      userId: user_data && user_data._id ? user_data._id : "",

      fssaiLicense: fssaiLicense ? fssaiLicense : user_data?.fssaiLicense,
    };
    try {
      const response = await API.post(UPDATE_VENDOR_PROFILE_DETAIL, body);
      if (response?.data?.success) {
        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        notify("success", response?.data?.message);
      } else {
        setLoading(false);
        notify("error", response?.data?.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const catelogValidator = () => {
    if (!selectedsubCategories || productImage?.length === 0) {
      productImage?.length === 0 && notify("error", "Please select Product Image ");
      !selectedsubCategories && notify("error", "Please select Sub Category ");
    } else {
      addProductLink.current.click();
    }
  };

  const removeImage = (data) => {
    setProductImage((prevState) =>
      prevState.filter((image, index) => index !== parseInt(data))
    );
  };

  const addUpdateImage = (selectedFile, data) => {
    const formData = new FormData();
    setisDisable(true);
    setisSpin(data);
    formData.append(`file`, selectedFile);
    axios
      .post(`${process.env.REACT_APP_KIKO_API_V1}/products/upload`, formData)
      .then((res) => {
        if (data === "productImage") {
          setProductImage((prevProductImage) => [
            ...prevProductImage,
            res?.data?.file_url,
          ]);
          setisDisable(false);
        }
        if (data === "productImageFront") {
          const newLink = res?.data?.file_url;
          const updatedProductImage = [...productImage];
          if (updatedProductImage?.length > 0) {
            updatedProductImage[0] = newLink;
          } else {
            updatedProductImage.push(newLink);
          }
          setProductImage(updatedProductImage);
          setisDisable(false);
        }
        if (data === "productImageBack") {
          const newLink = res?.data?.file_url;
          const updatedProductImage = [...productImage];
          if (updatedProductImage?.length > 0) {
            updatedProductImage[1] = newLink;
          } else {
            updatedProductImage.push(newLink);
          }
          setProductImage(updatedProductImage);
          setisDisable(false);
        }
      });
  };

  const autoGenerateText = async () => {
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/auto-genrate-text`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        message: `Generate 60 words marketing description for ${productName}`,
      },
    };
    setLoading(true);
    try {
      const result = await axios(options);
      if (result) {
        if (result?.data?.choices?.length > 0) {
          setdescription(result?.data?.choices[0]?.message?.content);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const handleWeightChange = (e) => {
    const inputValue = e.target.value.trim();
    if (inputValue === "" || Number(inputValue) > 0) {
      setweight(inputValue);
      if (weightUnit === "GRAMS" && Number(inputValue) >= 1000) {
        setweightUnit("KG");
        setweight(inputValue / 1000);
      }
      if (weightUnit === "ML" && Number(inputValue) >= 1000) {
        setweightUnit("LITRE");
        setweight(inputValue / 1000);
      }
    }
  };

  const checkCatelog = async () => {
    try {
      const response = await API.post(GET_CATELOGUE, {
        productId: productId,
      });
      if (response?.data?.success) {
        handleCategory(response?.data?.data?.catelogData?.categoryId ?? "");
        updateState(response?.data?.data?.catelogData);
        setOpenScanner(false);
        //setProductName(response?.data?.data?.catelogData?.productName)
      } else {
        // setOpenScanner(false);
        // setScanCatelogData({});
        // setQRResult("Data Not Found")
        setOpenScanner(false);
        notify("error", response?.data?.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // const onNewScanResult = (decodedText, decodedResult) => {
  //   setProductId(decodedText);
  // };

  const updateState = (catelogData) => {
    setCatelogData(catelogData);
    setisReturnable(catelogData?._id ? catelogData?.isReturnable : false);
    setisCancellable(catelogData?._id ? catelogData?.isCancellable : false);
    setSelectedCategory(catelogData?._id ? catelogData?.categoryId : "");
    setselectedsubCategories(catelogData?._id ? catelogData?.subCategoryId : "");
    setProductImage(catelogData?._id ? catelogData?.productImages : []);
    setProductName(catelogData?._id ? catelogData?.productName : "");
    setProductId(catelogData?._id ? catelogData?.productId : "");
    setweight(catelogData?._id ? catelogData?.weight : "");
    setGst(catelogData?._id ? catelogData?.gst : 0);
    setweightUnit(catelogData?._id ? catelogData?.weightUnit : "GRAMS");
    setquantity(catelogData?._id ? catelogData?.availableQuantity : "");
    setSkuCode(catelogData?._id ? catelogData?.skuCode : "");
    setcountry(catelogData?._id ? catelogData?.countryOfOrigin : "India");
    setdescription(catelogData?._id ? catelogData?.description : "");
    setprice(catelogData?._id ? catelogData?.price : "");
    setfoodType(catelogData?._id ? catelogData?.foodType : "veg");
    setdiscount(catelogData?._id ? catelogData?.discountedPrice : "");
    setsize(catelogData?._id ? catelogData?.size : "");
    setcolor(catelogData?._id ? catelogData?.color : "");
    setmaterial(catelogData?._id ? catelogData?.material : "");
    setFssaiLicense(user_data ? user_data?.fssaiLicense : "");
    setpackagingCost(catelogData?._id ? catelogData?.packagingCost : "");
    setpackagedFood(catelogData?._id ? catelogData?.packagedFood : true);
    setManufactureName(
      catelogData?._id
        ? catelogData?.statutory_reqs_packaged_commodities
          ?.manufacturer_or_packer_name
        : ""
    );
    setCommonName(
      catelogData?._id
        ? catelogData?.statutory_reqs_packaged_commodities
          ?.common_or_generic_name_of_commodity
        : ""
    );
    setMfgLicense(
      catelogData?._id
        ? catelogData?.statutory_reqs_packaged_commodities?.mfg_license_no
        : ""
    );
    setManufacturerDate(
      catelogData?._id
        ? catelogData?.statutory_reqs_packaged_commodities?.month_year_of_manufacture_packing_import
          .split("/")
          .reverse()
          .join("-")
        : ""
    );
    setManufactureFSSAILicense(
      catelogData?._id
        ? catelogData?.statutory_reqs_prepackaged_food?.brand_owner_FSSAI_license_no?.toString()
        : ""
    );
    setImporterFSSAILicense(
      catelogData?._id
        ? catelogData?.statutory_reqs_prepackaged_food?.importer_FSSAI_license_no?.toString()
        : ""
    );
    setManufacturerAddress(
      catelogData?._id
        ? catelogData?.statutory_reqs_packaged_commodities
          ?.manufacturer_or_packer_address
        : ""
    );

    setOtherFSSAILicense(
      catelogData?._id
        ? catelogData?.statutory_reqs_prepackaged_food?.other_FSSAI_license_no?.toString()
        : ""
    );
    setAdditivesInformation(
      catelogData?._id
        ? catelogData?.statutory_reqs_prepackaged_food?.additives_info
        : ""
    );
    setNutritionalInfo(
      catelogData?._id
        ? catelogData?.statutory_reqs_prepackaged_food?.nutritional_info
        : ""
    );
  };

  const handleCategory = (value) => {
    setSelectedCategory(value);
    setselectedsubCategories("");
    if (value !== "") {
      const categoryList = categoriesList.find(
        (category) => category.title === value
      );
      setsubCategoriesList(categoryList?.subCategories);
    } else {
      setsubCategoriesList([]);
    }
  };
  const handleChange = (val, index) => {
    // console.log(val, index)
    handleInputChange(
      index,
      "childCustomGroupId",
      val
    );

  }
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        productId: "",
        productName: "",
        isCustom: true,
        customGroupId: "",
        weight: "",
        weightUnit: "UNIT",
        price: "",
        childCustomGroupId: "",
        availableQuantity: "",
        discountedPrice: "",
        userId: user_data._id,
      },
    ]);
  };

  const validateVariants = () => {
    console.log(variants, 'variants')
    return variants.every(
      (variant) => {
        return Object.values(variant).every((value) => {
          if ((variant?.childCustomGroupId !== "" || variant?.childCustomGroupId === "")) {
            return true
          } else {
            return value !== ""
          }
        }) &&
          parseFloat(variant.discountedPrice) <= parseFloat(variant.price)
      }

    );
  };

  const variantDisabled = !validateVariants();

  const deleteVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  const deleteVariantApi = async (variant) => {
    try {
      const response = await API.post(DELETE_VARIENT, { _id: variant?._id });
      if (response.data?.success) {
        getCatelogueVarient();
      }
    } catch (error) {
      handleError(error);
    }
  };
  const [childCustomGroupList, setChildCustomGroupId] = useState([])
  const handleInputChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    if (field === "customGroupId") {
      let obj = customGroupList?.find(c => c._id === value);
      if (obj && !childCustomGroupList.some(c => c._id === obj._id)) {
        setChildCustomGroupId([...childCustomGroupList, obj]);
      }
    }
    setVariants(updatedVariants);
  };

  const getCatelogueVarient = async () => {
    try {
      const response = await API.post(GET_CATELOGUE_VARIENT, {
        _id: catelogData?._id,
      });
      if (response.data?.success) {
        setVariants(response.data.result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleMultiSelectChange = (newValue) => {
    setBpcProps(prevState => ({
      ...prevState,
      preference: newValue // Update bpcProps.preference
    }));
  };

  const createCustomGroup = async () => {
    setSubmitCustomGroup(true);
    if (
      (customGroup.sequence === "" && customGroup.sequence !== 0) ||
      customGroup.input === "" ||
      customGroup.status === "" ||
      customGroup.customGroupName === ""
    ) {
      return;
    }
    try {
      if (customGroup.max === "") {
        customGroup.max = 0
      }
      if (customGroup.min === "") {
        customGroup.min = 0
      }

      const response = await API.post(CREATE_UPDATE_CUSTOM_GROUP, customGroup);
      if (response?.data?.success) {
        notify("success", response?.data?.result?.message);
        setAddCustomModal(false);
        getCustomGroupList()
      }
    } catch (error) {
      handleError(error);
    }
  };

  const createMenu = async () => {
    setSubmitMenu(true);
    if (
      menu.timeFrom === "" ||
      menu.timeTo === "" ||
      menu.dayFrom === "" ||
      menu.dayTo === "" ||
      menu.status === "" ||
      menu.menuName === ""
    ) {
      return;
    }
    if(parseInt(menu.timeFrom)>parseInt(menu.timeTo))
    {
      notify("error", "Please Enter Correct Time");
      return;
    }
    try {
      const response = await API.post(CREATE_UPDATE_CUSTOM_MENU, menu);
      if (response?.data?.success) {
        notify("success", response?.data?.result?.message);
        setMenuPopup(false);
        getMenuList()
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
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
        <div className="addsinglecatelog">
          <div className="catelogHeader">
            <div className="need-help-heading">
              <h3>
                <img
                  src={leftArrow}
                  alt=""
                  onClick={() => {
                    catelogData?._id && catelogData?.userId
                      ? navigate("/inventory")
                      : navigate("/addsinglecatalog");
                  }}
                />
                Add Single Catalog
              </h3>
              <div className="rightLinks">
                <a
                  href="https://www.youtube.com/watch?v=iHx4iCLdQ_o"
                  alt=""
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={youtube} alt="" />
                  Learn to upload single catalog?
                </a>
                <a href="mailto:support@kiko.media" className="m-0 " rel="noreferrer" target="_blank">
                  <img src={headphone} alt="" />
                  Need Help?
                </a>
              </div>
            </div>
            <ul className="nav nav-pills catalog-steps" role="tablist">
              {!catelogData?._id && (
                <li className="nav-item active">
                  <a data-toggle="tab" href="#home">
                    Select Category
                  </a>
                </li>
              )}
              <li className="nav-item">
                <a
                  data-toggle={
                    selectedsubCategories && productImage?.length !== 0
                      ? "tab"
                      : ""
                  }
                  href={
                    selectedsubCategories && productImage?.length !== 0
                      ? "#menu1"
                      : "#home"
                  }
                  ref={addProductLink}
                  onClick={() => {
                    catelogValidator();
                  }}
                >
                  Add Product Details
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            <div id="home" className="tab-pane active">
              <div className="row justify-content-between ">
                <div className="col-lg-5">
                  <div className="row ">
                    <div className="col-md-6 category-list">
                      <p>Main category</p>
                      <ul className="category-cards">
                        {categoriesList.map((category, index) => {
                          return (
                            <li
                              key={index}
                              className={
                                selectedCategory === category.title
                                  ? "active"
                                  : ""
                              }
                              onClick={() => {
                                setsubCategoriesList(category.subCategories);
                                setSelectedCategory(category.title);
                              }}
                            >
                              {category.title}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {(selectedCategory !== "F&B" && selectedCategory !== "Food & Beverage") &&
                      <div className="col-md-6 category-list">
                        <p>Sub category</p>
                        <ul className="category-cards">
                          {subCategoriesList.map((category, index) => {
                            return (
                              <li
                                key={index}
                                className={
                                  selectedsubCategories === category.title
                                    ? "active"
                                    : ""
                                }
                                onClick={() => {
                                  setselectedsubCategories(category.title);
                                }}
                              >
                                {category.title}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    }
                    {(selectedCategory === "F&B" || selectedCategory === "Food & Beverage") &&
                      <div className="col-md-6 category-list">
                        <p>Menu List</p>
                        <ul className="category-cards">
                          {menuList.map((menu, index) => {
                            return (
                              <li
                                key={index}
                                className={
                                  selectedMenu?.menuName === menu.menuName
                                    ? "active"
                                    : ""
                                }
                                onClick={() => {
                                  setselectedsubCategories(menu.menuName);
                                  setSelectedMenu(menu)
                                }}
                              >
                                {menu.menuName}
                              </li>
                            );
                          })}
                        </ul>
                        <button
                          className="btn btn-primary btn-md"
                          onClick={() => {
                            setMenuPopup(true)
                          }}
                        >
                          Add Menu
                        </button>
                      </div>}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="row productImageBlock">
                    <div className="col-lg-6 p-0">
                      <div className="profileHeader">
                        <p className="m-0">
                          {selectedCategory &&
                            selectedCategory + "/" + selectedsubCategories}
                        </p>
                      </div>
                      <div className="image-wrapper">
                        <div className="productimg">
                          <img src={productImage?.length > 0 ? productImage[0] : defaultImage} alt="" />
                        </div>
                        <p>Please provide only front image for each product</p>
                        <div className="text-center">
                          <button
                            onClick={onOpenModal}
                            className="btn btn-md btn-primary"
                            style={{
                              backgroundColor: "#0000",
                              border: "2px bold #7459af",
                              color: "black",
                            }}
                          >
                            <UploadFile className="icons" />
                            Add Product Images
                          </button>
                        </div>
                        <PermissionAlertP
                          permissionAlertPopUp={permissionAlertPopUp}
                          setPermissionAlertPopUp={setPermissionAlertPopUp}
                        />
                        <Modal
                          open={open}
                          onClose={() => {
                            onCloseModal();
                            setProductImage([]);
                          }}
                          center
                        >
                          <div className="modal-heading">
                            <h3>Products in a catalog</h3>
                          </div>
                          <div className="modal_body">
                            <p>
                              Please add the front image first for your product
                              and then you can add multiple images for the same
                              product.
                            </p>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="guidelinesHeading">
                                  <img src={infoIcon} alt="" />
                                  <p>
                                    You can add minimum 1 and maximum 9 products
                                    to create a catalog
                                  </p>
                                </div>
                                <div className="images-catalog">
                                  <div className="images-block-flex">
                                    {productImage.map((image, index) => {
                                      return (
                                        <div className="image-preview-Block">
                                          <div
                                            className="img-preview"
                                            key={index}
                                          >
                                            <img
                                              src={image}
                                              alt=""
                                              className="aad-img"
                                            />
                                          </div>
                                          <div className="cross-icon">
                                            <img
                                              src={crossIcon}
                                              alt=""
                                              onClick={() => {
                                                removeImage(`${index}`);
                                              }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}

                                    <button className="add-image-btn"
                                      onClick={async () => {
                                        if (window && window.flutter_inappwebview) {
                                          const tempV = await flutterfetchCameraPermission();
                                          if (!tempV) {
                                            onCloseModal();
                                            setProductImage([]);
                                            setPermissionAlertPopUp({
                                              permission: true,
                                              type: "cameraPermission",
                                            });
                                          }
                                          else {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.onchange = async (e) => {
                                              if (productImage?.length >= 9) {
                                                notify(
                                                  "error",
                                                  "Maximum 9 Images images allowed."
                                                );
                                                return;
                                              }
                                              addUpdateImage(
                                                e.target.files[0],
                                                "productImage"
                                              );
                                            };
                                            input.click();
                                          }
                                        } else {
                                          const input = document.createElement("input");
                                          input.type = "file";
                                          input.onchange = async (e) => {
                                            if (productImage?.length >= 9) {
                                              notify(
                                                "error",
                                                "Maximum 9 Images images allowed."
                                              );
                                              return;
                                            }
                                            addUpdateImage(
                                              e.target.files[0],
                                              "productImage"
                                            );
                                          };
                                          input.click();
                                        }
                                      }}>
                                      {/* <input
                                        type="file"
                                        onChange={(e) => {
                                          if (productImage.length >= 9) {
                                            notify(
                                              "error",
                                              "Maximum 9 Images images allowed."
                                            );
                                            return;
                                          }
                                          addUpdateImage(
                                            e.target.files[0],
                                            "productImage"
                                          );
                                        }}
                                        disabled={isDisable}
                                      /> */}
                                      {isDisable &&
                                        isSpin === "productImage" ? (
                                        <Space
                                          size="middle"
                                          className="Loaderblue"
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
                                      <div className="add-images">
                                        <img src={addImg} alt="" />
                                        Add Images
                                      </div>
                                    </button>
                                  </div>
                                </div>
                                {/* <h4>Add Images URL</h4>
                                <div className="d-flex gap-3">
                                  <input type="text" className="url-text"
                                    value={imageLink}
                                    onChange={(e) => {
                                      setimageLink(e.target.value);
                                    }}
                                  />
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                      if (productImage.length >= 9) {
                                        notify("error", "Maximum 9 Images images allowed.")
                                        return;
                                      }
                                      if (imageLink && !productImage.includes(imageLink)) {
                                        setProductImage((prevProductImage) => [
                                          ...prevProductImage,
                                          imageLink
                                        ]);
                                      }
                                      else {
                                        notify("error", "this image already exists");
                                      }
                                      setimageLink("");
                                    }}>Add</button>
                                </div> */}
                              </div>
                              <div className="col-lg-6">
                                <h6 className="not-allowed">
                                  <img src={blockIcon} alt="" />
                                  Image type which are not allowed
                                </h6>
                                <div className="row Notallowed-images">
                                  <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="product-image">
                                        <img src={watermark} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Watermark Image
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="product-image">
                                        <img src={fakebranded} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Fake branded/1st copy
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="product-image">
                                        <img src={imagewithprice} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Image With Price
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="product-image">
                                        <img src={pixelatedimage} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Pixelated Image
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="product-image">
                                        <img src={invertedimage} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Invered Image
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="product-image">
                                        <img src={blurunclear} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Blur/unclear Image
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                      <div className="product-image">
                                        <img src={incompletedimage} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Incompleted Image
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                      <div className="product-image">
                                        <img src={stretchedshrunk} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Stretched/shrunk
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3 gap-2">
                                      <div className="product-image">
                                        <img src={imagewithprops} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Image with Props
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3 gap-2">
                                      <div className="product-image">
                                        <img src={imagewithtext} alt="" />
                                      </div>
                                      <div>
                                        <p className="image-title">
                                          Image with text
                                        </p>
                                        <p className="not-allowed-image">
                                          <img src={BlockGray} alt="" />
                                          NOT ALLOWED
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal_footer">
                            <button
                              className="btn btn-sm cancle-btn"
                              onClick={() => {
                                onCloseModal();
                                setProductImage([]);
                              }}
                              disabled={isDisable}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={onCloseModal}
                              disabled={isDisable}
                            >
                              Continue
                            </button>
                          </div>
                        </Modal>
                      </div>
                      <div className="text-center mb-3 mt-2">
                        {/* <button className="btn" href={
                              selectedsubCategories && productImage.length != 0
                                ? "#menu1"
                                : "#home"
                            }
                              onClick={() => { catelogValidator() }}>Save & Continue</button> */}
                        <button
                          className="btn btn-primary btn-md"
                          onClick={() => {
                            catelogValidator();
                          }}
                        >
                          Save & Continue
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-6 p-0 guidelines">
                      <div className="guidelinesHeading">
                        <img src={infoIcon} alt="" />
                        <p className="m-0">
                          Follow guidelines to reduce quality check failure
                        </p>
                      </div>
                      <ul>
                        <h6>General Guidelines</h6>
                        <li>
                          You can add minimum 1 and maximum 9 products to create
                          a catalog.
                        </li>
                        <li>
                          Upload the products from the same category that you
                          have chosen.
                        </li>
                      </ul>
                      <ul>
                        <h6>Image Guidelines</h6>
                        <li>
                          Images with text/Watermark are not acceptable in
                          primary images.
                        </li>
                        <li>Product image should not have any text.</li>
                        <li>
                          Please add solo product image without any props.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="menu1" className=" tab-pane">
              <div className="row">
                <div className="col-xl-8 col-md-12">
                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingOne">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <h5 className="border-0 m-0 p-0">Product Details</h5>
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <form>
                            <div className="row justify-content-center justify-content-md-between">
                              {/* <div className="col-md-6 mb-3  gap-2 ">
                        <label className="mb-1">Main Category*</label>
                        <select
                          type="select"
                          value={selectedCategory}
                          onChange={(e)=>handleCategory(e.target.value)}
                        >
                          <option value="">Select a Category</option>
                          {categoriesList.map((category, index) => (
                            <option key={index} value={category.title}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                        {superValidation && !selectedCategory && (
                          <p className="error">Required*</p>
                        )}
                      </div>
                      <div className="col-md-6 mb-3  gap-2 ">
                        <label className="mb-1">Sub Category*</label>
                        <select
                          type="select"
                          value={selectedsubCategories}
                          onChange={(e) => {
                            setselectedsubCategories(e.target.value);
                          }}
                        >
                          <option value="">Select a sub </option>
                          {subCategoriesList.map((category, index) => (
                            <option key={index} value={category.title}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                        {superValidation && !selectedsubCategories && (
                          <p className="error">Required*</p>
                        )}
                      </div> */}
                              <div className="col-md-6 gap-2 mb-3">
                                <label className="mb-1">Main category*</label>
                                <select
                                  className="form-select"
                                  value={selectedCategory}
                                  onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                  }}
                                >
                                  {categoriesList.map((category, index) => {
                                    return (
                                      <option key={index} value={category.title}> {category.title}</option>
                                    )
                                  })}
                                </select>
                                {superValidation && !selectedCategory && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              {(selectedCategory !== "F&B" && selectedCategory !== "Food & Beverage") ?
                                <div className="col-md-6 gap-2 mb-3">
                                  <label className="mb-1">Sub category*</label>
                                  <select
                                    className="form-select"
                                    value={selectedsubCategories}
                                    onChange={(e) => {
                                      setselectedsubCategories(e.target.value);
                                    }}
                                  >
                                    {subCategoriesList.map((category, index) => {
                                      return (
                                        <option key={index} value={category.title}> {category.title}</option>
                                      )
                                    })}
                                  </select>
                                  {superValidation && !selectedsubCategories && (
                                  <p className="error">Required*</p>
                                )}
                                </div>
                                :
                                <div className="col-md-6 category-list">
                                  <p>Menu List</p>
                                  <select
                                    className="form-select"
                                    value={selectedsubCategories}
                                    onChange={(e) => {
                                      setselectedsubCategories(menu.menuName);
                                      setSelectedMenu(menu)
                                    }}
                                  >
                                    {menuList.map((menu, index) => {
                                      return (
                                        <option key={index} value={menu.menuName}>{menu.menuName}</option>
                                      )
                                    })}
                                  </select>
                                  {superValidation && !menu?.menuName && (
                                  <p className="error">Required*</p>
                                )}
                                </div>
                              }

                              <div className="col-md-6 gap-2 mb-3">
                                <label className="mb-1">Product Name*</label>
                                <input
                                  type="text"
                                  placeholder="Enter Product Name"
                                  className="form-control"
                                  value={productName}
                                  onChange={(e) => {
                                    setProductName(e.target.value.trimStart());
                                  }}
                                />
                                {superValidation && !productName && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-md-6 mb-3 gap-2">
                                <label className="mb-1">
                                  EAN/Barcode Number*
                                </label>
                                <div className="d-flex gap-1">
                                  <input
                                    type="text"
                                    placeholder="Enter EAN/Barcode Number"
                                    className="form-control"
                                    value={productId}
                                    onChange={(e) => {
                                      setProductId(e.target.value.trimStart());
                                    }}
                                  />

                                  {/* <button
                          className="btn btn-md btn-primary ps-4 pe-4"
                          type="button"
                          disabled={productId === ""}
                          onClick={() => {
                            checkCatelog();
                          }}
                          style={{ position: "relative" }}
                        >
                            check
                          </button> */}
                                </div>
                                {superValidation &&
                                  !productId &&
                                  selectedCategory === "Grocery" && (
                                    <p className="error">Required*</p>
                                  )}
                              </div>
                              {selectedCategory === "Home & Kitchen" && (
                                <>
                                  <div className="col-md-6 mb-3  gap-2 ">
                                    <label className="mb-1">Material*</label>
                                    <div class="dropdown colordropdown">
                                      <button
                                        class=" dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        {material === "" ? "Select Material Type" : material}
                                      </button>
                                      <ul class="dropdown-menu p-0">
                                        {
                                          materialArray.map((material) => {
                                            return (
                                              <li className="skin-dropdown-list" onClick={() => {
                                                setmaterial(material);
                                              }}>
                                                {material}
                                              </li>
                                            )
                                          })
                                        }
                                      </ul>
                                    </div>
                                    {/* <label className="mb-1">Material*</label>
                                    <input
                                      type="text"
                                      placeholder="Enter Material"
                                      className="form-control"
                                      value={material}
                                      onChange={(e) => {
                                        setmaterial(e.target.value.trimStart());
                                      }}
                                    />
                                    {superValidation && !material && (
                                      <p className="error">Required*</p>
                                    )} */}
                                  </div>
                                  <div className="col-md-6 mb-3  gap-2">
                                    <label className="mb-1">Color*</label>
                                    <div class="dropdown colordropdown">
                                      <button
                                        class=" dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        {color === "" ? "Select Colour" : color}
                                      </button>
                                      <ul class="dropdown-menu">
                                        <div className="dropdown-color-flex">
                                          {colorArray.map((color, index) => {
                                            return (
                                              <>
                                                <div className="dropdown-color-list" onClick={() => { setcolor(color) }}>
                                                  <div className={`dropdown-color ${color}`}></div>
                                                  {color}
                                                </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </ul>
                                    </div>
                                    {/* <select
                                      className="form-select"
                                      value={color}
                                      onChange={(e) => {
                                        setcolor(e.target.value);
                                      }}
                                    >
                                      <option value="UNIT">
                                      </option>
                                      <option value="Red">Red</option>
                                      <option value="Yellow">Yellow</option>
                                      <option value="Green">Green</option>
                                      <option value="Blue">Blue</option>
                                    </select> */}
                                    {superValidation && !color && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                </>
                              )}
                              {(selectedCategory === "F&B" ||
                                selectedCategory === "Food & Beverage") && (
                                  <>
                                    {" "}
                                    <div className="col-md-6 mb-3 row align-items-center ">
                                      <div className=" d-flex gap-4 justify-content-start">
                                        <div className="Cancellable">
                                          <input
                                            type="radio"
                                            id="veg"
                                            name="radio-group"
                                            defaultChecked={foodType === "veg"}
                                            onClick={() => {
                                              setfoodType("veg");
                                            }}
                                          />
                                          <label for="veg">Veg*</label>
                                        </div>
                                        <div className="Cancellable">
                                          <input
                                            type="radio"
                                            id="non-veg"
                                            name="radio-group"
                                            defaultChecked={
                                              foodType === "non-veg"
                                            }
                                            onClick={() => {
                                              setfoodType("non-veg");
                                            }}
                                          />
                                          <label for="non-veg">Non-Veg*</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2">
                                      <label className="mb-1">
                                        FSSAI License Number*
                                      </label>
                                      <div>
                                        {!user_data?.fssaiLicense ||
                                          user_data?.fssaiLicense === "" ? (
                                          <input
                                            type="text"
                                            placeholder="Fssai Number"
                                            className="form-control"
                                            maxLength={14}
                                            value={fssaiLicense}
                                            onChange={(e) => {
                                              const inputValue =
                                                e.target.value.trimStart();
                                              if (
                                                inputValue === "" ||
                                                Number(inputValue) >= 0
                                              ) {
                                                setFssaiLicense(inputValue);
                                              }
                                            }}
                                          />
                                        ) : (
                                          <p className="form-control m-0">
                                            {fssaiLicense}
                                          </p>
                                        )}
                                        {superValidation && !fssaiLicense && (
                                          <p className="error">Required*</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2">
                                      <label className="mb-1">
                                        Packaging Cost*
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Type"
                                        className="form-control"
                                        maxLength={3}
                                        value={packagingCost}
                                        onChange={(e) => {
                                          const inputValue =
                                            e.target.value.trimStart();
                                          if (
                                            inputValue === "" ||
                                            Number(inputValue) >= 0
                                          ) {
                                            setpackagingCost(inputValue);
                                          }
                                        }}
                                      />
                                      {superValidation && !packagingCost && (
                                        <p className="error">Required*</p>
                                      )}
                                    </div>
                                  </>
                                )}
                              <div className="col-md-6 mb-3  gap-2 ">
                                <label className="mb-1">
                                  Net Weight (gms/Kg)*
                                </label>
                                <div className="d-flex gap-1">
                                  <input
                                    type="text"
                                    placeholder="Enter Net Weight"
                                    className="form-control"
                                    value={weight}
                                    disabled={catelogData?.weight}
                                    onChange={handleWeightChange}
                                    style={{ minWidth: "100px" }}
                                  />

                                  <select
                                    className="form-select"
                                    value={weightUnit}
                                    disabled={catelogData?.weightUnit}
                                    onChange={(e) => {
                                      setweightUnit(e.target.value);
                                    }}
                                  >
                                    <option value="UNIT">UNIT</option>
                                    <option value="GRAMS">GRAMS</option>
                                    <option value="KG">KG</option>
                                    <option value="LITRE">LITRE</option>
                                    <option value="ML">ML</option>
                                  </select>
                                </div>
                                {superValidation && !weight && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              {selectedCategory === "Home & Kitchen" && (
                                <>
                                  <div className="col-md-6 mb-3  gap-2 ">
                                    <label className="mb-1">
                                      Length/Height/Bredth
                                    </label>
                                    <div className="d-flex gap-1">
                                      <input
                                        type="text"
                                        placeholder="Length"
                                        className="form-control"
                                        value={hkProps?.length}
                                        onChange={(e) => {
                                          setHkProps((prevState) => ({
                                            ...prevState,
                                            length: e.target.value,
                                          }));
                                        }}
                                        style={{ minWidth: "100px" }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="Height"
                                        className="form-control"
                                        value={hkProps?.height}
                                        onChange={(e) => {
                                          setHkProps((prevState) => ({
                                            ...prevState,
                                            height: e.target.value,
                                          }));
                                        }}
                                        style={{ minWidth: "100px" }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="Bredth"
                                        className="form-control"
                                        value={hkProps?.bredth}
                                        onChange={(e) => {
                                          setHkProps((prevState) => ({
                                            ...prevState,
                                            bredth: e.target.value,
                                          }));
                                        }}
                                        style={{ minWidth: "100px" }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-3  gap-2">
                                    <label className="mb-1">
                                      Care Instruction
                                    </label>
                                    <textarea
                                      rows={4}
                                      className="w-100 form-control"
                                      value={hkProps?.careInstruction}
                                      placeholder="Enter Care Instruction"
                                      onChange={(e) => {
                                        setHkProps((prevState) => ({
                                          ...prevState,
                                          careInstruction: e.target.value,
                                        }));
                                      }}
                                    ></textarea>
                                  </div>
                                  <div className="col-md-6 mb-3  gap-2">
                                    <label className="mb-1">
                                      Special Features
                                    </label>
                                    <textarea
                                      rows={4}
                                      className="w-100 form-control"
                                      value={hkProps?.specialFeatures}
                                      placeholder="Enter Special Features"
                                      onChange={(e) => {
                                        setHkProps((prevState) => ({
                                          ...prevState,
                                          specialFeatures: e.target.value,
                                        }));
                                      }}
                                    ></textarea>
                                  </div>
                                  <div className="col-md-6 mb-3  gap-2">
                                    <label className="mb-1">Modal</label>
                                    <input
                                      type="text"
                                      placeholder="Type"
                                      className="form-control"
                                      value={hkProps?.modal}
                                      onChange={(e) => {
                                        setHkProps((prevState) => ({
                                          ...prevState,
                                          modal: e.target.value,
                                        }));
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                              {selectedCategory === "Fashion" && (
                                <>
                                  <div className="col-md-6 mb-3 gap-2">
                                    <label className="mb-1">Size*</label>
                                    <input
                                      type="text"
                                      placeholder="Enter size"
                                      className="form-control"
                                      value={size}
                                      onChange={(e) => {
                                        setsize(e.target.value.trimStart());
                                      }}
                                    />
                                    {superValidation && !size && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                  <div className="col-md-6 mb-3  gap-2 ">
                                    <label className="mb-1">Material*</label>
                                    <input
                                      type="text"
                                      placeholder="Enter Material"
                                      className="form-control"
                                      value={material}
                                      onChange={(e) => {
                                        setmaterial(e.target.value.trimStart());
                                      }}
                                    />
                                    {superValidation && !material && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                  <div className="col-md-6 mb-3  gap-2">
                                    <label className="mb-1">Color*</label>
                                    <div class="dropdown colordropdown">
                                      <button
                                        class=" dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        {color === "" ? "Select Colour" : color}
                                      </button>
                                      <ul class="dropdown-menu">
                                        <div className="dropdown-color-flex">
                                          {colorArray.map((color, index) => {
                                            return (
                                              <>
                                                <div className="dropdown-color-list" onClick={() => { setcolor(color) }}>
                                                  <div className={`dropdown-color ${color}`}></div>
                                                  {color}
                                                </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </ul>
                                    </div>
                                    {/* <label className="mb-1">Color*</label>
                                    <select
                                      className="form-select"
                                      value={color}
                                      onChange={(e) => {
                                        setcolor(e.target.value);
                                      }}
                                    >
                                      <option value="UNIT">
                                        Select Colour
                                      </option>
                                      <option value="Red">Red</option>
                                      <option value="Yellow">Yellow</option>
                                      <option value="Green">Green</option>
                                      <option value="Blue">Blue</option>
                                    </select> */}
                                    {superValidation && !color && (
                                      <p className="error">Required*</p>
                                    )}
                                  </div>
                                </>
                              )}
                              {selectedCategory ===
                                "Beauty & Personal Care" && (
                                  <>
                                    <div className="col-md-6 mb-3  gap-2">
                                      <label className="mb-1">Color*</label>
                                      <div class="dropdown colordropdown">
                                        <button
                                          class=" dropdown-toggle"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          {color === "" ? "Select Colour" : color}
                                        </button>
                                        <ul class="dropdown-menu">
                                          <div className="dropdown-color-flex">
                                            {colorArray.map((color, index) => {
                                              return (
                                                <>
                                                  <div className="dropdown-color-list" onClick={() => { setcolor(color) }}>
                                                    <div className={`dropdown-color ${color}`}></div>
                                                    {color}
                                                  </div>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </ul>
                                      </div>

                                      {superValidation && !color && (
                                        <p className="error">Required*</p>
                                      )}
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2 ">
                                      <label className="mb-1">Concerns*</label>
                                      <div class="dropdown colordropdown">
                                        <button
                                          class=" dropdown-toggle"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          {bpcProps?.concerns === "" ? "Select Concerns" : bpcProps?.concerns}
                                        </button>
                                        <ul class="dropdown-menu p-0">
                                          {
                                            concernArray.map((concern) => {
                                              return (
                                                <li className="skin-dropdown-list" onClick={() => {
                                                  setBpcProps((prevState) => ({
                                                    ...prevState,
                                                    concerns: concern,
                                                  }));
                                                }}>
                                                  {concern}
                                                </li>
                                              )
                                            })
                                          }
                                        </ul>
                                      </div>
                                      {/* <input
                                        type="text"
                                        placeholder="Enter Concerns"
                                        className="form-control"
                                        value={bpcProps?.concerns}
                                        onChange={(e) => {
                                          setBpcProps((prevState) => ({
                                            ...prevState,
                                            concerns: e.target.value.trimStart(),
                                          }));
                                        }}
                                      /> */}
                                      {superValidation &&
                                        bpcProps?.concerns === "" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2">
                                      <label className="mb-1">Skin Type*</label>
                                      <div class="dropdown colordropdown">
                                        <button
                                          class=" dropdown-toggle"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          {bpcProps?.skinType === "" ? "Select Skin Type" : bpcProps?.skinType}
                                        </button>
                                        <ul class="dropdown-menu p-0">
                                          {
                                            skinTypeArray.map((skin) => {
                                              return (
                                                <li className="skin-dropdown-list" onClick={() => {
                                                  setBpcProps((prevState) => ({
                                                    ...prevState,
                                                    skinType: skin,
                                                  }));
                                                }}>
                                                  {skin}
                                                </li>
                                              )
                                            })
                                          }
                                        </ul>
                                      </div>
                                      {/* <select
                                      className="form-select"
                                      value={bpcProps?.skinType}
                                      onChange={(e) => {
                                        setBpcProps((prevState) => ({
                                          ...prevState,
                                          skinType: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value="UNIT">
                                        Select Skin Type
                                      </option>
                                      <option value="Normal Skin">
                                        Normal Skin
                                      </option>
                                      <option value="Dry Skin">Dry Skin</option>
                                      <option value="Oily Skin">
                                        Oily Skin
                                      </option>
                                      <option value="Combination Skin (Both Dry & Oily Skin)">
                                        Combination Skin (Both Dry & Oily Skin)
                                      </option>
                                      <option value="Sensitive Skin">
                                        Sensitive Skin
                                      </option>
                                    </select> */}
                                    </div>
                                  </>
                                )}
                              {["Health & Wellness"].includes(
                                selectedCategory
                              ) && (
                                  <>
                                    <div className="col-md-6 gap-2 mb-3 ">
                                      <label className="mb-1">
                                        Manufacturer Month*
                                      </label>
                                      <input
                                        type="month"
                                        className="form-control date-picker"
                                        value={manufacturerDate}
                                        max={
                                          new Date().toISOString().split("T")[0]
                                        }
                                        onChange={(event) => {
                                          const selectedMonth = new Date(
                                            event.target.value + "-01"
                                          );
                                          const currentMonth = new Date();
                                          if (selectedMonth <= currentMonth) {
                                            setManufacturerDate(
                                              event.target.value
                                            );
                                          }
                                        }}
                                      />
                                      {superValidation && !manufacturerDate && (
                                        <p className="error">Required*</p>
                                      )}
                                    </div>
                                    <div className="col-md-6 gap-2 mb-3 ">
                                      <label className="mb-1">Expiry Date*</label>
                                      <input
                                        type="date"
                                        className="form-control date-picker"
                                        value={hwProps?.expiryDate}
                                        onChange={(e) => {
                                          setHwProps((prevState) => ({
                                            ...prevState,
                                            expiryDate: e.target.value,
                                          }));
                                        }}
                                      />
                                      {superValidation &&
                                        hwProps?.expiryDate === "" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                  </>
                                )}
                              {selectedCategory ===
                                "Beauty & Personal Care" && (
                                  <>
                                    <div className="col-md-6 gap-2 mb-3 ">
                                      <label className="mb-1">
                                        Manufacture Month*
                                      </label>
                                      {/* <input
                                        type="date"
                                        className="form-control date-picker"
                                        value={hwProps?.expiryDate}
                                        onChange={(e) => {
                                          setHwProps((prevState) => ({
                                            ...prevState,
                                            expiryDate: e.target.value,
                                          }));
                                        }}
                                      />
                                      {superValidation &&
                                        hwProps?.expiryDate === "" && (
                                          <p className="error">Required*</p>
                                        )} */}
                                      <input
                                        type="month"
                                        className="form-control date-picker"
                                        value={manufacturerDate}
                                        placeholder="Date/Month/Year"
                                        max={
                                          new Date().toISOString().split("T")[0]
                                        }
                                        onChange={(event) => {
                                          const selectedMonth = new Date(
                                            event.target.value + "-01"
                                          );
                                          const currentMonth = new Date();
                                          if (selectedMonth <= currentMonth) {
                                            setManufacturerDate(
                                              event.target.value
                                            );
                                          }
                                        }}
                                      />
                                      {superValidation && !manufacturerDate && (
                                        <p className="error">Required*</p>
                                      )}
                                    </div>
                                    <div className="col-md-6 gap-2 mb-3 ">
                                      <label className="mb-1">Expiry Date*</label>
                                      <input
                                        type="date"
                                        className="form-control date-picker"
                                        value={bpcProps?.expiryDate}
                                        onChange={(e) => {
                                          setBpcProps((prevState) => ({
                                            ...prevState,
                                            expiryDate: e.target.value,
                                          }));
                                        }}
                                      />
                                      {superValidation &&
                                        bpcProps?.expiryDate === "" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2 ">
                                      <label className="mb-1">Ingredients*</label>
                                      <textarea
                                        rows={4}
                                        className="w-100 form-control"
                                        value={bpcProps?.ingredients}
                                        placeholder="Enter Ingredients"
                                        onChange={(e) => {
                                          setBpcProps((prevState) => ({
                                            ...prevState,
                                            ingredients: e.target.value,
                                          }));
                                        }}
                                      ></textarea>
                                      {/* <input
                                        type="text"
                                        placeholder="Enter Concerns"
                                        style={{minHeight:"90px"}}
                                        
                                      
                                      /> */}
                                      {superValidation &&
                                        bpcProps?.ingredients === "" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2 ">
                                      <label className="mb-1">Formulation*</label>
                                      <textarea
                                        rows={4}
                                        className="w-100 form-control"
                                        value={bpcProps?.formulation}
                                        placeholder="Enter Formulation"
                                        onChange={(e) => {
                                          setBpcProps((prevState) => ({
                                            ...prevState,
                                            formulation: e.target.value,
                                          }));
                                        }}
                                      ></textarea>
                                      {superValidation &&
                                        bpcProps?.formulation === "" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3  gap-2">
                                      <label className="mb-1">Gender</label>
                                      <div class="dropdown colordropdown">
                                        <button
                                          class=" dropdown-toggle"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          {bpcProps?.gender === "" ? "Select Gender" : bpcProps?.gender}
                                        </button>
                                        <ul class="dropdown-menu p-0">
                                          {
                                            genderArray.map((gender) => {
                                              return (
                                                <li className="skin-dropdown-list"
                                                  onClick={() => {
                                                    setBpcProps((prevState) => ({
                                                      ...prevState,
                                                      gender: gender,
                                                    }))
                                                  }}
                                                >
                                                  {gender}
                                                </li>
                                              )
                                            })
                                          }

                                        </ul>
                                      </div>

                                      {/* <select
                                      className="form-select"
                                      value={bpcProps?.gender}
                                      onChange={(e) => {
                                        setBpcProps((prevState) => ({
                                          ...prevState,
                                          gender: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value="UNIT">
                                        Select Gender
                                      </option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select> */}
                                    </div>

                                    <div className="col-md-6 mb-3  gap-2 ">
                                      <label className="mb-1">Conscious*</label>
                                      <select
                                        className="form-select"
                                        value={bpcProps?.conscious}
                                        onChange={(e) => {
                                          setBpcProps((prevState) => ({
                                            ...prevState,
                                            conscious: e.target.value,
                                          }));
                                        }}
                                      >
                                        <option value="">
                                          Select Conscious
                                        </option>
                                        <option value="Cruelty Free">Cruelty Free</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Natural">Natural</option>
                                      </select>
                                      {/* <div className="">
                                          <div className="d-flex gap-2">
                                            <div className="Cancellable">
                                              <input
                                                type="radio"
                                                id="Consciousyes"
                                                defaultChecked={bpcProps?.conscious}
                                                onClick={() => {
                                                  setBpcProps((prevState) => ({
                                                    ...prevState,
                                                    conscious: true,
                                                  }));
                                                }}
                                                name="radio-group"
                                              />
                                              <label for="Consciousyes">Yes</label>
                                            </div>
                                            <div className="Cancellable">
                                              <input
                                                type="radio"
                                                id="Consciousno"
                                                defaultChecked={
                                                  !bpcProps?.conscious
                                                }
                                                onClick={() => {
                                                  setBpcProps((prevState) => ({
                                                    ...prevState,
                                                    conscious: false,
                                                  }));
                                                }}
                                                name="radio-group"
                                              />
                                              <label for="Consciousno">No</label>
                                            </div>
                                          </div>
                                        </div> */}
                                    </div>

                                    <div className="col-md-6 mb-3  gap-2 ">
                                      <label className="mb-1">Preference*</label>
                                      <MultiSelect
                                        options={options}
                                        value={bpcProps?.preference}
                                        onChange={handleMultiSelectChange}
                                        labelledBy="Select Preference"
                                        className="custom-select"
                                      />
                                      {/* <input
                                        type="text"
                                        placeholder="Enter Concerns"
                                        className="form-control"
                                        value={bpcProps?.preference}
                                        onChange={(e) => {
                                          setBpcProps((prevState) => ({
                                            ...prevState,
                                            preference:
                                              e.target.value.trimStart(),
                                          }));
                                        }}
                                      /> */}
                                      {superValidation &&
                                        bpcProps?.preference === "" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                  </>
                                )}
                              <div className="col-md-6 mb-3  gap-2">
                                <label className="mb-1">
                                  Seller SKU Code
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter Seller SKU Code"
                                  className="form-control"
                                  value={skuCode}
                                  onChange={(e) => {
                                    setSkuCode(e.target.value.trimStart());
                                  }}
                                />
                              </div>
                              <div className="col-md-6 mb-3  gap-2 ">
                                <label className="mb-1">
                                  Country of Origin*
                                </label>
                                <select
                                  className="form-select"
                                  type="select"
                                  value={country}
                                  onChange={(e) => {
                                    setcountry(e.target.value);
                                  }}
                                >
                                  <option value="">Select a country</option>
                                  {countries.map((countryItem, index) => (
                                    <option
                                      key={index}
                                      value={countryItem.name}
                                    >
                                      {countryItem.name}
                                    </option>
                                  ))}
                                </select>
                                {superValidation && !country && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-md-6 mb-3  gap-2">
                                <label className="mb-1">
                                  Available Quantity*
                                </label>
                                <input
                                  type="number"
                                  placeholder="Enter Available Quantity"
                                  className="form-control"
                                  value={quantity}
                                  onChange={(e) => {
                                    let inputValue = e.target.value.trim();
                                    if (inputValue?.length > 4) {
                                      inputValue = inputValue.slice(0, 4);
                                    }
                                    if (inputValue === "" || Number(inputValue) > 0) {
                                      setquantity(inputValue);
                                    }
                                  }}
                                />
                                {superValidation && !quantity && (
                                  <p className="error">Required*</p>
                                )}
                              </div>
                              <div className="col-md-3 mb-3  gap-2">
                                <label className="mb-1">
                                  Item Limit Per Order
                                </label>
                                <input
                                  type="number"
                                  placeholder="Item Limit Per Order"
                                  className="form-control"
                                  value={maxAvailableQuantity}
                                  onChange={(e) => {
                                    let inputValue = e.target.value.trim();
                                    if (inputValue?.length > 4) {
                                      inputValue = inputValue.slice(0, 4);
                                    }
                                    if (inputValue === "" || Number(inputValue) > 0) {
                                      setMaxAvailableQuantity(inputValue);
                                    }
                                  }}
                                />
                              </div>
                              {selectedCategory === "Health & Wellness" && (
                                <div className="col-md-6 mb-3  gap-2">
                                  <label className="mb-1">
                                    Usage Instruction
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter Usage Instruction"
                                    className="form-control"
                                    value={hwProps?.usageInstruction}
                                    onChange={(e) => {
                                      setHwProps((prevState) => ({
                                        ...prevState,
                                        usageInstruction: e.target.value,
                                      }));
                                    }}
                                  />
                                </div>
                              )}
                              <div className="col-md-6 mb-3  gap-2 d-flex align-items-center">
                                {[
                                  "Health & Wellness",
                                  "Beauty & Personal Care",
                                  "Grocery",
                                  "Fashion",
                                  "Home & Kitchen",
                                ].includes(selectedCategory) && (
                                    <div className="d-flex gap-3 align-items-center ">
                                      <label className="">Packaged Item*</label>
                                      <div className="d-flex gap-2">
                                        <div className="Cancellable">
                                          <input
                                            type="radio"
                                            id="PackagedItemyes"
                                            defaultChecked={packagedFood}
                                            onClick={() => {
                                              setpackagedFood(true);
                                            }}
                                            name="radio-group"
                                          />
                                          <label for="PackagedItemyes">
                                            Yes
                                          </label>
                                        </div>
                                        <div className="Cancellable">
                                          <input
                                            type="radio"
                                            id="PackagedItemno"
                                            defaultChecked={!packagedFood}
                                            onClick={() => {
                                              setpackagedFood(false);
                                            }}
                                            name="radio-group"
                                          />
                                          <label for="PackagedItemno">No</label>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 mb-3  gap-2">
                                <form>
                                  {["Home & Kitchen"].includes(
                                    selectedCategory
                                  ) && (
                                      <div className=" d-flex gap-3 align-items-center">
                                        <label className="">
                                          Assembly Required*
                                        </label>
                                        <div className="">
                                          <div className="d-flex gap-2">
                                            <div className="Cancellable">
                                              <input
                                                type="radio"
                                                id="Cancellableyes"
                                                defaultChecked={
                                                  hkProps?.assemblyRequired
                                                }
                                                onClick={() => {
                                                  setHkProps((prevState) => ({
                                                    ...prevState,
                                                    assemblyRequired: true,
                                                  }));
                                                }}
                                                name="radio-group"
                                              />
                                              <label for="Cancellableyes">
                                                Yes
                                              </label>
                                            </div>
                                            <div className="Cancellable">
                                              <input
                                                type="radio"
                                                id="Cancellableno"
                                                defaultChecked={
                                                  !bpcProps?.assemblyRequired
                                                }
                                                onClick={() => {
                                                  setBpcProps((prevState) => ({
                                                    ...prevState,
                                                    assemblyRequired: false,
                                                  }));
                                                }}
                                                name="radio-group"
                                              />
                                              <label for="Cancellableno">No</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </form>
                              </div>
                              <div className="col-md-6 mb-3  gap-2">
                                <form>
                                  {["Health & Wellness"].includes(
                                    selectedCategory
                                  ) && (
                                      <div className="d-flex gap-3 align-items-center ">
                                        <label className="">
                                          Prescription Required*
                                        </label>
                                        <div className="">
                                          <div className="d-flex gap-2">
                                            <div className="Cancellable">
                                              <input
                                                type="radio"
                                                id="Prescriptionyes"
                                                defaultChecked={
                                                  hwProps?.prescription
                                                }
                                                onClick={() => {
                                                  setHwProps((prevState) => ({
                                                    ...prevState,
                                                    prescription: true,
                                                  }));
                                                }}
                                                name="radio-group"
                                              />
                                              <label for="Prescriptionyes">
                                                Yes
                                              </label>
                                            </div>
                                            <div className="Cancellable">
                                              <input
                                                type="radio"
                                                id="Prescriptionno"
                                                defaultChecked={
                                                  hwProps?.prescription
                                                }
                                                onClick={() => {
                                                  setHwProps((prevState) => ({
                                                    ...prevState,
                                                    prescription: false,
                                                  }));
                                                }}
                                                name="radio-group"
                                              />
                                              <label for="Prescriptionno">No</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </form>
                              </div>
                              <form>
                                <div className=" upload-image-section">
                                  <div className="row">
                                    {/* <ul className="col-md-11 ps-4">
                                        <li>
                                          Under the guidelines, it is required
                                          to provide the ingredient and
                                          nutritional details of the package.
                                        </li>
                                        <li>
                                          Please provide images of the front and
                                          back of the package (Check below
                                          sample Image).
                                        </li>
                                      </ul> */}
                                    {packagedFood &&
                                      [
                                        "Health & Wellness",
                                        "Beauty & Personal Care",
                                        "Grocery",
                                        "Fashion",
                                        "Home & Kitchen",
                                      ].includes(selectedCategory) && (
                                        <div className="upload-images">
                                          <div>
                                            <h6>Sample Image</h6>
                                            <div className="sample-images">
                                              <div>
                                                <div className="imagesPreview">
                                                  <img
                                                    src={
                                                      selectedCategory ===
                                                        "Grocery"
                                                        ? frontImg
                                                        : selectedCategory ===
                                                          "Fashion"
                                                          ? FaishionFront
                                                          : selectedCategory ===
                                                            "Health & Wellness"
                                                            ? HealthFront
                                                            : HealthFront
                                                    }
                                                    alt=""
                                                  />
                                                </div>
                                                <p>Front Image</p>
                                              </div>
                                              <div>
                                                <div className="imagesPreview">
                                                  <img
                                                    src={
                                                      selectedCategory ===
                                                        "Grocery"
                                                        ? BackImg
                                                        : selectedCategory ===
                                                          "Fashion"
                                                          ? FaishionBack
                                                          : selectedCategory ===
                                                            "Health & Wellness"
                                                            ? HealthBack
                                                            : HealthBack
                                                    }
                                                    alt=""
                                                  />
                                                </div>
                                                <p>Back Image</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <h6>Uploaded Image</h6>
                                            <div className="uploaded-images">
                                              <div>
                                                <div className="uploadImg">
                                                  {!productImage[0] ? (
                                                    <button onClick={async () => {
                                                      if (window && window.flutter_inappwebview) {
                                                        const tempV = await flutterfetchCameraPermission();
                                                        if (!tempV) {
                                                          setPermissionAlertPopUp({
                                                            permission: true,
                                                            type: "cameraPermission",
                                                          });
                                                        }
                                                        else {
                                                          const input = document.createElement("input");
                                                          input.type = "file";
                                                          input.onchange = async (e) => {
                                                            addUpdateImage(
                                                              e.target.files[0],
                                                              "productImageFront"
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
                                                            "productImageFront"
                                                          );
                                                        };
                                                        input.click();
                                                      }
                                                    }}>
                                                      {/* <input
                                                      type="file"
                                                      onChange={(e) => {
                                                        addUpdateImage(
                                                          e.target.files[0],
                                                          "productImageFront"
                                                        );
                                                      }}
                                                    /> */}
                                                      <div className="add-images">
                                                        Add Images
                                                      </div>
                                                    </button>
                                                  ) : (
                                                    <img
                                                      src={productImage[0]}
                                                      alt=""
                                                      className="add-images-preview"
                                                    />
                                                  )}
                                                </div>
                                                <p>Front Image</p>
                                              </div>
                                              <div>
                                                <div className="uploadImg">
                                                  {!productImage[1] ? (
                                                    <button
                                                    // onClick={async () => {
                                                    //   if (window && window.flutter_inappwebview) {
                                                    //     const tempV = await flutterfetchCameraPermission();
                                                    //     if (!tempV) {
                                                    //       setPermissionAlertPopUp({
                                                    //         permission: true,
                                                    //         type: "cameraPermission",
                                                    //       });
                                                    //     }
                                                    //     else {
                                                    //       const input = document.createElement("input");
                                                    //       input.type = "file";
                                                    //       input.onchange = async (e) => {
                                                    //         addUpdateImage(
                                                    //           e.target.files[0],
                                                    //           "productImageBack"
                                                    //         );
                                                    //       };
                                                    //       input.click();
                                                    //     }
                                                    //   } else {
                                                    //     const input = document.createElement("input");
                                                    //     input.type = "file";
                                                    //     input.onchange = async (e) => {
                                                    //       addUpdateImage(
                                                    //         e.target.files[0],
                                                    //         "productImageBack"
                                                    //       );
                                                    //     };
                                                    //     input.click();
                                                    //   }
                                                    // }}
                                                    >
                                                      <input
                                                        type="file"
                                                        onChange={(e) => {
                                                          addUpdateImage(
                                                            e.target.files[0],
                                                            "productImageBack"
                                                          );
                                                        }}
                                                      />
                                                      <div className="add-images">
                                                        Add Images
                                                      </div>
                                                    </button>
                                                  ) : (
                                                    <img
                                                      src={productImage[1]}
                                                      alt=""
                                                      className="add-images-preview"
                                                    />
                                                  )}
                                                </div>
                                                <p>Back Image</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    <div className=" col-lg-12  descriptionBlock gap-2">
                                      <label>
                                        {selectedCategory ===
                                          "Health & Wellness"
                                          ? "Remarks*"
                                          : "Description*"}
                                      </label>
                                      <div className="w-100">
                                        <textarea
                                          className="form-control"
                                          id="exampleFormControlTextarea1"
                                          rows="5"
                                          placeholder={
                                            selectedCategory ===
                                              "Health & Wellness"
                                              ? "Enter Remarks"
                                              : "Enter Description (AI tool will be implemented)"
                                          }
                                          value={description}
                                          onChange={(e) => {
                                            setdescription(
                                              e.target.value.trimStart()
                                            );
                                          }}
                                        ></textarea>
                                        {superValidation && !description && (
                                          <p className="error">Required*</p>
                                        )}
                                      </div>
                                    </div>
                                    {!["Health & Wellness"].includes(
                                      selectedCategory
                                    ) && (
                                        <div>
                                          <div className="text-center  mb-3 mt-3">
                                            <button
                                              className="btn btn-md btn-primary ps-4 pe-4"
                                              type="button"
                                              disabled={productName === ""}
                                              onClick={() => {
                                                autoGenerateText();
                                              }}
                                              style={{ position: "relative" }}
                                            >
                                              {loading && (
                                                <Spin
                                                  indicator={antIcon}
                                                  className="me-2"
                                                  style={{
                                                    color: "currentcolor",
                                                  }}
                                                />
                                              )}
                                              Generate Description using AI
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </form>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    {/* <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        setOpenScanner(true);
                      }}
                      style={{ position: "relative" }}
                    >
                      {"Scan Bar Code"}
                    </button> */}
                  </div>
                  {/* <div className="col-md-6 mb-3  d-flex gap-2 align-items-center">
                    <label className="col-sm-4">{'Get product details from barcode'}</label>
                    <button
                      className="btn btn-md btn-primary ps-4 pe-4"
                      type="button"
                      onClick={() => { setOpenScanner(true) }}
                      style={{ position: "relative" }}
                    >
                      {"Scan Bar Code"}
                    </button>
                  </div> */}
                  {packagedFood &&
                    [
                      "Health & Wellness",
                      "Beauty & Personal Care",
                      "Grocery",
                      "Fashion",
                      "Home & Kitchen",
                    ].includes(selectedCategory) &&
                    <div class="accordion" id="accordionExample">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="headingManufacture">
                          <button
                            class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseManufacture"
                            aria-expanded="true"
                            aria-controls="collapseManufacture"
                          >
                            <h3>Manufacture Details</h3>
                          </button>
                        </h2>
                        <div
                          id="collapseManufacture"
                          class="accordion-collapse collapse show"
                          aria-labelledby="headingManufacture"
                          data-bs-parent="#accordionExample"
                        >
                          <div class="accordion-body">
                            <form>
                              <div className="row justify-content-center justify-content-md-between">
                                <div className="col-md-6 mb-3 gap-2">
                                  <label className="mb-1">
                                    {[
                                      "Beauty & Personal Care",
                                      "Health & Wellness",
                                      "Home & Kitchen",
                                    ].includes(selectedCategory)
                                      ? "Brand Name*"
                                      : "Manufacturer Name*"}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter Brand Name"
                                    className="form-control"
                                    value={manufactureName}
                                    onChange={(e) => {
                                      setManufactureName(
                                        e.target.value.trimStart()
                                      );
                                    }}
                                  />
                                  {superValidation && !manufactureName && (
                                    <p className="error">Required*</p>
                                  )}
                                </div>
                                {![
                                  "Beauty & Personal Care",
                                  "Health & Wellness",
                                  "Home & Kitchen",
                                ].includes(selectedCategory) && (
                                    <>
                                      <div className="col-md-6 mb-3 gap-2">
                                        <label className="mb-1">Common Name*</label>
                                        <input
                                          type="text"
                                          placeholder="Enter Generic Name"
                                          className="form-control"
                                          value={commonName}
                                          maxLength={20}
                                          onChange={(e) => {
                                            setCommonName(
                                              e.target.value.trimStart()
                                            );
                                          }}
                                        />
                                        {superValidation && !commonName && (
                                          <p className="error">Required*</p>
                                        )}
                                      </div>
                                    </>
                                  )}
                                {[
                                  "Health & Wellness",
                                  "Beauty & Personal Care",
                                  "Home & Kitchen",
                                ].includes(selectedCategory) && (
                                    <div className="col-md-6 mb-3 gap-2">
                                      <label className="mb-1">
                                        MFG. License Number{" "}
                                        {selectedCategory === "Health & Wellness"
                                          ? "*"
                                          : ""}
                                      </label>

                                      <input
                                        type="text"
                                        placeholder="Enter MFG. License Number"
                                        className="form-control"
                                        value={mfgLicense}
                                        maxLength={20}
                                        onChange={(e) => {
                                          setMfgLicense(e.target.value.trimStart());
                                        }}
                                      />
                                      {superValidation &&
                                        !mfgLicense &&
                                        selectedCategory ===
                                        "Health & Wellness" && (
                                          <p className="error">Required*</p>
                                        )}
                                    </div>
                                  )}
                                {[
                                  "Gourmet & World Foods",
                                  "Beverages",
                                  "Bakery, Cakes & Dairy",
                                  "Snacks & Branded Foods",
                                  "Dairy and Cheese",
                                  "Snacks, Dry Fruits, Nuts",
                                  "Cereals and Breakfast",
                                  "Sauces, Spreads and Dips",
                                  "Chocolates and Biscuits",
                                  "Tinned and Processed Food",
                                  "Energy and Soft Drinks",
                                  "Fruit Juices and Fruit Drinks",
                                  "Snacks and Namkeen",
                                  "Ready to Cook and Eat",
                                  "Pickles and Chutney",
                                  "Indian Sweets",
                                  "Frozen Snacks"
                                ].includes(selectedsubCategories) && (
                                    <>
                                      <div className="col-md-6 mb-3 gap-2">
                                        <label>Nutritional Information*</label>
                                        <input
                                          type="text"
                                          placeholder="Enter Information"
                                          className="form-control"
                                          value={nutritionalInfo}
                                          onChange={(e) => {
                                            setNutritionalInfo(
                                              e.target.value.trimStart()
                                            );
                                          }}
                                        />
                                        {superValidation && !nutritionalInfo && (
                                          <p className="error">Required*</p>
                                        )}
                                      </div>
                                      <div className="col-md-6 mb-3 gap-2">
                                        <label
                                          className="mb-1"
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          Manufacture FSSAI License Number*
                                        </label>
                                        <input
                                          type="text"
                                          placeholder="Enter License Number"
                                          className="form-control"
                                          value={manufactureFSSAILicense}
                                          maxLength={14}
                                          onChange={(e) => {
                                            const inputValue =
                                              e.target.value.trimStart();
                                            if (
                                              inputValue === "" ||
                                              Number(inputValue) >= 0
                                            ) {
                                              setManufactureFSSAILicense(
                                                inputValue
                                              );
                                            }
                                          }}
                                        />
                                        {superValidation &&
                                          !manufactureFSSAILicense && (
                                            <p className="error">Required*</p>
                                          )}
                                      </div>
                                      <div className="col-md-6 mb-3 gap-2">
                                        <label
                                          className="mb-1"
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          Importer FSSAI License Number
                                        </label>
                                        <input
                                          type="text"
                                          placeholder="Enter License Number"
                                          className="form-control"
                                          value={importerFSSAILicense}
                                          maxLength={14}
                                          onChange={(e) => {
                                            const inputValue =
                                              e.target.value.trimStart();
                                            if (
                                              inputValue === "" ||
                                              Number(inputValue) >= 0
                                            ) {
                                              setImporterFSSAILicense(inputValue);
                                            }
                                          }}
                                        />
                                      </div>
                                    </>
                                  )}
                                {["Home & Kitchen", "Grocery"].includes(
                                  selectedCategory
                                ) && (
                                    <div className="col-md-6 mb-3 gap-2">
                                      <label className="mb-1">
                                        Manufacturer Month*
                                      </label>
                                      <input
                                        type="month"
                                        className="form-control date-picker"
                                        value={manufacturerDate}
                                        max={new Date().toISOString().split("T")[0]}
                                        onChange={(event) => {
                                          const selectedMonth = new Date(
                                            event.target.value + "-01"
                                          );
                                          const currentMonth = new Date();
                                          if (selectedMonth <= currentMonth) {
                                            setManufacturerDate(event.target.value);
                                          }
                                        }}
                                      />
                                      {superValidation && !manufacturerDate && (
                                        <p className="error">Required*</p>
                                      )}
                                    </div>
                                  )}
                                <div className="col-md-6 mb-3 gap-2">
                                  <label className="mb-1">
                                    Manufacturer Address*
                                  </label>
                                  <input
                                    placeholder="Enter Address"
                                    type="text"
                                    className="form-control"
                                    value={manufacturerAddress}
                                    onChange={(e) => {
                                      setManufacturerAddress(
                                        e.target.value.trimStart()
                                      );
                                    }}
                                  />
                                  {superValidation && !manufacturerAddress && (
                                    <p className="error">Required*</p>
                                  )}
                                </div>
                                {[
                                  "Gourmet & World Foods",
                                  "Beverages",
                                  "Bakery, Cakes & Dairy",
                                  "Snacks & Branded Foods",
                                  "Dairy and Cheese",
                                  "Snacks, Dry Fruits, Nuts",
                                  "Cereals and Breakfast",
                                  "Sauces, Spreads and Dips",
                                  "Chocolates and Biscuits",
                                  "Tinned and Processed Food",
                                  "Energy and Soft Drinks",
                                  "Fruit Juices and Fruit Drinks",
                                  "Snacks and Namkeen",
                                  "Ready to Cook and Eat",
                                  "Pickles and Chutney",
                                  "Indian Sweets",
                                  "Frozen Snacks"
                                ].includes(selectedsubCategories) && (
                                    <>
                                      <div className="col-md-6 mb-3 gap-2">
                                        <label
                                          className="mb-1"
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          Other FSSAI License Number
                                        </label>
                                        <input
                                          type="text"
                                          placeholder="Enter License Number"
                                          className="form-control"
                                          value={otherFSSAILicense}
                                          maxLength={14}
                                          onChange={(e) => {
                                            const inputValue =
                                              e.target.value.trimStart();
                                            if (
                                              inputValue === "" ||
                                              Number(inputValue) >= 0
                                            ) {
                                              setOtherFSSAILicense(inputValue);
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3 gap-2">
                                        <label className="mb-1">
                                          Additives Information
                                        </label>
                                        <input
                                          type="text"
                                          placeholder="Enter Information"
                                          className="form-control"
                                          value={additivesInformation}
                                          onChange={(e) => {
                                            setAdditivesInformation(
                                              e.target.value.trimStart()
                                            );
                                          }}
                                        />
                                        {superValidation &&
                                          !additivesInformation && (
                                            <p className="error">Required*</p>
                                          )}
                                      </div>
                                      <div className="col-md-6 d-flex gap-2 mb-3 align-items-center">
                                        <p
                                          className="error"
                                          style={{ fontSize: "12px" }}
                                        >
                                          Note* Please provide details about
                                          additives such as preservatives,
                                          artificial colors, or other ingredients.
                                        </p>
                                      </div>
                                    </>
                                  )}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingPrice">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsePrice"
                          aria-expanded="true"
                          aria-controls="collapsePrice"
                        >
                          <h3>Price</h3>
                        </button>
                      </h2>
                      <div
                        id="collapsePrice"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingPrice"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <form>
                            <div className="row justify-content-center justify-content-md-between">
                              <div className="col-md-3 gap-2 mb-3">
                                <p className="label-text min-text mb-1">MRP*</p>
                                <div className="w-100">
                                  <input
                                    type="text"
                                    placeholder="Enter Price"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        setprice(inputValue);
                                      }
                                    }}
                                  />
                                  {superValidation && !price && (
                                    <p className="error">Required*</p>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-3 gap-2 mb-3">
                                <p className="label-text min-text mb-1">
                                  Discount Value*
                                </p>
                                <div className="w-100">
                                  {" "}
                                  <input
                                    type="text"
                                    placeholder="Enter discounted Price"
                                    className="form-control"
                                    value={discount}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        setdiscount(inputValue);
                                      }
                                    }}
                                  />
                                  {superValidation &&
                                    parseInt(discount) > parseInt(price) && (
                                      <p className="error">
                                        {parseInt(discount) > parseInt(price)
                                          ? "Selling price must be less or equal to price"
                                          : "Required*"}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="col-md-3 gap-2 mb-3">
                                <p className="label-text min-text mb-1">
                                  Item Wise Delivery Charges
                                </p>
                                <div className="w-100">
                                  {" "}
                                  <input
                                    type="text"
                                    placeholder="Enter Item Wise Delivery Charges"
                                    className="form-control"
                                    value={itemLevelDeliveryCharges}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        setItemLevelDeliveryCharges(inputValue);
                                      }
                                    }}
                                  />
                                  {superValidation &&
                                    parseInt(discount) > parseInt(price) && (
                                      <p className="error">
                                        {parseInt(discount) > parseInt(price)
                                          ? "Selling price must be less or equal to price"
                                          : "Required*"}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="col-md-3 gap-2 mb-3">
                                <div className="gap-1">
                                  <p className="label-text min-text mb-1">
                                    GST
                                  </p>
                                  <select
                                    className="form-select"
                                    value={gst}
                                    onChange={(e) =>
                                      setGst(parseInt(e.target.value))
                                    }
                                  >
                                    <option value={0}>0%</option>
                                    <option value={5}>5%</option>
                                    <option value={12}>12%</option>
                                    <option value={18}>18%</option>
                                    <option value={28}>28%</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-12 gap-2">
                                <div
                                  className=" align-items-center gap-2 settlementAmount"
                                  style={{ display: "inline-flex" }}
                                >
                                  <p className="label-text">
                                    Settlement amount
                                  </p>{" "}
                                  <span className="amount">
                                    {discount - discount * 0.05}
                                  </span>
                                </div>
                                <p className="PlatformPopover ">
                                  <Popover
                                    content={platformIcon}
                                    trigger="hover"
                                  >
                                    <img
                                      src={BlueInfoIcon}
                                      className="me-1 "
                                      alt=""
                                    />
                                  </Popover>
                                  Platform Fees (5%)
                                </p>
                              </div>
                              <div className="cancellable-section mb-3">
                                <form>
                                  <div className=" d-flex gap-4 align-items-center">
                                    <label>Cancellable*</label>
                                    <div className="d-flex gap-2">
                                      <div className="Cancellable">
                                        <input
                                          type="radio"
                                          id="test1"
                                          onClick={() => {
                                            setisCancellable(true);
                                          }}
                                          checked={isCancellable}
                                          name="radio-group"
                                        />
                                        <label
                                          onClick={() => {
                                            setisCancellable(true);
                                          }}
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="Cancellable">
                                        <input
                                          type="radio"
                                          id="test2"
                                          onClick={() => {
                                            setisCancellable(false);
                                          }}
                                          checked={!isCancellable}
                                          name="radio-group"
                                        />
                                        <label
                                          onClick={() => {
                                            setisCancellable(false);
                                          }}
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                                <form>
                                  <div className="d-flex gap-4 align-items-center">
                                    <label>Returnable*</label>
                                    <div className="d-flex gap-2">
                                      <div className="Returnable">
                                        <input
                                          type="radio"
                                          onClick={() => {
                                            setisReturnable(true);
                                          }}
                                          checked={isReturnable}
                                          name="radio-group"
                                        />
                                        <label
                                          onClick={() => {
                                            setisReturnable(true);
                                          }}
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="Returnable">
                                        <input
                                          type="radio"
                                          onClick={() => {
                                            setisReturnable(false);
                                          }}
                                          checked={!isReturnable}
                                          name="radio-group"
                                        />
                                        <label
                                          onClick={() => {
                                            setisReturnable(false);
                                          }}
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="footerbtn  mb-3">
                    {!catelogData?._id && (
                      <button
                        className="border-btn"
                        disabled={submitDisable}
                        onClick={() => {
                          submitCatelog("drafted");
                        }}
                      >
                        Save and Go Back
                      </button>
                    )}
                    <button
                      className="btn btn-md btn-primary"
                      disabled={submitDisable && !superValidation}
                      onClick={() => {
                        submitCatelog("pending");
                      }}
                    >
                      Submit Catalog
                    </button>
                  </div>
                  {(selectedCategory === "F&B" || selectedCategory === "Food & Beverage") && (
                    <button
                      className="btn btn-md btn-primary"
                      disabled={submitDisable && !superValidation}
                      onClick={() => {
                        setAddCustomModal(true)
                      }}
                    >
                      Add Custom Group
                    </button>
                  )}
                  {/* <p className="price-note">
                    Note * Enter the price including all taxes.
                  </p> */}
                  {(selectedCategory === "F&B" || selectedCategory === "Food & Beverage") && (
                    <div className="add-variants-table">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3>Add Variants</h3>
                        <div className="PlatPopover m-0">
                          <Popover content={platformIcon} trigger="hover">
                            <img src={BlueInfoIcon} className="me-1 " alt="" />
                          </Popover>
                          Platform Fees (5%)
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table m-0">
                          <thead>
                            <tr>
                              <td>
                                Custom Group<span>*</span>
                              </td>
                              <td>
                                Variant Name<span>*</span>
                              </td>
                              <td>
                                EAN Number<span>*</span>
                              </td>
                              <td>
                                Net Weight(gms/kg)<span>*</span>
                              </td>
                              <td>
                                Select Unit<span>*</span>
                              </td>
                              <td>
                                Available Quantity<span>*</span>
                              </td>
                              <td>
                                Price<span>*</span>
                              </td>
                              <td>
                                Selling Price<span>*</span>
                              </td>
                              <td>Settlement Price</td>
                              <td>Child Custom Group</td>
                              <td></td>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((variant, index) => (
                              <tr
                                style={{ verticalAlign: "middle" }}
                                key={index}
                              >
                                <td>
                                  <select
                                    className="form-select"
                                    value={variant.customGroupId}
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "customGroupId",
                                        e.target.value
                                      )
                                    }
                                    }
                                  >
                                    <option value="">Select</option>
                                    {customGroupList?.map(c => {
                                      return <option value={c._id}>{c?.customGroupName}</option>
                                    })}
                                  </select>
                                  {superValidation && variant.customGroupId === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Variant Name*"
                                    className="form-control"
                                    value={variant.productName}
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "productName",
                                        e.target.value.trimStart()
                                      );
                                    }}
                                  />
                                  {superValidation && variant.productName === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter EAN Number*"
                                    className="form-control"
                                    value={variant.productId}
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "productId",
                                        e.target.value.trimStart()
                                      );
                                    }}
                                  />
                                  {superValidation && variant.productId === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Net Weight*"
                                    className="form-control"
                                    value={variant.weight}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "weight",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation && variant.weight === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>

                                  <select
                                    className="form-select"
                                    value={variant.weightUnit}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "weightUnit",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="UNIT">UNIT</option>
                                    {weightUnit !== "LITRE" &&
                                      weightUnit !== "ML" && (
                                        <option value="GRAMS">GRAMS</option>
                                      )}
                                    {weightUnit !== "LITRE" &&
                                      weightUnit !== "ML" && (
                                        <option value="KG">KG</option>
                                      )}
                                    {weightUnit !== "GRAMS" &&
                                      weightUnit !== "KG" && (
                                        <option value="LITRE">LITRE</option>
                                      )}
                                    {weightUnit !== "GRAMS" &&
                                      weightUnit !== "KG" && (
                                        <option value="ML">ML</option>
                                      )}
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Quantity*"
                                    className="form-control"
                                    value={variant.availableQuantity}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "availableQuantity",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation &&
                                    variant.availableQuantity === "" && (
                                      <p className="error">Required*</p>
                                    )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Price*"
                                    className="form-control"
                                    value={variant.price}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) >= 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "price",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation && variant.price === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Selling Price*"
                                    className="form-control"
                                    value={variant.discountedPrice}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) >= 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "discountedPrice",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation &&
                                    variant.discountedPrice === "" && (
                                      <p className="error">Required*</p>
                                    )}
                                  {parseFloat(variant.discountedPrice) >
                                    parseFloat(variant.price) && (
                                      <p className="error">Not valid*</p>
                                    )}
                                </td>
                                <td>
                                  {variant.discountedPrice !== 0 &&
                                    variant.discountedPrice !== "" && (
                                      <span className="form-control">
                                        {variant.discountedPrice -
                                          variant.discountedPrice * 0.05}
                                      </span>
                                    )}
                                </td>

                                <td>
                                  <Select
                                    mode="tags"
                                    className="form-select"
                                    // style={{ width: '100%' }}
                                    defaultValue={variants[index]?.childCustomGroupId}
                                    placeholder="Tags Mode"
                                    onChange={(e) => handleChange(e, index)}
                                  // onChange={handleChange}
                                  >
                                    <option value="-1">Select</option>
                                    {customGroupList?.map(c => {
                                      // console.log(variants[index]?.customGroupId,'variants[index]?.customGroupId')
                                      if (c._id !== variants[index]?.customGroupId) {
                                        return <option value={c._id}>{c?.customGroupName}</option>
                                      }
                                    })}
                                  </Select>
                                  {/* <select
                                    className="form-select"
                                    value={variant.childCustomGroupId}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "childCustomGroupId",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    {customGroupList?.map(c=>{
                                      // console.log(variants[index]?.customGroupId,'variants[index]?.customGroupId')
                                      if(c._id !== variants[index]?.customGroupId){
                                        return <option value={c._id}>{c?.customGroupName}</option>
                                      }
                                    })}
                                  </select> */}
                                </td>
                                <td>
                                  <button
                                    className="p-0"
                                    style={{
                                      border: "none",
                                      background: "inherit",
                                    }}
                                    onClick={() =>
                                      variant._id
                                        ? deleteVariantApi(variant)
                                        : deleteVariant(index)
                                    }
                                  >
                                    <img src={deleteIcon} alt="Delete" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={6} style={{ textAlign: "left" }}>
                                <button
                                  className="btn btn-primary"
                                  disabled={variantDisabled}
                                  onClick={addVariant}
                                >
                                  <img src={CirclePlus} alt="Add Variant" /> Add
                                  Products
                                </button>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                  {(selectedCategory === "Grocery") && (
                    <div className="add-variants-table">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3>Add Variants</h3>
                        <div className="PlatPopover m-0">
                          <Popover content={platformIcon} trigger="hover">
                            <img src={BlueInfoIcon} className="me-1 " alt="" />
                          </Popover>
                          Platform Fees (5%)
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table m-0">
                          <thead>
                            <tr>
                              <td>
                                EAN Number<span>*</span>
                              </td>
                              <td>
                                Net Weight(gms/kg)<span>*</span>
                              </td>
                              <td>
                                Select Unit<span>*</span>
                              </td>
                              <td>
                                Available Quantity<span>*</span>
                              </td>
                              <td>
                                Price<span>*</span>
                              </td>
                              <td>
                                Selling Price<span>*</span>
                              </td>
                              <td>Settlement Price</td>
                              <td></td>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((variant, index) => (
                              <tr
                                style={{ verticalAlign: "middle" }}
                                key={index}
                              >
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter EAN Number*"
                                    className="form-control"
                                    value={variant.productId}
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "productId",
                                        e.target.value.trimStart()
                                      );
                                    }}
                                  />
                                  {superValidation && variant.productId === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Net Weight*"
                                    className="form-control"
                                    value={variant.weight}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "weight",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation && variant.weight === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    value={variant.weightUnit}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "weightUnit",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="UNIT">UNIT</option>
                                    {weightUnit !== "LITRE" &&
                                      weightUnit !== "ML" && (
                                        <option value="GRAMS">GRAMS</option>
                                      )}
                                    {weightUnit !== "LITRE" &&
                                      weightUnit !== "ML" && (
                                        <option value="KG">KG</option>
                                      )}
                                    {weightUnit !== "GRAMS" &&
                                      weightUnit !== "KG" && (
                                        <option value="LITRE">LITRE</option>
                                      )}
                                    {weightUnit !== "GRAMS" &&
                                      weightUnit !== "KG" && (
                                        <option value="ML">ML</option>
                                      )}
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Quantity*"
                                    className="form-control"
                                    value={variant.availableQuantity}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "availableQuantity",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation &&
                                    variant.availableQuantity === "" && (
                                      <p className="error">Required*</p>
                                    )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Price*"
                                    className="form-control"
                                    value={variant.price}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "price",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation && variant.price === "" && (
                                    <p className="error">Required*</p>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Selling Price*"
                                    className="form-control"
                                    value={variant.discountedPrice}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      if (
                                        inputValue === "" ||
                                        Number(inputValue) > 0
                                      ) {
                                        handleInputChange(
                                          index,
                                          "discountedPrice",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  {superValidation &&
                                    variant.discountedPrice === "" && (
                                      <p className="error">Required*</p>
                                    )}
                                  {parseFloat(variant.discountedPrice) >
                                    parseFloat(variant.price) && (
                                      <p className="error">Not valid*</p>
                                    )}
                                </td>
                                <td>
                                  {variant.discountedPrice !== 0 &&
                                    variant.discountedPrice !== "" && (
                                      <span className="form-control">
                                        {variant.discountedPrice -
                                          variant.discountedPrice * 0.05}
                                      </span>
                                    )}
                                </td>
                                <td>
                                  <button
                                    className="p-0"
                                    style={{
                                      border: "none",
                                      background: "inherit",
                                    }}
                                    onClick={() =>
                                      variant._id
                                        ? deleteVariantApi(variant)
                                        : deleteVariant(index)
                                    }
                                  >
                                    <img src={deleteIcon} alt="Delete" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={6} style={{ textAlign: "left" }}>
                                <button
                                  className="btn btn-primary"
                                  disabled={variantDisabled}
                                  onClick={addVariant}
                                >
                                  <img src={CirclePlus} alt="Add Variant" /> Add
                                  Products
                                </button>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-xl-4 col-md-12">
                  <div className="uploadedImage">
                    <h5>Uploaded Images</h5>
                    <div className="d-flex gap-5">
                      <div>
                        <p className="change-text">Front Image*</p>
                        <button className="change-image"
                          onClick={async () => {
                            if (window && window.flutter_inappwebview) {
                              const tempV = await flutterfetchCameraPermission();
                              if (!tempV) {
                                setPermissionAlertPopUp({
                                  permission: true,
                                  type: "cameraPermission",
                                });
                              }
                              else {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.onchange = async (e) => {
                                  addUpdateImage(
                                    e.target.files[0],
                                    "productImageFront"
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
                                  "productImageFront"
                                );
                              };
                              input.click();
                            }
                          }}>
                          {/* <input
                            type="file"
                            disabled={isDisable}
                            onChange={(e) => {
                              addUpdateImage(
                                e.target.files[0],
                                "productImageFront"
                              );
                            }}
                          /> */}
                          CHANGE
                        </button>
                      </div>

                      {/* <button className="changeBtn">
                          CHANGE</button> */}
                      {/* <div className="images-block">

                          {productImage.map((image, index) => {
                            return (
                              <div className="image-preview-Block">
                                <div className="img-preview">
                                  <img
                                    src={
                                      image
                                    }
                                    className="aad-img"
                                  />

                                </div>
                                {index != 0 && <div className="cross-icon">
                                  <img src={crossIcon} onClick={() => { removeImage(`${index}`) }} />
                                </div>}
                              </div>
                            );
                          })}
                        </div> */}
                      {/* </div>
                      <div> */}
                      <div>
                        {packagedFood && selectedCategory === "Grocery" && (
                          <>
                            <p className="change-text">Back Image*</p>
                            <button className="change-image" onClick={async () => {
                              if (window && window.flutter_inappwebview) {
                                const tempV = await flutterfetchCameraPermission();
                                if (!tempV) {
                                  setPermissionAlertPopUp({
                                    permission: true,
                                    type: "cameraPermission",
                                  });
                                }
                                else {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.onchange = async (e) => {
                                    addUpdateImage(
                                      e.target.files[0],
                                      "productImageBack"
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
                                    "productImageBack"
                                  );
                                };
                                input.click();
                              }
                            }}>
                              {/* <input
                                type="file"
                                disabled={isDisable}
                                onChange={(e) => {
                                  addUpdateImage(
                                    e.target.files[0],
                                    "productImageBack"
                                  );
                                }}
                              /> */}
                              CHANGE
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="front-back-uploaded">
                      {productImage.map((image, index) => {
                        return (
                          <div className="image-preview-Block">
                            <div className="img-preview">
                              <img src={image} alt="" className="aad-img" />
                            </div>
                            {packagedFood && selectedCategory === "Grocery"
                              ? index !== 0 &&
                              index !== 1 && (
                                <div className="cross-icon">
                                  <img
                                    src={crossIcon}
                                    alt=""
                                    onClick={() => {
                                      removeImage(`${index}`);
                                    }}
                                  />
                                </div>
                              )
                              : index !== 0 && (
                                <div className="cross-icon">
                                  <img
                                    src={crossIcon}
                                    alt=""
                                    onClick={() => {
                                      removeImage(`${index}`);
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        );
                      })}
                      {/* </div> */}
                      {/* </div> */}
                    </div>
                    <button className="add-image-btn" onClick={async () => {
                      if (window && window.flutter_inappwebview) {
                        const tempV = await flutterfetchCameraPermission();
                        if (!tempV) {
                          setPermissionAlertPopUp({
                            permission: true,
                            type: "cameraPermission",
                          });
                        }
                        else {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.onchange = async (e) => {
                            if (productImage?.length >= 9) {
                              notify("error", "Maximum 9 images allowed .");
                              return;
                            }
                            addUpdateImage(e.target.files[0], "productImage");
                          };
                          input.click();
                        }
                      } else {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.onchange = async (e) => {
                          if (productImage?.length >= 9) {
                            notify("error", "Maximum 9 images allowed .");
                            return;
                          }
                          addUpdateImage(e.target.files[0], "productImage");
                        };
                        input.click();
                      }
                    }}>
                      {/* <input
                        type="file"
                        disabled={isDisable}
                        onChange={(e) => {
                          if (productImage.length >= 9) {
                            notify("error", "Maximum 9 images allowed .");
                            return;
                          }
                          addUpdateImage(e.target.files[0], "productImage");
                        }}
                      /> */}
                      {isDisable && isSpin === "productImage" ? (
                        <Space size="middle" className="Loaderblue">
                          <div>
                            {" "}
                            <Spin size="medium" className="spiner" />
                          </div>
                        </Space>
                      ) : (
                        ""
                      )}
                      {isDisable && isSpin === "productImageBack" ? (
                        <Space size="middle" className="Loaderblue">
                          <div>
                            {" "}
                            <Spin size="medium" className="spiner" />
                          </div>
                        </Space>
                      ) : (
                        ""
                      )}
                      {isDisable && isSpin === "productImageFront" ? (
                        <Space size="middle" className="Loaderblue">
                          <div>
                            {" "}
                            <Spin size="medium" className="spiner" />
                          </div>
                        </Space>
                      ) : (
                        ""
                      )}
                      <div className="add-images">
                        <img src={addImg} alt="" />
                        Add Images
                      </div>
                    </button>

                    {superValidation && !productImage && (
                      <p className="error">Required*</p>
                    )}
                  </div>
                  <div className="guidelines product-guidelines">
                    <div className="guidelinesHeading">
                      <img src={infoIcon} alt="" />
                      <p className="m-0">
                        Follow guidelines to reduce quality check failure
                      </p>
                    </div>
                    <ul>
                      <h6>Image Guidelines</h6>
                      <li>
                        Images with text/Watermark are not acceptable in primary
                        images.
                      </li>
                      <li>Product image should not have any text</li>
                      <li>Please add solo product image without any props.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {openCatalog && (
                <div className="submit-catalog-container">
                  <div className="submit-catalog-modal">
                    <div className="submit-catalog">
                      <div className="backgorund-img">
                        <img src={submitcatalogBg} alt="" />
                      </div>
                      <img
                        src={whiteSubmitBg}
                        className="submitwhite-bg"
                        alt=""
                      />
                      <div className="submit-catalog-content">
                        <h3>Catalog uploaded successfully</h3>
                        <p>
                          Your catalog will go live after quality check are
                          done. it usually takes around 10-12 hours.{" "}
                        </p>
                        <div className="submit-catalog-btn">
                          <button
                            className="btn btn-md btn-outline"
                            onClick={() => {
                              navigate("/inventory");
                            }}
                          >
                            Go to Inventory
                          </button>
                          <button
                            className="btn btn-md btn-primary"
                            onClick={() => {
                              navigate("/addsinglecatalog");
                            }}
                          >
                            Upload more Catalogs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div >
      </div >
      <Modal
        open={openScanner}
        onClose={() => {
          setOpenScanner(false);
        }}
        center
      >
        {/* <div className="modal-heading">
          <h3>{qRResult}</h3>
        </div> */}
        <div className="modal_body barcode-scanner">
          {/* <BarcodeScanner
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          /> */}
        </div>
        <div className="modal_footer">
          <button
            className="btn btn-sm cancle-btn"
            onClick={() => {
              setOpenScanner(false);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              checkCatelog();
            }}
          >
            Continue
          </button>
        </div>
      </Modal>
      <Modal
        open={menuPopup}
        onClose={() => {
          setMenuPopup(false)
        }}
        center
      >
        <div className="container pb-3 pt-3">
          <div className="coupon-details-form">
            <h6>MENU DETAILS</h6>
            <div className="row">
            </div>

            <form className="form">
              <div className="row">
                <div className="col-lg-6 mb-3">
                  <label>Time From</label>
                  <input
                    type="time"
                    className="form-control time-picker"
                    value={
                      menu?.timeFrom &&
                      moment(
                        menu?.timeFrom,
                        "HHmm"
                      ).format("HH:mm")
                    }
                    onChange={(e) => {
                      setMenu((prevState) => ({
                        ...prevState,
                        timeFrom: moment(e.target.value, "HH:mm").format("HHmm"),
                      }));
                    }}
                  />
                  {submitMenu &&
                    menu?.timeFrom === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Time To</label>
                  <input
                    type="time"
                    className="form-control time-picker"
                    value={
                      menu?.timeTo &&
                      moment(
                        menu?.timeTo,
                        "HHmm"
                      ).format("HH:mm")
                    }
                    onChange={(e) => {
                      if (moment(menu?.timeFrom, "HHmm") > moment(e.target.value, "HHmm")) {
                        notify("error", "End time is not equal or less than start time ");
                      } else {
                        setMenu((prevState) => ({
                          ...prevState,
                          timeTo: moment(e.target.value, "HH:mm").format("HHmm"),
                        }));
                      }
                    }}
                  />
                  {submitMenu &&
                    menu?.timeTo === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Day From</label>
                  <select
                    className="form-select"
                    value={menu?.dayFrom}
                    onChange={(e) => {
                      if (parseInt(e.target.value) > parseInt(menu.dayTo)) { notify("error", "Day From is not less than Day To "); return; }
                      else {
                        setMenu((prevState) => ({
                          ...prevState,
                          dayFrom: e.target.value,
                        }));
                      }
                    }}
                  >
                    <option value="">
                      Select From
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  {submitMenu &&
                    menu?.dayFrom === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Day To</label>
                  <select
                    className="form-select"
                    value={menu?.dayTo}
                    onChange={(e) => {
                      if (parseInt(menu?.dayFrom) > parseInt(e.target.value)) { notify("error", "Day From is not less than Day To "); return; }
                      else {
                        setMenu((prevState) => ({
                          ...prevState,
                          dayTo: e.target.value,
                        }));
                      }
                    }}
                  >
                    <option value="">
                      Select To
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  {submitMenu &&
                    menu?.dayTo === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={menu?.status}
                    onChange={(e) => {
                      setMenu((prevState) => ({
                        ...prevState,
                        status: e.target.value,
                      }));
                    }}
                  >
                    <option value="">
                      Select Status
                    </option>
                    <option value="active">Active</option>
                    <option value="inActive">In Active</option>
                  </select>
                  {submitMenu &&
                    menu?.status === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={menu?.menuName}
                    onChange={(e) => {
                      setMenu((prevState) => ({
                        ...prevState,
                        menuName: e.target.value,
                      }));
                    }}
                  />
                  {submitMenu &&
                    menu?.menuName === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
              </div>
            </form>

            <div className="d-flex justify-content-end align-item-center">
              <button
                className="btn btn-outline me-2 btn-sm"
                onClick={() => {
                  setMenuPopup(false);
                  setMenu({
                    userId: user_data._id,
                    timeFrom: "0000",
                    timeTo: "2359",
                    status: "active",
                    dayFrom: "",
                    dayTo: "",
                    isActive: true
                  });
                  setSubmitMenu(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  createMenu()
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>

      </Modal>
      <Modal
        open={customModal}
        onClose={() => {
          setAddCustomModal(false)
        }}
        center
      >
        <div className="container pb-3 pt-3">
          <div className="coupon-details-form">
            <h6>Custom Group DETAILS</h6>
            <div className="row">
            </div>

            <form className="form">
              <div className="row">
                <div className="col-lg-6 mb-3">
                  <label>Custom Group Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customGroup?.customGroupName}
                    onChange={(e) => {
                      setCustomGroup((prevState) => ({
                        ...prevState,
                        customGroupName: e.target.value,
                      }));
                    }}
                  />
                  {submitCustomGroup &&
                    customGroup?.customGroupName === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Custom Group Sequence</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customGroup?.sequence}
                    onChange={(e) => {
                      setCustomGroup((prevState) => ({
                        ...prevState,
                        sequence: e.target.value,
                      }));
                    }}
                  />
                  {submitCustomGroup &&
                    customGroup?.sequence === "" && customGroup?.sequence !== 0 && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Select Item Minimum</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customGroup?.min}
                    onChange={(e) => {
                      setCustomGroup((prevState) => ({
                        ...prevState,
                        min: e.target.value,
                      }));
                    }}
                  />
                  {/* {submitCustomGroup &&
                    customGroup?.menuName === "" && (
                      <p className="error">Required*</p>
                    )} */}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Select Item Maximum</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customGroup?.max}
                    onChange={(e) => {
                      setCustomGroup((prevState) => ({
                        ...prevState,
                        max: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Custom Group Input Type</label>
                  <select
                    className="form-select"
                    value={customGroup?.input}
                    onChange={(e) => {
                      setCustomGroup((prevState) => ({
                        ...prevState,
                        input: e.target.value,
                      }));
                    }}
                  >
                    <option value="">
                      Select Custom Group Input type
                    </option>
                    <option value="select">Select</option>
                  </select>
                  {submitCustomGroup &&
                    customGroup?.input === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Custom Group Status</label>
                  <select
                    className="form-select"
                    value={customGroup?.status}
                    onChange={(e) => {
                      setCustomGroup((prevState) => ({
                        ...prevState,
                        status: e.target.value,
                      }));
                    }}
                  >
                    <option value="">
                      Select Status
                    </option>
                    <option value="active">Active</option>
                    <option value="inActive">In Active</option>
                  </select>
                  {submitCustomGroup &&
                    customGroup?.status === "" && (
                      <p className="error">Required*</p>
                    )}
                </div>
              </div>
            </form>

            <div className="d-flex justify-content-end align-item-center">
              <button
                className="btn btn-outline me-2 btn-sm"
                onClick={() => {
                  setAddCustomModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  createCustomGroup()
                }}
              >
                Save
              </button>
            </div>
          </div>
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
export default FBCategories;
