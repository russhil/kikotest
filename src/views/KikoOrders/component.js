import React, { useState, useEffect } from "react";
//import ReactDOMServer from "react-dom/server";
// import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./styles.scss";
import { Space, Spin } from "antd";
// import "react-responsive-modal/styles.css";
// import { Modal, ModalBody } from "react-responsive-modal";
// import rejectMessages from "../../reject.json"
//sidebar
import Camera from "../../components/svgIcons/Camera";
import walletIcon from "../../images/wallet/wallerIcon.svg";
import cartIcon from "../../images/Inventry/cart-icon.png";
import infoIcon from "../../images/Inventry/Info-icon.svg";
//import Excel from "../../components/svgIcons/Excel";
import pikupInitiated from "../../images/pickup-initiated.svg";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
//import printerIcon from "../../images/Inventry/printer.svg";
import { GET_USER, KIKO_ORDERS } from "../../api/apiList";
import crossIcon from "../../images/cross-icon.svg";
import { get, isEmpty } from "lodash";
//import InvoiceTemplate from "../InvoiceTemplate/invoiceTemplate.js";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import whatsAppIcon from "../../images/whatsaapIcon.svg"
import {
  handleError,
  notify,
  DateFilters,
  PaginationFilter,
  nomenclature,
  CsvGenerator,
  flutterfetchCameraPermission,
  flutterDailPadHandler,
  handleLogout
} from "../../utils";
import PermissionAlertP from "../../components/Modal/PermissionAlertPopup";

