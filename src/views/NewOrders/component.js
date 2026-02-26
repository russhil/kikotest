import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./styles.scss";
import { Space, Spin } from "antd";
import Camera from "../../components/svgIcons/Camera";
import cartIcon from "../../images/Inventry/cart-icon.png";
import walletIcon from "../../images/wallet/wallerIcon.svg";
import infoIcon from "../../images/Inventry/Info-icon.svg";
import pikupInitiated from "../../images/pickup-initiated.svg";
import FilterIcon from "../../images/filterIcon.svg";
import OrderIcon from "../../images/order-phone-icon.svg";
import Refresh from "../../images/refresh.svg";
import whatsAppIcon from "../../images/whatsaapIcon.svg"
import red from "../../images/red.png"
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import printerIcon from "../../images/Inventry/printer.svg";
import productImg from "../../images/product-img.png";
import {
  ORDER_LIST,
  ORDER_LIST_EXPORT,
  UPDATE_ORDER,
  GET_USER,
  INVENTORY_LIST,
  ONDC_OVERDUE_ORDER_LIST,
} from "../../api/apiList";
import crossIcon from "../../images/cross-icon.svg";
import API from "../../api";
import { get, isEmpty } from "lodash";
import axios from "axios";
import { selfDeliveryIssue } from "../../reject.js";
import {
  handleError,
  notify,
  nomenclature,
  DateFilters,
  PaginationFilter,
  CsvGenerator,
  flutterDailPadHandler,
  flutterfetchCameraPermission,
  handleLogout
} from "../../utils";
import { useNavigate } from "react-router-dom";
import RightArrow from "../../components/svgIcons/RIghtArrow.js";
import Download from "../../components/svgIcons/download.js";
import PermissionAlertP from "../../components/Modal/PermissionAlertPopup";
import OrderDeliverIcon from "../../images/order-deliver-icon.svg"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

