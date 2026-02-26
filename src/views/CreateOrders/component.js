import React, { useState, useEffect, useRef } from "react";
import { read, utils } from "xlsx";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import crossIcon from "../../images/cross-icon.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./styles.scss";
import { Spin, Button } from "antd";
import cartIcon from "../../images/Inventry/cart-icon.png";
import { LoadingOutlined } from "@ant-design/icons";
import { PaginationFilter, notify, handleError, handleLogout, DateFilters } from "../../utils";
import useDownloadShipmentDetails from "./useDowloadShipmentDetails";

function CreateOrder(props) {
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
  const [user_data, setuser_data] = useState(getSellerDetails());
  const [componentMounted, setComponentMounted] = useState(false);
  const [createShipmentPopup, setCreateShipmentPopup] = useState("");
  const [page, setpage] = useState(1);
  const [orderView, setOrderView] = useState(false);
  const [walletInsuffientModalVisible, setWalletInsuffientModalVisible] = useState(false);
  const [tripView, setTripView] = useState(false);
  const [initPopup, setInitPopup] = useState(false);
  const userData = getSellerDetails();
  const [searchOrderId, setSearchOrderId] = useState("");
  const [search, setSearch] = useState("");
  const [toggleCount, settoggleCount] = useState({});
  const [KikoOrderData, setKikoOrderData] = useState([]);
  const [status, setstatus] = useState("");
  const [clear, setclear] = useState(false);
  const [logisticDetail, setLogisticDetail] = useState({});
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [wrongRecord, setWrongRecord] = useState([])
  const [tableLoading, setTableloading] = useState(false);
  const [modalLoading, setModalLoading] = useState("");
  const [loadings, setLoadings] = useState([]);
  const [itemId, setItemId] = useState("");
  const [limit] = useState(20);
  const [singleOrderData, setSingleOrderData] = useState({})
  const [singleTripData, setSingleTripData] = useState([])
  const [selectVehicle, setSelectVehicle] = useState(false)
  const [storeDetail, setStoreDetail] = useState({})
  const [orderDeliveryMode, setOrderDeliveryMode] = useState({})
  const [availableVehicles, setAvailableVehicles] = useState([])
  const [showCreatedAlert, setShowCreatedAlert] = useState(false);
  const myRef = useRef();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const onPageChanged = (page) => {
    setpage(page);
  };

  const shipmentOrders = async () => {
    if (!user_data._id || user_data._id == "") {
      handleLogout();
    }
    setTableloading(true);
    const token = getSellerToken();
    let data = {
      userId: user_data && user_data._id ? user_data._id : "",
      startDate: startDate,
      endDate: endDate,
      search: search?.trim(),
      status: status,
      page,
      limit,
      searchOrderId: searchOrderId?.trim(),
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/getOrders`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response) {
        setTableloading(false);
        setKikoOrderData(response?.data?.data?.orderData);
        settoggleCount(response?.data?.data?.toggleCount);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      const telUrl = `tel:${phoneNumber}`;
      window.open(telUrl, "_blank", "noopener,noreferrer");
    }
  };

  const initiatePickup = async (orderId, tripId) => {
    setModalLoading(tripId);
    setItemId(tripId)
    const token = getSellerToken();
    let data = {
      "orderId": orderId,
      "tripId": tripId
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/search-b2b-logistics-partner`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response?.data?.success) {
        setOrderView(false);
        setSelectVehicle(true);
        setInitPopup("")
        setAvailableVehicles(response?.data?.availableVehicles)
      }
      else {
        notify("error", `${response?.data?.message}`)
        setInitPopup("")
        setOrderView(false);
        setSelectVehicle(true);
      }
    } catch (error) {
      handleError(error);
    }
    finally {
      setModalLoading("")
    }
  };

  const initiateDelivery = async (vehicleInfo, orderId) => {
    setModalLoading(orderId);
    const token = getSellerToken();
    let data = {
      vehicleInfo,
      orderId,
      tripId: itemId
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/init-b2b-logistics-partner`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response?.data?.success) {
        setSelectVehicle(false)
        notify("success", `${response?.data?.message}`)
      }
      else {
        if (response?.data?.insufficientBalance) {
          setWalletInsuffientModalVisible(true)
        }
        else {
          notify("error", `${response?.data?.message}`)
        }
        setSelectVehicle(false);
      }
      setModalLoading("");
    } catch (error) {
      setModalLoading("");
      handleError(error);
    }
  };

  const clearState = () => {
    setpage(1);
    setclear(true);
    setSearch("");
    setstartDate("");
    setSearchOrderId("");
    setendDate("");
  };

  useEffect(() => {
    if (componentMounted) {
      shipmentOrders();
    } else {
      setComponentMounted(true);
    }

  }, [componentMounted, status, page]);

  useEffect(() => {
    if (
      search === "" &&
      startDate === "" &&
      searchOrderId === "" &&
      endDate === "" &&
      clear
    ) {
      shipmentOrders();
    }
  }, [search, startDate, searchOrderId, endDate]);

  const convertExcelToJson = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".csv"))  {
        notify("error", "Invalid file format. Only XLSX files are allowed.");
        return; // Return early and do not proceed further
      }
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const filteredData = utils.sheet_to_json(worksheet, { header: 1, raw: false });

        const jsonData = filteredData.filter(
          (row) => Array.isArray(row) && row?.length > 0
        );
        const headers = jsonData[0];
        const headerTransformations = {
          'Customer ID': 'custID',
          'UID': 'uId',
          'Order ID': 'orderId',
          'Invoice ID': 'invoiceId',
          'Billing Date': 'billingDate',
          'Category': 'category',
          'Category Code': 'categoryCode',
          'MSKU Code': 'mskuCode',
          'Item Code': 'itemCode',
          'Item Description': 'itemDescription',
          'Entered Qty': 'enteredQty',
          'Entered UOM': 'enteredUOM',
          'Qty': 'quantity',
          'UOM': 'uom',
          'Net Invoice Value': 'netInvoiceValue',
          'Weight': 'weight',
          'Gross Weight Per Piece': 'grossWeightPerPiece',
          'Unit': 'weightUnit',
          'Total CFC': 'totalCFC',
          'CFC Conversion': 'CFCConversion',
          'PAC Conversion': 'PACConversion',
          'Store Name': 'storeName',
          'Store Address': 'storeAddress',
          'Delivery Lat': 'storeLatitude',
          'Delivery Long': 'storeLongitude',
          'Store Mobile Number': 'storeMobile',
          'Length': 'CFCDimensionLength',
          'Width': 'CFCDimensionWidth',
          'Height': 'CFCDimensionHeight',
          'CFC Dimensions unit': 'CFCDimensionUnit',
          'WD Dest Code': 'wareHouseDistributorDestCode',
          'WD Name': 'wareHouseDistributorName',
          'MRP': 'mrp',
          'BATCH': 'batch',
        };
        const result = jsonData.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            const modifiedHeader = headerTransformations[header.trim()];
            if(modifiedHeader === "CFCConversion"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "CFCDimensionHeight"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "mrp"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "CFCDimensionLength"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "CFCDimensionWidth"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "storeMobile"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "storeLongitude"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "storeLatitude"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "PACConversion"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "CFCConversion"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "totalCFC"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "weight"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "netInvoiceValue"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "quantity"){
              obj[modifiedHeader] = Number(row[index])
            }else if(modifiedHeader === "enteredQty"){
              obj[modifiedHeader] = Number(row[index])
            }else if (modifiedHeader === 'orderId') {
              obj[modifiedHeader] = row[index].replace(/"/g, ''); // Remove double quotes
            } else {
              obj[modifiedHeader] = row[index];
            }
          });
          return obj;
        });

        resolve(result);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    try {
      const jsonData = await convertExcelToJson(file);
      // console.log(jsonData,)
      // return;
      const finalData = jsonData.filter((item) => { return item != null })
      if (wrongRecord.length > 0) { notify("error", `${wrongRecord.length} records are Wrong`); }
      const hasValidationError = finalData.some((item) => item === false);
      if (!hasValidationError) {
        try {
          const options = {
            method: "post",
            url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/create`,
            headers: {
              desktop: true,
            },
            data: { providerId: userData?._id, orders: finalData },
          };
          const response = await axios(options);
          console.log("response-->", response)
          if (response?.data?.success) {
            console.log(response?.data?.data?.url,'response?.data?.data?.url')
            if(response?.data?.data?.url){
              window.open(response?.data?.data?.url, "_blank");
            }
            setCreateShipmentPopup(response?.data?.data?.orderData?._id)
            shipmentOrders();
            toast(`Sheet Upload successfully`);
          }
          if (wrongRecord.length > 0) {
            setTimeout(() => {
              myRef.current.link.click();
              setWrongRecord([]);
            }, 1000);
          }
        } catch (error) {
          notify('error', 'Something went wrong');
        }
      }

    } catch (error) {
      handleError(error);
    }
  };

  const { downloadShipmentDetails, loading } = useDownloadShipmentDetails();

  const handleClick = async () => {
    const success = await downloadShipmentDetails(user_data?._id);
    if (success) toast("Download Shipments successfully");
    else toast("No Shipment Found");
  };

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <div className="RightBlock" >
        <div className="order-section">
          <div className="section-title">
            <h1 className="m-0"> Shipments</h1>
            <div style={{ display: 'none' }}>

            </div>

            <div className="order-data-btn d-flex align-items-center flex-wrap gap-2">
              {/* {user_data?._id && user_data?.brandName == "B2B" &&<button className="download-btn" onClick={()=>downloadShipmentDetails(user_data?._id) ? toast(`Download Shipments successfully`): toast(`No Shipment Found`)}>Download Shipments Data</button>} */}
              {user_data?._id && user_data?.brandName === "B2B" && (
                <button
                  className="download-btn"
                  onClick={handleClick}
                  disabled={loading}
                >
                  {loading ? "Downloading..." : "Download Shipments Data"}
                </button>
              )}
              <div className="order-data-btn ">
                <label className="btn btn-sm btn-primary">Upload Sheet
                  <input style={{ display: 'none' }} type="file" onChange={(e) => handleFileChange(e)} />
                </label>
              </div>
            </div>
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
                  href="#home"
                  onClick={() => {
                    setpage(1);
                    setstatus("created");
                  }}
                >
                  Created<span>({toggleCount?.createdCount})</span>
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
                          shipmentOrders();
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
                  </div>
                </div>
                {KikoOrderData?.length > 0 ? (
                  <div className="table-responsive">
                    {tableLoading ? (
                      <Spin indicator={antIcon} className="loader" />
                    ) : (
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th scope="col">Sr No.</th>
                            <th scope="col">Shipment Created Date & Time</th>
                            <th scope="col">Shipment ID</th>
                            <th scope="col">Total Trips</th>
                            <th scope="col">Total Drop Points</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Shipment Status</th>
                            <th scope="col">Order Details</th>
                            <th scope="col">Shipment Delivered Date & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {KikoOrderData.map((order, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  {moment(order?.createdAt).format(
                                    "DD MMMM YYYY"
                                  ) +
                                    " at " +
                                    moment(order?.createdAt).format(
                                      "hh:mm A"
                                    )}
                                </td>
                                <td>{order?.orderId}</td>
                                <td>
                                  {order?.arraySize === 0
                                    ? "-"
                                    : (order?.b2blogistiscs?.filter(t => t.onNetworklogisticData.onNetworklogisticStatus === "parcel_delivered")?.length || 0) + "/" + order?.arraySize}
                                </td>
                                <td>
                                  {order?.arraySize === 0
                                    ? "-"
                                    : order?.latLongRoutesSize
                                      ? order?.latLongRoutesSize - 1
                                      : 0}
                                </td>
                                <td>
                                  {order?.arraySize === 0
                                    ? "-"
                                    : order?.totalAmount
                                      ? order?.totalAmount.toFixed(2)
                                      : '0'}
                                </td>
                                <td>
                                  {order?.arraySize === 0 ? (
                                    <button
                                      className="btn btn-sm btn-outline shipment-status-btn"
                                      style={{ color: "red", borderColor: "red" }}
                                      onClick={() => setShowCreatedAlert(true)}
                                    >
                                      Error
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-outline shipment-status-btn"
                                    >
                                      {order?.b2blogistiscs?.every(t => t.onNetworklogisticData?.onNetworklogisticStatus === "Cancelled")
                                        ? "Cancelled"
                                        : order?.b2blogistiscs?.some(t => t.onNetworklogisticData?.isOnNetwork === true) &&
                                          order?.b2blogistiscs?.every(t => t.onNetworklogisticData?.onNetworklogisticStatus === "parcel_delivered" || t.onNetworklogisticData?.onNetworklogisticStatus === "rto_delivered")
                                          ? "Completed"
                                          : order?.b2blogistiscs?.some(t => t.onNetworklogisticData?.isOnNetwork === true)
                                            ? "In-Progress"
                                            : "Created"}
                                    </button>
                                  )}
                                </td>
                                <td>
                                  {order?.arraySize === 0 ? (
                                    "-"
                                  ) : (
                                    <span
                                      className="view-order view-order-link"
                                      onClick={() => {
                                        navigate(`/orders-details`, {
                                          state: { id: order?._id }
                                        });
                                      }}
                                    >
                                      View Order
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {( order?.b2blogistiscs?.length <2 && order?.b2blogistiscs?.[0].updatedAt && order?.b2blogistiscs?.every(t => t.onNetworklogisticData?.onNetworklogisticStatus === "parcel_delivered" || t.onNetworklogisticData?.onNetworklogisticStatus === "rto_delivered")) ? moment(order?.b2blogistiscs?.[0].updatedAt).format(
                                    "DD MMMM YYYY"
                                  ) +
                                    " at " +
                                    moment(order?.b2blogistiscs?.[0].updatedAt).format(
                                      "hh:mm A"
                                    ): "-"}
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
                  {singleOrderData?.orderTripsId &&
                    singleOrderData?.orderTripsId.map((item, index) => {
                      return (
                        <div className="order-items-cells">
                          <div className="left-block-order-items">
                            <p>
                              <span>{index + 1}</span> Trip
                            </p>
                          </div>
                          <div className="action-order-items">
                            <button className="confirm-button" onClick={() => {
                              navigate(`/track-shipment/${item?._id}`, {
                                state: { vendor: true } // Pass the entire item as a prop
                              });
                            }} >Track Trip</button>
                            <button className="confirm-button" onClick={() => { setTripView(true); setSingleTripData(item) }} >View</button>

                            {!item?.onNetworklogisticData?.isOnNetwork ?

                              <Button
                                onClick={() => setInitPopup(item._id)}
                                type="primary"
                                className="confirm-button"
                              >
                                Initiate Pickup
                              </Button>
                              :
                              <Button
                                onClick={() => { setLogisticDetail(item?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails); setOrderView(false); }}
                                type="primary"
                                className="confirm-button"
                                disabled={modalLoading !== ""}
                                loading={item?._id == modalLoading}
                              >
                                Logistic Details
                              </Button>}

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
          className="viewOrder"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container">
            <div className="view-order-modal">
              <ModalHeader className="ps-0 pe-0">
                Trip Details
                <img
                  src={crossIcon}
                  onClick={() => {
                    setTripView(false)
                  }}
                  alt=""
                />
              </ModalHeader>
              <ModalBody className="p-0">
                {singleTripData?.orderIds?.length > 0 &&
                  singleTripData?.orderIds?.map((item, index) => {
                    return (
                      <>
                        <div className="viewOrder-content-block">
                          <div className="count-order-no-block">
                            <span>{index + 1}</span>
                          </div>
                          <div className="viewOrder-description-container">
                            <div className="orderDetail-store-no">
                              <ul>
                                <li>{item?.storeName}</li>
                                <li>{item?.storeMobile}</li>
                                <li>OTP: {item?.endOtp}</li>
                              </ul>
                            </div>
                            <div className="orderDetail-store-no">
                              <ul>
                                <li>Order Id: {item?.orderId}</li>
                                <li>Status: {item?.orderStatus}</li>
                              </ul>
                            </div>
                            <p>{item?.storeAddress}</p>
                            <div className="button-action-view-store">
                              <button onClick={() => { setStoreDetail(item) }} >View Item</button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                {singleTripData?.onNetworklogisticData?.onNetworklogisticOrderId && <p>Logistic Order Id: {singleTripData?.onNetworklogisticData?.onNetworklogisticOrderId}</p>}
              </ModalBody>
            </div>
          </div>
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
                    setStoreDetail({})
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
                    Mobile Number:{" "}
                    <span>{storeDetail?.storeMobile}</span>{" "}
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
                              <td>
                                {item?.weight + " " + item?.weightUnit}
                              </td>
                              <td>{item?.quantity}</td>
                              <td className="text-end">{parseFloat(item?.netInvoiceValue).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter className="ps-0 pe-0">
                <div className="d-flex gap-2 justify-content-center w-100">
                </div>
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
              onClick={() => { setSelectVehicle(false); setItemId("") }}
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
                        <th>Available Vehicle</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableVehicles.map((vehicle, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <label className="custom-radio" onClick={() => { setOrderDeliveryMode(vehicle); }
                              } > {vehicle?.vehicle}
                                <input type="radio" name="radio" className="custom-radio-input"
                                  checked={orderDeliveryMode?.vehicle == vehicle?.vehicle}
                                  onClick={() => {
                                    setOrderDeliveryMode(vehicle);
                                  }} />
                                <span className="custom-radio-checkmark"></span>
                              </label>
                            </td>
                            <td>₹{vehicle?.charge}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="popup-footer">
                <button className="back-button"
                  onClick={() => { setSelectVehicle(false); setItemId("") }}>Cancel</button>
                <button className="confirm-button"
                  disabled={!orderDeliveryMode?.fulfillment_id || modalLoading !== ""}
                  onClick={() => { initiateDelivery(orderDeliveryMode, singleOrderData?.orderId) }}
                >
                  {modalLoading && <Spin indicator={antIcon} />}Proceed</button>
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
          style={{ width: "350px" }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          {modalLoading ? (
            <Spin indicator={antIcon} className="me-2" />
          ) : (
            <div className="container">
              <ModalHeader className="ps-0 pe-0 Courier-info">
                Courier Info
                <img
                  src={crossIcon}
                  onClick={() => {
                    setLogisticDetail({});
                  }}
                  alt=""
                />
              </ModalHeader>
              {(logisticDetail?.name) ? (
                <div className="view-popup">
                  <div>
                    <div className="textAlign">
                      <h5>Id :</h5>
                      <p>
                        {logisticDetail?.id}
                      </p>
                    </div>
                    <div className="textAlign">
                      <h5>Name :</h5>
                      <p>
                        {logisticDetail?.name}
                      </p>
                    </div>
                    <div
                      className="textAlign"
                      onClick={() => {
                        const phoneNumber = (logisticDetail?.phone)
                        makePhoneCall(phoneNumber);
                      }}
                    >
                      <h5>Mobile :</h5>
                      <p>{logisticDetail?.phone}</p>
                    </div>
                  </div>
                  <div className="textAlign m-0">
                    <button className="btn btn-sm btn-primary">
                      <a
                        href={logisticDetail?.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="termsCondition"
                      >
                        {" "}
                        Track order{" "}
                      </a>
                    </button>
                  </div>
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
            </div>
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
          <div className="container pb-3 pt-3">
            <div className="py-4">
              <h4 className="text-center mb-0">
                Are you sure you want to Initiate this order?
              </h4>
              <div className="options-block"></div>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-3">

              <button
                className="btn btn-sm btn-success"
                onClick={() => initiatePickup(singleOrderData?.orderId, initPopup)}
                disabled={modalLoading !== ""}
                loading={initPopup == modalLoading}
              >
                {initPopup == modalLoading && <Spin indicator={antIcon} />}Yes
              </button>
              <button
                className="btn btn-sm btn-danger"
                disabled={modalLoading !== ""}
                onClick={() => {
                  setInitPopup("");
                }}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={(createShipmentPopup && createShipmentPopup != "") ? true : false}
          onClose={() => {
            setCreateShipmentPopup("");
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container pb-3 pt-3">
            <div className="py-4">
              <h4 className="text-center mb-0">
                Sheet uploaded Successfully!
                Go to orders
              </h4>
              <div className="options-block"></div>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-3">

              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  navigate(`/orders-details`, {
                    state: { id: createShipmentPopup }
                  });
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-sm btn-danger"
                disabled={modalLoading !== ""}
                onClick={() => {
                  setCreateShipmentPopup("");
                }}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showCreatedAlert}
          toggle={() => setShowCreatedAlert(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container pb-3 pt-3">
            <div className="py-4">
              <h4 className="text-center mb-0">
                Sorry! Unable to create trips due to limits, Please try to reduce weight or prices of trips.
              </h4>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowCreatedAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        </Modal>
        <div className="d-flex justify-content-center">
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={toggleCount?.totalCount}
            page={page}
          />
        </div>
      </div>
    </>
  );
}
export default CreateOrder;
