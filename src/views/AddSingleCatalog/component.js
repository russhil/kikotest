import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import "react-responsive-modal/styles.css";
import { Modal } from "reactstrap";
import axios from "axios";
import { countries } from "../../country";
import AddsingleCatalog from "../../images/single-catalog.png";
import BulkCatalog from "../../images/bulk-catalog.png";
import Barcode from "../../images/barcode.jpeg";
import { Link } from "react-router-dom";
import { read, utils } from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import { notify, handleError, flutterfetchStoragePermission, CsvGenerator } from "../../utils";
import { get } from "lodash";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { GET_USER, GET_CATELOGUE } from "../../api/apiList";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import PermissionAlertP from "../../components/Modal/PermissionAlertPopup";

const AddSingleCatalog = (props) => {
  const myRef = useRef();
  const navigate = useNavigate();
  const [openScanner, setOpenScanner] = useState(false);
  const [scanCatelogData, setScanCatelogData] = useState({});
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const [user_data] = useState(getSellerDetails());
  const [qRResult, setQRResult] = useState("Data Not Found");
  const [loading, setLoading] = useState(false);
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({
    permission: false,
    type: "",
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [wrongRecord, setWrongRecord] = useState([])
  const [catelogId, setCatelogId] = useState("");
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const getUser = async () => {
    const userData = getSellerDetails();
    try {
      const response = await API.post(GET_USER, {
        _id: userData && userData._id,
      });
      if (response) {
        localStorage.setItem("user", JSON.stringify(response?.data?.result));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const convertWeightUnit = (unit) => {
    switch (unit.trim().toUpperCase()) {
      case 'GRAM':
        return 'GRAMS';
      case 'UNIT':
        return 'UNIT';
      case 'GRAMS':
        return 'GRAMS';
      case 'KG':
        return 'KG';
      case 'KILOGRAM':
        return 'KG';
      case 'KILOGRAMS':
        return 'KG';
      case 'MILLIILITERS':
        return 'ML';
      case 'MILLILITERS':
        return 'ML';
      case 'LITRE':
        return 'LITRE';
      case 'LITRES':
        return 'LITRE';
      default:
        return null;
    }
  };

  const convertExcelToJson = (file) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith(".xlsx")) {
        notify("error", "Invalid file format. Only XLSX files are allowed.");
        setLoading(false);
        return; // Return early and do not proceed further
      }
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const filteredData = utils.sheet_to_json(worksheet, { header: 1 });

        const jsonData = filteredData.filter(
          (row) => Array.isArray(row) && row?.length > 0
        );

        const headers = jsonData[0];
        const headerTransformations = {
          "EAN Number": "productId",
          Category: "categoryId",
          Subcategory: "subCategoryId",
          L3: "l3",
          L4: "l4",
          Code: "code",
          "Common Name": "commonName",
          "Product Name": "productName",
          "Available Quantity": "availableQuantity",
          Unit: "weightUnit",
          Price: "price",
          "Selling Price": "discountedPrice",
          GST: "gst",
          Description: "description",
          "SKU Code": "skuCode",
          "Manufacturer Name": "manufactureName",
          "Manufacturer Address": "manufacturerAddress",
          "Country of Origin": "countryOfOrigin",
          "Customer Care Contact": "customerCare",
          "Time to Ship": "timeToShip",
          "Packaged Item": "packagedFood",
          Returnable: "isReturnable",
          Cancellable: "isCancellable",
          "COD available (Y/N)": "cod",
          "Product Image1": "image1",
          "Product Image2": "image2",
          "Product Image3": "image3",
          "Product Image4": "image4",
          "Product Image5": "image5",
          "Product Image6": "image6",
          "Product Image7": "image7",
          "Net Weight": "weight",
          Brand: "brand",
          "Pack Quantity": "packQuantity",
          "Pack Size": "packSize",
          "Images / Video": "imageVideo",
          "UPC/EAN": "upcEan",
          "Manufacture FSSAI License Number": "manufactureFSSAILicense",
          "Preservatives (Y/N)": "preservatives",
          "Preservatives (details)": "preservativesDetail",
          "Flavours & Spices": "flavourSpices",
          "Ready to cook (Y/N)": "readyToCook",
          "Ready to eat (Y/N)": "readyToEat",
          "Rice grain type": "riceGrainType",
          "Recommended Age": "recommendAge",
          "Baby Weight": "babyWeight",
          "Absorption Duration (in Hrs)": "absorptionDuration",
          "Scented/ Flavour": "scentedFlavour",
          "Herbal/ Ayurvedic": "herbalAyurvedic",
          "Theme/ Occasion Type": "themeOccasionType",
          "Hair Type": "hairType",
          "Mineral Source": "mineralSource",
          "Caffeine Content": "caffeineContent",
          Capacity: "capacity",
          "Nutritional Information": "nutritionalValue",
          "Other FSSAI License Number":"otherFSSAILicense",
          "Importer FSSAI license Number":"importerFSSAILicense",
          "Misc Info": "miscInfo",
          "Veg/Non-Veg": "foodType",
          "Packaging Cost": "packagingCost",
          "Menu Name": "menuName"
        };
        const result = jsonData.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            const modifiedHeader = headerTransformations[header?.trim()];
            obj[modifiedHeader] = row[index]
            obj.status = "active";
            obj.userId = user_data?._id;
            if (obj.categoryId?.trim() === "Food & Beverage") {
              obj.isFoodAndBeverage = true
            }
          });
          if (
            !obj.userId ||
            !obj.subCategoryId ||
            !obj.image1 ||
            !obj.productName ||
            !obj.productId ||
            !obj.weight ||
            !obj.weightUnit ||
            !obj.availableQuantity ||
            parseInt(obj.availableQuantity) > 999 ||
            !obj.price ||
            parseInt(obj.discountedPrice) >  parseInt(obj.price) ||
            obj.productId?.length > 20 ||
            !obj.description ||
            !obj.discountedPrice ||
            !obj.countryOfOrigin ||
            // !["yes",true,"true","no","false",false].includes(obj.packagedFood)||
            !["yes", true, "true", "TRUE", "no", "NO", "No", "false", "FALSE", false].includes(obj.isReturnable) ||
            !["yes", true, "true", "TRUE", "no", "NO", "No", "false", "FALSE", false].includes(obj.isCancellable)
          ) {
            if (!["yes", true, "true", "no", "false", false].includes(obj.isReturnable)) {
              obj.Error = "Returnable is not valid"
            }
            if (!["yes", true, "true", "no", "false", false].includes(obj.isCancellable)) {
              obj.Error = "Cancellable is not valid"
            }
            if(parseInt(obj.discountedPrice) >  parseInt(obj.price))
            {
               obj.Error = "Selling price of item can't be greater than the price"
            }
            if (!obj.userId) {
              obj.Error = "userId is not valid"
            }
            else if (!obj.subCategoryId ) {
              obj.Error = "Sub CategoryId is not valid"
            }
            else if (!obj.image1) {
              obj.Error = "Image is not valid"
            }
            else if (!obj.productName) {
              obj.Error = "Product Name is not valid"
            }
            else if (!obj.productId || obj.productId?.length > 20) {
              obj.Error = "Product Id is not valid"
            }
            else if (!obj.weight) {
              obj.Error = "weight is not valid"
            }
            else if (!obj.weightUnit) {
              obj.Error = "weight Unit is not valid"
            }
            else if (!obj.availableQuantity || parseInt(obj.availableQuantity) > 999) {
              obj.Error = "Available Quantity is not valid"
            }
            else if (!obj.price ) {
              obj.Error = "Price is not valid"
            }
            else if (!obj.description) {
              obj.Error = "Description is not valid"
            }
            else if (!obj.discountedPrice ) {
              obj.Error = "Discounted Price is not valid"
            }
            else if (!obj.countryOfOrigin) {
              obj.Error = "Country Of Origin Price is not valid"
            }
            wrongRecord.push(obj);
            return null;
          }
          if (![0, 5, 12, 18, 28].includes(obj.gst)) {
            obj.Error = "Gst is not valid"
            wrongRecord.push(obj);
            return null;
          }
          if (catelogId !== obj.categoryId) {
            obj.Error = "Category Id is not valid"
            wrongRecord.push(obj);
            return null;
          }
          if (obj.categoryId?.trim() === "Food & Beverage") {
            if(obj.productName?.length > 100){
              obj.Error = "Produnct Name is not valid"
              wrongRecord.push(obj);
              return null;
            }
            if(obj.subCategoryId?.length > 100){
              obj.Error = "sub Category Id Name is not valid"
              wrongRecord.push(obj);
              return null;
            }
            if (!obj.packagingCost && obj.packagingCost >= 1000) {
              obj.Error = "Packaging Cost is not valid"
              wrongRecord.push(obj);
              return null;
            }
            if (!obj.manufactureFSSAILicense || obj.manufactureFSSAILicense?.toString()?.length != 14) {
              obj.Error = "Manufacture FSSAI License is not valid"
              wrongRecord.push(obj);
              return null;
            }
            if (!["veg", "non-veg"].includes(obj.foodType?.trim().toLowerCase())) {
              obj.Error = "Food Type is not valid"
              wrongRecord.push(obj);
              return null;
            }
            if ((!obj.menuName || obj.menuName?.length > 40)) {
              obj.Error = "Menu Name is not valid"
              wrongRecord.push(obj);
              return null;
            }
          }
          if (obj.categoryId?.trim() === "Food & Beverage") {
            obj.foodType = obj.foodType?.trim().toLowerCase();
            obj.fssaiLicense = get(obj, "manufactureFSSAILicense", "");
          }
          if (
            [
              "Masala & Seasoning",
              "Oil & Ghee",
              "Eggs, Meat & Fish",
              "Cleaning & Household",
              "Pet Care",
              "Pasta, Soup and Noodles",
              "Cooking and Baking Needs",
              "Atta, Flours and Sooji",
              "Rice and Rice Products",
              "Dals and Pulses",
              "Salt, Sugar and Jaggery",
              "Tea and Coffee",

            ].includes(obj.subCategoryId?.trim()) &&
            (!obj.manufactureName ||
              !obj.manufacturerAddress ||
              !obj.commonName ||
              !obj.countryOfOrigin)
          ) {
            if (!obj.manufactureName) {
              obj.Error = "Manufacture Name is not valid"
            }
            else if (!obj.manufacturerAddress) {
              obj.Error = "Manufacturer Address is not valid"
            }
            else if (!obj.commonName) {
              obj.Error = "Common Name is not valid"
            }
            else if (!obj.countryOfOrigin) {
              obj.Error = "country Of Origin is not valid"
            }
            wrongRecord.push(obj);
            return null;
          }

          if (
            [
              "Health & Wellness",
              "Beauty & Personal Care",
              "Grocery",
              "Fashion",
              "Masala & Seasoning",
              "Oil & Ghee",
              "Eggs, Meat & Fish",
              "Cleaning & Household",
              "Pet Care",
              "Pasta, Soup and Noodles",
              "Cooking and Baking Needs",
              "Atta, Flours and Sooji",
              "Rice and Rice Products",
              "Dals and Pulses",
              "Salt, Sugar and Jaggery",
              "Tea and Coffee",       
            ].includes(obj.categoryId?.trim()) &&
            (obj.packagedFood === "Yes"  ||  obj.packagedFood === "YES" || obj.packagedFood === "yes" ||  obj.packagedFood === "True" || obj.packagedFood === true)
          ) {
            obj.statutory_reqs_packaged_commodities = {
              manufacturer_or_packer_name: get(obj, "manufactureName", ""),
              manufacturer_or_packer_address: get(obj, "manufacturerAddress", ""),
              common_or_generic_name_of_commodity: get(obj, "commonName", ""),
              net_quantity_or_measure_of_commodity_in_pkg: `${obj.weight}${obj.weightUnit?.trim()}`,
              month_year_of_manufacture_packing_import: moment(new Date()).format("MM/YYYY"),
              imported_product_country_of_origin: countries.find((item) => item.name === obj.countryOfOrigin?.trim())?.code || "IND",
            };
          }

          if (
            [
              "Bakery, Cakes & Dairy",
              "Fruit Juices and Fruit Drinks",
              "Snacks and Namkeen",
              "Dairy and Cheese",
              "Snacks, Dry Fruits, Nuts",
              "Cereals and Breakfast",
              "Sauces, Spreads and Dips",
              "Chocolates and Biscuits",
              "Tinned and Processed Food",
              "Energy and Soft Drinks",
              "Ready to Cook and Eat",
              "Pickles and Chutney",
              "Indian Sweets",
              "Frozen Snacks",
            ].includes(obj.subCategoryId?.trim()) &&
            (!obj.nutritionalValue ||
              (!obj.manufactureFSSAILicense && obj.manufactureFSSAILicense?.toString()?.length === 14) ||
              !obj.countryOfOrigin)
          ) {
            if (!obj.nutritionalValue) {
              obj.Error = "Nutritional Value is not valid"
            }
            else if (!obj.manufactureFSSAILicense) {
              obj.Error = "Manufacture FSSAI License is not valid"
            }
            else if (!obj.countryOfOrigin) {
              obj.Error = "country Of Origin is not valid"
            }
            else if(!obj.importerFSSAILicense){
              obj.Error = "Importer Fssai License is not valid"
            }
            else if(!obj.otherFSSAILicense){
              obj.Error = "Other Fssai License is not valid"
            }
            wrongRecord.push(obj);
            return null;
          }

          if (
            [
              "Bakery, Cakes & Dairy",
              "Fruit Juices and Fruit Drinks",
              "Snacks and Namkeen",
              "Dairy and Cheese",
              "Snacks, Dry Fruits, Nuts",
              "Cereals and Breakfast",
              "Sauces, Spreads and Dips",
              "Chocolates and Biscuits",
              "Tinned and Processed Food",
              "Energy and Soft Drinks",
              "Ready to Cook and Eat",
              "Pickles and Chutney",
              "Indian Sweets",
              "Frozen Snacks",
            ].includes(obj.subCategoryId?.trim()) &&
            (obj.packagedFood === "Yes" || obj.packagedFood === "YES" || obj.packagedFood === "yes" || obj.packagedFood === "True" || obj.packagedFood === true)
          ) {
            obj.statutory_reqs_prepackaged_food = {
              //nutritional_info: `Energy(KCal)-(per 100kg) ${obj.energyPer100kg},(per serving 50g)${obj.energyPerServing};Protein(g)-(per 100kg) ${obj.proteinPer100kg},(per serving 50g) ${obj.proteinPerServing}`,
              nutritional_info: obj.nutritionalValue,
              // additives_info: `Preservatives -${get(obj, "preservatives", "")},Preservatives - ${get(obj, "preservativesDetail", "")},Flavours & Spices -${get(obj, "flavourSpices", "")},Ready to cook -${get(obj, "readyToCook", "")},Ready to eat -${get(obj, "readyToEat", "")},Rice grain type -${get(obj, "riceGrainType", "")},Recommended Age -${get(obj, "recommendAge", "")},Baby Weight - ${get(obj, "babyWeight", "")},Absorption Duration -${get(obj, "absorptionDuration", "")},Scented/ Flavour -${get(obj, "scentedFlavour", "")},Herbal/ Ayurvedic -${get(obj, "herbalAyurvedic", "")},Theme/ Occasion Type -${get(obj, "themeOccasionType", "")}, Hair Type -${get(obj, "hairType", "")},Mineral Source -${get(obj, "mineralSource", "")},Caffeine Content -${get(obj, "caffeineContent", "")},`,
              additives_info: `
              ${get(obj, "preservatives", "")?.trim() !== ""
                  ? `Preservatives -${get(obj, "preservatives", "")?.trim()},`
                  : ""}
              ${get(obj, "preservativesDetail", "")?.trim() !== ""
                  ? `Preservatives - ${get(obj, "preservativesDetail", "")?.trim()},`
                  : ""
                }
              ${get(obj, "flavourSpices", "")?.trim() !== ""
                  ? `Flavours & Spices -${get(obj, "flavourSpices", "")?.trim()},`
                  : ""
                }
              ${get(obj, "readyToCook", "").trim() !== ""
                  ? `Ready to cook -${get(obj, "readyToCook", "").trim()},`
                  : ""
                }
              ${get(obj, "readyToEat", "").trim() !== ""
                  ? `Ready to eat -${get(obj, "readyToEat", "").trim()},`
                  : ""
                }
              ${get(obj, "riceGrainType", "").trim() !== ""
                  ? `Rice grain type -${get(obj, "riceGrainType", "").trim()},`
                  : ""
                }
              ${get(obj, "recommendAge", "").trim() !== ""
                  ? `Recommended Age -${get(obj, "recommendAge", "").trim()},`
                  : ""
                }
              ${get(obj, "babyWeight", "").trim() !== ""
                  ? `Baby Weight - ${get(obj, "babyWeight", "").trim()},`
                  : ""
                }
              ${get(obj, "absorptionDuration", "").trim() !== ""
                  ? `Absorption Duration -${get(
                    obj,
                    "absorptionDuration",
                    ""
                  ).trim()},`
                  : ""
                }
              ${get(obj, "scentedFlavour", "").trim() !== ""
                  ? `Scented/ Flavour -${get(obj, "scentedFlavour", "").trim()},`
                  : ""
                }
              ${get(obj, "herbalAyurvedic", "").trim() !== ""
                  ? `Herbal/ Ayurvedic -${get(obj, "herbalAyurvedic", "").trim()},`
                  : ""
                }
              ${get(obj, "themeOccasionType", "").trim() !== ""
                  ? `Theme/ Occasion Type -${get(
                    obj,
                    "themeOccasionType",
                    ""
                  ).trim()},`
                  : ""
                }
              ${get(obj, "hairType", "").trim() !== ""
                  ? `Hair Type -${get(obj, "hairType", "").trim()},`
                  : ""
                }
              ${get(obj, "mineralSource", "").trim() !== ""
                  ? `Mineral Source -${get(obj, "mineralSource", "").trim()},`
                  : ""
                }
              ${get(obj, "caffeineContent", "").trim() !== ""
                  ? `Caffeine Content -${get(obj, "caffeineContent", "").trim()},`
                  : ""
                }`,
              brand_owner_FSSAI_license_no: get(obj, "manufactureFSSAILicense", "")?.toString().trim(),
              other_FSSAI_license_no: get(obj, "otherFSSAILicense", "") === "" ? 'NA' : get(obj, "otherFSSAILicense", ""),
              importer_FSSAI_license_no: get(obj, "importerFSSAILicense", "") === "" ? 'NA' : get(obj, "importerFSSAILicense", ""),
              imported_product_country_of_origin: countries.find((item) => item.name === (obj.countryOfOrigin).trim())?.code || "IND",
            };
          }
          delete obj.upcEan;
          delete obj.nutritionalValue;
          delete obj.manufactureFSSAILicense;
          delete obj.preservatives;
          delete obj.preservativesDetail;
          delete obj.flavourSpices;
          delete obj.readyToCook;
          delete obj.readyToEat;
          delete obj.riceGrainType;
          delete obj.recommendAge;
          delete obj.babyWeight;
          delete obj.absorptionDuration;
          delete obj.caffeineContent;
          delete obj.scentedFlavour;
          delete obj.herbalAyurvedic;
          delete obj.themeOccasionType;
          delete obj.hairType;
          delete obj.mineralSource;
          delete obj.manufactureName;
          delete obj.manufacturerAddress;
          delete obj.commonName;
          delete obj.net_quantity;
          delete obj.manufacturerDate;
          delete obj.otherFSSAILicense;
          delete obj.importerFSSAILicense;
          const imageProperties = [
            "image1",
            "image2",
            "image3",
            "image4",
            "image5",
            "image6",
            "image7",
          ];
          let productImages = [];
          const allowedExtensions = ['jpeg', 'jpg', 'png', 'webp'];
          const isAllowed = obj.categoryId?.trim() === "Food & Beverage"  ? true : false
          for (const propName of imageProperties) {
            if (obj[propName] && typeof obj[propName] === 'string' && obj[propName] !== null) {
              const extension = obj[propName].split('.').pop().toLowerCase();
              if (allowedExtensions.includes(extension) || isAllowed) {
                productImages.push(obj[propName]);
              }
            }
            delete obj[propName];
          }
          if (productImages?.length < 2 && !isAllowed ) {
            obj.Error = "Image is not valid"
            wrongRecord.push(obj);
            return null;
          }
          if (["yes", true, "true", "TRUE", "YES"].includes(obj.isReturnable)) {
            obj.isReturnable = true;
          }
          if (["no", "NO", "false", "FALSE", false].includes(obj.isReturnable)) {
            obj.isReturnable = false;
          }
          if (["yes", true, "true", "TRUE", "YES"].includes(obj.isCancellable)) {
            obj.isCancellable = true;
          }

          if (["no", "NO", "false", "FALSE", false].includes(obj.isCancellable)) {
            obj.isCancellable = false;
          }
          obj.productImages = productImages;
          obj.weight = parseFloat(obj.weight).toFixed(2);
          obj.weight = parseFloat(obj.weight);
          obj.packagedFood = (obj.packagedFood === "Yes" || obj.packagedFood === "True" || obj.packagedFood === true) ? true : false;
          obj.bulkUpload = true;
          obj.categoryId = obj.categoryId.trim();
          obj.countryOfOrigin = "India"
          obj.subCategoryId = obj.subCategoryId.trim();
          obj.weightUnit = convertWeightUnit(obj.weightUnit)
          if (obj.weightUnit === null) {
            obj.Error = "Weight Unit is not valid"
            wrongRecord.push(obj);
            return null
          }
          if (obj.productId && typeof obj.productId !== "string") {
            obj.productId = obj.productId?.toString();
          }
          if (obj.availableQuantity && typeof obj.availableQuantity !== "string") {
            obj.availableQuantity = obj.availableQuantity?.toString();
          }
          if (obj.price && typeof obj.price !== "string") {
            obj.price = obj.price?.toString();
          }
          if (obj.discountedPrice && typeof obj.discountedPrice !== "string") {
            obj.discountedPrice = obj.discountedPrice?.toString();
          }
          if (obj.skuCode && typeof obj.skuCode !== "string") {
            obj.skuCode = obj.skuCode?.toString();
          }
          if( obj.statutory_reqs_prepackaged_food && obj.statutory_reqs_prepackaged_food.additives_info.trim().length <3)
          {
            obj.statutory_reqs_prepackaged_food.additives_info = 'N/A'
          }
          return obj;
        });

        resolve(result);
      };

      reader.onerror = (e) => {
        reject(e);
      };
      setCatelogId("")
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    try {
      const jsonData = await convertExcelToJson(file);
      const finalData = jsonData.filter((item) => {
        return item !== null;
      });
      console.log(wrongRecord,'wrongRecord')
      if (wrongRecord?.length > 0) {
        notify("error", `${wrongRecord?.length} records are Wrong`);
      }
      const hasValidationError = finalData.some((item) => item === false);
      if (!hasValidationError) {
        const options = {
          method: "post",
          url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/create-catalogues-bulk`,
          headers: {
            desktop: true,
          },
          data: finalData,
        };
        const response = await axios(options);
        setLoading(false);
        if (response.data?.success) {
          notify("success", response?.data?.message);
          getUser();
          wrongRecord.length > 0 && setTimeout(() => {
            myRef.current.link.click();
            setWrongRecord([])
          }, 1000);
          // setWrongRecord([])
        } else {
          notify("error", response?.data?.message);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getCatelog = async () => {
    try {
      if (qRResult === "Data Not Found") {
        notify("error", "Barcode not scanned.");
      } else {
        const response = await API.post(GET_CATELOGUE, {
          productId: qRResult,
        });
        if (response?.data?.success) {
          setScanCatelogData(response?.data?.data?.catelogData);
          //setQRResult("Data Not Found")
        } else {
          setOpenScanner(false);
          setScanCatelogData({});
          setQRResult("Data Not Found");
          notify("error", response?.data?.message);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };
  const header = [
    { label: "Error Cause", key: "Error" },
    { label: "EAN Number", key: "productId" },
    { label: "Category", key: "categoryId" },
    { label: "Subcategory", key: "subCategoryId" },
    { label: "L3", key: "l3" },
    { label: "L4", key: "l4" },
    { label: "Code", key: "code" },
    { label: "Common Name", key: "commonName" },
    { label: "Product Name", key: "productName" },
    { label: "Available Quantity", key: "availableQuantity" },
    { label: "Unit", key: "weightUnit" },
    { label: "Price", key: "price" },
    { label: "Selling Price", key: "discountedPrice" },
    { label: "GST", key: "gst" },
    { label: "Description", key: "description" },
    { label: "SKU Code", key: "skuCode" },
    { label: "Manufacturer Name", key: "manufactureName" },
    { label: "Manufacturer Address", key: "manufacturerAddress" },
    { label: "Country of Origin", key: "countryOfOrigin" },
    { label: "Customer Care Contact", key: "customerCare" },
    { label: "Time to Ship", key: "timeToShip" },
    { label: "Packaged Item", key: "packagedFood" },
    { label: "Returnable", key: "isReturnable" },
    { label: "Cancellable", key: "isCancellable" },
    { label: "COD available (Y/N)", key: "cod" },
    { label: "Product Image1", key: "image1" },
    { label: "Product Image2", key: "image2" },
    { label: "Product Image3", key: "image3" },
    { label: "Product Image4", key: "image4" },
    { label: "Product Image5", key: "image5" },
    { label: "Product Image6", key: "image6" },
    { label: "Product Image7", key: "image7" },
    { label: "Net Weight", key: "weight" },
    { label: "Brand", key: "brand" },
    { label: "Pack Quantity", key: "packQuantity" },
    { label: "Pack Size", key: "packSize" },
    { label: "Images / Video", key: "imageVideo" },
    { label: "UPC/EAN", key: "upcEan" },
    { label: "Manufacture FSSAI License Number", key: "manufactureFSSAILicense" },
    { label: "Preservatives (Y/N)", key: "preservatives" },
    { label: "Preservatives (details)", key: "preservativesDetail" },
    { label: "Flavours & Spices", key: "flavourSpices" },
    { label: "Ready to cook (Y/N)", key: "readyToCook" },
    { label: "Ready to eat (Y/N)", key: "readyToEat" },
    { label: "Rice grain type", key: "riceGrainType" },
    { label: "Recommended Age", key: "recommendAge" },
    { label: "Baby Weight", key: "babyWeight" },
    { label: "Absorption Duration (in Hrs)", key: "absorptionDuration" },
    { label: "Scented/ Flavour", key: "scentedFlavour" },
    { label: "Herbal/ Ayurvedic", key: "herbalAyurvedic" },
    { label: "Theme/ Occasion Type", key: "themeOccasionType" },
    { label: "Hair Type", key: "hairType" },
    { label: "Mineral Source", key: "mineralSource" },
    { label: "Caffeine Content", key: "caffeineContent" },
    { label: "Capacity", key: "capacity" },
    { label: "Nutritional Information", key: "nutritionalValue" },
    { label: "Other FSSAI License Number", key: "otherFSSAILicense"},
    { label:"Importer FSSAI license Number", key:"importerFSSAILicense"},
    { label: "Misc Info", key: "miscInfo" },
    { label: "Veg/Non-Veg", key: "foodType" },
    { label: "Packaging Cost", key: "packagingCost" },
  ];

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="RightBlock" style={isMobile ? { "width": "100%", "left": "0", "top": isAppView === "true" ? "0px" : "68px" } : {}}>
        <div className="section-title mb-3">
          <h1>Welcome to Kiko Live</h1>
        </div>
        <div className="ProductPricingWrapper">
          {/* <div className="row m-0"> */}
          {/* <div className="col-lg-10"> */}
          <div className="left-section">
            <ul className="catalog-steps">
              <li>Upload catalogs to get started</li>
              <li>Catalogs go live on kiko</li>
              <li>Get your first order</li>
            </ul>
            <div className="upload-catalog-wrapper">
              <h6>Choose how you would like to upload your catalog</h6>
              <div className="upload-catalog">
                {/* <div className="upload-catalog-block">
                  <p>Scan Barcode to Catalog</p>
                  <div className="image-preview">
                    <img src={Barcode} alt="" />
                  </div>
                  <ul className="upload-catalog-list">
                    <li>Quick Scan Product Barcode</li>
                    <li>Single Click Catalog Upload</li>
                  </ul>
                  <button onClick={() => {
                    setOpenScanner(true);
                  }} className="btn  btn-md btn-primary">
                    {" "}
                    Scan Barcode
                  </button>
                </div> */}
                <div className="upload-catalog-block">
                  <p>Upload Single Catalog</p>
                  <div className="image-preview">
                    <img src={AddsingleCatalog} alt="" />
                  </div>
                  <ul className="upload-catalog-list">
                    <li>Add one product at a time</li>
                    <li>Excel Sheet not Required</li>
                  </ul>
                  <Link to="/categories" className="btn  btn-md btn-primary">
                    {" "}
                    Add Single Catalog
                  </Link>
                </div>
                <div className="upload-catalog-block">
                  <p>Upload Bulk Catalog</p>
                  <div className="image-preview">
                    <img src={BulkCatalog} alt="" className="bulk-catalog" />
                  </div>
                  <ul className="upload-catalog-list">
                    <li>Add Multiple catalog at a time</li>
                    <li>Excel Sheet Required</li>
                  </ul>
                  <button
                    className="btn btn-md p-0 uploadBtn btn-primary "
                    // style={{ position: "absolute", bottom: "0" }}
                    disabled={loading}
                    onClick={async () => {
                      setCatelogId(user_data?.mainCategory)
                    }}
                  >
                    {/* <input type="file" onChange={handleFileChange} /> */}
                    <span className="upload-img">
                      {loading && <Spin indicator={antIcon} />}Add Catalog In
                      Bulk
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="footer-section">
              <div className="left-block">
                <p className="Book-training"
                >
                  <span>Learn</span>
                  <a className="m-0" href="https://www.youtube.com/watch?v=iHx4iCLdQ_o" rel="noreferrer" target="_blank"> how to upload single catalogue ?</a>
                </p>
                <p className="Book-training mb-0"
                >
                  <span>Learn</span>
                  <a className="m-0" href="https://www.youtube.com/watch?v=iHx4iCLdQ_o" rel="noreferrer" target="_blank"> how to upload bulk catalogue ?</a>
                </p>
              </div>
              {/* <seprator className="seprator"></seprator> */}
              <div className="left-block">
                <ul className="m-0">
                  <li >
                    <p className="m-0">
                      <span>Download</span>
                      <a className="m-0" href="https://d1yd3a2ik8ypqd.cloudfront.net/uploads/user_images/Sample_FB.csv"> Sample excel for F&B</a>
                    </p>
                  </li>
                  <li className="mb-0">
                    <p className="m-0">
                      <span>Download</span>
                      <a className="m-0" href="https://kikonewapi.s3.ap-south-1.amazonaws.com/uploads/user_images5-s_STUPh.csv"> Sample excel for Grocery</a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* <div className="col-lg-3">
              <div className="right-section">
                <h6>Useful Links</h6>
                <p>Learn to operate and grow on Kiko.</p>
                <ul className="useful-link-list">
                  <li>
                    <a href="/" className="useful-links">
                      Prepare catalog for kiko
                    </a>
                  </li>
                  <li>
                    <a href="/" className="useful-links">
                      Pricing and commission
                    </a>
                  </li>
                  <li>
                    <a href="/" className="useful-links">
                      Delivery and Returns
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}
          {/* </div> */}
        </div>
        <div style={{ display: 'none' }}>
          <CsvGenerator
            myRef={myRef}
            data={wrongRecord}
            headings={header}
            fileName={"CatelogError.csv"}
            buttonName={"Error "}
            exportLoading={false}
          />
        </div>
      </div>
      <PermissionAlertP
        permissionAlertPopUp={permissionAlertPopUp}
        setPermissionAlertPopUp={setPermissionAlertPopUp}
      />
      <Modal
        isOpen={openScanner}
        size="md"
        onClose={() => {
          setOpenScanner(false);
          setScanCatelogData({});
          setQRResult("Data Not Found");
        }}
        className="barcodeModal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <div className="modal-heading">
          <h3>{qRResult}</h3>
        </div> */}
        <div className="modal_body border-0">
          {/* {!scanCatelogData._id && (
            <BarcodeScanner
              className="sdcdsk"
              fps={10}
              qrbox={250}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
            />
          )} */}
          {scanCatelogData?.productImages?.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", marginLeft: "50px" }}>
                  <p>Barcode Number</p>
                  <img src={Barcode} alt="" width={"116px"} height={"100px"} />
                  <p>{qRResult}</p>
                </div>
                <div style={{ width: "100%", marginLeft: "50px" }}>
                  <p>Product Image</p>
                  <img
                    src={scanCatelogData?.productImages[0]}
                    alt=""
                    width={"116px"}
                    height={"100px"}
                  />
                  <p></p>
                </div>
              </div>
              <h3>Barcode Number And Product Details Found</h3>
            </>
          )}
        </div>
        <div className="modal_footer justify-content-center pb-3 pt-0">
          {!scanCatelogData._id && (
            <>
              {" "}
              <button
                className="btn btn-sm cancle-btn"
                onClick={() => {
                  setOpenScanner(false);
                  setScanCatelogData({});
                  setQRResult("Data Not Found");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                disabled={qRResult === "Data Not Found"}
                onClick={() => {
                  getCatelog();
                }}
              >
                Continue
              </button>
            </>
          )}
          {scanCatelogData._id && (
            <>
              {" "}
              <button
                className="btn btn-sm cancle-btn"
                onClick={() => {
                  setOpenScanner(false);
                  setScanCatelogData({});
                  setQRResult("Data Not Found");
                }}
              >
                Try Again
              </button>
              <Link to="/categories" className="btn  btn-md btn-primary">
                {" "}
                Enter Details Manually
              </Link>
              <button
                className="btn btn-sm btn-primary"
                disabled={qRResult === "Data Not Found"}
                onClick={() => {
                  navigate("/categories", {
                    state: { catelogData: scanCatelogData },
                  });
                }}
              >
                Continue
              </button>
            </>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={catelogId !== ""}
        onClose={() => {
          setCatelogId("");
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pt-3 pb-3">
          <div className="packedOrder">
            <h4 className="text-center mb-3">Choose Catelogue Format</h4>
            <form className="type">
              <input
                type="radio"
                checked={catelogId === "Grocery"} 
                disabled={user_data?.mainCategory?.trim() === "Food & Beverage"}
                onClick={() => {setCatelogId("Grocery")}}
              />
              <label htmlFor="Grocery">Grocery</label>
              <input
                type="radio"
                disabled={user_data?.mainCategory?.trim() === "Grocery"}
                checked={catelogId === "Food & Beverage"} 
                onClick={() => {setCatelogId("Food & Beverage")}}
              />
              <label>
                Food & Beverage
              </label>
            </form>
          </div>

          <div className="text-center" style={{ display: "flex", marginTop: "10px" }}>
            <button
              className="btn btn-md p-0 uploadBtn btn-primary "
              style={{ marginRight: "5px" }}
              disabled={loading}
              onClick={async () => {
                if (window && window.flutter_inappwebview) {
                  const tempV = await flutterfetchStoragePermission();
                  if (!tempV) {
                    setPermissionAlertPopUp({
                      permission: true,
                      type: "storagePermission",
                    });
                  }
                  else {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.onchange = async (e) => {
                      handleFileChange(e);
                    };
                    input.click();
                  }
                } else {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.onchange = async (e) => {
                    handleFileChange(e);
                  };
                  input.click();
                }
              }}
            >
              {/* <input type="file" onChange={handleFileChange} /> */}
              <span className="upload-img">
                {loading && <Spin indicator={antIcon} />}Proceed
              </span>
            </button>
            <button
              className="btn btn-md p-0 uploadBtn btn-danger ml-5"
              style={{ marginLeft: "5px" }}
              disabled={catelogId === ""}
              onClick={() => {
                setCatelogId("")
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default AddSingleCatalog;
