import React, { useEffect, useState } from "react";
import bottomArrow from "../../images/black-down-arrow.svg";
import CallIcon from "../../components/svgIcons/CallIcon";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Dropdown } from 'antd';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import "./styles.scss";
import { handleError, notify } from "../../utils";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { RightArrow, ThreeDots } from "../../components/svgIcons";
const libraries = ['places'];

const TrackShipment = (props) => {

  const  location = useLocation();
  

  const getQueryParams = () => {
    
    const params = new URLSearchParams(location?.search); // Parse the query string
    // console.log(params,'parasm')
    return {
      vendor: params.get('type'), // Get the 'vendor' query parameter
    };
  };

  const { id } = useParams();
  const { vendor } = getQueryParams();

  const navigate = useNavigate();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [componentMounted, setComponentMounted] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpValues, setOtpValues] = useState({});
  const [tripEndPoints, setTripEndPoints] = useState([]);
  const [tripData, setTripData] = useState({});
  const [viewMap, setViewMap] = useState("track");
  const [isActive, setActive] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');




  const toggleClass = () => {
    setActive(!isActive);
  };

  const getSellerToken = () => {
    try {
      return JSON.parse(localStorage.getItem("token") || "");
    } catch (error) {
      return null;
    }
  };

  const handleOtpChange = (e, orderId) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setOtpValues((prevState) => ({
        ...prevState,
        [orderId]: value,
      }));
    }
  };

  const verifyOtp = async () => {
    const token = getSellerToken();
    const data = {}
    for (const [key, value] of Object.entries(otpValues)) {
      data.endOtp = value
      data.orderId = key
    }
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/verifyOtp`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        notify("success", `${response.data.message}`)
        tripDetail();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const resendOtp = async (orderId) => {
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/resend-otp`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: { orderId },
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        notify("success", `${response.data.message}`)
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const updateStatus = async (orderId, status) => {
    const token = getSellerToken();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/updateOrderStatus`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: { orderId, "orderStatus": status },
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        notify("success", `${response.data.message}`)
        tripDetail();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const tripDetail = async () => {
    setIsLoading(true);
    const token = getSellerToken();
    let data = {
      _id: id
    };
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/getTripDetails`,
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.data.success) {
        const splitLatLong = (latLongString) => {
          const [lat, lng] = latLongString.split(",");
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        };
        const result = response?.data?.data?.tripRoutes.flatMap((item, index) => {
          let coordinates;
          if (index === 0) {
            const sourceCoordinates = splitLatLong(item.source);
            const destinationCoordinates = splitLatLong(item.destinattion);
            coordinates = [sourceCoordinates, destinationCoordinates];
            return coordinates;
          } else {
            coordinates = splitLatLong(item.destinattion);
            return coordinates;
          }
        });
        setTripData(response?.data?.data);
        setTripEndPoints(result.slice(0, -1));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const DurationDisplay = (totalDuration) => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    return (
      <div className="clock-block">
        <span>{hours}hr</span>
        :
        <span>{minutes}min</span>
      </div>
    );
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries: libraries,
  });


  useEffect(() => {
    if (componentMounted) {
      tripDetail();
    } else {
      setComponentMounted(true);
    }
  }, [componentMounted]);

  useEffect(() => {
    if (isLoaded && tripEndPoints.length > 1) {
      const origin = tripEndPoints[0];
      // const destination = tripEndPoints[tripEndPoints.length - 1];
      const destination = tripEndPoints[tripEndPoints.length - 1];
      const waypoints = tripEndPoints.slice(1,-1).map(point => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: true,
      }));
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error('Error fetching directions', status);
          }
        }
      );
    }
  }, [isLoaded, tripEndPoints]);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = tripEndPoints[0] ? {
    lat: tripEndPoints[0]?.lat || 22.7196,
    lng: tripEndPoints[0]?.lng || 75.8577,
  } : { lat: 22.7196, lng: 75.8577 };

  const items = [
    {
      key: '2',
      label: 'Send OTP',
    },
    {
      key: '3',
      label: 'Reschedule',
    },
    {
      key: '4',
      label: 'Cancelled',
    },
  ];
  const handleMenuClick = (e, data) => {
    const { key } = e;
    switch (key) {
      case '2':
        resendOtp(data._id);
        break;
      case '3':
        showModal("Reschedule", data);
        break;
      case '4':
        showModal("Cancelled", data);
        break;
      default:
        break;
    }
  };
  const showModal = (actionType, data) => {
    setActionType(actionType);
    setSelectedData(data); // ✅ Store data for later use
    setIsModalVisible(true);
  };
  const handleOk = () => {
    if (!selectedData) return; // ✅ Ensure selectedData exists

    if (actionType === 'Reschedule') {
      updateStatus(selectedData._id, "Reschedule");
    } else if (actionType === 'Cancelled') {
      updateStatus(selectedData._id, "Cancelled");
    }
    
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function getLetterByIndex(index) {
    // Ensure the index is within the range of letters in the alphabet (1 to 26)
    if (index >= 1 && index <= 26) {
      return String.fromCharCode(64 + index); // 96 + index gives 'a' for 1, 'b' for 2, etc.
    } else {
      return null; // Return null if index is out of bounds
    }
  }

  async function openMap(){
    let source = ""
    let destination = ""
    let waypoints = []
    let prm = tripData?.tripRoutes.flatMap((item, index) => {
      let coordinates;
      if (index === 0) {
        source = item.source;
        destination = item.source
        waypoints.push(item.destinattion)
        // return coordinates;
      } else if(index != tripData?.tripRoutes?.length - 1) {
        waypoints.push(item.destinattion)
        // coordinates = splitLatLong(item.destinattion);
        // return coordinates;
      } 
    })
    await Promise.all(prm)

    let waypointParams = waypoints.join("|")
    let url = `https://www.google.com/maps/dir/?api=1&origin=${source}&destination=${destination}&waypoints=${waypointParams}&travelmode=driving&authuser=3`
    console.log(url,'url')
    window.open(url, '__blank')
  }

  return isLoaded && !isLoading ? (
    <div className="track-shipment-section">

      <div className="track-shipment-map-details-section">
        <div className="mobile-tab-button-stack">
          <button className={viewMap === 'track' ? "active" : ""} onClick={() => { setViewMap('track') }} >Track Order</button>
          <button className={viewMap === 'shipment' ? "active" : ""} onClick={() => { setViewMap('shipment') }}>Shipment Details</button>
        </div>
        <div className={isActive ? 'track-shipment-row-map' : 'track-shipment-row-map active-sidebar'} >
          <div className={viewMap === "track" ? "left-detail-container" : "left-detail-container track-shipment-view-on"}>
            <div className="page-header-track-shipment justify-space-between">
              <div className="d-flex align-items-center gap-2">
                {vendor == "seller" &&<button className="arrow-btn" onClick={() => {
                  navigate(`/orders-details`, {
                    state: { id: tripData?.b2bLogisticOrderId?._id }
                  });
                }}>
                  <RightArrow />
                </button>}
                <h2>Track Your Shipment</h2>
              </div>
              <button onClick={()=> openMap()} className="btn btn-primary btn-xs">Go to Google Maps</button>
            </div>
            <div className="map-header-detail">
              <h4>Shipment in Transit</h4>
              <button className="toggle-map-button" onClick={toggleClass} >
                <img
                  src={bottomArrow}
                  alt="Icon"
                  className="map-block-toggle"
                />
              </button>
            </div>
            {tripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name &&
              <>
                <div className="order-person-detail-row">
                  {/* <div className="avtar-image-block">
                    <img src="https://images.pexels.com/photos/30337813/pexels-photo-30337813/free-photo-of-portrait-of-woman-with-afro-hairstyle-against-wooden-door.jpeg" />
                  </div> */}
                  <div className="name-drive-details">
                    <span>{tripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.name}</span>
                    <p>{tripData?.onNetworklogisticData?.onNetworklogisticFulfillmentData?.agentDetails?.phone}</p>
                  </div>
                  <div className="time-distance-block">
                    {DurationDisplay(tripData?.totalDuration)}
                    <p>{tripData?.totalDistanceText}</p>
                  </div>
                </div></>
            }
            <div className="timeline-row-section">
            {        console.log(vendor, '<----vendor')}
            <div className="timeline-row" >
                    <div className="timeline-cell-content">
                      <div className="timeline-header-detail">
                        <ul>
                          <li><span style={{fontWeight:"bold",fontSize:"20px"}}>{"A "}</span>.{tripData?.b2bLogisticOrderId.wareHouseDistributorName}</li>
                          <li>{tripData?.b2bLogisticOrderId.wareHouseDistributorContactNumber}</li>
                        </ul>
                      </div>

                      <div className="address-phone-container">
                        <p>{tripData?.b2bLogisticOrderId.wareHouseDistributorAddress}</p>
                      </div>
                    </div>
                  </div>
              {Object.keys(tripData?.storeArray || {}).map((key, index) => {
                return (
                  <div className="timeline-row" key={key}>
                    <div className="timeline-cell-content">
                      <div className="timeline-header-detail">
                        <ul>
                          <li><span style={{fontWeight:"bold",fontSize:"20px"}}>{getLetterByIndex(index + 2)}</span>. {tripData?.storeArray[key][0]?.storeName}</li>
                          <li>{tripData?.storeArray[key][0]?.storeMobile}</li>
                        </ul>
                      </div>

                      <div className="address-phone-container">
                        <p>{tripData?.storeArray[key][0]?.storeAddress}</p>
                        {/* <span className="address-open-btn" /> */}
                      </div>

                      {/* Here we render the orders without reversing */}
                      {tripData?.storeArray[key].map((data, orderIndex) => (
                        <div key={`${key}-${orderIndex}`}>
                          {/* Conditional rendering for order status and vendor */}
                          {data?.orderStatus === "Completed" && vendor && (
                            <div className="order-done">
                              <span>Order Delivered</span>
                            </div>
                          )}

                          {vendor == "driver" && (
                            <div className="orderId-container-row">
                              {data?.orderStatus === "Completed" ? (
                                <div className="order-done">
                                  <div className="order-input-container">
                                    <p>1. Order ID: {data?.orderId}</p> {/* Correct orderId reference */}
                                    <span>Order Delivered</span>
                                  </div>
                                </div>
                              ):  data?.orderStatus === "Cancelled" ? (
                                <div className="order-done">
                                  <div className="order-input-container">
                                    <p>1. Order ID: {data?.orderId}</p> {/* Correct orderId reference */}
                                    <span style={{color:"Red"}}>Order Cancelled</span>
                                  </div>
                                </div>
                              ) : data?.orderStatus === "Reschedule" ? (
                                <div className="order-done">
                                  <div className="order-input-container">
                                    <p>1. Order ID: {data?.orderId}</p> {/* Correct orderId reference */}
                                    <span style={{color:"blue"}}>Order Reschedule</span>
                                  </div>
                                </div>
                              )  : (
                                <>
                                  <div className="order-input-container">
                                    <p>1. Order ID: {data?.orderId}</p> {/* Correct orderId reference */}
                                    <div className="input-container-order-inline">
                                      <div className="orderid-input-cells">
                                        <input
                                          id={data.orderId}
                                          type="number"
                                          value={otpValues[data.orderId] || ''}
                                          onChange={(e) => handleOtpChange(e, data.orderId)}
                                          onFocus={(e) =>{
                                            e.target.addEventListener(  
                                              "wheel",
                                              function (e) {
                                                e.preventDefault();
                                              },
                                              { passive: false }
                                            );
                                            setOtpValues({});
                                          }
                                          }
                      
                                          maxLength={4}
                                          className="float-input-field"
                                          placeholder="OTP"
                                        />
                                        <div className="action-btn-submit">
                                          <button
                                            disabled={Object.keys(otpValues)[0] !== data.orderId}
                                            onClick={() => verifyOtp()}
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      </div>
                                      <div className="button-action-block">
                                        <button
                                          onClick={() => {
                                            const telUrl = `tel:${data?.storeMobile}`;
                                            window.open(telUrl, "_blank", "noopener,noreferrer");
                                          }}
                                        >
                                          <CallIcon />
                                        </button>

                                        <Dropdown
                                          overlayClassName="drowndown-menu-icon-custom"
                                          menu={{
                                            items,
                                            onClick: (e) => handleMenuClick(e, data),
                                          }}
                                        >
                                          <button onClick={(e) => e.preventDefault()}>
                                            <ThreeDots />
                                          </button>
                                        </Dropdown>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
          <div className={viewMap === "shipment" ? "right-map-container" : "right-map-container track-shipment-view-on"}>
            <div className="map-container-shipment">
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={12}
                center={center}
              >
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    options={{
                      polylineOptions: {
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 3,
                      },
                    }}
                  />
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
      <Modal
          isOpen={isModalVisible}
          onClose={handleCancel}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="container pb-3 pt-3">
            <div className="py-4">
              <h4 className="text-center mb-0">
                Are you sure you want to {actionType} this order?
              </h4>
              <div className="options-block"></div>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-3">

              <button
                className="btn btn-sm btn-success"
                onClick={handleOk}
              >
                Yes
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleCancel}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
    </div >
  ) : (
    <></>
  );
};

export default TrackShipment;
