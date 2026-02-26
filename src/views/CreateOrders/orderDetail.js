import React, { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import crossIcon from "../../images/cross-icon.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./styles.scss";
import { Spin } from "antd";
import cartIcon from "../../images/Inventry/cart-icon.png";
import {
  LoadingOutlined,
  LeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  PaginationFilter,
  notify,
  handleError,
  nomenclature,
} from "../../utils";
import { CSVLink } from "react-csv";
import html2pdf from "html2pdf.js"; // Only if using ES modules

function OrderDetail(props) {

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
  const navigate = useNavigate();
  const { state } = useLocation();
  const [user_data, setuser_data] = useState(getSellerDetails());
  const [componentMounted, setComponentMounted] = useState(false);
  const [page, setpage] = useState(1);
  const [orderView, setOrderView] = useState(false);
  const [childTable, setChildTable] = useState("");
  const [walletInsuffientModalVisible, setWalletInsuffientModalVisible] =
    useState(false);
  const [tripView, setTripView] = useState(false);
  const [initPopup, setInitPopup] = useState(false);
  const [trackingPopup, setTrackingPopup] = useState("");
  const [count, setCount] = useState(0);
  const [KikoOrderData, setKikoOrderData] = useState([]);
  const [status, setstatus] = useState("");
  const [logisticDetail, setLogisticDetail] = useState({});
  const [tableLoading, setTableloading] = useState(false);
  const [modalLoading, setModalLoading] = useState("");
  const [cancelLoading, setCancelLoading] = useState("");
  const [itemId, setItemId] = useState("");
  const [limit] = useState(20);
  const [singleTripData, setSingleTripData] = useState([]);
  const [selectVehicle, setSelectVehicle] = useState(false);
  const [storeDetail, setStoreDetail] = useState({});
  const [tripData, setTripData] = useState({});
  const [orderDeliveryMode, setOrderDeliveryMode] = useState({});
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [printQRModalVisible, setPrintQRModalVisible] = useState(false);
  const [printQrData, setPrintQrData] = useState({});
  const [deliveryTimeStamp, setDeliveryTimeStamp] = useState([]);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [tripId, setTripId] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(
    logisticDetail?.vehicalNumber ?? ""
  );
  const [orderId, setOrderId] = useState("")

  const handleSave = async() => {
    // 👉 call your save API here
    console.log("Saving:", vehicleNumber);
    let data = {
      vehicalNumber: vehicleNumber,
      _id: orderId,
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/updateVehicalNumber`,
      headers: {
        // Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      // if (response.data.success) {
      //   setTableloading(false);
      //   setKikoOrderData(response?.data?.data[0]);
      //   if (status && singleTripData?._id) {
      //     const tripData = response?.data?.data[0]?.orderTripsId?.find((item) => item?._id === singleTripData?._id)
      //     setSingleTripData(tripData)
      //   }
      // }
    } catch (error) {
      handleError(error);
    } finally {
      setTableloading(false);
    }
    setEditMode(false); // exit edit mode
  };
  const onPageChanged = (page) => {
    setpage(page);
  };

  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      const telUrl = `tel:${phoneNumber}`;
      window.open(telUrl, "_blank", "noopener,noreferrer");
    }
  };

  const sendOtpsToSellers = async () => {
    const token = getSellerToken();
    const _ids = singleTripData?.orderIds?.map((item) => item._id)
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/send-all-otps`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: { orderIds: _ids }
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        notify("success", `${response.data.message}`)
      }
    } catch (error) {
      handleError(error);
    }
  }

  const initiatePidgePickup = async (tripId) => {
    setModalLoading(tripId);
    setItemId(tripId);
    const token = getSellerToken();
    const data = {
      tripId: tripId,
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/pidge/get-delivery-charges`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      const res = response?.data?.response
      if (res?.success) {
        setOrderView(false);
        setInitPopup("");
        setTripId(tripId)
        setSelectVehicle(true);
        // setAvailableVehicles(res?.data);
        // setOrderDeliveryMode(res?.data?.[0]);
        setAvailableVehicles([
          {
            "name": "Pidge",
            "id": 1,
            "charge": 3500
          },
        ]);
        setOrderDeliveryMode({
          "name": "Pidge",
          "id": 1,
          "charge": 3500
        });
      } else {
        notify("error", `${res?.message}`);
        setInitPopup("");
        setOrderView(false);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setModalLoading("");
    }
  };

// Convert Excel serial to JS Date (robust)
function excelSerialToDate(serial) {
  if (serial === null || serial === undefined) return null;
  if (serial instanceof Date) return serial;

  // If it's a numeric-looking string, coerce
  const num = typeof serial === 'string' ? parseFloat(serial) : serial;
  if (isNaN(num)) return null;

  // Excel epoch: 1899-12-30 (this accounts for Excel's 1900 system)
  // Use UTC epoch to avoid local timezone shifting when constructing Date.
  const epochUtcMs = Date.UTC(1899, 11, 30, 0, 0, 0); // Dec 30, 1899 UTC

  const days = Math.floor(num);
  const fraction = num - days;

  // ms for whole days and ms for fractional day
  const wholeDaysMs = days * 86400000;
  const fracMs = Math.round(fraction * 86400000);

  // Build UTC milliseconds then create a Date from that
  const totalMsUtc = epochUtcMs + wholeDaysMs + fracMs;
  const d = new Date(totalMsUtc);

  return d; // a JS Date object (in your local tz when displayed), time preserved
}

// Helper to get only date portion as YYYY-MM-DD (no timezone jitter)
function excelSerialToDateString(serial) {
  const d = excelSerialToDate(serial);
  if (!d) return null;
  // Use UTC fields so the date part matches Excel's displayed date
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // "2025-07-10"
}

// Example:
console.log(excelSerialToDateString(45848)); // -> "2025-07-10"
console.log(excelSerialToDate(45848));       // -> Date object for 2025-07-10T00:00:00.000Z


  const initiatePidgeDelivery = async (orderId, orderTrips, tripId) => {
    setModalLoading(orderId);
    const token = getSellerToken();
    const lineItem = orderTrips?.find((item) => item._id == tripId)
    const lineItemsIds = lineItem?.orderIds.reduce((acc, item) => {
      acc[item.orderId] = item._id;
      return acc;
    }, {});
    const data = {
      _id: itemId,
      lineItemsIds: lineItemsIds
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/pidge/create-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      const res = response?.data?.response
      if (res?.success) {
        setSelectVehicle(false);
        notify("success", `${res?.message}`);
      } else {
        if (response?.data?.insufficientBalance) {
          setWalletInsuffientModalVisible(true);
        } else {
          notify("error", `${response?.data?.message}`);
        }
        setSelectVehicle(false);
      }
      fetchOrderDetail(false);
      setModalLoading("");
    } catch (error) {
      setModalLoading("");
      handleError(error);
    }
  };

  const cancelPidgeDelivery = async (id, orderId) => {
    setCancelLoading(orderId);
    const token = getSellerToken();
    const data = {
      pidgeId: id,
      orderId: orderId
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/pidge/cancel-order`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      const res = response?.data?.response
      if (res?.success) {
        setCancelLoading("");
        notify("success", `${res?.data?.data?.description}`);
      } else {
        notify("error", `${response?.data?.error?.message}`);
      }
      setCancelLoading("");
    } catch (error) {
      setCancelLoading("");
      handleError(error);
    }
  };

  const fetchOrderDetail = async (status) => {
    setTableloading(true);
    let orderId = state?.id;
    const token = getSellerToken();
    let data = {
      providerId: user_data && user_data._id ? user_data._id : "",
      _id: orderId,
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/getOrderDetails`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        setTableloading(false);
        setKikoOrderData(response?.data?.data[0]);
        if (status && singleTripData?._id) {
          const tripData = response?.data?.data[0]?.orderTripsId?.find((item) => item?._id === singleTripData?._id)
          setVehicleNumber(tripData?.vehicalNumber??"")
          setSingleTripData(tripData)
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setTableloading(false);
    }
  };

  useEffect(() => {
    if (componentMounted) {
      fetchOrderDetail(false);
    } else {
      setComponentMounted(true);
    }
  }, [componentMounted, status, page]);


  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify("success", "URL copied to clipboard");
      })
      .catch((err) => {
        notify("error", "Failed to copy URL");
      });
  };

  const checkDeliveryStatus = async (orderIds) => {
    const statusIds = orderIds?.map((item) => ({ _id: item?._id ?? "", pidgeId: item?.onNetworklogisticOrderId ?? "" }))
    setStatusLoading(true);
    try {
      const promises = statusIds.map((item) => {
        const token = getSellerToken();
        const data = {
          _id: item._id,
          pidgeId: item.pidgeId,
        };
        const options = {
          method: "post",
          url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/pidge/get-status`,
          headers: {
            Authorization: `${token}`,
            desktop: true,
          },
          data: data,
        };
        return axios(options)
          .then((response) => {
            const res = response.data.data;
            return res;
          })
          .catch((error) => {
            notify("error", `Failed to update status for ${item?.pidgeId}`);
            return null; // so Promise.all doesn't break
          });
      });
      const results = await Promise.all(promises);
      notify("success", `status updated successfully`);
      setStatusLoading(false);
      fetchOrderDetail(true)
    } catch (error) {
      setStatusLoading(false);
    }
  }

  const handlePrint = () => {
    const element = document.getElementById("printable-content").innerHTML;
    // const opt = {
    //   margin: 0.3,
    //   filename: "order-details.pdf",
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale:  1 },
    //   jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
    //     pagebreak: { mode: ["css", "legacy"] } // ✅ handles long tables

    // };

    // html2pdf().set(opt).from(content).save();
      const opt = {
    margin:0.2, // margin in pt
    filename: `${KikoOrderData?.orderId}-${moment(KikoOrderData?.createdAt)?.format("YYYY-MM-DD")}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 1.5, // higher scale for clarity
      useCORS: true, // if images are from external source
      scrollY: -window.scrollY, // ensures full content
    },
    jsPDF: {
      unit: "pt",
      format: "a4",
      orientation: "landscape",
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save();

  };

  const handlePrintQR = () => {
    setPrintQRModalVisible(true);
  };
  const sendToAdloggs = async () => {
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/send-csv-to-adloggs`,
      headers: {
        desktop: true,
      },
      data: { b2bTripId: singleTripData._id },
    };
    const response = await axios(options);
  };
  const handlePrintQRCode = async () => {
    setTableloading(true);
    const token = getSellerToken();
    let data = singleTripData?.orderIds?.map((item) => ({
      _id: item?._id,
      invoiceId: item?.orderId,
      count: item?.printCount || 1,
    }));
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/generate-qr-code`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderData: data,
        b2bTripId: singleTripData._id,
        b2bShipmentOrderId: KikoOrderData?.orderId,
      },
    };
    try {
      const response = await axios(options);
      if (response.data) {
        setTableloading(false);
        setPrintQrData(response?.data?.orderDetails);
        let content = "";
        let blockCounter = 0;
        let pageContent = "";

        const orderDetails = response?.data?.orderDetails || [];
        let totalBlocks = orderDetails.reduce(
          (sum, item) => sum + (item?.count || 1),
          0
        );
        let currentBlock = 0;

        for (let i = 0; i < orderDetails.length; i++) {
          const count = orderDetails[i]?.count || 1;
          for (let j = 0; j < count; j++) {
            currentBlock++;
            pageContent += `
            <div class="column-container">
                <div class="qr-container">
                <img src="${orderDetails[i]?.qrCode}" alt="QR Code" />
                </div>
                <div class="info-container">
                <p><strong>Store Name:</strong> ${orderDetails[i]?.storeName}</p>
                <p><strong>Invoice No:</strong> ${orderDetails[i]?.invoideNumber}</p>
                <p><strong>Store No:</strong> ${orderDetails[i]?.storeMobile}</p>
                <p><strong>Box Qty:</strong> ${j + 1}/${count}</p>
                </div>
            </div>
            `;
            // When 4 blocks filled or it's the last block
            if (currentBlock % 4 === 0 || currentBlock === totalBlocks) {
              const addBreak = currentBlock !== totalBlocks;
              content += `<div class="page${addBreak ? " page-break" : ""
                }">${pageContent}</div>`;
              pageContent = "";
            }
          }
        }

        let finalHTML = `
            <html>
            <head>
                <title>Order Details</title>
            <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
            }
            .page {
                width: 210mm;
                height: 297mm;
                display: flex;
                flex-wrap: wrap;
                align-items: start;
                padding: 10mm;
                box-sizing: border-box;
            }
            .page-break {
                page-break-after: avoid;
            }
            .column-container {
                width: calc(50% - 10px);
                display: flex;
                flex-direction: column;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                margin: 5px;
                box-sizing: border-box;
            }
            .qr-container img {
                width: 100%;
                height: auto;
                display: block;
            }
            .info-container p {
                margin: 0 0 5px;
            }
            </style>
                </head>
            <body>
                <div class="parent-container">
                ${content}
                </div>
            </body>
            </html>
            `;

        const opt = {
          margin: 0,
          filename: "order-details.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(finalHTML).save();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setTableloading(false);
    }
  };

  const headers = [
    { label: "Sr No.", key: "srNo" },
    { label: "Store Name", key: "storeName" },
    { label: "Store Mobile", key: "storeMobile" },
    { label: "Order ID", key: "orderId" },
    { label: "Invoice ID", key: "invoiceId" },
    { label: "Billing Date", key: "billingDate" },
    { label: "Status", key: "status" },
    { label: "Store Address", key: "storeAddress" },
    { label: "Category", key: "category" },
    { label: "Item description", key: "itemDescription" },
    // { label: "Invoice Id", key: "invoiceId" },
    { label: "Invoice Value", key: "netInvoiceValue" },
    { label: "Quantity", key: "quantity" },
    { label: "UOM", key: "uom" },
    { label: "Total CFC", key: "totalCFC" },
    { label: "CFC", key: "CFCConversion" },
    { label: "PAC", key: "PACConversion" },
    { label: "Weight", key: "weight" },
  ];

  const csvData =
    singleTripData?.orderIds?.flatMap((item) =>
      item?.lineItems?.map((order, index) => ({
        srNo: index + 1,
        storeName: item?.storeName,
        storeMobile: item?.storeMobile,
        orderId: item?.orderId,
        invoiceId: item?.invoiceId,
        billingDate:item?.billingDate?.length <=8 ? excelSerialToDateString(item?.billingDate): item?.billingDate?.replace("0:00",""),
        status: nomenclature(item?.orderStatus),
        storeAddress: item?.storeAddress,
        category: order?.category,
        itemDescription: order?.itemDescription || "-",
        invoiceId: order?.invoiceId,
        netInvoiceValue: parseFloat(order?.netInvoiceValue).toFixed(2),
        quantity: order?.quantity,
        uom: order?.uom,
        totalCFC: parseFloat(order?.totalCFC).toFixed(2),
        CFCConversion: parseFloat(order?.CFCConversion).toFixed(2),
        PACConversion: parseFloat(order?.PACConversion).toFixed(2),
        weight: `${parseFloat(order?.weight).toFixed(2)} ${order?.weightUnit}`,
      }))
    ) || [];

  const handlePrintCountMinus = (index) => {
    const updated = { ...singleTripData };
    updated.orderIds = updated.orderIds.map((itm, idx) =>
      idx === index
        ? {
          ...itm,
          printCount: Math.max((itm.printCount || 1) - 1, 1),
        }
        : itm
    );
    setSingleTripData(updated);
  };

  const handlePrintCountPlus = (index) => {
    const updated = { ...singleTripData };
    updated.orderIds = updated.orderIds.map((itm, idx) =>
      idx === index
        ? {
          ...itm,
          printCount: Math.min((itm.printCount || 1) + 1, 99),
        }
        : itm
    );
    setSingleTripData(updated);
  };

  const handlePrintCountChange = (e, index) => {
    let val = e.target.value;

    if (val === "") {
      const updated = { ...singleTripData };
      updated.orderIds = updated.orderIds.map((itm, idx) =>
        idx === index ? { ...itm, printCount: "" } : itm
      );
      setSingleTripData(updated);
      return;
    }
    if (!/^\d+$/.test(val)) {
      return;
    }
    if (Number(val) > 99) {
      return;
    }

    const updated = { ...singleTripData };
    updated.orderIds = updated.orderIds.map((itm, idx) =>
      idx === index ? { ...itm, printCount: Number(val) } : itm
    );
    setSingleTripData(updated);
  };

  const handlePrintCountBlur = (e, index) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 99) val = 99;
    const updated = { ...singleTripData };
    updated.orderIds = updated.orderIds.map((itm, idx) =>
      idx === index ? { ...itm, printCount: val } : itm
    );
    setSingleTripData(updated);
  };

  const resetPrintCounts = () => {
    if (!singleTripData?.orderIds) return;
    const updated = {
      ...singleTripData,
      orderIds: singleTripData.orderIds.map((itm) => ({
        ...itm,
        printCount: 1,
      })),
    };
    setSingleTripData(updated);
  };
  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="RightBlock">
        <div className="order-section">
          <div className="section-title">
            <h1 className="m-0">
              <LeftOutlined
                onClick={() => navigate("/create-orders")}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  color: "black",
                  fontSize: "14px",
                }}
              />
              Order Details
            </h1>
            <div style={{ display: "none" }}></div>
          </div>
          <div className="col-lg-12 p-0">
            <div className="section-title">
              <h1 className="m-0">Shipment ID: {KikoOrderData?.orderId} </h1>
              <div style={{ display: "none" }}></div>
            </div>
            <div className="tab-content">
              <div id="home" className="tab-pane active">
                {KikoOrderData?.orderTripsId?.length > 0 ? (
                  <div className="table-responsive">
                    {tableLoading ? (
                      <Spin indicator={antIcon} className="loader" />
                    ) : (
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th scope="col">Sr No.</th>
                            <th scope="col">Trip Id</th>
                            <th scope="col">Shipment Created Date & Time</th>
                            <th scope="col">Shipment Delivered Date & Time</th>
                            <th scope="col">Shipment Status</th>
                            <th scope="col">Initiate Pickup</th>
                            <th scope="col">Total Drop Points</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Trip Distance</th>
                            <th scope="col">Total Weight</th>
                            <th scope="col">Total Time</th>
                            <th scope="col">Order Details</th>
                            <th scope="col">Tracking URLs</th>
                            <th scope="col">Logistics Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {KikoOrderData?.orderTripsId?.map((order, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <th >{order?.tripOrderId ? order?.tripOrderId: "-"}</th>
                                <td>
                                  {moment(order?.createdAt).format(
                                    "DD MMMM YYYY"
                                  ) +
                                    " at " +
                                    moment(order?.createdAt).format("hh:mm A")}
                                </td>
                                <td>
                                  { order?.onNetworklogisticData?.onNetworklogisticStatus === "parcel_delivered" ? moment(order?.updatedAt).format(
                                    "DD MMMM YYYY"
                                  ) +
                                    " at " +
                                    moment(order?.updatedAt).format("hh:mm A"):'-'}
                                </td>
                                <td>
                                  {
                                    order?.onNetworklogisticData?.onNetworklogisticStatus === "parcel_delivered" ? "Completed"
                                      : order?.onNetworklogisticData?.onNetworklogisticStatus === "in-progress"
                                        ? "In-Progress"
                                        : order?.onNetworklogisticData?.onNetworklogisticStatus
                                  }
                                </td>
                                <td>
                                  <button
                                    className="view-order"
                                    onClick={() => {
                                      setInitPopup(order._id);
                                      setTripData(order);
                                    }}
                                    disabled={
                                      order?.onNetworklogisticData?.isOnNetwork
                                    }
                                  >
                                    Initiate Pickup
                                  </button>
                                </td>
                                <td>{order?.orderIds?.length}</td>
                                <td>
                                  {order?.orderIds
                                    ?.map((item) =>
                                      item.lineItems.reduce(
                                        (a, b) =>
                                          a +
                                          parseFloat(b.netInvoiceValue || 0),
                                        0
                                      )
                                    )
                                    ?.reduce(
                                      (total, subTotal) => total + subTotal,
                                      0
                                    )
                                    ?.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                </td>

                                <td>{order?.totalDistanceText}</td>
                                <td>{order?.totalWeight.toFixed(2) + " kg"}</td>
                                <td>{order?.totalDurationText}</td>
                                <td>
                                  <span
                                    className="btn btn-sm btn-outline shipment-status-btn"
                                    onClick={() => {
                                      setTripView(true);
                                      setSingleTripData(order);
                                    }}
                                  >
                                    View Order
                                  </span>
                                </td>
                                <td
                                  onClick={() =>
                                    // order?.onNetworklogisticData
                                    //   ?.onNetworklogisticOrderId
                                    //   ? 
                                      setTrackingPopup(order._id)
                                      // : null
                                  }
                                >
                                  <span
                                    className={
                                      // order?.onNetworklogisticData
                                      //   ?.onNetworklogisticOrderId
                                        // ? 
                                        "table-link-items"
                                        // : ""
                                    }
                                  >
                                    {"Track"}
                                  </span>
                                </td>
                                <td>
                                  {
                                    order?.onNetworklogisticData
                                      ?.onNetworklogisticFulfillmentData
                                      ?.agentDetails?.name ? (
                                      <span
                                        className="view-order view-order-link"
                                        onClick={() => {
                                          setLogisticDetail(
                                            order?.onNetworklogisticData
                                              ?.onNetworklogisticFulfillmentData
                                              ?.agentDetails
                                          );
                                          setVehicleNumber(order?.vehicalNumber)
                                          setOrderId(order?._id)
                                        }}
                                      >
                                        View
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
        <div style={{ display: "none"  }} id="printable-content">
          <div className="table-responsive">
              <div className="order-table-header">
              <h3><b>Order Details</b></h3>

              {
                <>                <p>
                  Shipment ID: {KikoOrderData?.orderId} | Trip Distance:{" "}
                  {singleTripData?.totalDistanceText} | Trip Weight:{" "}
                  {singleTripData?.totalWeight?.toFixed(2)} | Trip Duration:{" "}
                  {singleTripData?.totalDurationText}{" "}
                  {/* <div>        */}
             | Vehicle Number: {singleTripData?.vehicalNumber} | Driver Name: {singleTripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name} |
                Driver Number: {singleTripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone}
            {/* </div> */}
                </p>
                </>
              }
            </div>
            <Table className="global-table modal-table-main">
              <thead
                style={{
                  borderBottom: "1px solid #ececec",
                  pageBreakBefore: "auto",
                  pageBreakInside: "avoid",
                }}
              >
                <tr>
                  <th style={{ textAlign: "center" }}>Sr No.</th>
                  <th style={{ textAlign: "center" }}>Store Name</th>
                  <th style={{ textAlign: "center" }}>Store Number</th>
                  <th style={{ textAlign: "center" }}>Order ID</th>
                  <th style={{ textAlign: "center" }}>Address</th>
                  <th style={{ textAlign: "center" }}>Vehical Number</th>
                  <th style={{ textAlign: "center" }}>Driver Name</th>
                  <th style={{ textAlign: "center" }}>Driver Number</th>
                  {/* <th style={{ textAlign: "center" }}>Status</th> */}
                </tr>
              </thead>
              <tbody>
                {singleTripData?.orderIds?.length > 0 &&
                  singleTripData?.orderIds?.map((item, index) => {
                    return (
                      <>
                        <tr className="parent-tr-row" key={index}>
                          <td
                            className="text-start"
                            style={{ fontWeight: "bold" }}
                          >
                            {index + 1}
                          </td>
                          <td style={{
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                            width: 120,
                                          }}className="whiteSpace--nowrap">
                            {item?.storeName}
                          </td>
                          <td>{item?.storeMobile}</td>
                          <td>{item?.orderId}</td>
                          <td>{item?.storeAddress}</td>
                          <td>{singleTripData?.vehicalNumber}</td>
                          <td
                            >
                                {singleTripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name || "-"}
                            </td>
                            <td>{singleTripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone}</td>
                            {/* <td>{item?.onNetworklogisticStatus ?? ""}</td> */}
                        </tr>
                        <tr
                          className="child-row"
                          style={{
                            color: "green",
                          }}
                        >
                          <td colSpan={8} className="p-0">
                            <table className="table">
                              <thead
                                style={{ borderBottom: "1px solid #ececec" }}
                              >
                                <tr>
                                  <th
                                    className="text-start"
                                    style={{ textAlign: "left" }}
                                  >
                                    Category
                                  </th>
                                  <th style={{ textAlign: "left" }}>
                                    Item description
                                  </th>
                                  <th style={{ textAlign: "left" }}>
                                    Invoice Id
                                  </th>
                                  <th style={{ textAlign: "left" }}>
                                    Invoice Value
                                  </th>
                                  <th style={{ textAlign: "left" }}>
                                    Quantity
                                  </th>
                                  <th style={{ textAlign: "left" }}>UOM</th>
                                  <th style={{ textAlign: "left" }}>
                                    Total CFC
                                  </th>
                                  <th style={{ textAlign: "left" }}>CFC</th>
                                  <th style={{ textAlign: "left" }}>PAC</th>
                                  <th style={{ textAlign: "left" }}>Weight</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item?.lineItems?.map((order) => {
                                  return (
                                    <tr>
                                      <td className="text-start">
                                        {order?.category}
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                            width: 120,
                                          }}
                                        >
                                          {order?.itemDescription
                                            ? order.itemDescription
                                            : "-"}
                                        </div>
                                      </td>
                                      <td>{order?.invoiceId}</td>
                                      <td>
                                        {parseFloat(
                                          order?.netInvoiceValue
                                        ).toFixed(2)}
                                      </td>
                                      <td>{order?.quantity}</td>
                                      <td>{order?.uom}</td>
                                      <td>
                                        {parseFloat(order?.totalCFC)?.toFixed(
                                          2
                                        )}
                                      </td>
                                      <td>
                                        {parseFloat(
                                          order?.CFCConversion
                                        )?.toFixed(2)}
                                      </td>
                                      <td>
                                        {parseFloat(
                                          order?.PACConversion
                                        )?.toFixed(2)}
                                      </td>
                                      <td>
                                        {parseFloat(order?.weight).toFixed(2) +
                                          " " +
                                          order?.weightUnit}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="text-left">
                                  <th
                                    className="text-left"
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    Total
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    -
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    -
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    {parseFloat(
                                      item?.lineItems?.reduce(
                                        (total, order) =>
                                          total +
                                          (Number(order?.netInvoiceValue) || 0),
                                        0
                                      )
                                    ).toFixed(2)}
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    {item?.lineItems?.reduce(
                                      (total, order) =>
                                        total + (Number(order?.quantity) || 0),
                                      0
                                    )}
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    -
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    -
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    -
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    -
                                  </th>
                                  <th
                                    style={{ borderBottom: "1px solid #111" }}
                                  >
                                    {parseFloat(
                                      item?.lineItems?.reduce(
                                        (total, order) =>
                                          total + (Number(order?.weight) || 0),
                                        0
                                      )
                                    ).toFixed(2)}
                                    {item?.lineItems?.length > 0
                                      ? " " + item?.lineItems[0]?.weightUnit
                                      : ""}
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
        <Modal
          isOpen={orderView}
          toggle={() => {
            setOrderView(false);
          }}
          className="viewOrder"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container pb-3">
            <div className="view-order-modal">
              <ModalHeader className="ps-0 pe-0">
                Order Details
                <img
                  src={crossIcon}
                  onClick={() => {
                    setOrderView(false);
                    setItemId("");
                  }}
                  alt=""
                />
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="order-items-list-container">
                  {KikoOrderData?.orderTripsId &&
                    KikoOrderData?.orderTripsId.map((item, index) => {
                      return (
                        <div>
                          <div className="tabel-responsive">
                            <table className="global-table">
                              <thead className="view-order-header">
                                <tr>
                                  <th>Item Code</th>
                                  <th className="text-center">Product Name</th>
                                  <th className="text-center">Net Weight</th>
                                  <th className="text-center">Quantity</th>
                                  <th className="text-end">Invoice Value</th>
                                </tr>
                              </thead>
                              <tbody className="view-order-body">
                                {storeDetail?.lineItems &&
                                  storeDetail?.lineItems.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <th className="text-start">
                                          {item?.itemCode}
                                        </th>
                                        <td>{item?.category}</td>
                                        <td>
                                          {item?.weight +
                                            " " +
                                            item?.weightUnit}
                                        </td>
                                        <td>{item?.quantity}</td>
                                        <td className="text-end">
                                          {parseFloat(
                                            item?.netInvoiceValue
                                          ).toFixed(2)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ModalBody>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={tripView}
          toggle={() => {
            setTripView(false);
          }}
          className="viewOrder order-modal-xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size="xl"
        >
          <ModalHeader className="modal-header w-100">
            <div className="order-table-header">
              Order Details

              {
                <>                <p>
                  Shipment ID: {KikoOrderData?.orderId} | Trip Distance:{" "}
                  {singleTripData?.totalDistanceText} | Trip Weight:{" "}
                  {singleTripData?.totalWeight?.toFixed(2)} | Trip Duration:{" "}
                  {singleTripData?.totalDurationText}{" "}
                  <div>       
              <p><b>Vehicle Number: {singleTripData?.vehicalNumber} | Driver Name: {singleTripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name} |
                </b></p><p><b> Driver Number: {singleTripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone}</b></p>
            </div>
                </p>
                </>
              }
            </div>

            <div className="gap-3 d-flex">
              {singleTripData?.onNetworklogisticData?.isOnNetwork &&
                <button disabled={statusLoading} className="view-order" onClick={() => { checkDeliveryStatus(singleTripData?.orderIds) }}>
                  {statusLoading ? <Spin indicator={antIcon} size="small" /> : "Check Delivery Status"}
                </button>}
              <button className="view-order" onClick={handlePrint}>
                Print
              </button>
              <button className="view-order" onClick={handlePrintQR}>
                Print QR
              </button>
              <button className="view-order" onClick={() => sendOtpsToSellers()}>
                Send OTPs to Sellers
              </button>
              <CSVLink
                data={csvData}
                headers={headers}
                filename={`order_details_${KikoOrderData?.orderId}.csv`}
                className="btn btn-primary"
                style={{ marginLeft: "10px" }}
              >
                Export
              </CSVLink>
              <img
                src={crossIcon}
                onClick={() => {
                  setTripView(false);
                }}
                alt=""
              />
            </div>
                  
          </ModalHeader>
                
          <ModalBody className="p-0 w-100">
            <div className="tabel-responsive">
              <Table className="global-table modal-table-main">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Store Name</th>
                    <th>Store Number</th>
                    <th>Order ID</th>
                    <th>Invoice ID</th>
                    <th>Billing Date</th>
                    <th>Tracking ID</th>
                    <th>OTP</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>View Orders</th>
                    <th>Address</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  {singleTripData?.orderIds?.length > 0 &&
                    singleTripData?.orderIds?.map((item, index) => {
                      return (
                        <>
                          <tr className="parent-tr-row" key={index}>
                            <td className="text-start">{index + 1}</td>
                            <td className="whiteSpace--nowrap">
                              {item?.storeName}
                            </td>
                            <td>{item?.storeMobile}</td>
                            <td>{item?.orderId}</td>
                            <td>{item?.invoiceId}</td>
                            <td>{
                              item?.billingDate?.length<=8?
                            excelSerialToDateString(item?.billingDate): item?.billingDate?.replace("0:00","")}</td>
                            <td
                              onClick={() =>
                                item?.deliveryStatusTracker?.length > 0
                                  ? setDeliveryTimeStamp(item?.deliveryStatusTracker)
                                  : null
                              }
                            >
                              <span
                                className={
                                  item?.onNetworklogisticOrderId
                                    ? "table-link-items"
                                    : ""
                                }
                              >
                                {item?.onNetworklogisticOrderId || "-"}
                              </span>
                            </td>
                            <td>{item?.endOtp}</td>
                            <td>{item?.onNetworklogisticStatus ?? ""}</td>
                            <td>{item?.remarks ? item?.remarks : ""}</td>
                            <td>
                              <div
                                onClick={() => {
                                  childTable === index
                                    ? setChildTable("")
                                    : setChildTable(index);
                                }}
                                className={
                                  childTable === index
                                    ? "view-btn-arrow active"
                                    : "view-btn-arrow"
                                }
                              >
                                View Items<span></span>
                              </div>
                            </td>
                            <td>{item?.storeAddress}</td>
                            <td>
                              <button
                                disabled={cancelLoading === item._id}
                                className="back-button"
                                onClick={() => {
                                  cancelPidgeDelivery(item.onNetworklogisticOrderId, item._id)
                                }}
                              >
                                {
                                  cancelLoading == item._id ? <Spin indicator={antIcon} size="small" /> : "Cancel"
                                }
                              </button>
                            </td>
                          </tr>
                          <tr
                            className="child-row"
                            style={{
                              display:
                                childTable === index ? "table-row" : "none",
                              color: "green",
                            }}
                          >
                            <td colSpan={8} className="p-0">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th className="text-start">Category</th>
                                    <th>Item description</th>

                                    <th>Invoice Id</th>
                                    <th>Invoice Value</th>
                                    <th>Quantity</th>
                                    <th>UOM</th>
                                    <th>Total CFC</th>
                                    <th>CFC</th>
                                    <th>PAC</th>
                                    <th>Weight</th>
                                    {/* <th>Weight Unit</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {item?.lineItems?.map((order) => {
                                    return (
                                      <tr>
                                        <td className="text-start">
                                          {order?.category}
                                        </td>
                                        <td>
                                          {order?.itemDescription
                                            ? order.itemDescription
                                            : "-"}
                                        </td>
                                        <td>{order?.invoiceId}</td>
                                        <td>
                                          {parseFloat(
                                            order?.netInvoiceValue
                                          ).toFixed(2)}
                                        </td>
                                        <td>{order?.quantity}</td>
                                        <td>{order?.uom}</td>
                                        <td>
                                          {parseFloat(order?.totalCFC)?.toFixed(
                                            2
                                          )}
                                        </td>
                                        <td>
                                          {parseFloat(
                                            order?.CFCConversion
                                          )?.toFixed(2)}
                                        </td>
                                        <td>
                                          {parseFloat(
                                            order?.PACConversion
                                          )?.toFixed(2)}
                                        </td>
                                        <td>
                                          {parseFloat(order?.weight).toFixed(
                                            2
                                          ) +
                                            " " +
                                            order?.weightUnit}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <tr className="text-center">
                                    <th className="text-start">Total</th>
                                    <th>-</th>
                                    <th>-</th>
                                    <th>
                                      {parseFloat(
                                        item?.lineItems?.reduce(
                                          (total, order) =>
                                            total +
                                            (Number(order?.netInvoiceValue) ||
                                              0),
                                          0
                                        )
                                      ).toFixed(2)}
                                    </th>
                                    <th>
                                      {item?.lineItems?.reduce(
                                        (total, order) =>
                                          total +
                                          (Number(order?.quantity) || 0),
                                        0
                                      )}
                                    </th>
                                    <th>-</th>
                                    <th>-</th>
                                    <th>-</th>
                                    <th>-</th>
                                    <th>
                                      {parseFloat(
                                        item?.lineItems?.reduce(
                                          (total, order) =>
                                            total +
                                            (Number(order?.weight) || 0),
                                          0
                                        )
                                      ).toFixed(2)}
                                      {item?.lineItems?.length > 0
                                        ? " " + item?.lineItems[0]?.weightUnit
                                        : ""}
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={storeDetail.orderId ? true : false}
          toggle={() => {
            setStoreDetail({});
          }}
          className="viewOrder"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container">
            <div className="view-order-modal">
              <ModalHeader className="ps-0 pe-0">
                Item Details
                <img
                  src={crossIcon}
                  onClick={() => {
                    setStoreDetail({});
                  }}
                  alt=""
                />
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                  <p className="m-0">
                    Order Id: <span>{storeDetail?.invoiceId}</span>
                  </p>
                </div>
                <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                  <p className="m-0">
                    Store Name: <span>{storeDetail?.storeName}</span>
                  </p>
                  <p className="m-0">
                    Mobile Number: <span>{storeDetail?.storeMobile}</span>{" "}
                  </p>
                </div>
                <p>
                  Address :{" "}
                  <span>
                    {storeDetail?.storeAddress
                      ? storeDetail?.storeAddress
                      : "" + "," + storeDetail?.storeCity
                        ? storeDetail?.storeCity
                        : ""}
                  </span>
                </p>
                <div className="tabel-responsive">
                  <table className="global-table">
                    <thead className="view-order-header">
                      <tr>
                        <th>Item Code</th>
                        <th className="text-center">Product Name</th>
                        <th className="text-center">Net Weight</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Invoice Value</th>
                      </tr>
                    </thead>
                    <tbody className="view-order-body">
                      {storeDetail?.lineItems &&
                        storeDetail?.lineItems.map((item, index) => {
                          return (
                            <tr key={index}>
                              <th className="text-start">{item?.itemCode}</th>
                              <td>{item?.category}</td>
                              <td>{item?.weight + " " + item?.weightUnit}</td>
                              <td>{item?.quantity}</td>
                              <td className="text-end">
                                {parseFloat(item?.netInvoiceValue).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter className="ps-0 pe-0">
                <div className="d-flex gap-2 justify-content-center w-100"></div>
              </ModalFooter>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={selectVehicle}
          onClose={() => {
            setSelectVehicle(false);
            setItemId("");
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <ModalHeader>
            Logistic Providers
            <img
              src={crossIcon}
              onClick={() => {
                setSelectVehicle(false);
                setItemId("");
              }}
              alt=""
            />
          </ModalHeader>
          <ModalBody style={{ padding: "0px" }}>
            <div className="popup">
              <div className="popup-content order-table-intiate-content">
                <div className="table-responsive">
                  <table className="table order-table-intiate">
                    <thead>
                      <tr>
                        <th>Available Provider</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableVehicles?.map((vehicle, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <label
                                className="custom-radio"
                                onClick={() => {
                                  setOrderDeliveryMode(vehicle);
                                }}
                              >
                                {" "}
                                {`${vehicle?.name}`}
                                <input
                                  type="radio"
                                  name="radio"
                                  className="custom-radio-input"
                                  checked={
                                    orderDeliveryMode?.id ==
                                    vehicle?.id
                                  }
                                  onClick={() => {
                                    setOrderDeliveryMode(vehicle);
                                  }}
                                />
                                <span className="custom-radio-checkmark"></span>
                              </label>
                            </td>
                            <td>₹{vehicle?.charge}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="popup-footer">
                <button
                  className="back-button"
                  onClick={() => {
                    setSelectVehicle(false);
                    setItemId("");
                    setTripId("")
                  }}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  disabled={
                    !orderDeliveryMode?.id || modalLoading !== ""
                  }
                  onClick={() => {
                    initiatePidgeDelivery(KikoOrderData?.orderId, KikoOrderData?.orderTripsId, tripId);
                  }}
                >
                  {modalLoading ? <Spin indicator={antIcon} /> : "Proceed"}
                </button>
              </div>
            </div>
          </ModalBody>
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

              <p>Add money to your wallet to proceed delivery</p>
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
          isOpen={logisticDetail?.name ? true : false}
          toggle={() => {
            setLogisticDetail({});
          }}
          onClose={() => {
            setLogisticDetail({});
          }}
          // style={{ width: "450px" }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          {modalLoading ? (
            <Spin indicator={antIcon} className="me-2" />
          ) : (
            <>
                      <div className="">
            <ModalHeader className="">
              Driver Details
              <img
                src={crossIcon}
                onClick={() => {
                  setLogisticDetail({});
                }}
                alt=""
              />
            </ModalHeader>
              <ModalBody>
                {logisticDetail?.name ? (
                  <div className="view-popup">
                    <ul className="detail-list-container">
                      <li>
                        <p>Id: </p>
                        <span>{logisticDetail?.id ?? "NA"}</span>
                      </li>
                      <li>
                        <p>Name: </p>
                        <span>{logisticDetail?.name}</span>
                      </li>
                      <li
                        onClick={() => {
                          const phoneNumber = logisticDetail?.phone ?? "";
                          makePhoneCall(phoneNumber);
                        }}
                      >
                        <p>Mobile: </p>
                        <span>{logisticDetail?.phone ?? "NA"}</span>
                      </li>
                      <li>
                      <p>Vehicle Number: </p>

                      {editMode ? (
                        <>
                        <input
                          type="text"
                          value={vehicleNumber}
                          maxLength={10} // limit to 10
                          onChange={(e) => {
                            const value = e.target.value
                              .toUpperCase() // convert to uppercase
                              .replace(/[^A-Z0-9]/g, ""); // allow only A-Z and 0-9
                            setVehicleNumber(value);
                          }}
                        />
                          <button onClick={handleSave}>Save</button>
                        </>
                      ) : (
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {vehicleNumber || "NA"}
                      <span onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
                      <EditOutlined style={{ fontSize: "16px", color: "black" }} />
                      
                      </span>
                      </span>
                      )}
                    </li>
                    </ul>
                    <div>
                    </div>
                    {logisticDetail?.trackingUrl &&
                      <div className="textAlign m-0">
                        <button className="btn btn-sm btn-primary w-100">
                          <a
                            href={logisticDetail?.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="termsCondition"
                          >
                            Track order{" "}
                          </a>
                        </button>
                      </div>}
                  </div>
                ) : (
                  <div className="view-popup justify-content-center">
                    <div className="courier-partner-msg">
                      <h5 className="m-0 text-center not-assigned ">
                        Courier detail not available !
                      </h5>
                    </div>
                  </div>
                )}
              </ModalBody>
              </div>
            </>
          )}
        </Modal>
        <Modal
          isOpen={initPopup != "" ? true : false}
          onClose={() => {
            setInitPopup("");
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="">
            <ModalHeader className="Courier-info">
              Initiate Pickup
              <img
                src={crossIcon}
                onClick={() => {
                  setInitPopup("");
                }}
                alt=""
              />
            </ModalHeader>
            <ModalBody>
              <div className="modal-body-container">
                <h6 className="mb-0">
                  Are you sure you want to initiate pickup?
                </h6>
              </div>
            </ModalBody>
            <ModalFooter className="shadow-footer">
              <div className="d-flex gap-2 justify-content-center w-100">
                <button
                  className="btn-secondary-modal flex-grow-1"
                  disabled={modalLoading !== ""}
                  onClick={() => {
                    setInitPopup("");
                  }}
                >
                  No
                </button>
                <button
                  className="btn-primary-modal flex-grow-1"
                  onClick={() =>
                    initiatePidgePickup(initPopup)
                  }
                  disabled={modalLoading !== ""}
                  loading={initPopup == modalLoading}
                >
                  {initPopup == modalLoading ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    "Yes"
                  )}
                </button>
              </div>
            </ModalFooter>
          </div>
        </Modal>
        <Modal
          isOpen={trackingPopup != "" ? true : false}
          onClose={() => {
            setTrackingPopup("");
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <ModalHeader className="Courier-info">
            Tracking URL
            <img
              src={crossIcon}
              onClick={() => {
                setTrackingPopup("");
              }}
              alt=""
            />
          </ModalHeader>
          <ModalBody>
            <div className="modal-body-container">
              <ul className="track-order-list-container">
                <li>
                  <span
                    className="confirm-button"
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      window.open(
                        `/track-shipment/${trackingPopup}?type=seller`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    <span
                      style={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      Tracking URL :{" "}
                    </span>
                    <span>{` ${window.location.origin}/track-shipment/${trackingPopup}?type=seller`}</span>
                  </span>
                </li>
                <li>
                  <span
                    className="confirm-button"
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      window.open(
                        `/track-shipment/${trackingPopup}?type=driver`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    <span
                      style={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      Driver URL :{" "}
                    </span>
                    <span>{` ${window.location.origin}/track-shipment/${trackingPopup}?type=driver`}</span>
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/track-shipment/${trackingPopup}?type=driver`
                      )
                    }
                  >
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z"
                        fill="#7459AF"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={printQRModalVisible}
          toggle={() => {
            setPrintQRModalVisible(false);
            resetPrintCounts();
          }}
          className="print-qr-modal"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <ModalHeader>
            Print QR
            <img
              src={crossIcon}
              onClick={() => {
                setPrintQRModalVisible(false);
                resetPrintCounts();
              }}
              alt=""
            />
          </ModalHeader>
          <ModalBody>
            <div className="table-responsive">
              <Table className="global-table modal-table-main">
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Invoice No</th>
                    <th>Number of Print</th>
                  </tr>
                </thead>
                <tbody>
                  {singleTripData?.orderIds?.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.storeName}</td>
                      <td>{item?.orderId}</td>
                      <td>
                        <div className="plus-minus-btn">
                          <button
                            className="minus-btn"
                            onClick={() => handlePrintCountMinus(index)}
                            disabled={(item.printCount || 1) <= 1}
                          >
                            -
                          </button>
                          <input
                            className="count-btn"
                            type="number"
                            min={1}
                            max={99}
                            value={item.printCount ?? 1}
                            style={{ width: 50, textAlign: "center" }}
                            onChange={(e) => handlePrintCountChange(e, index)}
                            onBlur={(e) => handlePrintCountBlur(e, index)}
                          />
                          <button
                            className="plus-btn"
                            onClick={() => handlePrintCountPlus(index)}
                            disabled={(item.printCount || 1) >= 99}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setPrintQRModalVisible(false);
                resetPrintCounts();
              }}
            >
              Cancel
            </button>
            <button className="btn btn-secondary" onClick={handlePrintQRCode}>
              Print
            </button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={deliveryTimeStamp.length > 0 ? true : false}
          toggle={() => {
            setDeliveryTimeStamp([]);
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="modal-custom"
        >
          <div className="timeStamp-container">
            <ModalHeader className="modal-header">
              Delivery Time Stamp{" "}
              <img
                src={crossIcon}
                onClick={() => {
                  setDeliveryTimeStamp([]);
                }}
                alt=""
              />
            </ModalHeader>
            <div className="main-div">
              {
                deliveryTimeStamp.map((item, index) => {
                  return (
                    <div className="timeStampStructure">
                      <div className="Ellipse-3657">
                        <span>
                          {index + 1}
                        </span>
                        {index < deliveryTimeStamp.length - 1 && <div className="vertical-line"></div>}
                      </div>
                      <div className="time-container">
                        <span className="Order-Created">
                          {(item?.status)}
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
        <div className="d-flex justify-content-center">
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={count}
            page={page}
          />
        </div>
      </div>
    </>
  );
}
export default OrderDetail;