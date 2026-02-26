import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { RETURN_LIST_V2 } from "../../api/apiList";
import API from "../../api";
import cartIcon from "../../images/Inventry/cart-icon.png";
import inTat from "../../images/Inventry/inTatIcon.svg";
import tatIcon from "../../images/Inventry/tatIcon.svg";
import openIcon from "../../images/Inventry/openIcon.svg";
import totalIcon from "../../images/Inventry/totalIcon.svg";
import resolved from "../../images/Inventry/resolved.svg";
import moment from "moment";
import Logout from "../../images/ShopDetails/logout.svg";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  handleError,
  notify,
  DateFilters,
  CsvGenerator,
  PaginationFilter,
  handleLogout
} from "../../utils";
// import "./styles.scss";
import "./igmstyles.scss"
import { selfDeliveryIssue } from "../../reject.js";
import { ToastContainer, toast } from "react-toastify";
import { get, size } from "lodash";
import { issueSubcategory } from "../../reject.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
function IgmManager(props) {
  const getIgmDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("igmUser") || "");
    } catch (error) {
      return null;
    }
  };
  const userData = getIgmDetails();
  const [tableLoading, setTableloading] = useState(false);
  const [status, setstatus] = useState("");
  const [search, setSearch] = useState("");
  const [clear, setclear] = useState(false);
  const [componentMounted, setComponentMounted] = useState(false);
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(20);
  const [count, setCount] = useState({
    InTatTckets: 0,
    OpenTickets: 0,
    OutTatTickets: 0,
    ResolvedTickets: 0,
    TotalTickets:0,
    count: 0
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [exportOrder, setexportOrder] = useState([]);
  const [returnItem, setReturnItem] = useState([]);
  const selfDeliveryIssueArray = Object.entries(selfDeliveryIssue);
  // ----------------------------------------------------------------------------------
  const [igmData, setIgmData] = useState([]);
  // const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [endDate, setEndDate] = useState("");
  const [issueCategoryFilter, setIssueCategoryFilter] = useState("");
  const [orderCategoryToFilter, setOrderCategoryToFilter] = useState("");
  const [statusToFilter, setStatusToFilter] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  ///-----------------------------------


  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


  const igmDataApi = async () => {
    setTableloading(true)
    // const { limit, page, statusToFilter, issueCategoryFilter, search, orderCategoryToFilter, startDate, endDate } = this.state;
    let authData = JSON.parse(localStorage.getItem('auth'))
    const loginUserName = get(authData, 'data.userName', '')
    const obj = {
      statusToFilter,
      issueCategoryFilter,
      "keyword": search,
      orderCategoryToFilter,
      limit: 20,
      page: page,
      startDate,
      endDate,
      ticketFilters: status
    }
    if (loginUserName == "ITCADMIN") {
      obj.brandName = "ITC"
    }
    if (startDate !== "" && endDate !== "") {
      var sDate = new Date(startDate);
      obj.startDate = sDate.setDate(sDate.getDate() + 1);
      var eDate = new Date(endDate)
      obj.endDate = eDate.setDate(eDate.getDate() + 1)
    }
    const options = {
      method: 'post',
      url: `${process.env.REACT_APP_IGM_KIKO_API}ondc-seller/igm-dashboard`,
      data: obj
    }
    const result = await axios(options)
    if (get(result, 'data.sucess', false)) {
      // this.setState({ isLoading: false })
      setTableloading(false)
      setIgmData(get(result, "data.data", {}))
      setCount({
        InTatTckets: get(result, 'data.InTatTckets', 0),
        OpenTickets: get(result, 'data.OpenTickets', 0),
        OutTatTickets: get(result, 'data.OutTatTickets', 0),
        ResolvedTickets: get(result, 'data.ResolvedTickets', 0),
        TotalTickets: get(result, 'data.TotalTickets', 0),
        count: get(result, 'data.count', 0)
      })

    }
    else {
      notify('error', get(result, "data.message", {}))
    }
  }

  const onPageChanged = (page) => {
    setpage(page);
  };

  const clearState = () => {
    setStatusToFilter("");
    setIssueCategoryFilter("");
    setOrderCategoryToFilter("");
    setSearch("");
    setStartDate("");
    setEndDate("");
    if (page === 1) { setclear(true); }
    else {
      setpage(1);
    }
  };

  useEffect(() => {
    if (!get(userData, "_id", "") || get(userData, "_id", "") === "") {
      handleLogout();
      navigate("/igm");
    }
  }, []);

  useEffect(() => {
    if (clear) {
      igmDataApi()
      setclear(false)
    }
  }, [clear])

  useEffect(() => {
      igmDataApi()
  }, [dateFilter])


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
        // getOrders();
      }
      else {
        setpage(1);
      }
    }
  };

  const handleDateFilterChange = (event) => {
    const selectedValue = event.target.value;
    const today = new Date();
    let newStartDate = null;
    let newEndDate = null;
    switch (selectedValue) {
      case "":
        newStartDate = "";
        newEndDate = "";
        break;
      case "today":
        newStartDate = new Date(today);
        newEndDate = new Date(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        newStartDate = new Date(yesterday);
        newEndDate = new Date(yesterday);
        break;
      case "week":
        const weekStartDate = new Date(today);
        weekStartDate.setDate(today.getDate() - 6);
        newStartDate = new Date(weekStartDate);
        newEndDate = new Date(today);
        break;
      case "15day":
        const days15StartDate = new Date(today);
        days15StartDate.setDate(today.getDate() - 14);
        newStartDate = new Date(days15StartDate);
        newEndDate = new Date(today);
        break;
      case "30day":
        const days30StartDate = new Date(today);
        days30StartDate.setDate(today.getDate() - 29);
        newStartDate = new Date(days30StartDate);
        newEndDate = new Date(today);
        break;
      default:
        break;
    }
    setDateFilter(selectedValue)
    setStartDate(newStartDate != "" ? newStartDate.setHours(0, 0, 0, 0) : "")
    setEndDate(newEndDate != "" ? newEndDate.setHours(0, 0, 0, 0) : "")
  };
  const handleSearch = (order) => {
    setSearch(order.target.value)
  }

  useEffect(() => {
    if (componentMounted) {
      igmDataApi();
    } else {
      setComponentMounted(true);
    }
  }, [componentMounted, status, page]);

  const exportOrders = () => {
    setExportLoading(true);
    let exportOrder = [];
    igmData.forEach((data, index) => {
      const obj = {       
        sNo:index + 1,
        issueId:get(data, "issueId", "") ? get(data, "issueId", "") : "-",
        zohoTicketId:get(data, "zohoTicketId", "") ? get(data, "zohoTicketId", "") : "-",
        issueCategory:get(data, "issueCategory", ""),
        issueSubCategory:get(data, "issueSubCategory", "") ? issueSubcategory[get(data, "issueSubCategory", "")] : '-',
        ondcOrderId:get(data, "ondcOrderId", "") ? get(data, "ondcOrderId", "") : "-",
        _id:get(data, "_id", ""),
        bap_id:get(data, "context.bap_id", "") ? get(data, "context.bap_id", "") : "-",
        ticketStatus:get(data, "ticketStatus", ""),
        createdAt:get(data, "createdAt", "") ? moment(get(data, "createdAt", "")).format("DD-MM-YYYY HH:mm:ss") : '-',
        ZohoTicketCloserDate:get(data, "ZohoTicketCloserDate", "") ? moment(get(data, "ZohoTicketCloserDate", "")).format("DD-MM-YYYY HH:mm:ss") : '-'     
      };
      exportOrder.push(obj);
      setexportOrder(exportOrder);
    });
    setExportLoading(false);
  };

  const headings = [
    { label: "S.No.", key: "sNo" },
    { label: "Issue ID ", key: "issueId" },
    { label: "Ticket ID", key: "zohoTicketId" },
    { label: "Issue Category (L1)", key: "issueCategory" },
    { label: "Issue Category (L2)", key: "issueSubCategory" },
    { label: "Order ID", key: "ondcOrderId" },
    { label: "Buyer NP Name", key: "_id" },
    { label: "Seller NP Name ", key: "bap_id" },
    { label: "Ticket Status", key: "ticketStatus" },
    { label: "Ticket Creation Time-Stamp", key: "createdAt" },
    { label: "Ticket Closure Timestamp", key: "ZohoTicketCloserDate" },
  ];

  return (
    <>
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
      <section className="Igm-section">
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
        <div className="order-section">
          <div className="section-title">
            <div className="welcome--user-title">Welcome, User</div>
            <div className="form_options_sort">
              <div className="sort-title">Sort By:</div>
              <select
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e)}
                className="form-select dropdown-select"
                size="1"
              >
                <option value="">All</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This week</option>
                <option value="15day">Last 15 days</option>
                <option value="30day">Last 30 days</option>
              </select>
            </div>
          </div>
          <div className="container_ticket">
            <div className="ticket-item">
              <div className="item-right">
                <div className="tat-ticket-icon">
                  <img src={totalIcon} alt="" />
                  <h2 className="ticket-title">Total Tickets</h2>
                </div>
                <div className="tat-ticket-Detail">
                  <div className="ticket-no">{count?.TotalTickets}</div>
                  {/* <div className="ticket-month">This Month</div> */}
                </div>
              </div>
            </div>
            <div className="ticket-item" >
              <div className="item-right">
                <div className="tat-ticket-icon">
                  <img src={openIcon} alt="" />
                  <h2 className="ticket-title">Open Tickets</h2>
                </div>
                <div className="tat-ticket-Detail">
                  <div className="ticket-no">{count?.OpenTickets}</div>
                  {/* <div className="ticket-month">This Month</div> */}
                </div>
              </div>
            </div>
            <div className="ticket-item" >
              <div className="item-right">
                <div className="tat-ticket-icon">
                  <img src={resolved} alt="" />
                  <h2 className="ticket-title">Resolved Tickets</h2>
                </div>
                <div className="tat-ticket-Detail">
                  <div className="ticket-no">{count?.ResolvedTickets}</div>
                  {/* <div className="ticket-month">This Month</div> */}
                </div>
              </div>
            </div>
            <div className="ticket-item" >
              <div className="item-right">
                <div className="tat-ticket-icon">
                  <img src={inTat} alt="" />
                  <div className="ticket-title">In TAT</div>
                </div>
                <div className="tat-ticket-Detail">
                  <div className="ticket-no">{count?.InTatTckets}</div>
                  {/* <div className="ticket-month">This Month</div> */}
                </div>
              </div>
            </div>
            <div className="ticket-item" >
              <div className="item-right">
                <div className="tat-ticket-icon">
                  <img src={tatIcon} alt="" />
                  <h2 className="ticket-title">Out of TAT</h2>
                </div>
                <div className="tat-ticket-Detail">
                  <div className="ticket-no">{count?.OutTatTickets}</div>
                  {/* <div className="ticket-month">This Month</div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-header">
              <label className="filter-title">Filters </label>
            
            </div>
            <ul className='filter-feilds'>
              {/* <DateFilters changeStartDate={(date) => setStartDate(date)} changeEndDate={(date) => setEndDate(date)} startDate={startDate} endDate={endDate} /> */}
              <li>
                <form action="" className='form_search'>
                  <div class="form-outline datepicker" data-mdb-format="dd, mmm, yyyy">
                    <label className="search_title">From</label>
                    <input type="date" class="form-control input_style" id="exampleDatepicker4" placeholder="dd, mmm, yyyy"
                      onChange={(e) => setStartDate(e.target.value)} 
                     maxDate={endDate == "" ? new Date() : endDate}
                     value={startDate} />
                  </div>
                </form>
              </li>
              <li>
                <form action="" className='form_search'>
                  <div class="form-outline datepicker" data-mdb-format="dd, mmm, yyyy">
                    <label className="search_title">To</label>
                    <input type="date" class="form-control input_style" id="exampleDatepicker4" placeholder="dd, mmm, yyyy"
                    onChange={(e) => setEndDate(e.target.value)} 
                    maxDate={new Date()}
                    minDate={startDate}
                    value={endDate}
                    />
                  </div>
                </form>
              </li>
              <li className='form_options'>
                <form action="" className='form_search'>
                  <label className="search_title">Search</label>
                  <input type="text" value={search} className="form-search select_style" placeholder='Order ID, Ticket ID, Seller NP Name ' onChange={(e) => handleSearch(e)} />
                </form>
              </li>
              <li className='form_options'>
                <label className='search_title'>Issue Category</label>
                <select value={issueCategoryFilter} onChange={(order) => { setIssueCategoryFilter(order.target.value) }} className='form-select select_style' size='1'>
                  <option value="">All</option>
                  <option value="ORDER">Order</option>
                  <option value="ITEM">ITEM</option>
                  <option value="FULFILLMENT">FULFILLMENT</option>
                  <option value="AGENT">AGENT</option>
                  <option value="PAYMENT">PAYMENT</option>
                </select>
              </li>
              <li className='form_options'>
                <label className='search_title'>Order Category</label>
                <select value={orderCategoryToFilter} onChange={(order) => { setOrderCategoryToFilter(order.target.value) }} className='form-select select_style' size='1'>
                  <option value="">All</option>
                  <option value="Beauty & Personal Care"> Beauty & Personal Care</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="F&B">Food & Beverage</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Home & Decor">Home & Decor</option>
                </select>
              </li>
              <li className='form_options'>
                <label className="search_title">Ticket Status</label>
                <select value={statusToFilter} onChange={(order) => { setStatusToFilter(order.target.value) }} className='form-select select_style' size='1'>
                  <option value=''>All</option>
                  <option value="Open">Open</option>
                  <option value="Pending with Buyer NP">Pending with Buyer NP</option>
                  <option value="Pending with Seller NP">Pending with Seller NP</option>
                  <option value="Reopen">Reopen</option>
                  <option value="Close">Closed</option>
                  <option value="Customer Awaited">Customer Awaited</option>
                </select>
              </li>
              <li className='form_options'>
                <label className="search_title"></label>
                <button type="submit" onClick={() => { igmDataApi() }} className="form_submit_search_btn"> Search</button>
              </li>
              <li className='form_options'>
                <label className="search_title"></label>
                <button type="submit" onClick={() => { clearState() }} className="form_submit_clear_btn"> Clear</button>
              </li>
            </ul>
          </div>

        </div>
        <div style={{display:"flex",alignItems:"center"}}>
        <ul className="nav nav-pills" role="tablist">
          <li className={status === "" ? "nav-item active" : "nav-item"}>
            <a
              data-toggle="tab"
              className="nav-link"
              href="#home"
              onClick={() => {
                setpage(1);
                setstatus("");
              }}
            >
              All Tickets<span>({count?.TotalTickets})</span>
            </a>
          </li>
          <li className={status === "open" ? "nav-item active" : "nav-item"}>
            <a
              data-toggle="tab"
              className="nav-link"
              href="#menu2"
              onClick={() => {
                setpage(1);
                setstatus("open");
              }}
            >
              Open Tickets<span>({count?.OpenTickets})</span>
            </a>
          </li>
          <li className={status === "resolved" ? "nav-item active" : "nav-item"}>
            <a
              data-toggle="tab"
              className="nav-link"
              href="#menu1"
              onClick={() => {
                setpage(1);
                setstatus("resolved");
              }}
            >
              Resolved Tickets<span>({count?.ResolvedTickets})</span>
            </a>
          </li>
          <li className={status === "out" ? "nav-item active" : "nav-item"}>
            <a
              data-toggle="tab"
              className="nav-link"
              href="#menu3"
              onClick={() => {
                setpage(1);
                setstatus("out");
              }}
            >
              Out of TAT<span>({count?.OutTatTickets})</span>
            </a>
          </li>
        </ul>
        <div style={{ position: "absolute", right: "0" ,paddingRight:"50px" }}>
                {/* <button  className="form-select dropdown-select">Download </button> */}
                <CsvGenerator
                  data={exportOrder}
                  headings={headings}
                  fileName={"Order.csv"}
                  onClick={exportOrders}
                  buttonName={"Download "}
                  exportLoading={exportLoading}
                />
                {/* <select
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e)}
                  className="form-select dropdown-select"
                  size="1"
                >
                  <option value="">Download</option>
                </select> */}
              </div>
              </div>
        {igmData?.length > 0 ? (
          <div className="Igm-panel-table">
            <div className="table-responsive">
              {tableLoading ? (
                <Spin indicator={antIcon} className="loader" />
              ) : (
                <table >
                  <thead className="table-heading">
                    <tr>
                      <th >S.No.</th>
                      <th>Issue ID </th>
                      <th>Ticket ID</th>
                      <th>Action</th>
                      <th>Issue Category (L1)</th>
                      <th>Issue Category (L2)</th>
                      <th>Order ID</th>
                      <th>Order Category</th>
                      <th>Buyer NP Name</th>
                      <th>Seller NP Name </th>
                      <th>Ticket Status</th>
                      <th>Ticket Creation Time-Stamp</th>
                      <th>Ticket Closure Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {igmData.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{get(data, "issueId", "") ? get(data, "issueId", "") : "-"}</td>
                          <td>{get(data, "zohoTicketId", "") ? get(data, "zohoTicketId", "") : "-"}</td>
                          <td>{<button className="igm-action-btn" onClick={() => {
                            navigate("/view-ticket", { state: data });
                          }}>View Ticket</button>}</td>
                          <td>{get(data, "issueCategory", "")}</td>
                          <td>{get(data, "issueSubCategory", "") ? issueSubcategory[get(data, "issueSubCategory", "")] : '-'}</td>
                          <td>{get(data, "ondcOrderId", "") ? get(data, "ondcOrderId", "") : "-"}</td>
                          <td>{get(data, "orderCategory", "")}</td>
                          <td>{get(data, "_id", "")}</td>
                          <td>{get(data, "context.bap_id", "") ? get(data, "context.bap_id", "") : "-"}</td>
                          <td><div>{get(data, "ticketStatus", "")}</div></td>
                          <td>{get(data, "createdAt", "") ? moment(get(data, "createdAt", "")).format("DD-MM-YYYY HH:mm:ss") : '-'}</td>
                          <td>{get(data, "ZohoTicketCloserDate", "") ? moment(get(data, "ZohoTicketCloserDate", "")).format("DD-MM-YYYY HH:mm:ss") : '-'}</td>
                        </tr>
                      )
                    })
                    }
                  </tbody>
                </table>
              )}
            </div>
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
                <h5>No Ticket</h5>
                {/* <p>We will Notify you once you receive any order!</p> */}
                <div className="d-flex gap-2 mt-4 justify-content-center"></div>
              </div>
            )}
          </div>
        )}
        <div className="igm-pagination">
          {" "}
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={count?.count}
            page={page}
          />
        </div>
      </section>
    </>
  );
}
export default IgmManager;
