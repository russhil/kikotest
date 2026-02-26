import React, { useState, useEffect } from "react";
import ondcNetwork from "../../images/ondc-network.png";
import { useLocation } from 'react-router-dom';
import { GET_CATEGORY_CATEGORIES } from "../../api/apiList";
import "./viewTicket.scss";
import Logout from "../../images/ShopDetails/logout.svg";
import arrow_back from "../../images/Inventry/arrow_back.svg";
import axios from "axios";
import { get, size } from "lodash";
import ThreeDots from "../../images/Inventry/three-dots.svg"
import WhiteDownArrow from "../../images/Inventry/down-arrow.svg"
import EditIcon from "../../images/Inventry/edit-icon.svg"
import ContactIcon from "../../images/contact-icon.svg";
import ContactInfo from "../../images/Inventry/info.svg"
import moment from "moment";
import API from "../../api";
import { LoadingOutlined } from "@ant-design/icons";
import { Space, Spin } from "antd";
import { handleError, notify,handleLogout } from "../../utils";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";

function EditTicket() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [singleIgmData, setSingleIgmData] = useState(state ? state : null);
    const [categories, setcategories] = useState([]);
    const [isSpin, setIsSpin] = useState(false);
    const [igmIssue, setIgmIssue] = useState({
        statustypeOfresolution: get(state, "typeOfresolution", ""),
        typeOfRespond: get(state, "typeOfRespond", ""),
        classification: get(state, "ZohoTicketClassification", ""),
        status: get(state, "ticketStatus", ""),
        resolution: get(state?.rawObject?.resolution, "long_desc", ""),
        modifiedTime: new Date(),
        closedTime: "",
        kikoStatus: get(state, "kikoStatus", "OPEN")
    })
    const [loading, setLoading] = useState(false);
    const getIgmDetails = () => {
        try {
          return JSON.parse(localStorage.getItem("igmUser") || "");
        } catch (error) {
          return null;
        }
      };
    const userData = getIgmDetails();

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      useEffect(() => {
        if (!get(userData, "_id", "") || get(userData, "_id", "") === "") {
          handleLogout();
          navigate("/igm");
        }
      }, []);


    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const getCategories = async () => {
        try {
            const response = await API.get(GET_CATEGORY_CATEGORIES);
            if (response.data?.success) {
                setcategories(response?.data?.data);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const updateIssueData = async (singleIgmData) => {
        setLoading(true)
        if (igmIssue.classification == "" || igmIssue.typeOfRespond == "" || igmIssue.typeOfresolution == "") {
            notify('error', "Please FIll Mandatory Field.")
            return;
        }
        if (igmIssue.status == "CLOSE") {
            igmIssue.closedTime = new Date()
        }
        const obj = {
            singleIgmData,
            igmIssue
        }
        console.log("obj-->", obj);

        const options = {
            method: 'post',
            url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/issue-webhook`,
            data: obj,
        }
        const result = await axios(options)
        setLoading(false)
        if (result?.data?.success) {
            notify('success', "Update Successfully..")
            navigate('/igm-manager')
        }
    }

    const getInitials = (name) => {
        const words = name?.split(' ');
        const initials = words?.map(word => word?.charAt(0).toUpperCase());
        return initials?.join('');
    };
    const formatDateAgo = (date) => {
        const createdAt = moment(date);
        const formattedTime = createdAt.format('hh:mm A');
        const timeAgo = createdAt.fromNow();
        return `${formattedTime} (${timeAgo})`;
    };

    const addISODurationToCurrentTime = (duration, deliveredTime) => {
        // Regular expression to match ISO 8601 durations (e.g., PT3H, P2D, PT30M)
        const regex = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
        const match = duration?.match(regex);
        if (match) {
            // Extract days, hours, minutes, and seconds
            const days = parseInt(match[1] || 0, 10);
            const hours = parseInt(match[2] || 0, 10);
            const minutes = parseInt(match[3] || 0, 10);
            const seconds = parseInt(match[4] || 0, 10);
            // Get the current date and time
            const orderDeliveredTime = new Date(deliveredTime);
            // Add the extracted time intervals to the current date
            orderDeliveredTime.setDate(orderDeliveredTime.getDate() + days);
            orderDeliveredTime.setHours(orderDeliveredTime.getHours() + hours);
            orderDeliveredTime.setMinutes(orderDeliveredTime.getMinutes() + minutes);
            orderDeliveredTime.setSeconds(orderDeliveredTime.getSeconds() + seconds);
            // Format the date to ISO 8601 string
            const isoString = orderDeliveredTime.toISOString();
            return isoString;
        }
        else {
            return null
        }
    }

    return (
        <>
            <div class="view-content-section">
                <div className="ticket-heading">
                    <h3 className="heading-text">Kiko Live | IGM Panel</h3>
                    <button
                        className="logout-icon"
                        onClick={() => {
                            localStorage.removeItem("igmUser");
                            localStorage.removeItem("token");
                            window.location.reload();
                        }}
                    >
                        {" "}
                        <img src={Logout} alt="" />
                    </button>
                </div>
                <div class="view-ticket-header"><div class="view-ticket-heading" onClick={() => navigate('/view-ticket', { state: singleIgmData })}><img src={arrow_back} alt="" style={{cursor: 'pointer'}}/> Edit Ticket({singleIgmData?.zohoTicketId})</div></div>
                <div class="view-ticket-body">
                    <div className='view-ticket-heading-block'>
                        <div className='view-ticket-modal-flex'>
                            <div className='view-ticket-modal-left'>
                                <div className='ticket-left-view'>
                                    <div className='ticket-information-section'>
                                        <div className='ticket-information'>Ticket Information</div>
                                        <form className='form'>
                                            <div className='row'>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Department*</label>
                                                    <input type='text' placeholder='Kiko Live' value={"Kiko Live"} className='form-control' />
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Contact Name*</label>
                                                    <input type='text' placeholder='Kiko Live' value={singleIgmData?.rawObject?.issue?.complainant_info?.person?.name} className='form-control' />
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Email</label>
                                                    <input type='email' placeholder='Kiko Live' value={singleIgmData?.rawObject?.issue?.complainant_info?.contact?.email} className='form-control' />
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Phone</label>
                                                    <input type='number' placeholder='Kiko Live' value={singleIgmData?.rawObject?.issue?.complainant_info?.contact?.phone} className='form-control' />
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Name</label>
                                                    <input type='text' placeholder='Kiko Live' value={singleIgmData?.rawObject?.issue?.complainant_info?.person?.name} className='form-control' />
                                                </div>
                                                <div className='col-12  mb-3'>
                                                    <label className='form-label'>Subject*</label>
                                                    <input type='text' placeholder='Kiko Live' value={singleIgmData?.rawObject?.issue?.description?.short_desc} className='form-control' />
                                                </div>
                                                <div className='col-12  mb-3'>
                                                    <label className='form-label'>Description</label>
                                                    <textarea className='form-control' value={singleIgmData?.rawObject?.issue?.description?.long_desc} placeholder='Type Here' style={{ minHeight: "100px" }}></textarea>
                                                </div>
                                            </div>
                                            <div className='products-card-flex'>
                                                {singleIgmData?.rawObject?.issue?.description?.images.map((data) => {
                                                    return (
                                                        <>
                                                            {data?.length > 3 && <div className='product-item'>
                                                                <img src={data} width={"120px"} height={"102"} />
                                                            </div>}
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </form>
                                    </div>
                                    <div className='additional-information-section'>
                                        <div className='ticket-information'>Additional Information</div>
                                        <form className='form'>
                                            <div className='row'>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Category*</label>
                                                    <select disabled
                                                        value={singleIgmData?.orderData?.orderCategory[0]}
                                                        className='form-select'>
                                                        <option value=''>Shop Category</option>
                                                        {categories.map((category, index) => {
                                                            return (
                                                                <option className='form-option' key={index} value={category.title}>{category.title}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Type Of Resolution*</label>
                                                    <select className='form-select'
                                                        disabled={igmIssue.status == 'CLOSE'}
                                                        value={igmIssue?.typeOfresolution}
                                                        onChange={(e) => {
                                                            const newValue = e.target?.value;
                                                            setIgmIssue((prevIgmIssue) => ({
                                                                ...prevIgmIssue,
                                                                typeOfresolution: newValue
                                                            }));
                                                            // this.setState((prevState) => ({
                                                            //     igmIssue: {
                                                            //         ...prevState.igmIssue,
                                                            //         typeOfresolution: newValue
                                                            //     }
                                                            // }));
                                                        }}
                                                    >
                                                        <option className='form-option' value="" >Select</option>
                                                        <option className='form-option' value="REFUND">Refund</option>
                                                        <option className='form-option' value="RETURN">Return</option>
                                                        <option className='form-option' value="REPLACEMENT">Replacement</option>
                                                        <option className='form-option' value="CANCEL">Cancel</option>
                                                        <option className='form-option' value="NO-ACTION">No-Action</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Type Of Respond*</label>
                                                    <select className='form-select' value={igmIssue.typeOfRespond}
                                                        disabled={igmIssue.status == 'CLOSE'}
                                                        onChange={(e) => {
                                                            const newValue = e.target?.value;
                                                            setIgmIssue((prevIgmIssue) => ({
                                                                ...prevIgmIssue,
                                                                typeOfRespond: newValue
                                                            }));
                                                            // this.setState((prevState) => ({
                                                            //     igmIssue: {
                                                            //         ...prevState.igmIssue,
                                                            //         typeOfRespond: newValue
                                                            //     }
                                                            // }));
                                                        }}
                                                    >
                                                        <option className='form-option' value="" >Select</option>
                                                        <option className='form-option' value="PROCESSING">Processing</option>
                                                        <option className='form-option' value="NEED-MORE-INFO">Need-More-Info</option>
                                                        <option className='form-option' value="CASCADED">Cascaded</option>
                                                        <option className='form-option' value="RESOLVED">Resolved</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Classifications*</label>
                                                    <select className='form-select'
                                                        value={igmIssue.classification}
                                                        disabled={igmIssue.status == 'CLOSE'}
                                                        onChange={(e) => {
                                                            const newValue = e.target?.value;
                                                            setIgmIssue((prevIgmIssue) => ({
                                                                ...prevIgmIssue,
                                                                classification: newValue
                                                            }));
                                                            // this.setState((prevState) => ({
                                                            //     igmIssue: {
                                                            //         ...prevState.igmIssue,
                                                            //         classification: newValue
                                                            //     }
                                                            // }));
                                                        }}
                                                    >
                                                        <option className='form-option' value="" >Select</option>
                                                        <option className='form-option' value="Pre-Shipment Order Cancellation Related">Pre-Shipment Order Cancellation Related</option>
                                                        <option className='form-option' value="Post-Shipment Order Cancellation Related">Post-Shipment Order Cancellation Related</option>
                                                        <option className='form-option' value="Order Shipment / Delivery Status">Order Shipment / Delivery Status</option>
                                                        <option className='form-option' value="Address Change Related">Address Change Related</option>
                                                        <option className='form-option' value="Product Quality issue(Post Delivery)">Product Quality issue(Post Delivery)</option>
                                                        <option className='form-option' value="Return Related">Return Related</option>
                                                        <option className='form-option' value="Refund Related">Refund Related</option>
                                                        <option className='form-option' value="Payment Failure">Payment Failure</option>
                                                        <option className='form-option' value="Others">Others</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Due Date</label>

                                                    <input type='text' className='form-control' value={moment(new Date(addISODurationToCurrentTime(singleIgmData?.rawObject?.issue?.expected_resolution_time?.duration, singleIgmData?.rawObject?.issue?.created_at))).format("DD-MM-YYYY HH:mm:ss")} placeholder='31 Aug 09:34 AM' />
                                                </div>
                                                <div className='col-lg-6 col-sm-12 mb-3'>
                                                    <label className='form-label'>Status</label>
                                                    <select className='form-select'
                                                        value={igmIssue.status}
                                                        disabled
                                                        onChange={(e) => {
                                                            const newValue = e.target?.value;
                                                            setIgmIssue((prevIgmIssue) => ({
                                                                ...prevIgmIssue,
                                                                status: newValue
                                                            }));
                                                            // this.setState((prevState) => ({
                                                            //     igmIssue: {
                                                            //         ...prevState.igmIssue,
                                                            //         status: newValue
                                                            //     }
                                                            // }));
                                                        }}
                                                    >
                                                        <option className='form-option' value="" >Select</option>
                                                        <option className='form-option' value="Open" >Open</option>
                                                        <option className='form-option' value="CLOSE">Closed</option>
                                                    </select>
                                                </div>
                                                <div className='col-12  mb-3'>
                                                    <label className='form-label'>Resolution</label>
                                                    {/* <ReactQuill theme="snow" className='form-control' value={igmIssue?.resolution} 
                                                        onChange={(newValue) => {
                                                            setIgmIssue((prevIgmIssue) => ({
                                                              ...prevIgmIssue,
                                                              resolution: newValue
                                                            }));
                                                          }}
                                                     /> */}
                                                    <textarea className='form-control' value={igmIssue?.resolution}
                                                        disabled={igmIssue.status == 'CLOSE'}
                                                        onChange={(e) => {
                                                            setIgmIssue((prevIgmIssue) => ({
                                                              ...prevIgmIssue,
                                                              resolution: e.target.value
                                                            }));
                                                          }}
                                                        placeholder='Type Here' style={{ minHeight: "100px" }}></textarea>
                                                </div>
                                                <div className='additinol-information-btn'>
                                                    <button className='form_save_btn' style={{minWidth: '116px'}} onClick={(e) => { e.preventDefault(); updateIssueData(singleIgmData) }} disabled={loading} >{loading ? <Space size="middle">
                                                        <Spin size="small" />
                                                    </Space> : "Save"}</button>
                                                    <button className='btn-cancel-ticket' onClick={(e) => { e.preventDefault(); navigate('/view-ticket', { state: singleIgmData }) }}>Cancel</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className='view-ticket-modal-right'>
                                <div className='ticket-properties'>
                                    <div className='contact-info-title'>
                                        <img src={ContactIcon} />   Contact Information
                                    </div>
                                </div>
                                <div className='contact-mystore'>
                                    <div className='Additional-item'>
                                        <div className='d-flex align-items-center gap-3'> <div className='My-circle'>{getInitials(singleIgmData?.rawObject?.issue?.complainant_info?.person?.name)}</div>
                                        <div className="contact-info">{singleIgmData?.rawObject?.issue?.complainant_info?.person?.name}</div>
                                        </div>
                                    </div>
                                    <div className='Additional-list'>
                                        <label>Email</label>
                                        <div className='ticket-text'>{singleIgmData?.rawObject?.issue?.complainant_info?.contact?.email}</div>
                                    </div>
                                    <div className='Additional-list'>
                                        <label>Phone</label>
                                        <div className='ticket-text'>{singleIgmData?.rawObject?.issue?.complainant_info?.contact?.phone}</div>
                                    </div>
                                    <div className='Additional-list'>
                                        <label>Contact Owner</label>
                                        <div className='ticket-text'>{singleIgmData?.rawObject?.issue?.complainant_info?.person?.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EditTicket;