function NewOndcOrder(props) {
  const myRef = useRef();
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
  const [user_data, setuser_data] = useState(getSellerDetails());
  const [openExport, setOpenExport] = useState(false);
  const [packingPopup, setPackingPopup] = useState(false);
  const [orderView, setorderView] = useState(false);
  const [orderDeliverView, setorderDeliverView] = useState(false);
  const [viewImage, setViewImage] = useState({});
  const [singleOrderDetail, setSingleOrderDetail] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [pickupModal, setpickupModal] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState([]);
  const [openBulkStatusConfirm, setOpenBulkStatusConfirm] = useState(false);
  const [selfDeliveryIssueModal, setSelfDeliveryIssueModal] = useState(false);
  const [tearms_cond, settearms_cond] = useState(true);
  const [deliveryChargesOpen, setdeliveryChargesOpen] = useState(false);
  const [page, setpage] = useState(1);
  const [uploadImage, setUploadImage] = useState(false);
  const [clear, setclear] = useState(false);
  const [orderImage, setorderImage] = useState("");
  const [selfDeliveryIssueKey, setselfDeliveryIssueKey] = useState("");
  const [productDeliveryImage, setProductDeliveryImage] = useState("");
  const [count, setCount] = useState(0);
  const [toggleCount, settoggleCount] = useState({});
  const [ondcOrderData, setOndcOrderData] = useState([]);
  const [isDisable, setisDisable] = useState(false);
  const [status, setstatus] = useState("");
  const [overDueOrders, setOverDueOrders] = useState(false);
  const [isSpin, setisSpin] = useState("");
  const [orderData, setOrderData] = useState({});
  const [itemData, setitemData] = useState([]);
  const [remittanceArray, setRemittanceArray] = useState([]);
  const [multiOrderArray, setMultiOrderArray] = useState([]);
  const [bulkLogisticsData, setBulkLogisticsData] = useState([]);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  const [order_id, setorder_id] = useState({});
  const [orderDeliveryMode, setorderDeliveryMode] = useState("SelfDelivery");
  const [selfDeliveryMode, setselfDeliveryMode] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [openAccept, setAccept] = useState(false);
  const [orderPacked, setOrderPacked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableloading] = useState(false);
  const [updateLoading, setUpdateloading] = useState("");
  const [openRejectBtn, setopenRejectBtn] = useState(false);
  const [courierModal, setcourierModal] = useState(false);
  const [partialCancelView, setPartialCancelView] = useState(false);
  const [pickupRejectModal, setpickupRejectModal] = useState(false);
  const [lspProviderPopup, setLspProviderPopup] = useState(false);
  const [lspOtherLogistic, setLspOtherLogistic] = useState([]);
  const [selectedOtherLogistic, setSelectedOtherLogistic] = useState({});
  const [pickUpReason, setpickUpReason] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [limit] = useState(20);
  const [viewDelivery, setViewDelivery] = useState(false);
  const [mobileFilterView, setMobileFilterView] = useState(false);
  const [totalWeight, settotalWeight] = useState(0);
  const [componentMounted, setComponentMounted] = useState(false);
  const selfDeliveryIssueArray = Object.entries(selfDeliveryIssue);
  const [walletInsuffientModalVisible, setWalletInsuffientModalVisible] =
    useState(false);
  const [exportInventory, setexportInventory] = useState([]);
  const navigate = useNavigate();
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [exportLogisticLoading, setExportLogisticLoading] = useState("");
  const [logisticDeliveryCharge, setLogisticDeliveryCharge] = useState(0);
  const [logisticProviderName, setLogisticProviderName] = useState("");
  const [onNetworkLSPTrackUrl, setOnNetworkLSPTrackUrl] = useState("");
  const [onNetworkLSPCourierInfo, setOnNetworkLSPCourierInfo] = useState(null);
  const [bulkAssign, setBulkAssign] = useState(false);
  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({
    permission: false,
    type: "",
  });

  const getOrders = async (orderId) => {
    if (!user_data._id || user_data._id == "") {
      handleLogout();
    }
    !orderId ? setTableloading(true) : setTableloading(false);
    try {
      const obj = {
        page,
        limit,
        userId: user_data?._id,
        status,
        searchOrderId,
        search: search,
        startDate: startDate,
        endDate: endDate,
      };
      if (startDate !== "" && endDate !== "") {
        var sDate = new Date(startDate);
        obj.startDate = sDate.setDate(sDate.getDate() + 1);
        var eDate = new Date(endDate);
        obj.endDate = eDate.setDate(eDate.getDate() + 1);
      }
      const response = await API.post(ORDER_LIST, obj);
      setTableloading(false);
      setOverDueOrders(false);
      if (response) {
        setCount(response?.data?.data?.count);
        settoggleCount(response?.data?.data?.toggleCount);
        setOndcOrderData(response?.data?.data?.ondcOrderData);
        setUpdateloading("");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getOrdersExport = async (type) => {
    setExportLogisticLoading(type);
    try {
      const obj = {
        page,
        limit,
        userId: user_data?._id,
        status,
        searchOrderId,
        search: search,
        startDate: startDate,
        endDate: endDate,
      };
      if (type === "Logistics") {
        obj.allExport = true;
      }
      if (startDate !== "" && endDate !== "") {
        var sDate = new Date(startDate);
        obj.startDate = sDate.setDate(sDate.getDate() + 1);
        var eDate = new Date(endDate);
        obj.endDate = eDate.setDate(eDate.getDate() + 1);
      }
      const response = await API.post(ORDER_LIST_EXPORT, obj);
      if (response) {
        if (window && window.flutter_inappwebview) {
          itcHandler(response.data.data.allExportData.file_url, type)
        }
        else {
          window.open(response.data.data.allExportData.file_url);
        }
        setOpenExport(!openExport)
        setExportLogisticLoading("");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getInventory = async () => {
    try {
      const obj = {
        userId: user_data?._id,
        searchOrderId,
        search: search,
        startDate: startDate,
        endDate: endDate,
      };
      if (startDate !== "" && endDate !== "") {
        var sDate = new Date(startDate);
        obj.startDate = sDate.setDate(sDate.getDate());
        var eDate = new Date(endDate);
        obj.endDate = eDate.setDate(eDate.getDate());
      }
      const response = await API.post(INVENTORY_LIST, obj);
      if (response) {
        return (response.data.data?.orderInventoryData)
      }
    } catch (error) {
      handleError(error);
    }
  };

  const nomenclaturePopUp = (order) => {
    const status = order;
    switch (status) {
      case "Created":
        return "Order Created";
      case "Accepted":
        return "Order Accepted";
      case "In-progress":
        return "Order In-progress";
      case "parcel_picked_up":
        return "Order Picked Up";
      case "out_for_delivery":
        return "Out For Delivery";
      case "parcel_delivered":
        return "Order Delivered";
      default:
        return status;
    }
  }

  const getOndcOverdue = async (orderId) => {
    try {
      if (!user_data._id || user_data._id == "") {
        handleLogout();
      }
      !orderId ? setTableloading(true) : setTableloading(false);
      const obj = {
        userId: user_data?._id,
        page,
        limit,
        searchOrderId,
        search: search,
        startDate: startDate,
        endDate: endDate,
      };
      if (startDate !== "" && endDate !== "") {
        var sDate = new Date(startDate);
        obj.startDate = sDate.setDate(sDate.getDate() + 1);
        var eDate = new Date(endDate);
        obj.endDate = eDate.setDate(eDate.getDate() + 1);
      }
      const response = await API.post(ONDC_OVERDUE_ORDER_LIST, obj);
      if (response) {
        setOndcOrderData(response?.data?.data?.ondcOrderData);
        setCount(response?.data?.data?.count);
        setTableloading(false);
        setUpdateloading("");
        setOverDueOrders(true);
      }
    } catch (error) {
      setTableloading(false);
      handleError(error);
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const onPageChanged = (page) => {
    setpage(page);
  };

  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      if (window && window.flutter_inappwebview) {
        const args = [phoneNumber];
        flutterDailPadHandler(args);
      }
      else {
        const telUrl = `tel:${phoneNumber}`;
        window.open(telUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const storeIds = (itemId, count) => {
    setRemittanceArray((prevRemittanceArray) => {
      if (prevRemittanceArray.some((item) => item.id === itemId)) {
        return prevRemittanceArray.filter((item) => item.id !== itemId);
      } else {
        return [
          ...prevRemittanceArray,
          {
            id: itemId,
            quantity: {
              count: count,
            },
            tags: {
              update_type: "cancel",
              reason_code: "002",
              ttl_approval: "P2D",
              ttl_reverseqc: "P3D",
              image: "",
            },
          },
        ];
      }
    });
  };

  const partialCancel = async () => {
    const token = getSellerToken();
    const orderId = order_id?._id
    const version = order_id?.context?.core_version
    setLoading(true);
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/partial-cancel-seller`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        items: remittanceArray,
        orderId: orderId,
      },
    };
    const result = await axios(options);
    if (result?.data?.success) {
      setLoading(false);
      overDueOrders ? getOndcOverdue() : getOrders()
      setPartialCancelView(false);
      setRemittanceArray([]);
      notify("success", result?.data?.message);
    } else if (!result?.data?.success) {
      overDueOrders ? getOndcOverdue() : getOrders()
      setPartialCancelView(false);
      setRemittanceArray([]);
    }
  };

  const getUser = async () => {
    const userData = getSellerDetails();
    try {
      const response = await API.post(GET_USER, {
        _id: userData && userData._id,
      });
      if (response) {
        localStorage.setItem("user", JSON.stringify(response?.data?.result));
        setuser_data(response?.data?.result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onInitiatePickup = () => {
    if (orderDeliveryMode === "OnNetworkDelivery") {
      pickUpLogisticOrder()
    }
    else {
      pickUpOrder()
    }
  }

  const pickUpOrder = async () => {
    const token = getSellerToken();
    const orderId = order_id?._id
    const version = order_id?.context?.core_version
    setLoading(true);
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/pickup-ondc-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderId: orderId,
        vendorId: user_data?._id,
        pickupType: "order",
        orderDeliveryMode,
      },
    };
    const result = await axios(options);
    setAccept(false);
    setisDisable(false);
    if (result?.data?.success) {
      setpickupModal(true);
      setLoading(false);
      overDueOrders ? getOndcOverdue() : getOrders()
      setdeliveryChargesOpen(false);
    } else if (!result?.data?.success) {
      setdeliveryChargesOpen(false);
      setLoading(false);
      if (result?.data?.insufficientWalletBalance) {
        setWalletInsuffientModalVisible(true)
      }
      else {
        setpickUpReason(result?.data?.message);
        setpickupRejectModal(true);
      }

    }
  };

  const pickUpLogisticOrder = async () => {
    const token = getSellerToken();
    let obj = {
      orderId: order_id?.ondcOrderId,
      logistic_provider: selectedOtherLogistic?.logistic_provider,
      logistic_provider_context: selectedOtherLogistic?.logistic_provider_context
    }
    if (status === "bulkLogistics" && orderDeliveryMode === "OnNetworkDelivery") {
      obj = {
        orderIds: bulkLogisticsData?.map((item) => item.ondcOrderId),
        bulkAssign: true,
        logistic_provider: selectedOtherLogistic?.logistic_provider,
        logistic_provider_context: selectedOtherLogistic?.logistic_provider_context
      }
    }
    setLoading(true);
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/init-logistics-partner`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: obj,
    };
    const result = await axios(options);
    setAccept(false);
    setisDisable(false);
    setBulkAssign(false);
    if (result?.data?.status) {
      setpickupModal(true);
      setLoading(false);
      overDueOrders ? getOndcOverdue() : getOrders()
      setdeliveryChargesOpen(false);
    }
    else if (!result?.data?.status) {
      setdeliveryChargesOpen(false);
      setLoading(false);
      setpickUpReason(result?.data?.message);
      setpickupRejectModal(true);
    };
  }

  const cancelOrder = async () => {
    setLoading(true);
    const token = getSellerToken();
    const orderId = order_id?._id
    const version = order_id?.context?.core_version
    let obj = {
      orderId: orderId,
      deliveryPanelCancellation: true,
      cancelledBy: "seller",
    };
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/cancel-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: obj,
    };

    try {
      const result = await axios(options);
      if (result && result?.data?.success) {
        setLoading(false);
        overDueOrders ? getOndcOverdue() : getOrders()
        setopenRejectBtn(false);
        setPartialCancelView(false);
        setRemittanceArray([]);
        notify("success", result?.data?.message);
      }
      else {
        setLoading(false);
        setopenRejectBtn(false);
        setPartialCancelView(false);
        setRemittanceArray([]);
        notify("error", result?.data?.message);
      }

    } catch (error) {
      setopenRejectBtn(false);
      handleError(error);
    }
  };

  const getItems = async (order, state, deliveryPartnerTaskId) => {
    getUser();
    const orderId = order?._id
    const version = order?.context?.core_version
    if (state === "item") {
      setorderView(true);
    } else if (state === "partner") {
      setcourierModal(true);
    }
    setModalLoading(true);
    setorder_id(order);
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/get-single-order-detail`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderId: orderId,
        deliveryId: deliveryPartnerTaskId,
      },
    };
    try {
      const response = await axios(options);
      if (response) {
        setModalLoading(false);
        setitemData(response?.data?.data?.itemRes);
        setOrderData(response?.data?.data?.otherData);
        settotalWeight(response?.data?.data?.otherData?.orderWeight);
        if (response?.data?.data?.otherData?.deliveryType !== "Self-Pickup") {
          if (response?.data?.data?.otherData?.context?.bap_id !== "ondc-bap.olacabs.com" && parseInt(response?.data?.data?.otherData?.orderWeight) > 15) {
            setorderDeliveryMode("SelfDelivery");
          }
          else if (response?.data?.data?.otherData?.context?.bap_id === "ondc-bap.olacabs.com") {
            setorderDeliveryMode("OnNetworkDelivery");
          }
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const uploadDeliveryImage = async () => {
    try {
      setisDisable(true);
      const response = await API.put(UPDATE_ORDER, {
        _id: order_id?._id,
        productDeliveryImage: orderImage,
      });
      if (response) {
        setUploadImage(false);
        notify("success", "Image uploaded ");
        overDueOrders ? getOndcOverdue() : getOrders()
        setisDisable(false);
      }
      setorderImage("")
    } catch (error) {
      handleError(error);
    }
  };

  const generateInvoice = async () => {
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/generateInvoice`,
      headers: {
        desktop: true,
      },
      data: {
        orderId: singleOrderDetail._id,
        vendorId: singleOrderDetail.vendorId,
      },
    };
    try {
      const response = await axios(options);
      if (response) {
        window.open(response?.data, '_blank')
      }
    } catch (error) {
      handleError(error);
    }
  }

  const updateOrderStatus = async (order, status) => {
    const token = getSellerToken();
    const orderId = order?._id
    setUpdateloading(orderId);
    const version = order?.context?.core_version
    let data = {};
    if (status === "RTO-Initiated") {
      data = {
        orderId: orderId,
        deliveryStatus: "RTO-Initiated",
        rtoInitiatedReason: selfDeliveryIssue[selfDeliveryIssueKey],
      };
    } else {
      data = {
        orderId: orderId,
        deliveryStatus: status,
      };
    }
    const options = {
      method: "post",
      url: `${version === "1.1.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V1 : process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/update-delivery-status`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response?.data?.sucess) {
        overDueOrders ? getOndcOverdue(orderId) : getOrders(orderId);
      }
      else if (response?.data?.minStatusDelay) {
        setorderDeliverView(true)
      }
      else {
        notify(
          "error",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );

      }
      setorderImage("");
      setUpdateloading("")
    } catch (error) {
      setorderImage("");
      setUpdateloading("")
      handleError(error);
    }
  };

  const onPressProceed = () => {
    if (orderDeliveryMode === "OnNetworkDelivery") {
      searchLogistic()
    }
    else {
      statusUpdate(true)
    }
  }

  const onBulkInitiate = () => {
    if (status === "bulkLogistics" && orderDeliveryMode === "OnNetworkDelivery") {
      searchLogistic()
    }
  }

  const statusUpdate = async (isPacked, status) => {
    const token = getSellerToken();
    let version = "1.2.0"
    let data = {};
    if (status === "bulkLogistics" && isPacked) {
      setModalLoading(true);
      data.bulkAssign = true;
      data.ondcOrderIds = bulkLogisticsData?.map((item) => item.ondcOrderId);;
      data.isPacked = true;
    }
    else {
      const orderId = order_id?._id
      version = order_id?.context?.core_version
      if (isPacked) {
        setModalLoading(true);
        data._id = orderId;
        data.isPacked = true;
      } else {
        setAcceptLoading(true);
        data._id = orderId;
        data.ondcOrderStatus = "Accepted";
        data.orderStatus = "Accepted";
      }
    }
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/update-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        setModalLoading(false);
        setAcceptLoading(false);
        if (isPacked && orderData?.deliveryType !== "Self-Pickup") {
          setdeliveryChargesOpen(true);
          setAccept(false);
        }
        else if (isPacked && orderData?.deliveryType === "Self-Pickup") {
          setAccept(false);
          setorderView(false);
        }
        else {
          setAccept(true);
          setorderView(false);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const searchLogistic = async () => {
    const token = getSellerToken();
    setModalLoading(true);
    let data = {
      orderId: order_id?.ondcOrderId
    };
    if (status === "bulkLogistics" && orderDeliveryMode === "OnNetworkDelivery") {
      data = {
        orderIds: bulkLogisticsData?.map((item) => item.ondcOrderId),
        bulkAssign: true
      }
    }
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/search-logistics-partner`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.data.status) {
        if (orderData?.context?.bap_id === "ondc-bap.olacabs.com" && response?.data?.providerBPPId !== "ondc-lsp.olacabs.com") {
          setpickUpReason("Ola Logistics Not Found");
          setpickupRejectModal(true);
          setModalLoading(false);
          setAcceptLoading(false);
        }
        else {
          statusUpdate(true, status)
          setModalLoading(false);
          setAcceptLoading(false);
          setLogisticDeliveryCharge(response?.data?.selectedProvider?.charge)
          setSelectedOtherLogistic(response?.data?.selectedProvider)
          setLogisticProviderName(response?.data?.selectedProvider?.name)
          setdeliveryChargesOpen(true);
          setLspOtherLogistic(response?.data?.lspProviders)
        }
      }
      else {
        if (response?.data?.insufficientBalance) {
          setSelectedOtherLogistic(response?.data?.selectedProvider)
          setModalLoading(false);
          setAcceptLoading(false);
          setWalletInsuffientModalVisible(true);
        }
        else {
          setpickUpReason(response?.data?.message);
          setpickupRejectModal(true);
          setModalLoading(false);
          setAcceptLoading(false);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const addUpdateImage = (selectedFile, data) => {
    const formData = new FormData();
    setisDisable(true);
    setisSpin(data);
    formData.append("file", selectedFile);
    axios
      .post(
        `${process.env.REACT_APP_KIKO_API_V1}/products/upload`,
        formData
      )
      .then((res) => {
        if (data === "uploadImage") {
          setorderImage(res?.data?.file_url);
          setisDisable(false);
        }
      });
  };

  useEffect(() => {
    if (componentMounted) {
      overDueOrders ? getOndcOverdue() : getOrders()
    } else {
      setComponentMounted(true);
    }
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [componentMounted, status, page, overDueOrders]);

  useEffect(() => {
    if (clear) {
      overDueOrders ? getOndcOverdue() : getOrders()
      setclear(false)
    }
  }, [clear])

  const exportInventorys = async () => {
    setExportLogisticLoading("inventory");
    let exportInventory = [];
    const inventoryData = await getInventory();
    await inventoryData.forEach((Inv, index) => {
      const obj = {
        createdAt: moment(new Date()).format("DD-MM-YYYY"),
        productName: Inv["@ondc/org/item_title"],
        orderId: isEmpty(get(Inv, "orderIds", []))
          ? ""
          : get(Inv, "orderIds", []).join(", "),
        availableQuantity: Inv["@ondc/org/item_quantity"].count,
        itemPrice: parseFloat(Inv.item.price.value),
        discountedPrice:
          parseFloat(Inv["@ondc/org/item_quantity"].count) *
          parseFloat(Inv.item.price.value),
      };
      exportInventory.push(obj);
    });
    setOpenExport(!openExport)
    setexportInventory(exportInventory);
    setTimeout(() => {
      myRef.current.link.click();
      setExportLogisticLoading("");
    }, 1000);
  };

  const calculateTotals = () => {
    const totals = {
      createdAt: "Total",
      productName: "",
      orderId: "",
      availableQuantity: exportInventory.reduce((sum, item) => sum + item.availableQuantity, 0),
      itemPrice: exportInventory.reduce((sum, item) => sum + item.itemPrice, 0),
      discountedPrice: exportInventory.reduce((sum, item) => sum + item.discountedPrice, 0),
    };
    return totals;
  };

  const dataWithTotals = [...exportInventory, calculateTotals()];

  const selectAll = () => {
    let arr = [];
    if (!selectAllCheckbox) {
      arr = ondcOrderData.map((a) => ({
        orderId: a._id,
        currentStatus: a.fulfillments[0]?.state?.descriptor?.code,
      }));
    }
    setMultiOrderArray(arr);
    setSelectAllCheckbox(!selectAllCheckbox);
  };

  const validation = () => {
    if (startDate === "" && endDate !== "") {
      notify("error", "Please Enter Start Date..!");
    }
    if (startDate !== "" && endDate === "") {
      notify("error", "Please Enter End Date..!");
    }
    if (
      (startDate === "" && endDate === "") ||
      (startDate !== "" && endDate !== "")
    ) {
      if (page === 1) { overDueOrders ? getOndcOverdue() : getOrders(); }
      else {
        setpage(1);
      }
    }
  };

  const storeUpdateIds = (order) => {
    const orderId = order._id;
    const currentStatus = order.fulfillments[0]?.state?.descriptor?.code;

    if (multiOrderArray.some((item) => item.orderId === orderId)) {
      const updatedArray = multiOrderArray.filter(
        (item) => item.orderId !== orderId
      );
      setMultiOrderArray(updatedArray);
    } else {
      setMultiOrderArray((prevArray) => [
        ...prevArray,
        { orderId, currentStatus },
      ]);
    }
  };

  const storeBulkLogisticIds = (order) => {
    const _id = order._id;
    const orderId = order.orderId;
    const groupId = order.groupId;
    const ondcOrderId = order.ondcOrderId;
    if (bulkLogisticsData.some((item) => item._id === _id)) {
      const updatedArray = bulkLogisticsData.filter(
        (item) => item.orderId !== orderId
      );
      setBulkLogisticsData(updatedArray);
    } else {
      setBulkLogisticsData((prevArray) => [
        ...prevArray,
        { _id, orderId, groupId, ondcOrderId },
      ]);
    }
  };

  const clearState = () => {
    setSearch("");
    setstartDate("");
    setSearchOrderId("");
    setendDate("");
    if (page === 1) { setclear(true); }
    else {
      setpage(1);
    }
  };

  function filter() {
    return (
      <div className="filter">
        <div className="filter-flex">
          <div>
            <span>
              <label>Filter By: Customer Name/Mobile Number</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </span>
            <span>
              <label>Order ID</label>
              <input
                type="text"
                value={searchOrderId}
                className="date-picker"
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
            </span>
            <span>
              <DateFilters
                changeStartDate={(date) => setstartDate(date)}
                changeEndDate={(date) => setendDate(date)}
                startDate={startDate}
                endDate={endDate}
                title={"Order Date"}
              />
            </span>
            <span>
              <button
                onClick={() => {
                  validation()
                  setMobileFilterView(false);
                }}
                disabled={
                  search === "" &&
                    startDate === "" &&
                    searchOrderId === "" &&
                    endDate === ""
                    ? true
                    : false
                }
                className="btn btn-primary btn-sm me-2"
              >
                Search
              </button>
              <button
                onClick={() => {
                  clearState();
                }}
                disabled={
                  search === "" &&
                    startDate === "" &&
                    searchOrderId === "" &&
                    endDate === ""
                    ? true
                    : false
                }
                className="btn btn-sm btn-outline"
              >
                Clear
              </button>
            </span>
          </div>

          {exportLogisticLoading === "" ? (
            <div>
              <div
                className="border-btn DownloadSelect"
                aria-placeholder="Update Status"
                onClick={() => setOpenExport(!openExport)}
              >
                Download
              </div>
              {openExport && <div className="DownloadOptions downloadShow">
                {!window?.flutter_inappwebview && <div onClick={() => exportInventorys()} className="downloadList"><Download />Inventory Data</div>}
                <div onClick={() => getOrdersExport("order")} className="downloadList"><Download />Order Summary</div>
                <div onClick={() => getOrdersExport("Logistics")} className="downloadList"><Download />Logistics Format</div>
              </div>}
            </div>
          ) : (
            <div
              className="border-btn DownloadSelect"
              aria-placeholder="Update Status"
              onClick={() => setOpenExport(!openExport)}
            >
              Loading...
            </div>
          )}
        </div>
      </div>
    );
  }

  function getStatusClassName(orderStatus) {
    switch (orderStatus) {
      case "Cancelled":
        return "red";
      case "Created":
      case "In-progress":
        return "yellow";
      case "Accepted":
        return "green";
      case "Completed":
        return "Darkgreen";
      case "In Progress":
        return "blue";
      default:
        return "";
    }
  }

  console.log(user_data,'user_data')

  const whatsApp = (phoneNumber) => {
    
    const messageForKwality = `KWALITY BAZAAR now offers 30 minutes FREE EXPRESS delivery for all your daily needs with best prices.\n\nBetter range of products than Quick Commerce apps and Top Quality!\n\nPowered by Kiko Live and Government of India ONDC network.\n\nOrder via ONDC-PayTM (Extra Rs.50 off on all orders): https://m.paytm.me/ump_v2?utm_source=unified_share_message&categoryId=289844&mmid=1309855&selectedTab=ONDC\n\nOrder via ONDC-Mystore (Extra Rs.60 off on all orders): https://www.mystore.in/en/seller/87599b0c7125a857a15ef90100893761?section=products`
    const mystoreLink = user_data?.buyerAppLink.find(item => item.key === 'mystore')?.value || "-";
    const paytmLink = user_data?.buyerAppLink.find(item => item.key === 'paytm')?.value || "-";
    const Digihaat  = user_data?.buyerAppLink.find(item => item.key === 'nirmit')?.value || "-" ;
    const mainCategory = user_data?.mainCategory === "Grocery" ? "ONDC:RET10" : "ONDC:RET11"
    const message = `Dear Customer,\nThanks for buying from my ONDC shop. Keep ordering from ${user_data?.storeName}\nfrom below links and get upto Rs.40 off on your orders above Rs.200\n https://digihaat.in/store?domain=${mainCategory}&provider_id=${user_data?._id}&bpp_id=ondc.kiko.live/ondc-seller KikoShop: https://kikoshop.in/seller?pid=${user_data?._id}`
    var whatsappUrl = `https://wa.me/${phoneNumber}?text=${user_data?.mobile?.toString() === "9625701616" ? encodeURIComponent(messageForKwality) : encodeURIComponent(message)}`;
    window.open(whatsappUrl);
  };
  const bulkUpdateStatus = async () => {
    setBulkLoading(true);
    setOpenBulkStatusConfirm(false);
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/bulk-update-delivery-status
      `,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: multiOrderArray,
    };
    try {
      const response = await axios(options);
      if (response?.data?.sucess) {
        setMultiOrderArray([]);
        setBulkLogisticsData([]);
        notify(
          "success",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );
        setBulkLoading(false);
        getOrders();
      } else {
        notify(
          "error",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );
        setBulkLoading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const itcHandler = async (file, name) => {
    const args = [file, `${name}.csv`];
    await window.flutter_inappwebview.callHandler('downloadFile', ...args).then(result => {
      if (result) {
        alert(`File Downloaded, Please Check in Downloads Folder`);
      } else {
        alert(`Somethng went wrong, please try again later`);
      }
    })
      .catch(error => {
        alert("Somethng went wrong, please try again later");
      });
  }

  function viewPartialCancel(order) {
    const order_data_filtered = order?.filter(
      (item) => item.tags === "" && item.quantity.count !== 0
    );
    const hidePartialCancel =
      order_data_filtered?.length === 0
        ? true
        : order_data_filtered?.length === 1
          ? order_data_filtered[0].quantity.count === 1
            ? true
            : false
          : false;
    return !hidePartialCancel;
  }

  function validatePartialCancel(order) {
    const order_data_filtered = order?.filter(
      (item) => item.tags === "" && item.quantity.count !== 0
    );
    let partailCancelAvailable = false
    if (order_data_filtered?.length === 1) {
      const itemCount = order_data_filtered[0].quantity.count
      const remmitanceCount = remittanceArray[0].quantity.count
      partailCancelAvailable = itemCount == remmitanceCount
    }
    if (order_data_filtered?.length === remittanceArray?.length) {
      let allItemMatched = true
      for (let i = 0; i < order_data_filtered.length; i++) {
        const itemCount = order_data_filtered[i].quantity.count;
        const remittanceCount = remittanceArray[i].quantity.count;
        if (itemCount !== remittanceCount) {
          allItemMatched = false;
          break;
        }
      }
      partailCancelAvailable = allItemMatched
    }
    return partailCancelAvailable;
  }

  const showCourierInfoMadal = (order) => {
    const trackingTag = order?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.tags?.find(tag => tag.code === "tracking");
    if (trackingTag) {
      const urlItem = trackingTag.list.find(item => item.code === "url");
      setOnNetworkLSPTrackUrl(urlItem?.value)
    }
    setOnNetworkLSPCourierInfo(order)
    setcourierModal(true);
  }

  function handleMobilePopups(order) {
    if (order?.orderDeliveryMode === "KikoDelivery") {
      getItems(order, "partner", order?.deliveryPartnerTaskId);
    }
    else if (order?.orderDeliveryMode === "OnNetworkDelivery") {
      showCourierInfoMadal(order)
    }
    else if (order?.orderDeliveryMode === "SelfDelivery" &&
      Array.isArray(order?.kikoDeliveryStatusTracker) &&
      order?.kikoDeliveryStatusTracker.some(item => item.status === "parcel_picked_up")) {
      setUploadImage(true);
      setorder_id(order);
      setProductDeliveryImage(order?.productDeliveryImage);
    }
  }

  function rtoValue(order) {
    const rtoValue = order?.fulfillments?.find(
      (fullfilment) => fullfilment?.type === "RTO"
    )
    return rtoValue?.state?.descriptor?.code;
  }

  function getTimeStamp(order) {
    const desiredStatuses = ["Created", "Accepted", "Cancelled"];
    const filteredOrderTracking = order?.orderTracking.filter(item => desiredStatuses.includes(item.status));
    const statusTimestamps = order?.kikoDeliveryStatusTracker.map(({ status, createdAt }) => ({ status, createdAt }));
    setTimeStamp([
      ...filteredOrderTracking.map(({ status, createdAt }) => ({ status, createdAt })),
      ...statusTimestamps
    ])
  }

  function generateOptionsForV2(order) {
    const rtoValue = order?.fulfillments?.find(
      (fullfilment) => fullfilment?.type === "RTO"
    )
    const fulfillmentCode = rtoValue?.state?.descriptor?.code;
    const isSelfDelivery = order?.orderDeliveryMode === "SelfDelivery";
    const isKikoDelivery = order?.orderDeliveryMode === "KikoDelivery";
    return [
      <option key={1} value={""}>Select</option>,
      isSelfDelivery && (
        <option
          key={2}
          value={"Order-picked-up"}
          disabled={fulfillmentCode !== "Packed"}
        >
          Order picked up
        </option>
      ),
      isSelfDelivery && (
        <option
          key={3}
          value={"Out-for-delivery"}
          disabled={fulfillmentCode !== "Order-picked-up"}
        >
          Out for delivery
        </option>
      ),
      isSelfDelivery && (
        <option
          key={4}
          value={"Order-delivered"}
          disabled={
            fulfillmentCode !== "Out-for-delivery"
          }
        >
          Order delivered
        </option>
      ),
      <option
        key={5}
        value={"RTO-Initiated"}
        disabled={
          (fulfillmentCode !== "Out-for-delivery" && isSelfDelivery) ||
          (!["Packed", "Order-picked-up", "Order-picked-up"].includes(fulfillmentCode) && isKikoDelivery) ||
          !order?.orderDeliveryMode
        }
      >
        RTO Initiated
      </option>,
      <option
        key={6}
        value={"RTO-Delivered"}
        disabled={fulfillmentCode !== "RTO-Initiated"}
      >
        RTO Delivered
      </option>,
      <option
        key={7}
        value={"RTO-Disposed"}
        disabled={fulfillmentCode !== "RTO-Initiated"}
      >
        RTO Disposed
      </option>,
    ];
  }

  const onNetworkAWBInvoice = (order) => {
    const url = order?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.startInstructions?.images?.[0]
    if (url && url !== "") {
      window.open(url, '_blank');
    }
  }

  function generateOptions(order) {
    const fulfillmentCode = order?.fulfillments[0]?.state?.descriptor?.code;
    const isSelfDelivery = order?.orderDeliveryMode === "SelfDelivery";
    const isKikoDelivery = order?.orderDeliveryMode === "KikoDelivery";
    return [
      <option key={1} value={""}>Select</option>,
      isSelfDelivery && (
        <option
          key={2}
          value={"Order-picked-up"}
          disabled={fulfillmentCode !== "Packed"}
        >
          Order picked up
        </option>
      ),
      isSelfDelivery && (
        <option
          key={3}
          value={"Out-for-delivery"}
          disabled={fulfillmentCode !== "Order-picked-up"}
        >
          Out for delivery
        </option>
      ),
      isSelfDelivery && (
        <option
          key={4}
          value={"Order-delivered"}
          disabled={
            fulfillmentCode !== "Out-for-delivery"
          }
        >
          Order delivered
        </option>
      ),
      <option
        key={5}
        value={"RTO-Initiated"}
        disabled={
          (fulfillmentCode !== "Out-for-delivery" && isSelfDelivery) ||
          (!["Packed", "Order-picked-up", "Order-picked-up"].includes(fulfillmentCode) && isKikoDelivery) ||
          !order?.orderDeliveryMode
        }
      >
        RTO Initiated
      </option>,
      <option
        key={6}
        value={"RTO-Delivered"}
        disabled={fulfillmentCode !== "RTO-Initiated"}
      >
        RTO Delivered
      </option>,
      <option
        key={7}
        value={"RTO-Disposed"}
        disabled={fulfillmentCode !== "RTO-Initiated"}
      >
        RTO Disposed
      </option>,
    ];
  }

  const headingsInventory = [
    { label: "Exported At", key: "createdAt" },
    { label: "Order Id's", key: "orderId" },
    { label: "Product Name", key: "productName" },
    { label: "Count of SKU", key: "availableQuantity" },
    { label: "Item Amount.", key: "itemPrice" },
    { label: "Total Amount.", key: "discountedPrice" },
  ];

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="RightBlock" style={isMobile ? { "width": "100%", "left": "0", "top": isAppView === "true" ? "0px" : "68px" } : {}} >
        <div className="order-section">
          <div className="section-title">
            <h1 className="m-0">Orders</h1>
            <div style={{ display: 'none' }}>
              <CsvGenerator
                myRef={myRef}
                data={dataWithTotals}
                headings={headingsInventory}
                fileName={"Inventory.csv"}
                buttonName={"Inventory "}
                exportLoading={false}
              />
            </div>
            <div className="order-data-btn d-flex align-items-center flex-wrap gap-2">
              {status === "bulkLogistics" ?
                <div className="order-data-btn ">
                  <button
                    onClick={() => {
                      setBulkAssign(true)
                      setorderDeliveryMode("OnNetworkDelivery");
                    }}
                    className="btn border-btn  btn-sm"
                    disabled={bulkLogisticsData.length <= 1}
                  >
                    {"Initiate Pickup"}
                  </button>
                </div>
                :
                <div className="order-data-btn ">
                  <button
                    onClick={() => {
                      setOpenBulkStatusConfirm(true);
                    }}
                    className="btn border-btn  btn-sm"
                    disabled={multiOrderArray.length === 0}
                  >
                    {bulkLoading ? (
                      <Spin indicator={antIcon} className="me-2" />
                    ) : (
                      "Bulk Update Status"
                    )}
                  </button>
                </div>}
            </div>
          </div>
          <ul className="nav nav-pills" role="tablist">
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#home"
                onClick={() => {
                  setOverDueOrders(false)
                  setpage(1);
                  setstatus("");
                }}
              >
                All<span>({toggleCount?.totalCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#home2"
                onClick={() => {
                  setOverDueOrders(false)
                  setpage(1);
                  setstatus("Accepted");
                }}
              >
                Live<span>({toggleCount?.liveCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu1"
                onClick={() => {
                  setOverDueOrders(false)
                  setpage(1);
                  setstatus("Created");
                }}
              >
                Pending<span>({toggleCount?.pendingCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu2"
                onClick={() => {
                  setOverDueOrders(false)
                  setpage(1);
                  setstatus("Completed");
                }}
              >
                Completed<span>({toggleCount?.CompletedCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu3"
                onClick={() => {
                  setOverDueOrders(false)
                  setpage(1);
                  setstatus("Cancelled");
                }}
              >
                Cancelled<span>({toggleCount?.CancelledCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu4"
                onClick={() => {
                  setpage(1);
                  getOndcOverdue()
                }}
              >
                Overdue orders{" "}
                {overDueOrders ? (
                  `(${count})`
                ) : (
                  <img src={red} alt="" className="tatIcon"></img>
                )}
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu4"
                onClick={() => {
                  setOverDueOrders(false);
                  setpage(1);
                  setstatus("bulkUpdate");
                }}
              >
                Bulk order status <span>({toggleCount?.BulkUpdateCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu4"
                onClick={() => {
                  setOverDueOrders(false);
                  setpage(1);
                  setBulkLogisticsData([]);
                  setstatus("bulkLogistics");
                }}
              >
                Bulk LSP status <span>({toggleCount?.BulkLogisticsCount})</span>
              </a>
            </li>
            <li className="right-most" onClick={() => getOrders()}>
              <img src={Refresh} alt="" style={{ width: "20px", height: "20px" }} />
            </li>
          </ul>
          <div className="tab-content">
            <div id="home" className="">
              <div className="desktop-view">
                {filter()}
                {ondcOrderData?.length > 0 ? (
                  <div className="table-responsive">
                    {tableLoading ? (
                      <Spin indicator={antIcon} className="loader" />
                    ) : (
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            {status === "bulkUpdate" && !overDueOrders && (
                              <th class="text-start">
                                <input
                                  name="select_all"
                                  style={{
                                    maxWidth: "15px",
                                    marginRight: "8px",
                                    verticalAlign: "middle",
                                  }}
                                  value={selectAllCheckbox}
                                  onChange={() => {
                                    selectAll();
                                  }}
                                  type="checkbox"
                                />
                                All
                              </th>
                            )}
                            {status === "bulkLogistics" && !overDueOrders && (
                              <th class="text-start">
                                Select
                              </th>
                            )}
                            <th scope="col">Sr No.</th>
                            <th>Ondc Version</th>
                            <th scope="col">Order ID</th>
                            <th scope="col">Ondc Order ID</th>
                            <th scope="col">Order Status</th>
                            <th scope="col">Update Status</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Mobile Number</th>
                            <th scope="col">Date & Time</th>
                            <th scope="col">Total Weight</th>
                            <th scope="col">Action</th>
                            <th scope="col">Delivery Mode</th>
                            <th scope="col">Delivery Status</th>
                            <th scope="col">Tracking ID</th>
                            <th scope="col">Delivery Partner</th>
                            <th scope="col">Upload Delivery</th>
                            <th scope="col">Return status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ondcOrderData.map((order, index) => {
                            return (
                              <tr key={index}>
                                {status === "bulkUpdate" && !overDueOrders && (
                                  <th class="text-start">
                                    <input
                                      type="checkbox"
                                      style={{
                                        maxWidth: "15px",
                                        verticalAlign: "middle",
                                      }}
                                      name="select_one"
                                      checked={multiOrderArray.some(
                                        (item) =>
                                          item.orderId === get(order, "_id")
                                      )}
                                      value={get(ondcOrderData, "_id")}
                                      onChange={(e) => {
                                        storeUpdateIds(order);
                                      }}
                                    />
                                  </th>
                                )}
                                {status === "bulkLogistics" && !overDueOrders && (
                                  <th class="text-start">
                                    <input
                                      type="checkbox"
                                      style={{
                                        maxWidth: "15px",
                                        verticalAlign: "middle",
                                      }}
                                      name="select_one"
                                      checked={bulkLogisticsData.some((item) => item._id === get(order, "_id"))}
                                      value={get(ondcOrderData, "_id")}
                                      onChange={(e) => {
                                        storeBulkLogisticIds(order);
                                      }}
                                      disabled={
                                        (bulkLogisticsData.length >= 10 && !bulkLogisticsData.some((item) => item._id === get(order, "_id"))) ||
                                        (bulkLogisticsData.length > 0 && order?.groupId !== bulkLogisticsData[0]?.groupId)
                                      }
                                    />
                                  </th>
                                )}
                                <th scope="row">{index + 1}</th>
                                <th>{order?.context?.core_version}</th>
                                <td>{order?.orderId}</td>
                                <td>{order?.ondcOrderId}</td>
                                <td onClick={() => {
                                  getTimeStamp(order);
                                }}>
                                  <p className={`${getStatusClassName(order?.ondcOrderStatus)} status-border`}>
                                    {order?.ondcOrderStatus}
                                  </p>
                                </td>
                                {
                                  order?.orderDeliveryMode === "OnNetworkDelivery" ?
                                    <td>
                                      {order?.fulfillments[0]?.state?.descriptor?.code}
                                    </td> :
                                    <td>
                                      {
                                        updateLoading === order?._id ? (
                                          <Spin indicator={antIcon} size="small" />
                                        ) :
                                          order?.orderStatus !== "Created" && (order?.fulfillments?.find(
                                            (fullfilment) => fullfilment?.type === "RTO"
                                          ) ?
                                            <select
                                              onChange={(e) => {
                                                if (e.target.value === "RTO-Initiated") {
                                                  setSelfDeliveryIssueModal(true);
                                                  setorder_id(order);
                                                  setselfDeliveryMode(e.target.value);
                                                } else if (e.target.value !== "") {
                                                  updateOrderStatus(order, e.target.value);
                                                  setselfDeliveryMode(e.target.value);
                                                }
                                              }}
                                              value={
                                                rtoValue(order)
                                              }
                                            >
                                              {generateOptionsForV2(order)}
                                            </select>
                                            :
                                            <select
                                              onChange={(e) => {
                                                if (e.target.value === "RTO-Initiated") {
                                                  setSelfDeliveryIssueModal(true);
                                                  setorder_id(order);
                                                  setselfDeliveryMode(e.target.value);
                                                } else if (e.target.value !== "") {
                                                  updateOrderStatus(order, e.target.value);
                                                  setselfDeliveryMode(e.target.value);
                                                }
                                              }}
                                              value={
                                                order?.fulfillments[0]?.state?.descriptor?.code
                                                  ? order?.fulfillments[0]?.state?.descriptor?.code
                                                  : selfDeliveryMode
                                              }
                                            >
                                              {generateOptions(order)}
                                            </select>
                                          )

                                      }
                                    </td>
                                }

                                <td>
                                  {order?.billing?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() +
                                    order?.billing?.name?.slice(1)}
                                </td>
                                <td style={{ cursor: "pointer" }} onClick={() => whatsApp(order?.billing?.phone)}>
                                  <img src={whatsAppIcon} alt="" className="me-1" />
                                  {order?.billing?.phone}</td>
                                <td>
                                  {moment(order?.createdAt).format(
                                    "DD MMMM YYYY"
                                  ) +
                                    " at " +
                                    moment(order?.createdAt).format(
                                      "hh:mm A"
                                    )}
                                </td>
                                <td>{parseFloat(order?.totalWeight) ? `${order?.totalWeight} kg` : ""}</td>
                                <td>
                                  {" "}
                                  <span
                                    className="view-order"
                                    onClick={() => {
                                      setSingleOrderDetail(order)
                                      getItems(order, "item");
                                    }}
                                  >
                                    View Order
                                  </span>
                                </td>

                                <td>
                                  {order?.orderDeliveryMode
                                    ? nomenclature(order?.orderDeliveryMode)
                                    : "-"}
                                </td>
                                <td>
                                  {order?.deliveryVendorStatus
                                    ? nomenclature(
                                      order?.deliveryVendorStatus
                                    )
                                    : "-"}
                                </td>
                                <td>
                                  {order?.orderDeliveryMode === "OnNetworkDelivery" ? order?.onNetworklogisticData?.onNetworklogisticDeliveryType === "P2H2P" ? <button className="view-order" onClick={() => { onNetworkAWBInvoice(order) }}>{order?.onNetworklogisticData?.onNetworklogisticOrderId} </button> : order?.onNetworklogisticData?.onNetworklogisticOrderId : order?.deliveryPartnerTaskId &&
                                    order?.deliveryPartnerTaskId !== ""
                                    ? order?.deliveryPartnerTaskId
                                    : "-"}
                                </td>
                                <td>
                                  {" "}
                                  {(order?.orderDeliveryMode === "OnNetworkDelivery" &&
                                    (order?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name)) ?
                                    <span
                                      className="view-order"
                                      onClick={() => {
                                        showCourierInfoMadal(order)
                                      }}
                                    >
                                      View
                                    </span> :
                                    order?.deliveryPartnerTaskId ? (
                                      <span
                                        className="view-order"
                                        onClick={() => {
                                          getItems(
                                            order,
                                            "partner",
                                            order?.deliveryPartnerTaskId
                                          );
                                        }}
                                      >
                                        View
                                      </span>
                                    ) : (
                                      "-"
                                    )}{" "}
                                </td>

                                <td>
                                  {order?.orderDeliveryMode === "OnNetworkDelivery" ? "-" :
                                    Array.isArray(
                                      order?.kikoDeliveryStatusTracker
                                    ) &&
                                      order?.kikoDeliveryStatusTracker.some(
                                        (item) =>
                                          item.status === "parcel_picked_up"
                                      ) ? (
                                      <span
                                        className="uploadImageModal"
                                        onClick={() => {
                                          setUploadImage(true);
                                          setorder_id(order);
                                          setProductDeliveryImage(
                                            order?.productDeliveryImage
                                          );
                                        }}
                                      >
                                        Upload Images
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                </td>
                                <td>
                                  {order?.returnStatus ===
                                    "parcel_delivered" ? (
                                    <p className="green status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Return_Picked" ? (
                                    <p className="yellow status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "courier_arrived" ? (
                                    <p className="green status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "parcel_picked_up" ? (
                                    <p className="green status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "courier_assigned" ? (
                                    <p className="green status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus === "active" ? (
                                    <p className="green status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Parcel Delivered" ? (
                                    <p className="Darkgreen status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Order Cancelled" ? (
                                    <p className="green status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Return_Delivered" ? (
                                    <p className="Darkgreen status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "courier_departed" ? (
                                    <p className="red status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Order Cancelled" ? (
                                    <p className="red status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Return_Rejected" ? (
                                    <p className="red status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus === "Pending" ? (
                                    <p className="yellow status-border">
                                      {" "}
                                      {"Return Picked"}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Return_Approved" ? (
                                    <p className="black status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus === "Liquidated" ? (
                                    <p className="Darkgreen status-border">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : order?.returnStatus ===
                                    "Return_Initiated" ? (
                                    <p className="blue status-border ">
                                      {" "}
                                      {nomenclature(order?.returnStatus)}{" "}
                                    </p>
                                  ) : (
                                    <p>
                                      {" "}
                                      {nomenclature(order?.returnStatus)}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <div className="no-data-status">
                    {tableLoading ? (
                      <Spin
                        indicator={antIcon}
                        className="loader"
                        size="large"
                      />
                    ) : (
                      <div>
                        <div className="cart-icon">
                          <img src={cartIcon} alt="" />
                        </div>
                        <h5>No Order Yet</h5>
                        <p>We will Notify you once you receive any order!</p>
                        <div className="d-flex gap-2 mt-4 justify-content-center"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div id="home" className="">
              <div className="mobile-view-card">
                <div className="filter_btn">
                  <button className="reset-btn me-3" onClick={() => { getOrders(); }}>Refresh</button>
                  <button className="reset-btn me-3" onClick={() => { clearState(); }}>Reset</button>
                  <button className="btn-outline" onClick={() => setMobileFilterView(!mobileFilterView)}>Filter By <img src={FilterIcon} alt="" /></button>
                  {mobileFilterView && filter()}
                </div>
                {ondcOrderData?.length > 0 ? (
                  <div className="pe-3 ps-3">
                    {tableLoading ? (
                      <Spin indicator={antIcon} className="loader" />
                    ) :
                      <div>
                        {ondcOrderData.map((order, index) => {
                          return (
                            <div className="order-card mb-3">
                              {status === "bulkLogistics" && !overDueOrders && (
                                <div class="text-start">
                                  <input
                                    type="checkbox"
                                    style={{
                                      maxWidth: "15px",
                                      verticalAlign: "middle",
                                    }}
                                    name="select_one"
                                    checked={bulkLogisticsData.some((item) => item._id === get(order, "_id"))}
                                    value={get(ondcOrderData, "_id")}
                                    onChange={(e) => {
                                      storeBulkLogisticIds(order);
                                    }}
                                    disabled={
                                      (bulkLogisticsData.length >= 10 && !bulkLogisticsData.some((item) => item._id === get(order, "_id"))) ||
                                      (bulkLogisticsData.length > 0 && order?.groupId !== bulkLogisticsData[0]?.groupId)
                                    }
                                  />
                                </div>
                              )}
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="order-date-time">
                                  <span>Order ID : #{order?.orderId}</span>
                                  <span>{moment(order?.createdAt).format("DD/MM/YYYY") + " at " + moment(order?.createdAt).format("hh:mm A")}</span>
                                </div>
                                <div>
                                  {order?.orderStatus === "Created" && <div className="new-tag">New</div>}
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mt-2">
                                <p>{order?.billing?.name
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  order?.billing?.name?.slice(1)}
                                  {!window.flutter_inappwebview && <><img src={OrderIcon} className="me-1 ms-1" alt=""
                                    onClick={() => {
                                      if (window && window.flutter_inappwebview) {
                                        const args = [order?.billing?.phone];
                                        flutterDailPadHandler(args);
                                      }
                                      else {
                                        window.location.href = `tel:${order?.billing?.phone}`;
                                      }
                                    }} />
                                    <img src={whatsAppIcon} alt="" onClick={() => { whatsApp(order?.billing?.phone) }} /></>}
                                </p>
                                <h6>₹{order?.quote?.price?.value}</h6>
                              </div>
                              <div className="order-status">
                                {/* <span className={getStatusClassName(order?.ondcOrderStatus)}>{order?.ondcOrderStatus}</span> */}
                                <p>Order Status : <span className={getStatusClassName(order?.ondcOrderStatus)}>{order?.ondcOrderStatus}</span></p>
                                {order?.orderDeliveryMode && <p>Delivery Mode : <span className="blue" onClick={() => handleMobilePopups(order)}>{order?.orderDeliveryMode}</span></p>}
                              </div>
                              <div className="order-status-btn">
                                {
                                  order?.orderDeliveryMode === "OnNetworkDelivery" ?
                                    <p>{order?.fulfillments[0]?.state?.descriptor?.code}</p> :
                                    updateLoading === order?._id ? (
                                      <Spin indicator={antIcon} size="small" />
                                    ) :
                                      order?.orderStatus !== "Created" && (order?.fulfillments?.find(
                                        (fullfilment) => fullfilment?.type === "RTO"
                                      ) ?
                                        <select
                                          onChange={(e) => {
                                            if (e.target.value === "RTO-Initiated") {
                                              setSelfDeliveryIssueModal(true);
                                              setorder_id(order);
                                              setselfDeliveryMode(e.target.value);
                                            } else if (e.target.value !== "") {
                                              updateOrderStatus(order, e.target.value);
                                              setselfDeliveryMode(e.target.value);
                                            }
                                          }}
                                          value={
                                            rtoValue(order)
                                          }
                                        >
                                          {generateOptionsForV2(order)}
                                        </select>
                                        :
                                        <select
                                          onChange={(e) => {
                                            if (e.target.value === "RTO-Initiated") {
                                              setSelfDeliveryIssueModal(true);
                                              setorder_id(order);
                                              setselfDeliveryMode(e.target.value);
                                            } else if (e.target.value !== "") {
                                              updateOrderStatus(order, e.target.value);
                                              setselfDeliveryMode(e.target.value);
                                            }
                                          }}
                                          value={
                                            order?.fulfillments[0]?.state?.descriptor?.code
                                              ? order?.fulfillments[0]?.state?.descriptor?.code
                                              : selfDeliveryMode
                                          }
                                        >
                                          {generateOptions(order)}
                                        </select>
                                      )}
                                {/* <select className="btn-outline" aria-placeholder="Update Status">
                                      <option>Update Status</option>
                                    </select> */}
                                <div className="d-flex align-items-end justify-content-end w-100">
                                  <button className="btn" onClick={() => { getItems(order, "item"); }}>View Order <RightArrow className="ms-2" /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    }
                  </div>
                ) :
                  (
                    <div className="no-data-status">
                      {tableLoading ? (
                        <Spin
                          indicator={antIcon}
                          className="loader"
                          size="large"
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center flex-column" style={{ height: "calc(100vh - 260px)" }}>
                          <div className="cart-icon">
                            <img src={cartIcon} alt="" />
                          </div>
                          <h5>No Order Yet</h5>
                          <p>We will Notify you once you receive any order!</p>
                          <div className="d-flex gap-2 mt-4 justify-content-center"></div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
        <div className="d-flex justify-content-center">
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={count}
            page={page}
          />
        </div>
      </div >
      <Modal
        isOpen={viewImage?.image?.length > 0}
        style={{ maxWidth: "586px" }}
        toggle={() => {
          setViewImage({});
        }}
        className="product-slider-popup"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <>&nbsp;</>
          <img
            src={crossIcon}
            onClick={() => {
              setViewImage({});
            }}
            alt=""
          />
        </ModalHeader>
        <ModalBody className="p-0">
          <Swiper
            style={{
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff',
            }}
            spaceBetween={0}
            navigation={true}
            // thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="product-slider"
          >
            {
              viewImage?.image?.map((item) => {
                return (
                  <SwiperSlide>
                    <img src={item} />
                  </SwiperSlide>
                )
              })
            }
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={0}
            slidesPerView={6}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="product-thumb-slider"
          >
            {
              viewImage?.image?.map((item) => {
                return (
                  <SwiperSlide>
                    <img src={item} />
                  </SwiperSlide>
                )
              })
            }
          </Swiper>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={orderView}
        style={{ maxWidth: "586px" }}
        toggle={() => {
          setorderView(false);
        }}
        className="view-order-popup-kiko"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {modalLoading ? (
          <Spin indicator={antIcon} style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        ) : (
          <>
            <ModalHeader>
              View Order
              <img
                src={crossIcon}
                onClick={() => {
                  setorderView(false);
                }}
                alt=""
              />
            </ModalHeader>
            <ModalBody>
              <ul className="view-order-address-list">
                <li>
                  <span>
                    Order Id: <span>{orderData?.orderId}</span>
                  </span>
                  {orderData?.invoiceUrl &&
                    <span onClick={() => { generateInvoice() }}>
                      Print <img src={printerIcon} style={{ cursor: "pointer" }} alt="" />{" "}
                    </span>
                  }
                </li>
                <li>
                  <span>
                    Customer Name:{" "}
                    <span>
                      {orderData?.customerName}
                    </span>
                  </span>
                  <span>
                    Mobile Number: <span>{orderData?.phone}</span>{" "}
                  </span>
                </li>
                <li>
                  <span>Address :  <span>
                    {
                      [
                        // orderData?.address?.address_line1,
                        // orderData?.address?.address_line2,
                        // orderData?.address?.city,
                        // orderData?.address?.state,
                        // orderData?.address?.zipcode
                        orderData?.fulfillments?.[0]?.end?.location?.address?.building,
                        orderData?.fulfillments?.[0]?.end?.location?.address?.locality,
                        orderData?.fulfillments?.[0]?.end?.location?.address?.city,
                        orderData?.fulfillments?.[0]?.end?.location?.address?.state,
                        orderData?.fulfillments?.[0]?.end?.location?.address?.area_code,
                      ]
                        .filter(part => part !== undefined && part !== null && part !== "")
                        .join(", ")
                    }
                  </span>
                  </span>
                </li>
              </ul>
              <ul className="view-product-list">
                {itemData &&
                  itemData.filter(item => item.quantity.count !== 0).map((item, index) => {
                    return (
                      <li className="view-product-items">
                        <div className="product" onClick={() => { setViewImage(item) }}>
                          <img src={item?.image?.[0]} alt="" />
                        </div>
                        <div className="product-items-details">
                          <ul className="product-details-list">
                            <li className="product-name">{item?.productName &&
                              item?.productName[0]?.toUpperCase() +
                              item?.productName?.slice(1)}</li>
                            <li className="product-name-price">
                              <span>Net Weight:{item?.weight}
                                {item?.weightUnit}</span><span>Price: ₹{item?.discountedPrice
                                  ? parseFloat(item?.discountedPrice).toFixed(2)
                                  : ""}</span>
                            </li>
                            <li className="product-qty">
                              <span>Qty: {item?.quantity?.count}</span><span>Status:{item?.tags && item?.tags === "cancel"
                                ? "Cancelled"
                                : item?.tags}</span>
                            </li>
                          </ul>
                        </div>
                      </li>
                    )
                  })}
              </ul>
              <div className="view-order-invoice-list">
                <div className="invoice-items">
                  <span>Order amount</span>
                  <span>₹{parseFloat(orderData?.orderAmount).toFixed(2)}</span>
                </div>
                <div className="invoice-items">
                  <span>Delivery amount</span>
                  <span>
                    ₹{parseFloat(orderData?.deliveryChargesValue).toFixed(2)}
                  </span>
                </div>
                {orderData?.context?.domain !== "ONDC:RET11" && <div className="invoice-items">
                  <span>Tax</span>
                  <span>₹{parseFloat(orderData?.tax).toFixed(2)}</span>
                </div>}
                <div className="invoice-items">
                  <span>Packing Fee</span>
                  <span>₹{parseFloat(orderData?.packingCharges).toFixed(2)}</span>
                </div>
                <div className="invoice-items total-amount">
                  <span>
                    Total amount
                  </span>
                  <span>
                    ₹
                    {Math.round(
                      parseFloat(orderData?.orderAmount) +
                      parseFloat(orderData?.deliveryChargesValue) +
                      parseFloat(orderData?.tax) +
                      parseFloat(orderData?.packingCharges)
                    )}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="d-flex gap-2 justify-content-center">
              {orderData?.ondcOrderStatus !== "Cancelled" &&
                Array.isArray(orderData?.kikoDeliveryStatusTracker) &&
                !orderData?.kikoDeliveryStatusTracker.some(
                  (item) =>
                    item.status === "courier_assigned" ||
                    item.status === "parcel_picked_up"
                ) && status !== "bulkLogistics" && (
                  <button
                    className="btn btn-xs btn-danger"
                    onClick={() => {
                      setopenRejectBtn(true);
                      setorderView(false);
                    }}
                  >
                    {" "}
                    {loading ? <Spin indicator={antIcon} /> : "Cancel"}
                  </button>
                )}
              {(orderData?.ondcOrderStatus === "Created" && status !== "bulkLogistics" && viewPartialCancel(itemData)) && (
                <button
                  className="btn btn-xs btn-danger-outline"
                  onClick={() => {
                    setPartialCancelView(true);
                    setorderView(false);
                  }}
                >
                  {" "}
                  {loading ? <Spin indicator={antIcon} /> : "Partial Cancel"}
                </button>
              )}
              {orderData?.ondcOrderStatus === "Created" && itemData?.length > 0 && itemData?.filter(
                (item) => item.tags === "" && item.quantity.count !== 0
              ).length > 0 && (
                  <button
                    className="btn btn-xs btn-success"
                    disabled={acceptLoading}
                    onClick={() => {
                      statusUpdate(false);
                    }}
                  >
                    {acceptLoading ? <Spin indicator={antIcon} /> : "Accept"}
                  </button>
                )}
              {["Accepted", "In-progress"].includes(
                orderData?.ondcOrderStatus
              ) && status !== "bulkLogistics" &&
                !orderData?.orderDeliveryMode && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setAccept(true);
                      setorderView(false);
                    }}
                  >
                    Initiate delivery
                  </button>
                )}
            </ModalFooter>
          </>
        )}
      </Modal>

      <Modal
        isOpen={partialCancelView}
        toggle={() => {
          setPartialCancelView(false);
        }}
        className="viewOrder viewOrderXXl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {modalLoading ? (
          <Spin indicator={antIcon} />
        ) : (
          <div className="container pb-3">
            <div className="view-order-modal">
              <ModalHeader className="ps-0 pe-0">
                Partial Cancel
                <img
                  src={crossIcon}
                  onClick={() => {
                    setPartialCancelView(false);
                  }}
                  alt=""
                />
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                  <p className="m-0">
                    Order Id: <span>{orderData?.orderId}</span>
                  </p>
                </div>
                <div className="tabel-responsive">
                  <table className="global-table">
                    <thead className="view-order-header">
                      <tr>
                        <th></th>
                        <th className="text-start">Product Name</th>
                        <th className="text-center">Net Weight</th>
                        <th className="text-center" style={{ width: "150px" }}>
                          Quantity
                        </th>
                        <th className="text-end">Price</th>
                      </tr>
                    </thead>
                    <tbody className="view-order-body">
                      {itemData &&
                        itemData
                          .filter((item) => (item?.tags === "" && item.quantity.count !== 0))
                          .map((item, index) => {
                            return (
                              <tr
                                key={index}
                                className={
                                  item?.tags !== "" ? "strikeout1" : ""
                                }
                              >
                                <td>
                                  <input
                                    style={{ width: "20px" }}
                                    type="checkbox"
                                    checked={remittanceArray.some(
                                      (remArray) => remArray.id === item?.itemId
                                    )}
                                    onChange={() =>
                                      storeIds(item.itemId, item.quantity.count)
                                    }
                                  />
                                </td>
                                <td>
                                  <div className="text-start">
                                    {item?.productName &&
                                      item?.productName[0]?.toUpperCase() +
                                      item?.productName?.slice(1)}
                                    <br />
                                    QTY:- {item?.quantity?.count}
                                  </div>
                                </td>
                                <td>
                                  {item?.weight}
                                  {item?.weightUnit}
                                </td>
                                {item?.quantity?.count > 1 &&
                                  remittanceArray.some(
                                    (remArray) => remArray.id === item?.itemId
                                  ) ? (
                                  <div className="quantity-input">
                                    <button
                                      className="quantity-button"
                                      id="decrement"
                                      onClick={() => {
                                        const quantityInput =
                                          remittanceArray.find(
                                            (remArray) =>
                                              remArray.id === item?.itemId
                                          );
                                        const currentValue = parseInt(
                                          quantityInput.quantity.count
                                        );
                                        if (currentValue > 1) {
                                          setRemittanceArray(
                                            (prevRemittanceArray) => {
                                              return prevRemittanceArray.map(
                                                (remArray) => {
                                                  if (
                                                    remArray.id === item?.itemId
                                                  ) {
                                                    return {
                                                      ...remArray,
                                                      quantity: {
                                                        count:
                                                          remArray.quantity
                                                            .count - 1,
                                                      },
                                                    };
                                                  }
                                                  return remArray;
                                                }
                                              );
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      -
                                    </button>
                                    <input
                                      disabled={true}
                                      type="text"
                                      id="quantity"
                                      value={
                                        remittanceArray.find(
                                          (remArray) =>
                                            remArray.id === item.itemId
                                        ).quantity.count
                                      }
                                    />
                                    <button
                                      className="quantity-button"
                                      id="increment"
                                      onClick={() => {
                                        const quantityInput =
                                          remittanceArray.find(
                                            (remArray) =>
                                              remArray.id === item?.itemId
                                          );
                                        const currentValue = parseInt(
                                          quantityInput.quantity.count
                                        );
                                        if (
                                          currentValue < item.quantity.count
                                        ) {
                                          setRemittanceArray(
                                            (prevRemittanceArray) => {
                                              return prevRemittanceArray.map(
                                                (remArray) => {
                                                  if (
                                                    remArray.id === item?.itemId
                                                  ) {
                                                    return {
                                                      ...remArray,
                                                      quantity: {
                                                        count:
                                                          remArray.quantity
                                                            .count + 1,
                                                      },
                                                    };
                                                  }
                                                  return remArray;
                                                }
                                              );
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <td>{item?.quantity?.count}</td>
                                )}
                                <td className="text-end">
                                  {item?.discountedPrice
                                    ? parseFloat(item?.discountedPrice).toFixed(2)
                                    : ""}
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <div className="d-flex gap-2 justify-content-center mt-3"></div>
              <div className="d-flex gap-2 justify-content-center mt-3">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setPartialCancelView(false);
                    setRemittanceArray([]);
                  }}
                >
                  {" "}
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  disabled={loading || remittanceArray?.length === 0}
                  onClick={() => {
                    validatePartialCancel(itemData) ? cancelOrder("Cancelled") : partialCancel();
                  }}
                >
                  {" "}
                  {loading ? <Spin indicator={antIcon} /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={deliveryChargesOpen}
        className="viewOrder"
        onClose={() => {
          setdeliveryChargesOpen(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {modalLoading ? (
          <Spin indicator={antIcon} />
        ) : (
          <div className="delivery-charge-modal">
            <div className="d-flex justify-content-end mb-2">
              {(orderDeliveryMode === "KikoDelivery" || orderDeliveryMode === "OnNetworkDelivery") && (
                <span className="wallet-am">
                  <img src={walletIcon} alt="" />₹
                  {user_data?.walletBalance ? user_data?.walletBalance.toFixed(2) : 0}
                </span>
              )}
            </div>
            <h3>
              {(orderDeliveryMode === "KikoDelivery" || orderDeliveryMode === "OnNetworkDelivery")
                ? "Kiko Live Delivery Charges"
                : "Do you wish to proceed with delivery?"}
            </h3>
            <h5>
              {(orderDeliveryMode === "OnNetworkDelivery") && (
                `Logistic Provider: ${logisticProviderName}`
              )}
            </h5>
            {(orderDeliveryMode === "KikoDelivery" || orderDeliveryMode === "OnNetworkDelivery") && (
              <div className="delivery-rate">
                {orderDeliveryMode === "KikoDelivery" ?
                  <p>₹{orderData?.actualShippingAmount}</p> :
                  <p>₹{logisticDeliveryCharge}</p>
                }
              </div>
            )}
            {(orderDeliveryMode === "KikoDelivery") && (
              <button
                className="view-charges"
                onClick={() => {
                  setViewDelivery(true);
                }}
              >
                View Delivery Charges{" "}
              </button>
            )}
            {(orderDeliveryMode === "OnNetworkDelivery") && (
              <button
                className="view-charges"
                onClick={() => {
                  setLspProviderPopup(true);
                }}
              >
                View Other Logistics {" "}
              </button>
            )}
            {(orderDeliveryMode === "KikoDelivery" || orderDeliveryMode === "OnNetworkDelivery") && (
              <h6>You cannot undo this operation</h6>
            )}
            {orderDeliveryMode === "SelfDelivery" && (
              <>
                <h6>Kindly arrange for Delivery</h6>
                <br />
                <h6>Upload proof once delivered</h6>
              </>
            )}
            <div className="operation-btns">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setdeliveryChargesOpen(false);
                }}
                disabled={isDisable}
              >
                No
              </button>
              <button
                className="btn btn-sm  btn-success"
                onClick={() => {
                  onInitiatePickup()
                  setisDisable(true);
                }}
                disabled={
                  !tearms_cond ||
                  isDisable
                }
              >
                {" "}
                {loading ? <Spin indicator={antIcon} /> : "Yes"}
              </button>
            </div>
            <div className="checkboxBlock">
              <input
                type="checkbox"
                checked={tearms_cond}
                onChange={(e) => settearms_cond(e.target.checked)}
              />
              <label className="terms-condition">
                <a
                  href="/terms-condition"
                  target="_blank"
                  rel="noreferrer"
                  className="termsCondition"
                  onClick={(e) => { e.preventDefault(); window.open("/terms-condition", "_blank") }}
                >
                  {" "}
                  I accept all delivery term & conditions{" "}
                </a>
              </label>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={viewDelivery}
        className="termsCondiModal"
        toggle={() => {
          setViewDelivery(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <ModalHeader>
          View Delivery Charges
          <img
            src={crossIcon}
            onClick={() => {
              setViewDelivery(false);
            }}
            alt=""
          />
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-lg-6">
              <div className="heading">
                <h1 className="title">Shipping charges</h1>
              </div>
              <ul className="chargeDetail">
                <li>
                  <span>*</span> Charges are inclusive of all taxes
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-6">
                  <div className="heading">
                    <h1 className="title">0 To 6 kgs</h1>
                  </div>
                  <ul className="chargeKgs">
                    <li>
                      <span>0 to 1 km</span>
                      <span>₹38.5</span>
                    </li>
                    <li>
                      <span>1.01 to 2 km</span>
                      <span>₹47</span>
                    </li>
                    <li>
                      <span>2.01 to 3 km</span>
                      <span>₹55</span>
                    </li>
                    <li>
                      <span>3.01 to 4 km</span>
                      <span>₹67</span>
                    </li>
                    <li>
                      <span>4.01 to 5 km</span>
                      <span>₹67</span>
                    </li>
                    <li>
                      <span>5.01 to 6 km</span>
                      <span>₹91</span>
                    </li>
                    <li>
                      <span>6.01 to 7 km</span>
                      <span>₹103</span>
                    </li>
                    <li>
                      <span>7.01 to 8 km</span>
                      <span>₹115</span>
                    </li>
                    <li>
                      <span>8.01 to 9 km</span>
                      <span>₹127</span>
                    </li>
                    <li>
                      <span>9.01 to 10 km</span>
                      <span>₹139</span>
                    </li>

                    <li>
                      <span>10.01 to 11 km</span>
                      <span>₹151</span>
                    </li>
                    <li>
                      <span>11.01 to 12 km</span>
                      <span>₹163</span>
                    </li>

                    <li>
                      <span>12.01 to 13 km</span>
                      <span>₹175</span>
                    </li>

                    <li>
                      <span>13.01 to 14 km</span>
                      <span>₹187</span>
                    </li>
                    <li>
                      <span>14.01 to 15 km</span>
                      <span>₹199</span>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <div className="heading">
                    <h1 className="title">6.01 To 15 kgs</h1>
                  </div>
                  <ul className="chargeKgs">
                    <li>
                      <span>0 to 1 km</span>
                      <span>₹42</span>
                    </li>
                    <li>
                      <span>1.01 to 2 km</span>
                      <span>₹52</span>
                    </li>
                    <li>
                      <span>2.01 to 3 km</span>
                      <span>₹60</span>
                    </li>
                    <li>
                      <span>3.01 to 4 km</span>
                      <span>₹74</span>
                    </li>
                    <li>
                      <span>4.01 to 5 km</span>
                      <span>₹87</span>
                    </li>
                    <li>
                      <span>5.01 to 6 km</span>
                      <span>₹100</span>
                    </li>
                    <li>
                      <span>6.01 to 7 km</span>
                      <span>₹113</span>
                    </li>
                    <li>
                      <span>7.01 to 8 km</span>
                      <span>₹126</span>
                    </li>
                    <li>
                      <span>8.01 to 9 km</span>
                      <span>₹140</span>
                    </li>
                    <li>
                      <span>9.01 to 10 km</span>
                      <span>₹153</span>
                    </li>

                    <li>
                      <span>10.01 to 11 km</span>
                      <span>₹166</span>
                    </li>
                    <li>
                      <span>11.01 to 12 km</span>
                      <span>₹180</span>
                    </li>

                    <li>
                      <span>12.01 to 13 km</span>
                      <span>₹192</span>
                    </li>

                    <li>
                      <span>13.01 to 14 km</span>
                      <span>₹206</span>
                    </li>
                    <li>
                      <span>14.01 to 15 km</span>
                      <span>₹219</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                setViewDelivery(false);
              }}
            >
              Ok
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={pickupModal}
        onClose={() => {
          setpickupModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="sm"
      >
        <div className="container pb-3 pt-3">
          <div className="pickup-initiated-modal">
            <div className="initiated-img">
              <img src={pikupInitiated} alt="" />
            </div>
            <h5>Pickup Initiated</h5>
            <div className="text-center">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setpickupModal(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={pickupRejectModal}
        toggle={() => {
          setpickupRejectModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="sm"
      >
        <div className="container pb-3 pt-3">
          <div className="pickup-initiated-modal">
            <div className="initiated-img">
              <img src={pikupInitiated} alt="" />
            </div>
            <h5>{pickUpReason ? pickUpReason : "Pickup Rejected"}</h5>
            <div className="text-center">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setpickupRejectModal(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openAccept}
        onClose={() => {
          setAccept(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pt-3 pb-3">
          <div className="packedOrder">
            <h4 className="text-center mb-3">Is Your Order Packed?</h4>
            <form className="type">
              <input
                type="radio"
                onClick={() => {
                  setPackingPopup(true);
                  setAccept(false);
                }}
                id="no"
                name="radio-group"
              />
              <label htmlFor="no">No</label>
              <input
                type="radio"
                checked={orderPacked}
                onClick={() => {
                  setOrderPacked(true);
                }}
                name="radio-group"
              />
              <label
                htmlFor="yes"
                onClick={() => {
                  setOrderPacked(true);
                }}
              >
                Yes
              </label>
            </form>
          </div>
          {orderData?.deliveryType === "Self-Pickup" ?
            <div className="delivery-option">
              <h6 className="text-center mb-3">{"Buyer will pick up this order from store"}</h6>
            </div> :
            <div className="delivery-option">
              <h4 className="text-center mb-3">Select Delivery Option</h4>
              <div className="options-block">
                {orderData?.context?.bap_id !== "ondc-bap.olacabs.com" &&
                  <div className="type">
                    <input
                      type="radio"
                      id="selfdelivery"
                      checked={orderDeliveryMode === "SelfDelivery"}
                      onClick={() => {
                        setorderDeliveryMode("SelfDelivery");
                      }}
                      name="radio-group"
                    />
                    <label htmlFor="selfdelivery">Self Delivery</label>
                    <p className="mb-0 mt-1 SelectDelivery">
                      <img src={infoIcon} alt="" /> What is Self Delivery
                      <div className="SelectDeliveryInfo">
                        <ul>
                          <li>
                            In case of Self Delivery,{" "}
                            <span>
                              Seller will be responsible to deliver parcel to
                              customer
                            </span>
                            . once Order get Delivered kindly upload Delivery
                            confirmation (Bill, Payment receipt etc..).Once bill get
                            uploaded order will marked as delivered and then you
                            will to receive your amount as per term & condition.
                          </li>
                        </ul>
                      </div>
                    </p>
                  </div>}
                {/* {orderData?.context?.bap_id !== "ondc-bap.olacabs.com" &&
                  <div className="type">
                    <input
                      type="radio"
                      id="kikodelivery"
                      checked={
                        orderDeliveryMode === "KikoDelivery" && totalWeight <= 15
                      }
                      disabled={orderData?.ondcOrderServiceability?.panIndiaDelivery ?? false}
                      onClick={() => {
                        setorderDeliveryMode("KikoDelivery");
                      }}
                      name="radio-group"
                    />
                    <label for="kikodelivery">Kiko Delivery</label>
                    <p className="mb-0 mt-1 SelectDelivery">
                      <img src={infoIcon} alt="" /> What is Kiko Delivery
                      <div className="SelectDeliveryInfo">
                        <ul>
                          <li>
                            Kiko live provides{" "}
                            <span>delivery services at affordable rates</span>.
                          </li>
                          <li>Approx. delivery time: 45 mins to 1 hour.</li>
                          <li>
                            <span>Live Tracking feature</span>.
                          </li>
                        </ul>
                      </div>
                    </p>
                  </div>
                } */}
                <div className="type">
                  <input
                    type="radio"
                    id="OnNetworkDelivery"
                    checked={
                      orderDeliveryMode === "OnNetworkDelivery"
                    }
                    onClick={() => {
                      setorderDeliveryMode("OnNetworkDelivery");
                    }}
                    name="radio-group"
                  />
                  <label for="OnNetworkDelivery">On-Network Delivery</label>
                  <p className="mb-0 mt-1 SelectDelivery">
                    <img src={infoIcon} alt="" /> What is On-Network Delivery
                    <div className="SelectDeliveryInfo">
                      <ul>
                        <li>
                          Kiko live provides{" "}
                          <span>delivery services at affordable rates</span>.
                        </li>
                        <li>Approx. delivery time: 45 mins to 1 hour.</li>
                        <li>
                          <span>Live Tracking feature</span>.
                        </li>
                      </ul>
                    </div>
                  </p>
                </div>
              </div>
            </div>}
          <div className="text-center">
            <button
              className=" btn btn-md btn-secondary"
              disabled={!orderPacked || modalLoading}
              onClick={() => {
                onPressProceed()
              }}
            >
              {modalLoading ? <Spin indicator={antIcon} /> : "Proceed"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openRejectBtn}
        onClose={() => {
          setopenRejectBtn(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="py-4">
            <h4 className="text-center mb-0">
              Are you sure you want to cancel this order?
            </h4>
            <div className="options-block"></div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button
              className="btn btn-sm btn-danger"
              disabled={loading}
              onClick={() => {
                cancelOrder("Cancelled");
              }}
            >
              {loading ? <Spin indicator={antIcon} className="me-2" /> : "Yes"}
            </button>
            <button
              className="btn btn-sm btn-success"
              disabled={loading}
              onClick={() => {
                setopenRejectBtn(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={packingPopup}
        onClose={() => {
          setPackingPopup(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-4 p-4">
          <h6 className="text-center mb-0">
            After packing the order, please click on "View Order" to begin the
            delivery process.
          </h6>
          <div className="options-block"></div>

          <div className="d-flex gap-2 justify-content-center mt-3">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setPackingPopup(false);
                overDueOrders ? getOndcOverdue() : getOrders()
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={courierModal}
        toggle={() => {
          setcourierModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        className="view-popup-modal auto-adjust-modal"
        centered
      >
        {modalLoading ? (
          <Spin indicator={antIcon} className="me-2" />
        ) : (
          <div className="container">
            <ModalHeader className="ps-0 pe-0 Courier-info">
              Courier Info
              {(onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" || orderData?.pickupOtp) &&
                <> (PickUp Otp-{onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.startInstructions?.short_desc : orderData?.pickupOtp})</>
              }
              <img
                src={crossIcon}
                onClick={() => {
                  setcourierModal(false);
                }}
                alt=""
              />
            </ModalHeader>
            {(orderData?.courierInfo?.name || onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") ? (
              <div className="view-popup py-3">
                <div>
                  {(orderData?.courierInfo?.id || onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") && <div className="textAlign">
                    <h5>Id :</h5>
                    <p>
                      {onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticProviderName?.long_desc : orderData?.courierInfo?.id ?? "NA"}
                    </p>
                  </div>}
                  {(orderData?.courierInfo?.name || onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") && <div className="textAlign">
                    <h5>Name :</h5>
                    <p>
                      {onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name ?? "NA" : orderData?.courierInfo?.name ?? "NA"}
                    </p>
                  </div>}
                  {(orderData?.courierInfo?.phone || (onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery")) && <div
                    className="textAlign"
                    onClick={() => {
                      const phoneNumber = (onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone : orderData?.courierInfo?.phone)
                      makePhoneCall(phoneNumber);
                    }}
                  >
                    <h5>Mobile :</h5>
                    <p>{onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone ?? "NA" : orderData?.courierInfo?.phone ?? "NA"}</p>
                  </div>}
                  {/* <div className='textAlign m-0'><h5>Track order :</h5><a href={orderData?.courierInfo?.courierinfo?.trackingUrl} target="_blank" >111</a></div>  */}
                  {(orderData?.courierInfo?.trackingUrl) || ((onNetworkLSPTrackUrl && onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") && (onNetworkLSPCourierInfo?.deliveryVendorStatus !== "parcel_delivered")) && <div className="textAlign m-0">
                    <button className="btn btn-sm btn-primary">
                      <a
                        href={onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPTrackUrl : orderData?.courierInfo?.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="termsCondition"
                      >
                        {" "}
                        Track order{" "}
                      </a>
                    </button>
                  </div>}
                </div>
              </div>
            ) : (
              <div className="view-popup justify-content-center not-assigned">
                <div>
                  <h5 className="m-0 text-center">
                    Courier Partner is not Assigned yet !
                  </h5>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      <PermissionAlertP
        permissionAlertPopUp={permissionAlertPopUp}
        setPermissionAlertPopUp={setPermissionAlertPopUp}
      />
      <Modal
        isOpen={uploadImage}
        toggle={() => {
          setUploadImage(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="sm"
      >
        <div className="container pb-3 pt-3">
          <div className="upload-image-modal">
            <div className="preview-image">
              {orderImage && (
                <img src={orderImage} alt="" className="logoimg" />
              )}
              {orderImage === "" && productDeliveryImage && (
                <img src={productDeliveryImage} className="logoimg" alt="" />
              )}
            </div>
            <div className="text-center">
              <button className="btn btn-sm btn-primary p-0 uploadBtn w-100"
                onClick={async () => {
                  if (window && window.flutter_inappwebview) {
                    const tempV = await flutterfetchCameraPermission();
                    if (!tempV) {
                      setUploadImage(false);
                      setPermissionAlertPopUp({
                        permission: true,
                        type: "cameraPermission",
                      });
                    }
                    else {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.onchange = async (e) => {
                        addUpdateImage(e.target.files[0], "uploadImage");
                      };
                      input.click();
                    }
                  } else {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.onchange = async (e) => {
                      addUpdateImage(e.target.files[0], "uploadImage");
                    };
                    input.click();
                  }
                }}>
                <p className="upload-img">
                  {" "}
                  {isDisable && isSpin === "uploadImage" ? (
                    <Space
                      size="middle"
                      className="Loader"
                      style={{ position: "relative", left: "-7px" }}
                    >
                      <div>
                        {" "}
                        <Spin size="medium" className="spiner" />
                      </div>
                    </Space>
                  ) : (
                    ""
                  )}
                  Upload confirmation Image
                  <Camera className="ms-2 Icon" />
                </p>
              </button>
            </div>
            {orderImage && (
              <div className="text-center">
                <button
                  className="btn btn-sm btn-primary w-100 mt-2"
                  disabled={isDisable}
                  onClick={() => {
                    uploadDeliveryImage();
                  }}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={selfDeliveryIssueModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container p-4">
          <div className="rejection-modal">
            <div className="modal-title">
              <h3 className="mb-2 text-center">Select issue with delivery</h3>
            </div>
            <div className="modal-body">
              {selfDeliveryIssueArray.map(([key, value]) => (
                <div
                  className="type"
                  onClick={() => {
                    setselfDeliveryIssueKey(key);
                  }}
                  key={key}
                >
                  <input
                    type="radio"
                    id={key}
                    checked={selfDeliveryIssueKey === key}
                    name="radio-group"
                  />
                  <label htmlFor="test1">{value}</label>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                className="mt-3 btn btn-md btn-primary"
                disabled={selfDeliveryIssueKey === ""}
                onClick={() => {
                  updateOrderStatus(order_id, "RTO-Initiated");
                  setSelfDeliveryIssueModal(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={walletInsuffientModalVisible}
        onClose={() => {
          setWalletInsuffientModalVisible(false);
        }}
        style={{ width: "350px" }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container p-5">
          <div className="Insufficient-modal">
            <h4 className="text-center mb-0">INSUFFICIENT WALLET BALANCE</h4>
            {(orderDeliveryMode === "OnNetworkDelivery") && (
              <div className="Insufficient-modal" >
                <p>{`Logistic Provider: ${selectedOtherLogistic?.name}`}</p>
                <p>{`Delivery Charges: ₹${selectedOtherLogistic?.charge}`}</p>
              </div>
            )}
            <p>Add money to your wallet to proceed kiko delivery</p>
            <a
              href="/wallet"
              onClick={() => {
                navigate("/wallet");
              }}
              className="wallet-link"
            >
              TOP UP WALLET
            </a>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button
              onClick={() => {
                setWalletInsuffientModalVisible(false);
                overDueOrders ? getOndcOverdue() : getOrders();
              }}
              className="btn btn-danger w-100"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openBulkStatusConfirm}
        onClose={() => {
          setOpenBulkStatusConfirm(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="py-4">
            <h4 className="text-center mb-0">
              Bulk Order Status Update Confirmation
            </h4>
            <p className="m-0">
              Please review all marked orders before proceeding with bulk status
              update.
            </p>
          </div>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-sm btn-success"
              disabled={bulkLoading}
              onClick={() => {
                bulkUpdateStatus();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-sm btn-danger"
              disabled={loading}
              onClick={() => {
                setOpenBulkStatusConfirm(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={timeStamp.length > 0 ? true : false}
        toggle={() => {
          setTimeStamp([]);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-custom"
      >
        <div className="timeStamp-container">
          <ModalHeader className="modal-header">
            Order Time Stamp{" "}
            <img
              src={crossIcon}
              onClick={() => {
                setTimeStamp([]);
              }}
              alt=""
            />
          </ModalHeader>
          <div className="main-div">
            {
              timeStamp.map((item, index) => {
                return (
                  <div className="timeStampStructure">
                    <div className="Ellipse-3657">
                      <span>
                        {index + 1}
                      </span>
                      {index < timeStamp.length - 1 && <div className="vertical-line"></div>}
                    </div>

                    <div className="time-container">
                      <span className="Order-Created">
                        {nomenclaturePopUp(item?.status)}
                      </span>
                      <span className="Order-Time">
                        {moment(item?.createdAt).format("DD MMMM YYYY") +
                          " at " +
                          moment(item?.createdAt).format("hh:mm A")}
                      </span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={orderDeliverView}
        style={{ maxWidth: "400px" }}
        toggle={() => {
          setorderDeliverView(false);
        }}
        className="view-order-deliver-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalBody>
          <div className="order-deliver-icon">
            <img src={OrderDeliverIcon} alt="" />
          </div>
          <div className="order-deliver-text">Please wait 10 minutes to mark as delivered</div>
          <button className="btn btn-primary order-close-btn" type="button" onClick={() => { setorderDeliverView(false) }} >Close</button>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={lspProviderPopup}
        toggle={() => {
          setLspProviderPopup(false);
        }}
        className="view-order-deliver-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{
          maxWidth: "550px",
        }}
      >
        <ModalBody style={{ padding: "0px" }}>
          <div className="popup">
            <div className="popup-header">
              Other Logistic Providers
            </div>
            <div className="popup-content">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Logistic Provider</th>
                      <th>TAT</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lspOtherLogistic.map((logistic, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <label className="custom-radio" onClick={() => { setSelectedOtherLogistic(logistic) }
                            } > {logistic?.name}
                              <input type="radio" name="radio" className="custom-radio-input" checked={selectedOtherLogistic?.name === logistic?.name} />
                              <span className="custom-radio-checkmark"></span>
                            </label>
                          </td>
                          <td>{logistic?.deliveryTAT}</td>
                          <td>₹{logistic?.charge}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="popup-footer">
              <button className="back-button"
                onClick={() => {
                  setLspProviderPopup(false);
                }}>Back</button>
              <button className="confirm-button" onClick={() => {
                if (parseFloat(selectedOtherLogistic?.charge) > parseFloat(user_data?.walletBalance)) {
                  setLspProviderPopup(false);
                  setWalletInsuffientModalVisible(true)
                }
                else {
                  setLogisticDeliveryCharge(selectedOtherLogistic?.charge);
                  setLogisticProviderName(selectedOtherLogistic?.name);
                  setLspProviderPopup(false);
                }
              }}>Confirm</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={bulkAssign}
        onClose={() => {
          setBulkAssign(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pt-3 pb-3">
          <div className="packedOrder">
            <div className="d-flex" style={{ width: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <h4 className="text-center mb-3">Is Your Order Packed?</h4>
              </div>
              <img
                src={crossIcon}
                onClick={() => setBulkAssign(false)}
                alt="Close"
                style={{ cursor: 'pointer', width: '15px', height: '15px' }}
              />
            </div>
            <h5 className="text-center mb-3">Please make sure all the selected orders have been packed and are ready to deliver before initiating delivery.</h5>
          </div>
          {orderData?.deliveryType === "Self-Pickup" ?
            <div className="delivery-option">
              <h6 className="text-center mb-3">{"Buyer will pick up this order from store"}</h6>
            </div> :
            <div className="delivery-option">
              <h4 className="text-center mb-3">Select Delivery Option</h4>
              <div className="options-block">
                <div className="type">
                  <input
                    type="radio"
                    id="OnNetworkDelivery"
                    checked={
                      orderDeliveryMode === "OnNetworkDelivery"
                    }
                    onClick={() => {
                      setorderDeliveryMode("OnNetworkDelivery");
                    }}
                    name="radio-group"
                  />
                  <label for="OnNetworkDelivery">On-Network Delivery</label>
                  <p className="mb-0 mt-1 SelectDelivery">
                    <img src={infoIcon} alt="" /> What is On-Network Delivery
                    <div className="SelectDeliveryInfo">
                      <ul>
                        <li>
                          Kiko live provides{" "}
                          <span>delivery services at affordable rates</span>.
                        </li>
                        <li>Approx. delivery time: 45 mins to 1 hour.</li>
                        <li>
                          <span>Live Tracking feature</span>.
                        </li>
                      </ul>
                    </div>
                  </p>
                </div>
              </div>
            </div>}
          <div className="text-center">
            <button
              className="btn btn-md btn-secondary"
              disabled={!orderDeliveryMode || bulkLogisticsData?.length <= 1}
              onClick={() => {
                onBulkInitiate()
              }}
            >
              {modalLoading ? <Spin indicator={antIcon} /> : "Proceed"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default NewOndcOrder;