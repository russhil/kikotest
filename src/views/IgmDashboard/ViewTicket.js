import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./viewTicket.scss";
import Logout from "../../images/ShopDetails/logout.svg";
import arrow_back from "../../images/Inventry/arrow_back.svg";
import { get, size } from "lodash";
import ThreeDots from "../../images/Inventry/three-dots.svg"
import WhiteDownArrow from "../../images/white-down-arrow.svg"
import EditIcon from "../../images/Inventry/edit-icon.svg"
import ContactInfo from "../../images/Inventry/info.svg"
import moment from "moment";
import API from "../../api";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { handleError, notify,handleLogout } from "../../utils";
import { useNavigate } from "react-router-dom";
import kikoOndcLogo from "../../images/HomeNew/kikoOndcLogo.png";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


function ViewTicket() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [singleIgmData, setSingleIgmData] = useState(null);
    const [kikoStatus, setKikoStatus] = useState(get(state, "kikoStatus", "OPEN"));
    const [addNotes, setAddNotes] = useState(false);
    const [noteEditable, setNoteEditable] = useState(false);
    const [notes, setNotes] = useState(get(state, "notes", ""));
    const [tableLoading, setTableloading] = useState(false);

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
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
        igmDataApi()
    }, []);

    useEffect(() => {
        if (!get(userData, "_id", "") || get(userData, "_id", "") === "") {
          handleLogout();
          navigate("/igm");
        }
      }, []);

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

    const igmDataApi = async () => {
        setTableloading(true)
        const obj = {
            _id: state._id,
        }
        const options = {
            method: 'post',
            url: `${process.env.REACT_APP_IGM_KIKO_API}ondc-seller/single-igm-dashboard`,
            data: obj
        }
        const result = await axios(options)
        if (get(result, 'data.sucess', false)) {
            setTableloading(false)
            console.log("result", get(result, 'data.data', {}));
            setSingleIgmData(get(result, 'data.data', {}))
            setNotes(get(result, 'data.data.notes', ""))
            setKikoStatus(get(result, 'data.data.kikoStatus', "OPEN"))
        }
        else {
            notify('error', get(result, "data.message", {}))
        }
    }

    const updateIssueStatus = async (singleIgmData, kikoStatus) => {
        setKikoStatus({ kikoStatus })
        const obj = {
            _id: singleIgmData._id,
            kikoStatus,
            notes
        }
        const options = {
            method: 'post',
            url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/issue-webhook`,
            data: obj,
        }
        const result = await axios(options)
        if (result?.data?.success) {
            notify('success', "Update Successfully..")
            igmDataApi()
            // navigate("/igm-manager")
        }
    }

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
                <div class="view-ticket-header"><div class="view-ticket-heading" onClick={() => navigate('/igm-manager')}><img src={arrow_back} alt="" style={{ cursor: 'pointer' }} /> View Ticket ({singleIgmData?.zohoTicketId})</div></div>
                <div class="view-ticket-body">
                    <div className='view-ticket-heading-block'>
                        <div className='view-ticket-modal-flex'>
                            <div className='view-ticket-modal-left'>
                                <div className='ticket-left'>
                                    <div className='order-cancellation-heading'>{singleIgmData?.rawObject?.issue?.description?.short_desc}</div>
                                    <div className='ticket-id-flex'>
                                        <div className='ticket-id-text'>Ticket ID: {singleIgmData?.zohoTicketId}</div>
                                        <div className='vertical-line'></div>
                                        <div className='ticket-id-text'>Contact: {singleIgmData?.rawObject?.issue?.complainant_info?.person?.name}</div>
                                        <div className='vertical-line'></div>
                                        <div className='ticket-id-text'>Created On: {moment(get(singleIgmData?.rawObject?.issue, "created_at", "")).format("DD-MM-YYYY HH:mm:ss")}</div>
                                        <div className='vertical-line'></div>
                                        <div className='ticket-id-text'>Ticket Status: <span>{singleIgmData?.ticketStatus}</span></div>
                                    </div>
                                    <div className='Conversation-block'>
                                        <div className='Conversation-heading'>
                                            <div className='Conversation-title'>Conversation</div>
                                        </div>
                                        <div className='my-store-content'>
                                            <div className='my-store-content-border'>
                                                <div className='mystore-block-flex'>
                                                    <div className='mystore-block'>
                                                        <div className='mystore'><div className='My-circle'>{getInitials(singleIgmData?.rawObject?.issue?.complainant_info?.person?.name)}</div><div className="myStore-title"> {singleIgmData?.rawObject?.issue?.complainant_info?.person?.name}</div></div><div className="myStore-time">{formatDateAgo(get(singleIgmData?.rawObject?.issue, "created_at", ""))}</div>
                                                    </div>
                                                    <button className='three-dot-btn'>
                                                        <img src={ThreeDots} />
                                                    </button>
                                                </div>
                                                <div className="myStore-desc">{singleIgmData?.rawObject?.issue?.description?.long_desc}</div>
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
                                            </div>
                                        </div>
                                        {singleIgmData?.issueAction?.[0]?.respondent_actions.length > 0 &&
                                            <div className='my-store-content'>
                                                {singleIgmData?.issueAction?.[0]?.respondent_actions.map((data) => {
                                                    return (
                                                        <div className='my-store-content-border'>
                                                            <div className='mystore-block-flex'>
                                                                <div className='mystore-block'>
                                                                    <div className='mystore'><div className='My-circle'>
                                                                        {getInitials(data?.updated_by?.person?.name)}
                                                                    </div> <div className="myStore-title">{data?.updated_by?.person?.name}</div></div>
                                                                    <div className="myStore-time">{formatDateAgo(get(data, "updated_at", ""))}</div>
                                                                </div>
                                                                <button className='three-dot-btn'>
                                                                    <img src={ThreeDots} />
                                                                </button>
                                                            </div>
                                                            <div>{data?.respondent_action}</div>
                                                            <div>{data?.short_desc}</div>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>}
                                    </div>
                                    <div className='view-ticket-footer'>
                                        <div className='view-ticket-footer-btn'>
                                            <button className='form_submit_search_btn d-flex align-items-center gap-3 w-auto' onClick={() => { navigate("/edit-ticket", { state: singleIgmData }); }}>Reply All <div className='vertical-line' style={{ display: 'block' }}></div><div>
                                                <img src={WhiteDownArrow} />
                                            </div></button>
                                            <button className='btn-close-ticket' onClick={() => { { navigate("/igm-manager"); } }} >Close Ticket</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='my-store-content-border-notes'>
                                    <div className="notes-header">
                                        <div className="notes-title">Notes</div>
                                        <button className="notesbtn">
                                            {(singleIgmData?.notes && singleIgmData?.notes !== "") && <img src={EditIcon} onClick={() => setNoteEditable(true)} />}
                                        </button>
                                    </div>
                                    {(singleIgmData?.notes && singleIgmData?.notes !== "") || addNotes ?
                                        <>
                                            <div className="react-Quill">
                                                <ReactQuill theme="snow" value={notes} onChange={setNotes} readOnly={!noteEditable} />
                                            </div>
                                            {noteEditable && <div className='view-ticket-footer-btn-notes'>
                                                <button className='form_save_btn' onClick={() => { updateIssueStatus(singleIgmData, get(state, "kikoStatus", "OPEN")) }}>Save
                                                </button>
                                                <button className='btn-cancel-ticket' onClick={() => { setAddNotes(false); setNoteEditable(false) }} >Cancel</button>
                                            </div>}
                                        </> :
                                        <div className="not-react-Quill">
                                            <div className="no-saved-title">No Saved Notes</div>
                                            <div className="no-saved-content" onClick={() => { setAddNotes(true); setNoteEditable(true) }}>Add Notes</div>
                                        </div>}
                                </div>
                            </div>
                            <div className='view-ticket-modal-right'>
                                <div className='ticket-properties'>
                                    <div className='ticket-properties-title'>
                                        Ticket Properties
                                    </div>
                                    <button className='btn edit-btn' onClick={() => { navigate("/edit-ticket", { state: singleIgmData }); }}>
                                        <img src={EditIcon} />
                                    </button>
                                </div>
                                <div className='ticket-properties-body'>
                                    <div className='ticket-properties-item'>
                                        <div class="accordion" id="accordionExample">
                                            <div class="accordion-item">
                                                {/* <h2 class="accordion-header">
                                                    <div className="additional-title">  Kiko Status</div>
                                                </h2> */}
                                                {/* <label className='form-label'>Kiko Status</label> */}
                                                <div class="accordion-body py-0">
                                                    <div className='Additional-item'>
                                                        <div className="additional-title">
                                                             Kiko Status</div>
                                                        <select
                                                             class="accordion-button"
                                                             style={{border: "1px solid #A1A4AA",fontSize: "18px",
                                                                fontWeight: "400",
                                                                color: "#1A1A1A",
                                                                padding: "6px",
                                                                borderRadius:"10"
                                                            }}
                                                            value={kikoStatus}
                                                            onChange={(e) => {
                                                                const newValue = e.target?.value;
                                                                updateIssueStatus(singleIgmData, newValue, get(state, "notes", ""));
                                                            }}
                                                        >
                                                            <option className='form-option' value="" >Select</option>
                                                            <option className='form-option' value="OPEN" >Open</option>
                                                            <option className='form-option' value="CLOSED">Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='ticket-properties-body'>
                                    <div className='ticket-properties-item'>
                                        <div class="accordion" id="accordionExample">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingOne">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        Contact Info
                                                    </button>
                                                </h2>
                                                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                        <div className='ticket-text'>
                                                            Name: {singleIgmData?.rawObject?.issue?.complainant_info?.person?.name}
                                                        </div>
                                                        <div className='ticket-text'>
                                                            Email: {singleIgmData?.rawObject?.issue?.complainant_info?.contact?.email}
                                                        </div>
                                                        <div className='ticket-text'>
                                                            Phone: {singleIgmData?.rawObject?.issue?.complainant_info?.contact?.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="accordion" id="accordionExample">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingTwo">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                                        Key Information
                                                    </button>
                                                </h2>
                                                <div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body py-0">
                                                        <div className='Additional-item'>
                                                            <div className="additional-title">   Ticket Owner   </div>
                                                            <div class="dropdown">
                                                                {/* <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Admin
                                                                </button> */}
                                                                <span>Admin</span>
                                                                {/* <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                    <li><a class="dropdown-item" href="#">Unassigned</a></li>
                                                                    <li><a class="dropdown-item" href="#">Unassigned</a></li>
                                                                </ul> */}
                                                            </div>
                                                        </div>
                                                        <div className='Additional-item'>
                                                            <div className="additional-title">   Due Date</div>
                                                            <div class="dropdown">
                                                                {/* <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    {moment(new Date(addISODurationToCurrentTime(singleIgmData?.rawObject?.issue?.expected_resolution_time?.duration, singleIgmData?.rawObject?.issue?.created_at))).format("DD-MM-YYYY HH:mm:ss")}
                                                                </button> */}
                                                                <span>   {moment(new Date(addISODurationToCurrentTime(singleIgmData?.rawObject?.issue?.expected_resolution_time?.duration, singleIgmData?.rawObject?.issue?.created_at))).format("DD-MM-YYYY HH:mm:ss")}</span>
                                                                {/* <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                    <li><a class="dropdown-item" href="#"> 31/08/2024 09:34 PM</a></li>
                                                                    <li><a class="dropdown-item" href="#"> 31/08/2024 09:34 PM</a></li>
                                                                </ul> */}
                                                            </div>
                                                        </div>
                                                        <div className='Additional-item'>
                                                            <div className="additional-title">   Response Due Date</div>
                                                            <div class="dropdown">
                                                                <span>{moment(new Date(addISODurationToCurrentTime(singleIgmData?.rawObject?.issue?.expected_response_time?.duration, singleIgmData?.rawObject?.issue?.created_at))).format("DD-MM-YYYY HH:mm:ss")}</span>
                                                                {/* <button class="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    {moment(new Date(addISODurationToCurrentTime(singleIgmData?.rawObject?.issue?.expected_response_time?.duration, singleIgmData?.rawObject?.issue?.created_at))).format("DD-MM-YYYY HH:mm:ss")}
                                                                </button>
                                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                    <li><a class="dropdown-item" href="#">Late by 01:33 hour</a></li>
                                                                    <li><a class="dropdown-item" href="#">Late by 01:33 hour</a></li>
                                                                </ul> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="accordion" id="accordionExample">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingThree">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                                        Additional Information
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" class="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body py-0">
                                                        <div className='Additional-item'>
                                                            <div className="additional-title"> Category*</div>
                                                            <input className='form-control' value={singleIgmData?.orderData?.orderCategory[0]} placeholder='Grocery' disabled />
                                                        </div>
                                                        <div className='Additional-item'>
                                                            <div className="additional-title">  Type Of Resolution*</div>
                                                            <input className='form-control' value={singleIgmData?.typeOfRespond} placeholder='Processing' disabled />
                                                        </div>
                                                        <div className='Additional-item'>
                                                            <div className="additional-title">   Classifications*</div>
                                                            <input className='form-control' value={singleIgmData?.ZohoTicketClassification} placeholder='None' disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="accordion" id="accordionExample">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingFour">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                                                        Ticket Information
                                                    </button>
                                                </h2>
                                                <div id="collapseFour" class="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body py-0">
                                                        <div className='Additional-item'>
                                                            <label className='m-0'>Phone</label>
                                                            <div>+91{singleIgmData?.rawObject?.issue?.complainant_info?.contact?.phone}</div>
                                                        </div>
                                                        <div className='Additional-item'>
                                                            <label className='m-0'> Name</label>
                                                            <div className='ticket-text'> {singleIgmData?.rawObject?.issue?.complainant_info?.person?.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
export default ViewTicket;