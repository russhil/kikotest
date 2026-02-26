import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import cartIcon from "../../images/Inventry/cart-icon.png";
import { RETURN_LIST_V2 } from "../../api/apiList";
import API from "../../api";
import moment from "moment";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  handleError,
  notify,
  DateFilters,
  PaginationFilter,
  CsvGenerator,
  nomenclature,
  handleLogout
} from "../../utils";
import pikupInitiated from "../../images/pickup-initiated.svg";
//import Excel from "../../components/svgIcons/Excel";
//import Printer from "../../components/svgIcons/Printer";
import infoIcon from "../../images/Inventry/Info-icon.svg";
//import ImageOne from "../../images/return-img-1.png";
//import ImageTwo from "../../images/return-img-2.png";
//import ImageThree from "../../images/return-img-3.png";
//import Camera from "../../components/svgIcons/Camera";
import crossIcon from "../../images/cross-icon.svg";
import { returnRejectCode, buyerReason } from "../../reject.js";
import "./styles.scss";
import { selfDeliveryIssue } from "../../reject.js";
import { ToastContainer, toast } from "react-toastify";

//const rejectMessagesArray = Object.entries(ondcCancelReason);
// const buyerMessagesArray = Object.entries(buyerReason);

function NewReturn(props) {
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
  const [user_data] = useState(getSellerDetails());
  //const [cancellationId, setcancellationId] = useState("");
  const [openOrder, setOpenOrder] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  //const [openRejectBtn, setReject] = useState(false);
  const [openAcceptBtn, setAccept] = useState(false);
  const [openProceed, setProceed] = useState(false);
  const [termCondModal, settermCondModal] = useState(false);
  const [isDisable, setisDisable] = useState(false);
  const [checkTermCondModal, setcheckTermCondModal] = useState(true);
  const [pickupModal, setpickupModal] = useState(false);
  const [courierModal, setcourierModal] = useState(false);
  //const [openSelfDelivery, setSelfDelivery] = useState(false);
  const [openDeliveryCharges, setDeliveryCharges] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [liquidatedModal, setLiquidatedModal] = useState(false);
  // const [orderImage, setorderImage] = useState("");
  const [ondcOrderData, setOndcOrderData] = useState([]);
  const [itemWiseData, setItemWiseData] = useState([]);
  const [orderData, setOrderdata] = useState({});
  const [orderItem, setOrderItem] = useState([]);
  const [modal, setModal] = useState(false);
  // const [isSpin, setisSpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableloading] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [returnData, setreturnData] = useState({});
  const [status, setstatus] = useState("");
  //const [uploadImage, setUploadImage] = useState(false);
  //const [selfDeliveryIssueModal, setSelfDeliveryIssueModal] = useState(false);
  const [confirmReject, setconfirmReject] = useState(false);
  const [confirmReturnInitiated, setConfirmReturnInitiated] = useState(false);
  const [pickUpReason, setpickUpReason] = useState("");
  const [pickupRejectModal, setpickupRejectModal] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  // const [orderId, setorderId] = useState({});
  //const [productDeliveryImage, setProductDeliveryImage] = useState("");
  // const [totalWeight, settotalWeight] = useState(0);
  //const [selfDeliveryIssueKey, setselfDeliveryIssueKey] = useState("");
  const [reason_code, setreason_code] = useState("");
  const [clear, setclear] = useState(false);
  const [selfDeliveryMode, setselfDeliveryMode] = useState("");
  const [componentMounted, setComponentMounted] = useState(false);
  const [page, setpage] = useState(1);
  const [toggleCount, settoggleCount] = useState({});
  const [limit, setlimit] = useState(20);
  const [count, setCount] = useState(0);
  const [orderDeliveryMode, setorderDeliveryMode] = useState("KikoDelivery");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportOrder, setexportOrder] = useState([]);
  const [returnItem, setReturnItem] = useState([]);
  const selfDeliveryIssueArray = Object.entries(selfDeliveryIssue);

  const closemodal = () => setModal(!modal);
  // const closeBtn = (
  //   <button className="close" onClick={closemodal} type="button">
  //     &times;
  //   </button>
  // );

  // var settings = {
  //   dots: false,
  //   infinite: true,
  //   arrows: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  // };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const pickUpOrder = async (order) => {
    const token = getSellerToken();
    const orderId = order?._id
    const version = order?.context?.core_version
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
        pickupType: "return",
        orderDeliveryMode,
      },
    };
    try {
      const result = await axios(options);
      setisDisable(false);
      setAccept(false);
      if (result?.data?.success) {
        rejectReturnOrder("Return_Approved");
      } else if (!result?.data?.success) {
        setpickUpReason(result?.data?.reason);
        notify("error", result?.data?.message);
        setLoading(false);
        setpickupRejectModal(true);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
      setisDisable(false);
    }
  };

  const updateOrderStatus = async (order, status) => {
    setTableloading(true);
    const token = getSellerToken();
    const orderId = order?._id
    const version = order?.context?.core_version
    let data = {
      orderId: orderId,
      deliveryStatus:
        status === "Order-delivered" ? "Return_Delivered" : status,
    };
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/update-return-status`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response) {
        getOrders();
        setTableloading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getItems = async (order, state, deliveryPartnerTaskIdForReturn) => {
    setLoading(true);
    const orderId = order?._id
    const version = order?.context?.core_version
    if (state === "item") {
      setOpenOrder(true);
    } else if (state === "partner") {
      setcourierModal(true);
    }
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/order-details-return`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: {
        orderId: orderId,
        deliveryId: deliveryPartnerTaskIdForReturn,
      },
    };

    try {
      const result = await axios(options);
      if (result) {
        setOrderItem(result?.data?.data?.itemRes);
        setOrderdata(result?.data?.data?.otherData);
        // getOrders();
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const onPageChanged = (page) => {
    setpage(page);
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

  useEffect(() => {
    if (clear) {
      getOrders();
      setclear(false)
    }
  }, [clear])

  const handleCheckboxChange = (item) => {
    const index = returnItem.findIndex((returnItem) => returnItem.fulfillment_id === item.fulfillment_id);
    if (index !== -1) {
      setReturnItem((prevReturnItem) => prevReturnItem.filter((_, i) => i !== index));
    } else {
      setReturnItem((prevReturnItem) => [...prevReturnItem, item]);
    }
  };

  const rejectReturnOrder = async (status) => {
    setLoading(true);
    const orderId = returnData?._id
    const version = returnData?.context?.core_version
    const token = getSellerToken();
    let obj = {};
    obj = {
      order_id: orderId,
      returnStatus: status,
      returnItem
    };
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/update-return-status`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: obj,
    };
    try {
      const response = await axios(options);
      if (response?.status === 200) {
        if (status === "Return_Rejected") {
          notify("success", "Order Cancelled");
          setconfirmReject(false);
          getOrders();
          setLoading(false);
          setReturnItem([])
        } else if (status === "Liquidated") {
          setLiquidatedModal(true);
          setProceed(false);
          setLoading(false);
          setConfirmReturnInitiated(false);
          getOrders();
        } else setpickupModal(true);
        setProceed(false);
        setLoading(false);
        setConfirmReturnInitiated(false);
        getOrders();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deliveryEstimation = async () => {
    setisDisable(true);
    const version = returnData?.context?.core_version
    const token = getSellerToken();
    setLoading(true);
    let data = {
      userId: returnData.vendorId,
      userLatitude: parseFloat(returnData?.userAddress?.latitude),
      userLongitude: parseFloat(returnData?.userAddress?.longitude.trim()),
    };
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/delivery-estimation`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const result = await axios(options);

      if (result?.data?.kikoDelivery) {
        setDeliveryCost(result?.data?.price);
        setProceed(true);
        setAccept(false);
        setLoading(false);
        setisDisable(false);
      } else {
        setAccept(false);
        setLoading(false);
        notify("error", result?.data?.reason);
        setisDisable(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  // const printAndOpenInvoice = () => {
  //   window.print();
  //   window.open("https://example.com/custom-invoice-page", "_blank");
  // };

  // const getReturnItem = async (orderId) => {
  //   setLoading(true);
  //   setOpenReject(true);
  //   setorderId(orderId);
  //   const token = getSellerToken();
  //   const options = {
  //     method: "post",
  //     url: `${process.env.REACT_APP_KIKO_API}/get-return-order-detail`,
  //     headers: {
  //       Authorization: `${token}`,
  //       desktop: true,
  //     },
  //     data: {
  //       orderId
  //     },
  //   };
  //   try {
  //     const response = await axios(options);
  //     console.log('====================================');
  //     console.log("response",response?.data?.data);
  //     console.log('====================================');
  //     if (response) {
  //       const foundCode = buyerMessagesArray.find(
  //         (c) =>
  //           c[0] ===
  //           response?.data?.data?.otherData?.returnRequest?.order?.items[0]?.tags
  //             ?.reason_code
  //       );
  //       setreason_code(foundCode[1]);
  //     }
  //     if (response.data.success) {
  //       let imageArray = [];
  //       response?.data?.data?.otherData?.returnRequest?.order?.items.map(
  //         (data) => {
  //           data?.tags?.image !== "" && imageArray.push(data?.tags?.image);
  //           setitemImages(imageArray);
  //         }
  //       );
  //       let weight = 0;
  //       response?.data?.data?.itemRes.map((data) => {
  //         weight =
  //           data?.weightUnit === "GRAMS" || data?.weightUnit === "ML"
  //             ? weight + (data?.weight / 1000) * data?.quantity?.count
  //             : weight + data?.weight * data?.quantity?.count;
  //       });
  //       if (parseInt(weight) > 15) {
  //         setorderDeliveryMode("SelfDelivery");
  //       }
  //       settotalWeight(weight);
  //       setLoading(false);
  //       setreturnData(response?.data?.data?.otherData);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //     setLoading(false);
  //   }
  // };

  const getReturnItem = async (order) => {
    setreturnData(order);
    setOpenReject(true)
  };

  const viewReturn = async (order) => {
    setLoading(true);
    const orderId = order?._id
    const version = order?.context?.core_version
    const token = getSellerToken();
    const obj = {
      "orderId": orderId
    }
    const options = {
      method: "post",
      url: `${version === "1.2.0" ? process.env.REACT_APP_ONDC_APP_KIKO_API_V2 : process.env.REACT_APP_ONDC_APP_KIKO_API_V1}/get-single-order-detail`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: obj,
    };
    try {
      const response = await axios(options);
      if (response) {
        const result = response?.data?.data?.otherData?.returnItem.map(obj => {
          const matchingItem = response?.data?.data?.itemRes.find(item => item.itemId === obj.item_id);
          if (matchingItem) {
            return { ...obj, productName: matchingItem.productName };
          }
          return obj;
        });
        setItemWiseData(result)
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  }

  const getOrders = async () => {
    if (!user_data._id || user_data._id == "") {
      handleLogout();
    }
    setTableloading(true);
    try {
      const obj = {
        page,
        limit,
        phone: "",
        userId: user_data?._id,
        searchOrderId,
        status,
        search: search,
        startDate: startDate,
        endDate: endDate,
      };
      const response = await API.post(RETURN_LIST_V2, obj);
      setTableloading(false);
      if (response) {
        setCount(response?.data?.data?.count);
        settoggleCount(response?.data?.data?.toggleCount);
        setOndcOrderData(response?.data?.data?.ondcOrderData?.filter((order) => order?.context?.core_version === "1.2.0"));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const addUpdateImage = (selectedFile, data) => {
    const formData = new FormData();
    setisDisable(true);
    // setisSpin(data);
    formData.append(`file`, selectedFile);
    axios
      .post(
        `${process.env.REACT_APP_KIKO_API_V1}/products/upload`,
        formData
      )
      .then((res) => {
        if (data === "uploadImage") {
          setisDisable(false);
        }
      });
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
        getOrders();
      }
      else {
        setpage(1);
      }
    }
  };

  useEffect(() => {
    if (componentMounted) {
      getOrders();
    } else {
      setComponentMounted(true);
    }
  }, [componentMounted, status, page]);

  const exportOrders = () => {
    setExportLoading(true);
    let exportOrder = [];
    ondcOrderData.forEach((order, index) => {
      const obj = {
        createdAt:
          moment(order?.createdAt).format("DD MMMM YYYY") +
          " at " +
          moment(order?.createdAt).format("hh:mm A"),
        Return: "Return",
        orderAmount: order?.orderAmount,
        orderId: order?.orderId,
        ondcOrderId: order?.ondcOrderId,
        name: order?.name,
      };
      exportOrder.push(obj);
      setexportOrder(exportOrder);
    });
    setExportLoading(false);
  };

  const headings = [
    { label: "Date & Time.", key: "createdAt" },
    { label: "Request Type", key: "Return" },
    { label: "Order Amount", key: "orderAmount" },
    { label: "Order ID", key: "orderId" },
    { label: "ONDC Order ID", key: "ondcOrderId" },
    { label: "Customer", key: "name" },
  ];

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="RightBlock">
        <div className="order-section">
          {!window?.flutter_inappwebview &&
            <div className="section-title">
              <h1>Return</h1>
              {/* <button className="btn btn-primary">
                            <Excel className="me-2" /> Download Return Data
                        </button> */}
              <CsvGenerator
                data={exportOrder}
                headings={headings}
                fileName={"Return.csv"}
                onClick={exportOrders}
                buttonName={"Download Order Data"}
                exportLoading={exportLoading}
              />
            </div>}

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
                href="#menu1"
                onClick={() => {
                  setpage(1);
                  setstatus("Accepted");
                }}
              >
                Return<span>({toggleCount?.returnCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu2"
                onClick={() => {
                  setpage(1);
                  setstatus("Replacement");
                }}
              >
                Replacement<span>({toggleCount?.pendingCount})</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                data-toggle="tab"
                href="#menu3"
                onClick={() => {
                  setpage(1);
                  setstatus("Return_Rejected");
                }}
              >
                Cancelled<span>({toggleCount?.CancelledCount})</span>
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div id="home" className="tab-pane active">
              <div className="filter filterBlock">
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
                  {/* <span>
                        <label>Order Date : From</label>
                        <input type="date" value={startDate} onChange={(e) => setstartDate(e.target.value)} className="date-picker" />
                      </span>
                      <span>
                        <label>To</label>
                        <input type="date" value={endDate} onChange={(e) => setendDate(e.target.value)} className="date-picker" />
                      </span> */}
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
              {ondcOrderData?.length > 0 ? (
                <div className="table-responsive">
                  {tableLoading ? (
                    <Spin indicator={antIcon} className="loader" />
                  ) : (
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th scope="col">Sr No.</th>
                          <th scope="col">Date & Time</th>
                          <th scope="col">Request status</th>
                          {/* <th scope="col">Order Amount</th> */}
                          <th scope="col">Order ID</th>
                          <th scope="col">ONDC Order ID</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Order Details</th>
                          <th scope="col">Action</th>
                          <th scope="col">Delivery Mode</th>
                          <th scope="col">Delivery Status</th>
                          <th scope="col">Tracking ID</th>
                          <th scope="col">Delivery Partner</th>
                          <th scope="col">Update Status</th>
                          {/* <th scope="col">Upload Delivery</th> */}
                          {/* <th scope="col">Upload Return</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {ondcOrderData.map((order, index) => {
                          return (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                {moment(order?.createdAt).format(
                                  "DD MMMM YYYY"
                                ) +
                                  " at " +
                                  moment(order?.createdAt).format("hh:mm A")}
                              </td>
                              {/* <td>{nomenclature(order?.returnStatus)}</td> */}
                              <td>
                                {order?.returnStatus === "parcel_delivered" ? (
                                  <p className="green status-border">
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
                                ) : order?.returnStatus === "Return_Picked" ? (
                                  <p className="yellow status-border">
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
                                  <p> {nomenclature(order?.returnStatus)}</p>
                                )}
                              </td>
                              {/* <td>{order?.orderAmount}</td> */}
                              <td>{order?.orderId}</td>
                              <td>{order?.ondcOrderId}</td>
                              <td>
                                {order?.name.charAt(0).toUpperCase() +
                                  order?.name.slice(1)}
                              </td>
                              <td>
                                {" "}
                                <span
                                  onClick={() => {
                                    getItems(order, "item");
                                  }}
                                  className="view-order"
                                >
                                  View Order
                                </span>
                              </td>
                              <td>
                                <span
                                  onClick={() => {
                                    getReturnItem(order);
                                    viewReturn(order)
                                  }}
                                  className="uploadImageModal"
                                >
                                  View Return
                                </span>
                              </td>
                              <td>
                                {order?.orderDeliveryModeForReturn
                                  ? nomenclature(
                                    order?.orderDeliveryModeForReturn
                                  )
                                  : "-"}
                              </td>
                              <td>
                                {order?.returnStatus
                                  ? nomenclature(order?.returnStatus)
                                  : "-"}
                              </td>
                              <td>{order?.deliveryPartnerTaskIdForReturn}</td>
                              <td>
                                {" "}
                                {order?.deliveryPartnerTaskIdForReturn && (
                                  <span
                                    className="view-order"
                                    onClick={() => {
                                      getItems(
                                        order,
                                        "partner",
                                        order?.deliveryPartnerTaskIdForReturn
                                      );
                                    }}
                                  >
                                    View
                                  </span>
                                )}{" "}
                              </td>
                              <td>
                                {order?.orderDeliveryModeForReturn ===
                                  "SelfDelivery" ? (
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value !== "") {
                                        setselfDeliveryMode(e.target.value);
                                        updateOrderStatus(
                                          order,
                                          e.target.value
                                        );
                                      }
                                    }}
                                    value={
                                      order?.returnFulfillments[1]?.state
                                        ?.descriptor?.code === "Order-picked-up"
                                        ? "Return_Picked"
                                        : order?.returnFulfillments[1]?.state
                                          ?.descriptor?.code
                                          ? order?.returnFulfillments[1]?.state
                                            ?.descriptor?.code
                                          : selfDeliveryMode
                                    }
                                  >
                                    <option value={""}>Select</option>
                                    <option
                                      value={"Return_Picked"}
                                      disabled={
                                        order?.returnStatus !==
                                        "Return_Approved"
                                      }
                                    >
                                      Return Picked
                                    </option>
                                    <option
                                      value={"Order-delivered"}
                                      disabled={
                                        order?.returnStatus !== "Return_Picked"
                                      }
                                    >
                                      Return Delivered{" "}
                                    </option>
                                    {/* <option value={"RTO-Initiated"} disabled={order?.fulfillments[0]?.state?.descriptor?.code != "Out-for-delivery"}>RTO Initiated</option>
                                                            <option value={"RTO-Delivered"} disabled={order?.fulfillments[0]?.state?.descriptor?.code != "RTO-Initiated"}>RTO Delivered</option>
                                                            <option value={"RTO-Disposed"} disabled={order?.fulfillments[0]?.state?.descriptor?.code != "RTO-Initiated"}>RTO Disposed</option> */}
                                  </select>
                                ) : (
                                  "-"
                                )}
                              </td>
                              {/* <td>{(Array.isArray(order?.kikoReturnStatusTracker) && order?.kikoReturnStatusTracker.some(item => item.status === 'parcel_delivered')) ? <span className="uploadImageModal" onClick={() => { setUploadImage(true); setorderId(order?._id); setProductDeliveryImage(order?.productDeliveryImage) }}>Upload Images</span> : "-"}</td> */}

                              {/* <td>
                                                            <span className="uploadImageModal" onClick={() => { setUploadImage(true) }}>Upload Image</span>
                                                        </td> */}
                              {/* <td><p className="uploadImageModal" onClick={onOpenModal}>Upload Delivery confirmation Image</p></td> */}
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
                    <Spin indicator={antIcon} className="loader" size="large" />
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
        <div className="d-flex justify-content-center">
          {" "}
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={count}
            page={page}
          />
        </div>
      </div>
      <Modal
        isOpen={openOrder}
        style={{ maxWidth: "550px" }}
        toggle={() => {
          setOpenOrder(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        className="viewOrder viewOrderXl"
        centered
      >
        {loading ? (
          <Spin indicator={antIcon} />
        ) : (
          <div className="container pb-3">
            <div className="view-order-modal">
              <ModalHeader className="pe-0 ps-0">
                View Order
                <img
                  src={crossIcon}
                  onClick={() => {
                    setOpenOrder(false);
                  }}
                  alt=""
                />
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="pt-2 pb-2 d-flex justify-content-between align-items-center">
                  <p className="m-0">
                    Order Id: <span>{orderData?.orderId}</span>
                  </p>
                  {/* <p className="m-0">Invoice <Printer /> </p> */}
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 pb-2">
                  <p className="m-0">
                    Customer Name: <span>{orderData?.customerName}</span>
                  </p>
                  <p className="m-0">
                    Mobile Number: <span>{orderData?.phone}</span>
                  </p>
                </div>
                <p className="mb-1">
                  Address :{" "}
                  <span>
                    {orderData?.address?.address?.building &&
                      orderData?.address?.address?.building[0].toUpperCase() +
                      orderData?.address?.address?.building.slice(1)}{" "}
                    {orderData?.address?.address?.locality}{" "}
                    {orderData?.address?.address?.area_code}
                  </span>
                </p>
                <div className="tabel-responsive">
                  <table className="global-table">
                    <thead>
                      <tr>
                        <th>Sr No.</th>
                        <th>Status</th>
                        <th className="text-center">Product Name</th>
                        <th className="text-center">Net Weight</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItem &&
                        orderItem.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className={item?.tags !== "" ? "strikeout1" : ""}
                            >
                              <th className="text-start">{index + 1}</th>
                              <td>
                                {item?.tags && item?.tags === "cancel"
                                  ? "Cancelled"
                                  : item?.tags}
                              </td>
                              <td>{item?.productName}</td>
                              <td>
                                {item?.weight}
                                {item?.weightUnit}
                              </td>
                              <td>{item?.quantity?.count}</td>
                              <td className="text-end">
                                {item?.discountedPrice}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center justify-content-between py-2 ps-2 pe-2">
                  <span>Order amount</span>
                  <span>₹{orderData?.orderAmount}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-top py-2  ps-2 pe-2">
                  <span>Delivery charges</span>
                  <span>₹{orderData?.deliveryChargesValue}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-top py-2  ps-2 pe-2">
                  <span>Tax</span>
                  <span>₹{orderData?.tax}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-top border-bottom pt-2 pb-2 mb-2 ps-2 pe-2">
                  <span>Packing Fee</span>
                  <span>₹{orderData?.packingCharges}</span>
                </div>
              </ModalBody>
              <ModalFooter
                className="justify-content-between footer-total-amount"
              >
                <p className="m-0">
                  Total amount
                </p>
                <p className="m-0">
                  ₹
                  {Math.round(
                    parseFloat(orderData?.orderAmount) +
                    parseFloat(orderData?.deliveryChargesValue) +
                    parseFloat(orderData?.tax) +
                    parseFloat(orderData?.packingCharges)
                  )}
                </p>
              </ModalFooter>
              <p className="error">
                *Marked item(s) are requested for return/replacement.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={openReject}
        toggle={() => { setOpenReject(false); setReturnItem([]) }}
        aria-labelledby="contained-modal-title-vcenter"
        className="viewOrder viewOrderLoader auto-adjust-modal"
        centered
        size="lg"
      >
        {loading ? (
          <Spin indicator={antIcon} />
        ) : (
          <div className="p-3">
            <div>
              <div style={{ textAlign: "end", marginBottom: "10px" }}>
                <img
                  src={crossIcon}
                  style={{
                    width: "15px",
                    height: "15px",
                    cursor: "pointer"
                  }}
                  onClick={() => { setOpenReject(false); setReturnItem([]) }}
                />
              </div>
            </div>
            <div className="tabel-responsive">
              <table className="global-table">
                <thead className="view-order-header">
                  <tr>
                    <th></th>
                    <th className="text-start">Image</th>
                    <th className="text-start">Product Name</th>
                    <th className="text-center" style={{ width: "150px" }}>
                      Quantity
                    </th>
                    <th className="text-end">Status</th>
                    <th className="text-end">Reason</th>
                  </tr>
                </thead>
                <tbody className="view-order-body">
                  {itemWiseData &&
                    itemWiseData.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            item?.tags === "" ? "strikeout1" : ""
                          }
                        >
                          {<td>
                            <input
                              style={{ width: "20px" }}
                              type="checkbox"
                              checked={returnItem.some((i) => i.fulfillment_id === item.fulfillment_id)}
                              onChange={() => handleCheckboxChange(item)}
                            />
                          </td>}
                          <td>
                            <img src={item?.images?.value} width={50} height={50} alt="" />
                          </td>
                          <td>
                            <div className="text-start">
                              {item?.productName &&
                                item?.productName[0].toUpperCase() +
                                item?.productName.slice(1)}
                            </div>
                          </td>
                          <td>
                            {item?.quantity?.count}
                          </td>
                          <td className="text-end">
                            {item?.status}
                          </td>
                          <td>
                            {returnRejectCode[item?.reasonId] || "Unknown code"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="view-order-flex">

              <button
                onClick={() => {
                  setconfirmReject(true);
                  setOpenReject(false);
                }}
                disabled={returnItem.length == 0}
                className="btn btn-danger"
              >
                Reject
              </button>

              <button
                className="btn btn-md btn-tertiary"
                disabled={returnItem.length == 0}
                onClick={() => {
                  setConfirmReturnInitiated(true);
                  setOpenReject(false);
                }}
              >
                Accept & Initiate Refund
              </button>
              <button
                className="btn btn-md btn-tertiary"
                disabled={returnItem.length == 0}
                onClick={() => {
                  rejectReturnOrder("Return_Approved")
                }}
              >
                Accept & Approve Return
              </button>
              <button
                className="btn btn-md btn-tertiary"
                disabled={returnItem.length == 0}
                onClick={() => {
                  rejectReturnOrder("Return_Picked")
                }}
              >
                Return Picked Up
              </button>
              <button
                className="btn btn-md btn-tertiary"
                disabled={returnItem.length == 0}
                onClick={() => {
                  rejectReturnOrder("Return_Delivered")
                }}
              >
                Return Delivered
              </button>
              {/* <button  className="btn btn-tertiary" onClick={() => {deliveryEstimation()}}>Estimation testing</button> */}
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={confirmReject}
        onClose={() => {
          setconfirmReject(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="py-3">
            <h4 className="text-center mb-0">
              Are you sure you want to cancel this return order?
            </h4>
            <div className="options-block"></div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                rejectReturnOrder("Return_Rejected");
              }}
            >
              {loading && <Spin indicator={antIcon} />}Yes
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setconfirmReject(false);
                setReturnItem([])
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={confirmReturnInitiated}
        onClose={() => {
          setConfirmReturnInitiated(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container p-4">
          <h4 className="text-center mb-0">
            Are you sure you want to initiate refund for this order?
          </h4>
          <div className="options-block"></div>

          <div className="d-flex gap-2 justify-content-center mt-3">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                rejectReturnOrder("Liquidated");
              }}
            >
              {loading && <Spin indicator={antIcon} />}Yes
            </button>
            <button
              className="btn btn-sm btn-danger "
              onClick={() => {
                setConfirmReturnInitiated(false);
                setReturnItem([])
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openAcceptBtn}
        toggle={() => {
          setAccept(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="delivery-option">
            <h4 className="text-center mb-3">Select Pickup Option</h4>
            <div className="options-block">
              <div className="type">
                <input
                  type="radio"
                  id="selfdelivery"
                  name="radio-group"
                  checked={orderDeliveryMode === "SelfDelivery"}
                  onClick={() => {
                    setorderDeliveryMode("SelfDelivery");
                  }}
                />
                <label for="selfdelivery">Self Pickup</label>
                <p className="mb-0 mt-1 SelectDelivery">
                  <img src={infoIcon} alt="" /> What is Self Pickup
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
              <div className="type">
                <input
                  type="radio"
                  id="kikodelivery"
                  name="radio-group"
                  checked={
                    orderDeliveryMode === "KikoDelivery"
                  }
                  onClick={() => {
                    setorderDeliveryMode("KikoDelivery");
                  }}
                />
                <label for="kikodelivery">Kiko Live Pickup</label>
                <p className="mb-0 mt-1 SelectDelivery">
                  <img src={infoIcon} alt="" /> What is Kiko Live Pickup
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
          {/* <div className="parcel-weight">
                        <h3>
                            Select Parcel Weight<span>*</span>{" "}
                        </h3>

                        <div className="type">
                            <input type="radio" id="test1" name="radio-group" />
                            <label for="test1">0 to 6 kgs</label>
                        </div>
                        <div className="type">
                            <input type="radio" id="test2" name="radio-group" />
                            <label for="test2">6.01 to 15 kgs</label>
                        </div>
                    </div> */}
          <div className="text-center">
            <button
              onClick={() => {
                deliveryEstimation();
              }}
              disabled={isDisable}
              className="mt-3 btn btn-sm btn-secondary"
            >
              {loading && <Spin indicator={antIcon} />}Proceed
            </button>
          </div>
        </div>
      </Modal>

      {/* <Modal isOpen={openSelfDelivery} toggle={() => { setSelfDelivery(false) }} aria-labelledby="contained-modal-title-vcenter" centered>
                <div className="container pb-3 pt-3">
                    <div className="selfDeliveryModal">
                        <h5 className="mb-3">Do you wish to proceed with Self Pickup?</h5>
                        <h6><span>Kindly arrange for Self Pickup</span></h6>
                        <h6><span>Upload proof once Pickup Done</span></h6>
                        <div className="d-flex gap-2 justify-content-center mt-2">
                            <button className="border-btn" onClick={() => { setSelfDelivery(false) }}>No</button>
                            <button onClick={() => { setDeliveryCharges(true) }} className="btn btn-secondary">Yes</button>
                        </div>
                    </div>
                </div>
            </Modal> */}

      <Modal
        isOpen={openProceed}
        toggle={() => {
          setProceed(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="container pb-3 pt-3">
          <div className="delivery-charge-modal">
            <h4>
              {orderDeliveryMode === "KikoDelivery"
                ? "Return Delivery Charges "
                : "Do you wish to proceed with Return?"}
            </h4>
            {orderDeliveryMode === "KikoDelivery" && (
              <div className="delivery-rate">
                <p>₹{deliveryCost}</p>
              </div>
            )}
            {orderDeliveryMode === "KikoDelivery" && (
              <button
                className="view-charges"
                onClick={() => {
                  setDeliveryCharges(true);
                }}
              >
                View Return Charges{" "}
              </button>
            )}
            {orderDeliveryMode === "KikoDelivery" && (
              <h5>Do you wish to proceed with Return?</h5>
            )}
            {orderDeliveryMode === "KikoDelivery" && (
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
                className="btn btn-sm"
                onClick={() => {
                  setProceed(false);
                }}
              >
                No
              </button>
              <button
                className="btn btn-sm"
                disabled={!checkTermCondModal || isDisable}
                onClick={() => {
                  pickUpOrder(returnData);
                  setisDisable(true);
                }}
              >
                {loading && <Spin indicator={antIcon} />}Yes
              </button>
            </div>
            <div className="checkboxBlock">
              <input
                type="checkbox"
                checked={checkTermCondModal}
                onClick={() => {
                  setcheckTermCondModal(!checkTermCondModal);
                }}
              />
              <label className="terms-condition">
                <a
                  href="#"
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
        </div>
      </Modal>

      <Modal
        isOpen={pickupModal}
        toggle={() => {
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
            <h5 className="text-center">Return Initiated</h5>
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
        isOpen={liquidatedModal}
        toggle={() => {
          setLiquidatedModal(false);
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
            <h5 className="text-center">Refund Initiated</h5>
            <div className="text-center">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setLiquidatedModal(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={termCondModal}
        toggle={() => {
          settermCondModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <div className="container pb-3 ">
          <div className="terms-condition">
            <div className="modal-header">
              <h3 className="m-0">Term & Condition</h3>
            </div>
            <div className="row">
              <h5>Thank you for choosing kiko delivery services! </h5>
              <div className="col-lg-6">
                <ul>
                  <li>
                    As a Kiko Seller, you will not use services of the company
                    for transporting illegal, hazardous, items or items that are
                    otherwise restricted or prohibited for transport by any
                    statute or law or regulation.{" "}
                  </li>
                  <li>
                    As a Kiko Seller, you cannot raise a delivery request for
                    transporting items more than 15 kg's at a time.{" "}
                  </li>
                  <li>
                    Maximum size of the parcel to be delivered can be 15 inch x
                    8 inch x 8 inch.
                  </li>
                  <li>
                    Courier person should be able to carry the parcel on a bike.{" "}
                  </li>
                  <li>
                    As a Kiko Seller, it is your responsibility to ensure that
                    the items being transported during the service are properly
                    packed. Neither the Company nor the delivery partners shall
                    be responsible for damage to items caused due to improper
                    packaging by the Customer.{" "}
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li>
                    If pickup for this order is not initiated within 3 hours of
                    creating the order, the order will be auto-cancelled.
                    <br />
                    Kiko merely acts as a technology platform to facilitate
                    delivery tasks initiated on the platform and Kiko does not
                    assume any responsibility or liability for any form of
                    deficiency of services towards finding a delivery partner.{" "}
                    <br />
                    Upon loss or theft of any item/s during delivery, Kiko can
                    undertake a maximum liability of upto Rs. 1000. Only on
                    receiving adequate proof of theft or loss which may include
                    but will not be limited to product's invoice, CCTV footing,
                    video recording, photographs of the product etc. and only
                    after doing the due diligence, Kiko will refund for the
                    loss.
                  </li>
                  <li>Approx delivery time-45mins</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <button
                className="btn btn-sm"
                onClick={() => {
                  settermCondModal(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openDeliveryCharges}
        className="termsCondiModal"
        toggle={() => {
          setDeliveryCharges(false);
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
              setDeliveryCharges(false);
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
                setDeliveryCharges(false);
              }}
            >
              Ok
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* <Modal isOpen={openDeliveryCharges} toggle={() => { setDeliveryCharges(false) }} aria-labelledby="contained-modal-title-vcenter" centered>
                <div className="container pb-3">
                    <div className="DeliveryChargesModal">
                        <div className="modal-title">
                            <h5>View Delivery Charges</h5>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="table-heading">
                                    <h5>Self Delivery Charges</h5>
                                </div>
                                <ul>
                                    <li><span>*</span>Seller will be responsible for delivering the order.</li>
                                    <li><span>*</span>Seller is required to arrange the delivery of the order
                                        and provide proof of delivery by uploading the
                                        necessary documentation or proof of delivery.</li>
                                    <li><span>*</span>Delivery fees will be deposited into the seller's
                                        account after delivery proof verification.</li>
                                </ul>
                            </div>
                            <div className="col-lg-4">
                                <div className="table-responsive">
                                    <table className="w-100">
                                        <thead className="table-heading">
                                            <tr>
                                                <th>Distance</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-center ">
                                                <td>0 to 2 km</td>
                                                <td><span>₹</span>41</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>2.01 to 3 km</td>
                                                <td><span>₹</span>41</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>0 to 2 km</td>
                                                <td><span>₹</span>41</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>0 to 2 km</td>
                                                <td><span>₹</span>41</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p className="text-center">Additional ₹18 for each
                                        Kilometer after 10Kms. </p>

                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-5">
                            <button className="btn btn-secondary">OK</button>
                        </div>
                    </div>
                </div>
            </Modal> */}

      {/* <Modal isOpen={openRejectBtn} toggle={() => { setReject(false) }} aria-labelledby="contained-modal-title-vcenter" centered>
                <div className="container p-4">
                    <div className="rejection-modal">
                        <div className="modal-title">
                            <h3 className="mb-2 text-center">Submit reason for Rejection </h3>
                        </div>
                        <div className="modal-body" >
                            {rejectMessagesArray.map(([key, value]) => (
                                <div className="type" onClick={() => { setcancellationId(key) }} key={key}>
                                    <input type="radio" id={key} checked={cancellationId === key} name="radio-group" />
                                    <label for="test1">{value}</label>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <button className="mt-3 btn btn-primary" disabled={cancellationId == ''} onClick={() => { setconfirmReject(true); setReject(false) }}>Submit</button>
                        </div>
                    </div>
                </div>
            </Modal> */}

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
        isOpen={courierModal}
        toggle={() => {
          setcourierModal(false);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        className="view-popup-modal auto-adjust-modal"
        centered
      >
        {loading ? (
          <Spin indicator={antIcon} />
        ) : (
          <div className="container">
            {orderData?.courierInfo?.courierinfo?.name ? (
              <div className="view-popup">
                <div>
                  <div className="textAlign">
                    <h5>Name :</h5>
                    <p>{orderData?.courierInfo?.courierinfo?.name}</p>
                  </div>
                  <div className="textAlign">
                    <h5>Mobile :</h5>
                    <p>{orderData?.courierInfo?.courierinfo?.phone}</p>
                  </div>
                  <div className="textAlign">
                    {" "}
                    <a
                      href={orderData?.courierInfo?.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="termsCondition"
                    >
                      {" "}
                      Track order{" "}
                    </a>
                  </div>
                  {/* <div className='textAlign m-0'><h5>Longitude :</h5><a href="/">{orderData?.courierInfo?.courierinfo?.longitude}</a></div> */}
                </div>
                <div>
                  <img
                    src={orderData?.courierInfo?.courierinfo?.photo_url}
                    alt=""
                    style={{ width: "85px", height: "85px" }}
                    className="logoimg"
                  />
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

      {/* <Modal isOpen={selfDeliveryIssueModal} toggle={() => { setSelfDeliveryIssueModal(false) }} aria-labelledby="contained-modal-title-vcenter" centered>
                <div className="container p-4">
                    <div className="rejection-modal">
                        <div className="modal-title">
                            <h3 className="mb-2 text-center">Select issue with delivery</h3>
                        </div>
                        <div className="modal-body" >
                            {selfDeliveryIssueArray.map(([key, value]) => (
                                <div className="type" onClick={() => { setselfDeliveryIssueKey(key) }} key={key}>
                                    <input type="radio" id={key} checked={selfDeliveryIssueKey === key} name="radio-group" />
                                    <label for="test1">{value}</label>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <button className="mt-3 btn btn-primary" onClick={() => { updateOrderStatus(orderId, "RTO-Initiated"); setSelfDeliveryIssueModal(false) }}>Submit</button>
                        </div>
                    </div>
                </div>
            </Modal> */}
    </>
  );
}
export default NewReturn;