function AdminOrders(props) {
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
  const [clear, setclear] = useState(false);
  const [orderView, setorderView] = useState(false);
  const [page, setpage] = useState(1);
  const [count, setCount] = useState(0);
  const [KikoOrderData, setKikoOrderData] = useState([]);
  const [singleOrderData, setSingleOrderData] = useState({});
  const [isDisable, setisDisable] = useState(false);
  const [status, setstatus] = useState("");
  const [isSpin, setisSpin] = useState("");
  const [couriorData, setcouriorData] = useState({});
  const [orderImage, setorderImage] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleCount, settoggleCount] = useState({});
  const [tableLoading, setTableloading] = useState(false);
  const [search, setSearch] = useState("");
  const [packingPopup, setPackingPopup] = useState(false);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [limit, setlimit] = useState(20);
  const [openAccept, setAccept] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [logisticDeliveryCharge, setLogisticDeliveryCharge] = useState(0);
  const [logisticProviderName, setLogisticProviderName] = useState("");
  const [componentMounted, setComponentMounted] = useState(false);
  const [exportOrder, setexportOrder] = useState([]);
  const [orderPacked, setOrderPacked] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [openRejectBtn, setopenRejectBtn] = useState(false);
  const [orderDeliveryMode, setorderDeliveryMode] = useState("");
  const [productDeliveryImage, setProductDeliveryImage] = useState("");
  const [order_id, setorder_id] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [selfDeliveryMode, setselfDeliveryMode] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [tearms_cond, settearms_cond] = useState(true);
  const [viewDelivery, setViewDelivery] = useState(false);
  const [courierModal, setcourierModal] = useState(false);
  const [pickupModal, setpickupModal] = useState(false);
  const [pickUpReason, setpickUpReason] = useState("");
  const [pickupRejectModal, setpickupRejectModal] = useState(false);
  const [buyerCollect, setBuyerCollect] = useState(false);
  const [walletInsuffientModalVisible, setWalletInsuffientModalVisible] =
    useState(false);
  const [deliveryChargesOpen, setdeliveryChargesOpen] = useState(false);
  const [openSelfDelivery, setopenSelfDelivery] = useState(false);
  const navigate = useNavigate();
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  const [multiOrderArray, setMultiOrderArray] = useState([]);
  const [openBulkStatusConfirm, setOpenBulkStatusConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [lspProviderPopup, setLspProviderPopup] = useState(false);
  const [lspOtherLogistic, setLspOtherLogistic] = useState([]);
  const [onNetworkLSPTrackUrl, setOnNetworkLSPTrackUrl] = useState("");
  const [onNetworkLSPCourierInfo, setOnNetworkLSPCourierInfo] = useState(null);
  const [selectedOtherLogistic, setSelectedOtherLogistic] = useState({});
  const [permissionAlertPopUp, setPermissionAlertPopUp] = useState({
    permission: false,
    type: "",
  });
  const kikoOrders = async () => {
    setTableloading(true);
    if (!user_data._id || user_data._id == "") {
      handleLogout();
    }
    let body = {
      userId: user_data && user_data._id ? user_data._id : "",
      startDate: startDate,
      endDate: endDate,
      search: search?.trim(),
      status: status,
      page,
      limit,
      searchOrderId: searchOrderId?.trim(),
    };
    try {
      const response = await API.post(KIKO_ORDERS, body);
      if (response) {
        setTableloading(false);
        setKikoOrderData(response?.data?.result?.result);
        setCount(response?.data?.result?.count);
        settoggleCount(response?.data?.result?.toggleCount);
      }
    } catch (error) {
      handleError(error);
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

  const bulkUpdateStatus = async () => {
    setBulkLoading(true);
    setOpenBulkStatusConfirm(false);
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_KIKO_API_V1}/order/bulk-update-website-order
      `,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: multiOrderArray,
    };
    try {
      const response = await axios(options);
      if (response?.data?.data?.success) {
        setMultiOrderArray([]);
        notify(
          "success",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );
        setBulkLoading(false);
        kikoOrders();
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

  const uploadDeliveryImage = async () => {
    const token = getSellerToken();
    try {
      setisDisable(true);
      const options = {
        method: "put",
        url: `${process.env.REACT_APP_KIKO_API_V1}/order/updateorder/${order_id}`,
        headers: {
          Authorization: `${token}`,
          desktop: true,
        },
        data: {
          productDeliveryImage: orderImage,
        },
      };
      const response = await axios(options);
      if (response) {
        setUploadImage(false);
        setorderImage("")
        notify("success", "Image uploaded ");
        kikoOrders();
        setisDisable(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const addUpdateImage = (selectedFile, data) => {
    const formData = new FormData();
    setisDisable(true);
    setisSpin(data);
    formData.append(`file`, selectedFile);
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
      kikoOrders();
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
  }, [componentMounted, status, page]);

  const exportOrders = () => {
    setExportLoading(true);
    let exportOrder = [];
    KikoOrderData.forEach((order, index) => {
      const obj = {
        srNo: index + 1,
        orderId: order?.orderId,
        ondcOrderStatus: order?.orderStatus
          ? nomenclature(order?.orderStatus)
          : "-",
        name:
          order?.buyerName.charAt(0).toUpperCase() + order?.buyerName.slice(1),
        phone: order?.buyerPhoneNumber,
        createdAt:
          moment(order?.createdAt).format("DD MMMM YYYY") +
          " at " +
          moment(order?.createdAt).format("hh:mm A"),
        orderAmount: order?.orderAmount,
        orderDeliveryMode: order?.orderDeliveryMode
          ? nomenclature(order?.orderDeliveryMode)
          : "",
        orderPaymentMode: order?.orderPaymentMode
          ? nomenclature(order?.orderPaymentMode)
          : "",
        shippingAmount: order?.shippingAmount,
        deliveryVendorStatus: order?.deliveryVendorStatus
          ? nomenclature(order?.deliveryVendorStatus)
          : "-",
      };
      exportOrder.push(obj);
      setexportOrder(exportOrder);
    });
    setExportLoading(false);
  };

  const getCancel = async () => {
    setLoading(true);
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_KIKO_API_V1}/order/cancel-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderId: singleOrderData._id,
        cancelledBy: "seller",
      },
    };
    const m2Options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/cancel-mp2-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderId: singleOrderData?.orderId,
        mp2OrderId: singleOrderData?.mp2OrderId,
        reasonCode: "005"
      },
    };
    try {
      let response = {};
      if (singleOrderData?.orderDeliveryMode === "MP2Delivery") {
        await axios(m2Options);
        response = await axios(options);
      }
      else {
        response = await axios(options);
      }
      setopenRejectBtn(false);
      setLoading(false);
      setorderDeliveryMode("");
      if (response?.data?.success) {
        kikoOrders();
        notify("success", "Order Cancelled");
      } else {
        notify("error", "Some thing went Wrong");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const showCourierInfoMadal = (order) => {
    const trackingTag = order?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.tags?.find(tag => tag.code === "tracking");
    if (trackingTag) {
      const urlItem = trackingTag.list.find(item => item.code === "url");
      setOnNetworkLSPTrackUrl(urlItem?.value)
    }
    setOnNetworkLSPCourierInfo(order)
    setcourierModal(true);
  }

  const getCourior = async (order_id) => {
    setcourierModal(true);
    setModalLoading(true);
    const token = getSellerToken();
    const options = {
      method: "get",
      url: `${process.env.REACT_APP_KIKO_API_V1}/order/${order_id}`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {},
    };
    try {
      const response = await axios(options);
      if (response?.data?.data) {
        setcouriorData(response?.data?.data);
        setModalLoading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const updateOrderStatus = async (order, status) => {
    let newStatus = "";
    let newkikoDeliveryStatusTracker = order?.kikoDeliveryStatusTracker
      ? order?.kikoDeliveryStatusTracker
      : [];
    if (status === "Out-for-delivery") {
      newStatus = "parcel_picked_up";
      newkikoDeliveryStatusTracker.push({
        status: newStatus,
        createdAt: new Date(),
      });
    } else if (status === "Order-delivered") {
      newStatus = "parcel_delivered";
      newkikoDeliveryStatusTracker.push({
        status: newStatus,
        createdAt: new Date(),
      });
    }
    setTableloading(true);
    const token = getSellerToken();
    const options = {
      method: "put",
      url: `${process.env.REACT_APP_KIKO_API_V1}/order/updateorder/${order?._id}`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        deliveryVendorStatus: newStatus,
        kikoDeliveryStatusTracker: newkikoDeliveryStatusTracker,
      },
    };
    try {
      const response = await axios(options);
      if (response?.data) {
        kikoOrders();
        setTableloading(false);
        notify(
          "success",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );
      } else {
        notify(
          "error",
          response?.data?.message
            ? response?.data?.message
            : "Something Went Wrong"
        );
        setTableloading(false);
      }
    } catch (error) {
      // handleError(error);
      notify("error", "Something Went Wrong");
    }
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
      if (page === 1) {
        kikoOrders();
      }
      else {
        setpage(1)
      }
    }
  };

  const pickUpLogisticOrder = async () => {
    const token = getSellerToken();
    // const orderId = singleOrderData?.orderId;
    const obj = {
      orderId: singleOrderData?.orderId,
      logistic_provider: selectedOtherLogistic?.logistic_provider,
      logistic_provider_context: selectedOtherLogistic?.logistic_provider_context
    }
    setLoading(true);
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/init-website-order-logistics-partner`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: obj,
    };
    const result = await axios(options);
    setAccept(false);
    setisDisable(false);
    if (result?.data?.status) {
      setpickupModal(true);
      setLoading(false);
      setdeliveryChargesOpen(false);
    }
    else if (!result?.data?.status) {
      setdeliveryChargesOpen(false);
      setLoading(false);
      setpickUpReason(result?.data?.message);
      setpickupRejectModal(true);
    };
  }

  const searchLogistic = async () => {
    const token = getSellerToken();
    setModalLoading(true);
    const data = {
      orderId: singleOrderData?.orderId
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/search-website-order-logistics-partner`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.data.status) {
        setAccept(false);
        if (singleOrderData?.context?.bap_id === "ondc-bap.olacabs.com" && response?.data?.providerBPPId !== "ondc-lsp.olacabs.com") {
          setpickUpReason("Ola Logistics Not Found");
          setpickupRejectModal(true);
          setModalLoading(false);
        }
        else {
          setModalLoading(false);
          setLogisticDeliveryCharge(response?.data?.selectedProvider?.charge)
          setSelectedOtherLogistic(response?.data?.selectedProvider)
          setLogisticProviderName(response?.data?.selectedProvider?.name)
          setLspOtherLogistic(response?.data?.lspProviders)
          setdeliveryChargesOpen(true);
        }
      }
      else {
        if (response?.data?.insufficientBalance) {
          setSelectedOtherLogistic(response?.data?.selectedProvider)
          setModalLoading(false);
          // setAcceptLoading(false);
          setAccept(false);
          setWalletInsuffientModalVisible(true);
        }
        else {
          setpickUpReason(response?.data?.message);
          setpickupRejectModal(true);
          setModalLoading(false);
          // setAcceptLoading(false);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const mp2Logistic = async () => {
    const token = getSellerToken();
    setModalLoading(true);
    const payload = {
      orderId: singleOrderData?.orderId,
      kiranaProOrderId: singleOrderData?.kiranaProOrderId
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/create-mp2-order-async`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: payload,
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        setBuyerCollect(false);
        setModalLoading(false);
        setpickupModal(true);
        setpickUpReason(response?.data?.message)
      }
      else {
        setBuyerCollect(false);
        setModalLoading(false);
        setpickupRejectModal(true);
        setpickUpReason(response?.data?.message)
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

  const deliveryEstimation = async () => {
    setisDisable(true);
    const token = getSellerToken();
    setLoading(true);
    getUser();
    let data = {
      userId: singleOrderData.userId._id,
      vendorId: singleOrderData.vendorId._id,
      userLatitude: singleOrderData?.userAddress?.latitude,
      userLongitude: singleOrderData?.userAddress?.longitude,
      usersAddress: singleOrderData?.userAddress?.address_line2,
      requestByVendor: false,
      freeDelivery: false,
      orderCreatedBy: "buyer",
      totalWeight: parseFloat(singleOrderData.totalWeight),
      userPincode: singleOrderData?.userAddress?.zipcode,
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_KIKO_API_V1}/order/delivery-estimation`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const result = await axios(options);

      if (result?.data?.data?.kikoDelivery) {
        setDeliveryCost(result?.data?.data?.price);
        if (
          parseInt(singleOrderData?.vendorId?.walletBalance) <
          parseInt(result?.data?.data?.price) &&
          orderDeliveryMode === "KikoDelivery"
        ) {
          setWalletInsuffientModalVisible(true);
          setAccept(false);
        } else {
          setdeliveryChargesOpen(true);
        }
        setAccept(false);
        setLoading(false);
        setisDisable(false);
      } else {
        setAccept(false);
        setLoading(false);
        // notify("error", result?.data?.data?.reason);
        setopenSelfDelivery(true);
        setisDisable(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const pickUpOrder = async () => {
    const token = getSellerToken();
    setisDisable(true);
    setLoading(true);
    const options = {
      method: "put",
      url: `${process.env.REACT_APP_KIKO_API_V1}/order/${singleOrderData?._id}`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderStatus: "order-ready-to-pickup",
        orderDeliveryMode,
        deliveryAmount: parseInt(deliveryCost),
      },
    };
    const result = await axios(options);
    setdeliveryChargesOpen(false);
    setisDisable(false);
    setorderDeliveryMode("");
    if (result?.data?.success) {
      // setdeliveryAmount(result?.data?.deliveryAmount)
      setpickupModal(true);
      setLoading(false);
      kikoOrders();
      setdeliveryChargesOpen(false);
    } else {
      setpickUpReason(result?.data?.message.length > 5 ? result?.data?.message : "-");
      //  notify("error", result?.data?.message);
      setdeliveryChargesOpen(false);
      setLoading(false);
      setpickupRejectModal(true);
    }
  };

  const storeUpdateIds = (order) => {
    const orderId = order._id;
    const currentStatus = order.deliveryVendorStatus

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


  const selectAll = () => {
    let arr = [];
    if (!selectAllCheckbox) {
      arr = KikoOrderData.map((a) => ({
        orderId: a._id,
        currentStatus: a.orderStatus
      }));
    }
    setMultiOrderArray(arr);
    setSelectAllCheckbox(!selectAllCheckbox);
  };

  const clearState = () => {
    setpage(1);
    setclear(true);
    setSearch("");
    setstartDate("");
    setSearchOrderId("");
    setendDate("");
  };

  const onNetworkAWBInvoice = (order) => {
    const url = order?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.startInstructions?.images?.[0]
    if (url && url !== "") {
      window.open(url, '_blank');
    }
  }

  useEffect(() => {
    if (
      search === "" &&
      startDate === "" &&
      searchOrderId === "" &&
      endDate === "" &&
      clear
    ) {
      kikoOrders();
    }
  }, [search, startDate, searchOrderId, endDate]);

  const headings = [
    { label: "SrNo.", key: "srNo" },
    { label: "Order ID.", key: "orderId" },
    { label: "Order Status.", key: "ondcOrderStatus" },
    { label: "Customer Name.", key: "name" },
    { label: "Mobile Number.", key: "phone" },
    { label: "Date & Time.", key: "createdAt" },
    { label: "Delivery Mode.", key: "orderDeliveryMode" },
    { label: "Payment Mode.", key: "orderPaymentMode" },
    { label: "Order amount.", key: "orderAmount" },
    { label: "Shipping Amount.", key: "shippingAmount" },
    { label: "Delivery Status.", key: "deliveryVendorStatus" },
  ];

  const whatsApp = (phoneNumber) => {
    const messageForKwality = `KWALITY BAZAAR now offers 30 minutes FREE EXPRESS delivery for all your daily needs with best prices.\n\nBetter range of products than Quick Commerce apps and Top Quality!\n\nPowered by Kiko Live and Government of India ONDC network.\n\nOrder via ONDC-PayTM (Extra Rs.50 off on all orders): https://m.paytm.me/ump_v2?utm_source=unified_share_message&categoryId=289844&mmid=1309855&selectedTab=ONDC\n\nOrder via ONDC-Mystore (Extra Rs.60 off on all orders): https://www.mystore.in/en/seller/87599b0c7125a857a15ef90100893761?section=products`
    const mystoreLink = user_data?.buyerAppLink.find(item => item.key === 'mystore')?.value || "-";
    const paytmLink = user_data?.buyerAppLink.find(item => item.key === 'paytm')?.value || "-";
    const message = `Dear Customer,\nThanks for buying from my Website. Keep ordering from ${user_data?.storeName}\nfrom below links and get upto Rs.40 off on your orders above Rs.200\n  https://shops.kiko.live/bhgat-kiryana-store`
    var whatsappUrl = `https://wa.me/${phoneNumber}?text=${user_data?.mobile?.toString() === "9625701616" ? encodeURIComponent(messageForKwality) : encodeURIComponent(message)}`;
    window.open(whatsappUrl);
  };

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />

      <div className="RightBlock" style={isMobile ? { "width": "100%", "left": "0", "top": isAppView === "true" ? "0px" : "68px" } : {}} >
        <div className="order-section">
          <div className="row w-100 m-0">
            <div className="col-lg-12 p-0">
              {!window?.flutter_inappwebview &&
                <div className="section-title">
                  <h1 className="m-0">Kiko Orders</h1>

                  <div className="order-data-btn d-flex align-items-center flex-wrap gap-2">
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
                    </div>
                  </div>
                </div>}
            </div>
            <div className="col-lg-12 p-0">
              <ul className="nav nav-pills" role="tablist">
                <li className="nav-item">
                  <a
                    data-toggle="tab"
                    href="#home"
                    onClick={() => {
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
                    href="#home"
                    onClick={() => {
                      setpage(1);
                      setstatus("parcel_picked_up");
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
                      setpage(1);
                      setstatus("order-place");
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
                      setpage(1);
                      setstatus("parcel_delivered");
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
                      setpage(1);
                      setstatus("order-cancelled");
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
                      setstatus("bulkUpdate");
                    }}
                  >
                    Bulk order status <span>({toggleCount?.BulkUpdateCount})</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-12 p-0">
              <div className="tab-content">
                <div id="home" className="tab-pane active">
                  <div className="filter filterBlock" style={{ display: 'flex' }}>
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
                            // kikoOrders();
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
                    <div>
                      <CsvGenerator
                        data={exportOrder}
                        headings={headings}
                        fileName={"Order.csv"}
                        onClick={exportOrders}
                        buttonName={"Download Order Data"}
                        exportLoading={exportLoading}
                      />
                    </div>
                  </div>
                  {KikoOrderData.length > 0 ? (
                    <div className="table-responsive">
                      {tableLoading ? (
                        <Spin indicator={antIcon} className="loader" />
                      ) : (
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              {status === "bulkUpdate" && (
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
                              <th scope="col">Sr No.</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Order Status</th>
                              <th scope="col">Customer Name</th>
                              <th scope="col">Mobile Number</th>
                              <th scope="col">Date & Time</th>
                              <th scope="col">Action</th>
                              <th scope="col">Delivery Mode</th>
                              <th scope="col">Payment Mode</th>
                              <th scope="col">Order Amount</th>
                              <th scope="col">Shipping Amount</th>
                              <th scope="col">Delivery Status</th>
                              <th scope="col">Tracking ID</th>
                              <th scope="col">Delivery Partner</th>
                              <th scope="col">Update Status</th>
                              <th scope="col">Upload Delivery</th>
                            </tr>
                          </thead>
                          <tbody>
                            {KikoOrderData.map((order, index) => {
                              return (
                                <tr key={index}>
                                  {status === "bulkUpdate" && (
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
                                        value={get(KikoOrderData, "_id")}
                                        onChange={(e) => {
                                          storeUpdateIds(order);
                                        }}
                                      />
                                    </th>
                                  )}
                                  <th scope="row">{index + 1}</th>
                                  <td>
                                    <p className={`status-border ${order?.landingSource === "https://shops.kiko.live/qc" ? 'flash-order-id' : ''}`}>
                                      {order?.orderId}
                                    </p>
                                  </td>
                                  <td>
                                    {[
                                      "order-place",
                                      "payment-completed",
                                    ].includes(order?.orderStatus) &&
                                      ![
                                        "parcel_delivered",
                                        "Order-delivered",
                                      ].includes(order?.deliveryVendorStatus)
                                      ? (
                                        <p className="green status-border">
                                          {" "}
                                          Created{" "}
                                        </p>
                                      ) : ([
                                        "order-ready-to-pickup",
                                        "parcel_picked_up",
                                        "In-progress"
                                      ].includes(order?.orderStatus) ||
                                        [
                                          "courier_departed",
                                          "active",
                                          "available",
                                          "courier_arrived",
                                          "looking_for_courier",
                                          "parcel_picked_up",
                                          "planned",
                                          "delayed",
                                          "agent_assigned"
                                        ].includes(
                                          order?.deliveryVendorStatus
                                        )) &&
                                        ![
                                          "order-cancelled",
                                          "orderCancelled",
                                          "Cancelled"
                                        ].includes(order?.orderStatus) &&
                                        ![
                                          "parcel_delivered",
                                          "Order-delivered",
                                        ].includes(order?.deliveryVendorStatus) ? (
                                        <p className="yellow status-border">
                                          {" "}
                                          In-Progress{" "}
                                        </p>
                                      ) : [
                                        "order-cancelled",
                                        "orderCancelled",
                                        "Cancelled"
                                      ].includes(order?.orderStatus) ||
                                        order?.deliveryVendorStatus ===
                                        "order_cancelled" ? (
                                        <p className="red status-border">
                                          {" "}
                                          Cancelled{" "}
                                        </p>
                                      ) : [
                                        "parcel_delivered",
                                        "Order-delivered",
                                      ].includes(order?.deliveryVendorStatus) ? (
                                        <p className="blue status-border">
                                          {" "}
                                          Delivered
                                        </p>
                                      ) : (
                                        "-"
                                      )}
                                  </td>
                                  <td>
                                    {order?.buyerName.charAt(0).toUpperCase() +
                                      order?.buyerName.slice(1)}
                                  </td>
                                  <td style={{ cursor: "pointer" }} onClick={() => whatsApp(order?.buyerPhoneNumber)}>
                                    <img src={whatsAppIcon} alt="" className="me-1" />
                                    {order?.buyerPhoneNumber}</td>
                                  {/* <td>{order?.buyerPhoneNumber}</td> */}
                                  <td>
                                    {moment(order?.createdAt).format(
                                      "DD MMMM YYYY"
                                    ) +
                                      " at " +
                                      moment(order?.createdAt).format(
                                        "hh:mm A"
                                      )}
                                  </td>
                                  <td>
                                    {" "}
                                    <span
                                      className="view-order"
                                      onClick={() => {
                                        setSingleOrderData(order);
                                        setDeliveryCost(order.shippingAmount);
                                        setorderView(true);
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
                                    {order?.orderPaymentMode
                                      ? nomenclature(order?.orderPaymentMode)
                                      : ""}
                                  </td>
                                  <td>{order?.orderAmount}</td>
                                  <td>{order?.shippingAmount}</td>
                                  <td>
                                    {order?.deliveryVendorStatus
                                      ? nomenclature(
                                        order?.deliveryVendorStatus
                                      )
                                      : "-"}
                                  </td>
                                  <td>
                                    {order?.orderDeliveryMode === "MP2Delivery" ? order?.mp2OrderId : order?.orderDeliveryMode === "OnNetworkDelivery" ? order?.onNetworklogisticData?.onNetworklogisticDeliveryType === "P2H2P" ? <button className="view-order" onClick={() => { onNetworkAWBInvoice(order) }}>{order?.onNetworklogisticData?.onNetworklogisticOrderId} </button> : order?.onNetworklogisticData?.onNetworklogisticOrderId : order?.deliveryPartnerTaskId &&
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
                                            getCourior(order?._id);
                                          }}
                                        >
                                          View
                                        </span>
                                      ) : (order?.orderDeliveryMode === "MP2Delivery" && order?.mp2LogisticData?.rider.name) ? (
                                        <span
                                          className="view-order"
                                          onClick={() => {
                                            const rider = {
                                              courierinfo: {
                                                name: order?.mp2LogisticData?.rider?.name,
                                                phone: order?.mp2LogisticData?.rider?.phone,
                                                trackingUrl: order?.mp2LogisticData?.tracking_url,
                                              }
                                            }
                                            setcouriorData(rider)
                                            setcourierModal(true);
                                          }}
                                        >
                                          View
                                        </span>
                                      ) : (
                                        "-"
                                      )}{" "}
                                  </td>
                                  {/* <td>
                                    {order?.deliveryPartnerTaskId ? (
                                      <span
                                        className="view-order"
                                        onClick={() => {
                                          getCourior(order?._id);
                                        }}
                                      >
                                        View
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td> */}
                                  <td>
                                    {order?.orderDeliveryMode ===
                                      "SelfDelivery" &&
                                      ![
                                        "orderCancelled",
                                        "order-cancelled",
                                        "Cancelled"
                                      ].includes(order?.orderStatus) &&
                                      ![
                                        "order_cancelled",
                                        "Order Cancelled",
                                        "Cancelled"
                                      ].includes(order?.deliveryVendorStatus)
                                      &&
                                      ![
                                        "parcel_delivered",
                                        "Order-delivered",
                                      ].includes(order?.deliveryVendorStatus)
                                      && (
                                        <select
                                          onChange={(e) => {
                                            e.target.value !== "" &&
                                              updateOrderStatus(
                                                order,
                                                e.target.value
                                              );
                                            setselfDeliveryMode(e.target.value);
                                          }}
                                          value={
                                            order?.deliveryVendorStatus ===
                                              "parcel_picked_up"
                                              ? "Out-for-delivery"
                                              : ""
                                          }
                                        >
                                          <option value={""}>Select</option>
                                          <option
                                            value={"Out-for-delivery"}
                                            disabled={[
                                              "parcel_picked_up",
                                              "parcel_delivered",
                                              "Order-delivered"
                                            ].includes(
                                              order?.deliveryVendorStatus
                                            )}
                                          >
                                            Out for delivery
                                          </option>
                                          {order?.deliveryVendorStatus ===
                                            "parcel_picked_up" && (
                                              <option
                                                value={"Order-delivered"}
                                                disabled={
                                                  ["parcel_delivered", "Order-delivered"].includes(
                                                    order?.deliveryVendorStatus
                                                  ) ||
                                                  !order?.productDeliveryImage ||
                                                  order?.productDeliveryImage ===
                                                  ""
                                                }
                                              >
                                                Order delivered
                                              </option>
                                            )}
                                        </select>
                                      )}
                                  </td>
                                  <td>
                                    {Array.isArray(
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
                                          setorder_id(order?._id);
                                          setProductDeliveryImage(
                                            order?.productDeliveryImage
                                          );
                                        }}
                                      >
                                        {/* Upload Images */}
                                        {order?.kikoDeliveryStatusTracker.some(item => item.status === "parcel_delivered")
                                          ? "View Image"
                                          : "Upload Images"}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                </tr>
                              );
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
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={count}
            page={page}
          />
        </div>
      </div>
      {/* 
      <Modal
        isOpen={orderView}
        toggle={() => {
          setorderView(false);
        }}
        className="viewOrder"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3">
          <div className="view-order-modal">
          <ModalHeader className="ps-0 pe-0 d-flex justify-content-between align-items-center flex-wrap">
  <div style={{ width: "100%" }}>
    <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
      View Order
    </div>

    {singleOrderData?.orderPaymentMode === "SelfPayment" && (
      <div
      style={{
        display: "inline-block",
        border: "1px solid red",
        backgroundColor: "#fff",
        color: "red",
        padding: "6px 12px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "14px",
        marginTop: "6px",
      }}
      >
        COD Order – Please Collect Payment From The Buyer Upon Delivery.
      </div>
    )}
  </div>

  <img
    src={crossIcon}
    onClick={() => {
      setorderView(false);
    }}
    alt=""
    style={{ cursor: "pointer" }}
  />
</ModalHeader>

            <ModalBody className="p-0">       
              <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                <p className="m-0">
                  Order Id: <span>{singleOrderData?.orderId}</span>
                </p>
              </div>
              <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                <p className="m-0">
                  Customer Name: <span>{singleOrderData?.buyerName}</span>
                </p>
                <p className="m-0">
                  Mobile Number:{" "}
                  <span>{singleOrderData?.buyerPhoneNumber}</span>{" "}
                </p>
              </div>
              <p>
                Address :{" "}
                <span>
                  {singleOrderData?.userAddress?.address_line2
                    ? singleOrderData?.userAddress?.address_line2
                    : "" + "," + singleOrderData?.userAddress?.address_line1
                      ? singleOrderData?.userAddress?.address_line1
                      : ""}
                </span>
              </p>
              <div className="tabel-responsive">
                <table className="global-table">
                  <thead className="view-order-header">
                    <tr>
                      <th>Sr No.</th>
                      <th className="text-center">Product Name</th>
                      <th className="text-center">Net Weight</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody className="view-order-body">
                    {singleOrderData?.cartItem &&
                      singleOrderData?.cartItem.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th className="text-start">{index + 1}</th>
                            <td>{item?.id?.productName}</td>
                            <td>
                              {item?.id?.weight + " " + item?.id?.weightUnit}
                            </td>
                            <td>{item?.quantity?.count}</td>
                            <td className="text-end">{item?.price}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </ModalBody>
            <div className="d-flex align-items-center justify-content-between pt-2 pb-2 ps-2 pe-2">
              <span>Order amount</span>
              <span>₹{singleOrderData?.orderAmount}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
              <span>Delivery amount</span>
              <span>₹{singleOrderData?.shippingAmount}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
              <span>Tax</span>
              <span>₹ 0</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
              <span>Packing Fee</span>
              <span>₹ 0</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
              <span>Convenience Fee</span>
              <span>₹ 0</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
              <span>Sub Total</span>
              <span>₹   {(singleOrderData?.orderAmount +
                  singleOrderData?.shippingAmount).toFixed(2)}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
              <span>Authentication Charges</span>
              <span>₹ -1</span>
            </div>
            <ModalFooter
              className="justify-content-between footer-total-amount"
            >
              <p className="m-0">
                Total amount
              </p>
              <p className="m-0" >
                ₹
                {(singleOrderData?.orderAmount +
                  singleOrderData?.shippingAmount).toFixed(2)-1}
              </p>
            </ModalFooter>
            <div className="d-flex gap-2 justify-content-center mt-3">
              {!["order-cancelled", "orderCancelled","Cancelled"].includes(
                singleOrderData?.orderStatus
              ) &&
                Array.isArray(singleOrderData?.kikoDeliveryStatusTracker) &&
                !singleOrderData?.kikoDeliveryStatusTracker.some(
                  (item) =>
                    item.status === "courier_assigned" ||
                    item.status === "parcel_picked_up"
                ) &&
                !["order_cancelled", "parcel_delivered", "Order-delivered"].includes(
                  singleOrderData?.deliveryVendorStatus
                ) && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setorderView(false);
                      setopenRejectBtn(true);
                    }}
                  >
                    {" "}
                    {loading && <Spin indicator={antIcon} />}Cancel
                  </button>
                )}
              {["order-place", "payment-completed"].includes(
                singleOrderData?.orderStatus
              ) &&
                !["order_cancelled", "parcel_delivered", "Order-delivered"].includes(
                  singleOrderData?.deliveryVendorStatus
                ) && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      setorderView(false);
                      setAccept(true);
                    }}
                  >
                    Accept
                  </button>
                )}
            </div>
          </div>
        </div>
      </Modal> */}
      <Modal
        isOpen={orderView}
        toggle={() => {
          setorderView(false);
        }}
        className="viewOrder"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3">
          <div className="view-order-modal">
            <ModalHeader className="ps-0 pe-0 d-flex justify-content-between align-items-center">
              <div style={{ width: "100%" }}>
                <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  View Order
                  <img
                    src={crossIcon}
                    onClick={() => {
                      setorderView(false);
                    }}
                    alt=""
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {singleOrderData?.orderPaymentMode === "SelfPayment" && (
                  <div
                    style={{
                      border: "1px solid red",
                      backgroundColor: "#fff",
                      color: "red",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    COD Order – Please Collect Payment From The Buyer Upon Delivery.
                  </div>
                )}

              </div>


            </ModalHeader>

            <ModalBody className="p-0">
              <div className="pt-2 pb-2">
                <p className="m-0">
                  Order Id: <span>{singleOrderData?.orderId}</span>
                </p>
              </div>
              <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                <p className="m-0">
                  Buyer Name: <span>{singleOrderData?.buyerName}</span>
                </p>
                <p className="m-0">
                  Mobile Number: <span>{singleOrderData?.buyerPhoneNumber}</span>
                </p>
              </div>
              <p className="m-0 pb-2">
                Address: <span>{singleOrderData?.userAddress?.address_line1}{singleOrderData?.userAddress?.address_line2 ? `, ${singleOrderData?.userAddress?.address_line2}` : ''}</span>
              </p>

              <div className="table-responsive">
                <table className="global-table w-100">
                  <thead className="view-order-header bg-light">
                    <tr>
                      <th>Sr.no</th>
                      <th>Product Name</th>
                      <th>Net Weight</th>
                      <th>Qty</th>
                      <th className="text-end">Selling Price</th>
                    </tr>
                  </thead>
                  <tbody className="view-order-body">
                    {singleOrderData?.cartItem &&
                      singleOrderData?.cartItem.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.id?.productName}</td>
                            <td>{item?.id?.weight + " " + item?.id?.weightUnit}</td>
                            <td>{item?.quantity?.count}</td>
                            <td className="text-end">{item?.price}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </ModalBody>

            <div className="p-2">
              <div className="d-flex align-items-center justify-content-between py-2">
                <span>Order Amount</span>
                <span>₹{singleOrderData?.orderAmount}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between border-top border-bottom py-2">
                <span>Delivery Amount</span>
                <span>₹{singleOrderData?.shippingAmount}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between border-bottom py-2 fw-bold">
                <span>Sub Total</span>
                <span>₹{(singleOrderData?.orderAmount + singleOrderData?.shippingAmount).toFixed(2)}</span>
              </div>
              {singleOrderData?.orderPaymentMode === "SelfPayment" && (
                <div className="d-flex align-items-center justify-content-between border-bottom py-2 fw-bold">
                  <span>Authentication Charges</span>
                  <span>₹-1.00</span>
                </div>
              )}

              <div className="d-flex align-items-center justify-content-between pt-2 pb-2 fw-bold">
                <span>Total Amount</span>
                <span>
                  ₹
                  {(
                    singleOrderData?.orderAmount +
                    singleOrderData?.shippingAmount -
                    (singleOrderData?.orderPaymentMode === "SelfPayment" ? 1 : 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center mt-2 mb-3">
              {!["order-cancelled", "orderCancelled", "Cancelled"].includes(
                singleOrderData?.orderStatus
              ) &&
                Array.isArray(singleOrderData?.kikoDeliveryStatusTracker) &&
                !singleOrderData?.kikoDeliveryStatusTracker.some(
                  (item) =>
                    item.status === "courier_assigned" ||
                    item.status === "parcel_picked_up"
                ) &&
                !["order_cancelled", "parcel_delivered", "Order-delivered"].includes(
                  singleOrderData?.deliveryVendorStatus
                ) && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setorderView(false);
                      setopenRejectBtn(true);
                    }}
                  >
                    Cancel
                  </button>
                )}
              {["order-place", "payment-completed"].includes(
                singleOrderData?.orderStatus
              ) &&
                !["order_cancelled", "parcel_delivered", "Order-delivered"].includes(
                  singleOrderData?.deliveryVendorStatus
                ) && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setorderView(false);
                      setAccept(true);
                    }}
                  >
                    Accept
                  </button>
                )}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openAccept}
        onClose={() => {
          setAccept(false);
          setLoading(true);
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
                  setAccept(false);
                  setPackingPopup(true);
                }}
                id="no"
                name="radio-group"
              />
              <label for="no">No</label>
              <input
                type="radio"
                checked={orderPacked}
                onClick={() => {
                  setOrderPacked(true);
                }}
                name="radio-group"
              />
              <label
                for="yes"
                onClick={() => {
                  setOrderPacked(true);
                }}
              >
                Yes
              </label>
            </form>
          </div>
          <div className="delivery-option">
            <h4 className="text-center mb-3">Select Delivery Option</h4>
            <div className="options-block">
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
                <label for="selfdelivery">Self Delivery</label>
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
              </div>
              {(singleOrderData?.kiranaProOrderId && singleOrderData?.kiranaProOrderId !== "") ?
                <div className="type">
                  <input
                    type="radio"
                    id="kikodelivery"
                    checked={orderDeliveryMode === "MP2Delivery"}
                    onClick={() => {
                      setorderDeliveryMode("MP2Delivery");
                    }}
                    name="radio-group"
                  />
                  <label for="kikodelivery">Mp2 Delivery</label>
                  <p className="mb-0 mt-1 SelectDelivery">
                    <img src={infoIcon} alt="" /> What is Mp2 Delivery
                    <div className="SelectDeliveryInfo">
                      <ul>
                        <li>
                          Mp2 live provides{" "}
                          <span>delivery services at affordable rates</span>.
                        </li>
                        <li>Approx. delivery time: 45 mins to 1 hour.</li>
                        <li>
                          <span>Live Tracking feature</span>.
                        </li>
                      </ul>
                    </div>
                  </p>
                </div> :
                null
                // <div className="type">
                //   <input
                //     type="radio"
                //     id="kikodelivery"
                //     checked={orderDeliveryMode === "KikoDelivery"}
                //     onClick={() => {
                //       setorderDeliveryMode("KikoDelivery");
                //     }}
                //     name="radio-group"
                //   />
                //   <label for="kikodelivery">Kiko Delivery</label>
                //   <p className="mb-0 mt-1 SelectDelivery">
                //     <img src={infoIcon} alt="" /> What is Kiko Delivery
                //     <div className="SelectDeliveryInfo">
                //       <ul>
                //         <li>
                //           Kiko live provides{" "}
                //           <span>delivery services at affordable rates</span>.
                //         </li>
                //         <li>Approx. delivery time: 45 mins to 1 hour.</li>
                //         <li>
                //           <span>Live Tracking feature</span>.
                //         </li>
                //       </ul>
                //     </div>
                //   </p>
                // </div>
              }

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
          </div>
          <div className="text-center">
            <button
              className=" btn btn-md btn-secondary"
              disabled={!orderPacked || orderDeliveryMode === "" || isDisable || loading || modalLoading}
              onClick={() => {
                if (orderDeliveryMode === "KikoDelivery") {
                  if (singleOrderData?.orderPaymentMode === "SelfPayment") {
                    setBuyerCollect(true);
                    setAccept(false);
                  } else {
                    setAccept(true);
                    deliveryEstimation();
                  }
                }
                else if (orderDeliveryMode === "OnNetworkDelivery") {
                  searchLogistic()
                }
                else if (orderDeliveryMode === "MP2Delivery") {
                  setBuyerCollect(true);
                  setAccept(false);
                }
                else {
                  setdeliveryChargesOpen(true);
                  setAccept(false)
                }
              }}
            >
              {(loading || modalLoading) && <Spin indicator={antIcon} />} Proceed
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openRejectBtn}
        onClose={() => {
          setopenRejectBtn(false);
          setorderDeliveryMode("");
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
                getCancel();
              }}
            >
              {loading && <Spin indicator={antIcon} className="me-2" />}Yes
            </button>
            <button
              className="btn btn-sm btn-success"
              disabled={loading}
              onClick={() => {
                setopenRejectBtn(false);
                setorderDeliveryMode("");
              }}
            >
              No
            </button>
          </div>
        </div>
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
        isOpen={courierModal}
        toggle={() => {
          setcourierModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        className="view-popup-modal auto-adjust-modal"
        centered
        size="lg"
      >
        {modalLoading ? (
          <Spin indicator={antIcon} className="me-2" />
        ) : (
          <div className="container">
            <ModalHeader className="ps-0 pe-0 Courier-info">
              Courier Info
              {(onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" || couriorData?.pickupOtp) &&
                <> (PickUp Otp-{onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.startInstructions?.short_desc : couriorData?.pickupOtp})</>
              }
              <img
                src={crossIcon}
                onClick={() => {
                  setcourierModal(false);
                }}
                alt=""
              />
            </ModalHeader>
            {(couriorData?.courierinfo?.name || onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") ? (
              <div className="view-popup">
                <div>
                  {(couriorData?.courierinfo?.id || onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") && <div className="textAlign">
                    <h5>Id :</h5>
                    <p>
                      {onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticProviderName?.long_desc : couriorData?.courierinfo?.id ?? "NA"}
                    </p>
                  </div>}
                  {(couriorData?.courierinfo?.name || onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") && <div className="textAlign">
                    <h5>Name :</h5>
                    <p>
                      {onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name ?? "NA" : couriorData?.courierinfo?.name ?? "NA"}
                    </p>
                  </div>}
                  {(couriorData?.courierinfo?.phone || (onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery")) && <div
                    className="textAlign"
                    onClick={() => {
                      const phoneNumber = (onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone : couriorData?.courierinfo?.phone)
                      makePhoneCall(phoneNumber);
                    }}
                  >
                    <h5>Mobile :</h5>
                    <p>{onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPCourierInfo?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone ?? "NA" : couriorData?.courierinfo?.phone ?? "NA"}</p>
                  </div>}
                  {(couriorData?.courierinfo?.trackingUrl) || ((onNetworkLSPTrackUrl && onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery") && (onNetworkLSPCourierInfo?.deliveryVendorStatus !== "parcel_delivered")) &&
                    <div className="textAlign m-0">
                      <button className="btn btn-sm btn-primary">
                        <a
                          href={onNetworkLSPCourierInfo?.orderDeliveryMode === "OnNetworkDelivery" ? onNetworkLSPTrackUrl : couriorData?.courierinfo?.trackingUrl}
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
              <div className="view-popup justify-content-center">
                <div className="courier-partner-msg">
                  <h5 className="m-0 text-center not-assigned ">
                    Courier Partner is not Assigned yet !
                  </h5>
                </div>
              </div>
            )}
          </div>
        )}
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
                  kikoOrders();
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
            <h5>{pickUpReason ? pickUpReason : "-"}</h5>
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

      <PermissionAlertP
        permissionAlertPopUp={permissionAlertPopUp}
        setPermissionAlertPopUp={setPermissionAlertPopUp}
      />

      <Modal
        isOpen={uploadImage}
        toggle={() => {
          setUploadImage(false);
          setorderImage("")
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="sm"
      >
        <div className="container pb-3 pt-3">
          <div className="upload-image-modal">
            <div className="preview-image">
              {orderImage && <img src={orderImage} className="logoimg" />}
              {!orderImage && productDeliveryImage && (
                <img src={productDeliveryImage} className="logoimg" alt="" />
              )}
            </div>
            <button className="btn btn-lg btn-primary p-0 uploadBtn d-flex m-auto"
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
              {isDisable && isSpin === "uploadImage" ? (
                <Space
                  size="middle"
                  className="Loader"
                  style={{ left: "2px", top: "8px" }}
                >
                  <div>
                    {" "}
                    <Spin size="medium" className="spiner" />
                  </div>
                </Space>
              ) : (
                ""
              )}{" "}
              {/* <input
                type="file"
                onChange={(e) => {
                  addUpdateImage(e.target.files[0], "uploadImage");
                }}
              // disabled={isDisable}
              /> */}
              <p className="upload-img">
                Upload confirmation Image
                <Camera className="ms-2 Icon" />
              </p>
            </button>
            {orderImage && (
              <div className="text-center">
                <button
                  className="btn btn-lg btn-primary mt-2"
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
        isOpen={packingPopup}
        onClose={() => {
          setPackingPopup(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="delivery-option">
            <h4 className="text-center mb-0">
              After packing the order, please click on "View Order" to begin the
              delivery process.
            </h4>
            <div className="options-block"></div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setPackingPopup(false);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openSelfDelivery}
        onClose={() => {
          setopenSelfDelivery(false);
        }}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container py-4 ps-3 pe-3">
          <div className="mt-2">
            <h5 className="text-center mb-0">
              Please Select Self Delivery for Pan-India delivery.
            </h5>
            <div className="options-block"></div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4">
            <button
              className="btn btn-sm btn-danger"
              disabled={loading}
              onClick={() => {
                setopenSelfDelivery(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={buyerCollect}
        onClose={() => {
          setBuyerCollect(false);
          setAccept(true);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="delivery-charge-modal ">
          <h4 className="mb-3">Do you wish to proceed with {orderDeliveryMode === "MP2Delivery" ? "MP2 delivery" : ""}?</h4>
          {orderDeliveryMode !== "MP2Delivery" && <ul
            style={{
              color: "red",
              paddingLeft: "13px",
              fontSize: "15px",
              textAlign: "left",
            }}
          >
            <li className="mb-2">
              Buyer has opted for <b>cash on delivery</b> as a payment mode,
              kindly make sure to <b>personally collect the order amount</b>{" "}
              from the buyer
            </li>
            <li>
              The {orderDeliveryMode === "MP2Delivery" ? "MP2" : "Kiko"} rider will not handle any money transactions, and it's
              important to inform the <b>buyer not to pay the kiko rider</b>.{" "}
            </li>
          </ul>}
          {orderDeliveryMode !== "MP2Delivery" && <div className="checkboxBlock">
            <input
              type="checkbox"
              checked={tearms_cond}
              onChange={(e) => settearms_cond(e.target.checked)}
            />
            <label className="terms-condition">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="termsCondition"
                style={{ textDecoration: "none" }}
                onClick={(e) => { e.preventDefault(); window.open("/terms-condition", "_blank") }}
              >
                {" "}
                I accept all delivery term & conditions{" "}
              </a>
            </label>
          </div>}
          <div className="mt-3">
            <button
              className="btn btn-sm btn-outline me-2"
              onClick={() => {
                setBuyerCollect(false);
                setAccept(true);
              }}
            >
              Back
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                if (orderDeliveryMode === "MP2Delivery") {
                  mp2Logistic();
                }
                else {
                  deliveryEstimation();
                  setBuyerCollect(false);
                  setAccept(true);
                }
              }}
              disabled={!tearms_cond || loading || modalLoading}
            >
              {(loading || modalLoading) && <Spin indicator={antIcon} />} Proceed
            </button>
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
              }}
              className="btn btn-danger w-100"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deliveryChargesOpen}
        className="viewOrder"
        onClose={() => { setdeliveryChargesOpen(false); }}
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
                `Logistic Provider: ${logisticProviderName ? logisticProviderName : "-"}`
              )}
            </h5>
            {(orderDeliveryMode === "KikoDelivery" || orderDeliveryMode === "OnNetworkDelivery") && (
              <div className="delivery-rate">
                {orderDeliveryMode === "KikoDelivery" ?
                  <p>₹{singleOrderData?.shippingAmount}</p> :
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
            {/* <div className="options-block"></div> */}
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
    </>
  );
}
export default AdminOrders;
