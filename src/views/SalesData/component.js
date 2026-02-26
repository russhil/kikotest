import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import cartIcon from "../../images/Inventry/cart-icon.png";
import { SELLER_POS_LIST, SELLER_POS_GRAPH_DATA } from "../../api/apiList";
import API from "../../api";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
    handleError,
    notify,
    DateFilters,
} from "../../utils";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import TotalProductSaleIcon from "../../images/total-product-sale-icon.svg";
import TotalSaleIcon from "../../images/total-sale-icon.svg";
import TotalCustomerIcon from "../../images/total-customer-icon.svg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function SalesData(props) {

    const getSellerDetails = () => {
        try {
            return JSON.parse(localStorage.getItem("user") || "");
        } catch (error) {
            return null;
        }
    };

    const [user_data] = useState(getSellerDetails());
    const [salesData, setSalesData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [totalSalesData, setTotalSalesData] = useState(null);
    const [percentGainData, setPercentGainData] = useState(null);
    const [componentMounted, setComponentMounted] = useState(false);
    const [count, setCount] = useState(0);
    const [pagination, setPagination] = useState(20);
    const [currentAppliedValue, setCurrentAppliedValue] = useState(20);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [posCsvLoading, setPosCsvLoading] = useState(false);
    const [graphLoading, setGraphLoading] = useState(false);
    const [productName, setProductName] = useState("");
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const [view, setView] = useState("graph"); // "table" or "graph"
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF3F3F'];
    const [hidePercentage, setHidePercentage] = useState(false);

    const clearState = () => {
        setStartDate("");
        setEndDate("");
        setProductName("");
        setPagination(20);
        setCurrentAppliedValue(20);
        if (view === "table") {
            getSellerPOSList(false)
        }
        else if (view === "graph") {
            getSellerPOSGraphData()
        }
    };


    const getSellerPOSList = async (isExport) => {
        try {
            if (startDate && !endDate) {
                notify("error", "Please Enter End Date...!");
                return
            }
            else if (endDate && !startDate) {
                notify("error", "Please Enter Start Date...!");
                return
            }
            if (!isExport) {
                setPosCsvLoading(true);
            }
            const obj = {
                sellerName: user_data && user_data.storeName ? user_data.storeName : "",
                sellerId: user_data && user_data.email ? user_data.userId : "",
                sellerEmail: user_data && user_data.email ? user_data.email : "",
                startDate: startDate ? startDate : "",
                endDate: endDate ? endDate : "",
                productName: productName ? productName : "",
                limit: pagination ? pagination : 20,
                export: isExport ? isExport : false
            };
            const response = await API.post(SELLER_POS_LIST, obj);
            setPosCsvLoading(false);
            if (response?.data?.isSuccess) {
                setSalesData(response?.data?.data?.filteredPOSData)
                setCount(response?.data?.data?.count ?? 0)
                setCurrentAppliedValue(pagination)
                if (response?.data?.data?.allExportData?.file_url) {
                    window.open(
                        response?.data?.data?.allExportData.file_url,
                        `sellerPOSInsight.csv`
                    );
                }
            }
            else {
                notify("error", response?.data?.messages);
            }
        } catch (error) {
            handleError(error);
        }
    };


    const getSellerPOSGraphData = async () => {
        try {
            if (startDate && !endDate) {
                notify("error", "Please Enter End Date...!");
                return
            }
            else if (endDate && !startDate) {
                notify("error", "Please Enter Start Date...!");
                return
            }
            setGraphLoading(true)
            const obj = {
                sellerName: user_data && user_data.storeName ? user_data.storeName : "",
                sellerId: user_data && user_data.email ? user_data.userId : "",
                startDate: startDate ? startDate : "",
                endDate: endDate ? endDate : "",
            };
            const response = await API.post(SELLER_POS_GRAPH_DATA, obj);
            if (response?.data?.isSuccess) {
                setBarData(response?.data?.data?.barData)
                setPieData(response?.data?.data?.topProducts)
                if (startDate && endDate) {
                    setHidePercentage(true)
                }
                else {
                    setHidePercentage(false)
                }
                const data = {
                    totalProductSales: response?.data?.data?.totalProductSales,
                    totalSales: response?.data?.data?.totalSales,
                    totalCustomers: response?.data?.data?.totalCustomers,
                }
                setTotalSalesData(data)
                setPercentGainData(response?.data?.data?.percentageChange)
            }
            else {
                notify("error", response?.data?.messages);
            }
            setGraphLoading(false)
        } catch (error) {
            handleError(error);
        }
    };


    useEffect(() => {
        if (componentMounted) {
            getSellerPOSList(false);
            getSellerPOSGraphData()
        } else {
            setComponentMounted(true);
        }
    }, [componentMounted]);

    const hasChanged = pagination !== currentAppliedValue;
    const totalQuantity = pieData.reduce((sum, p) => sum + p.quantity, 0);
    const chartData = pieData.map((p, index) => ({
        name: p.name,
        value: p.quantity,
        percent: ((p.quantity / totalQuantity) * 100).toFixed(2),
        color: COLORS[index % COLORS.length]
    }));

    const productGain = percentGainData?.productGain ?? 0
    const salesGain = percentGainData?.salesGain ?? 0
    const customersGain = percentGainData?.customersGain ?? 0
    const salesDifference = percentGainData?.salesDifference ?? 0
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
                        <div className="title-text">Sales POS Data</div>
                        <div className="record-count">{`Total Record: ${count}`}</div>
                    </div>
                    <div class="sales-data-card-container">
                        <div class="sales-data-card">
                            <div className="sales-data-card-header">
                                <div class="sales-data-card-title">Total Product Sale</div>
                                <img src={TotalProductSaleIcon} alt="Total Sales Icon" class="sales-data-card-icon" />
                            </div>
                            <div class="card-content">
                                {(graphLoading || posCsvLoading) ? <Spin indicator={antIcon} className="sales-loader" size="small" /> :
                                    <>
                                        <div class="sales-data-value">{parseInt(totalSalesData?.totalProductSales) ?? ""}</div>
                                        {(productGain !== 0 && !hidePercentage) && <div class={`sales-data-growth ${productGain > 0 ? 'positive' : 'negative'}`}>{`${productGain > 0 ? (productGain.toFixed(2)) + '% ▲' : Math.abs(productGain.toFixed(2)) + '% ▼'}`}<span>{`${productGain > 0 ? '+ More Than Last Week' : '- Less Than Last Week'}`}</span></div>}
                                    </>
                                }
                            </div>
                        </div>
                        <div class="sales-data-card">
                            <div className="sales-data-card-header">
                                <div class="sales-data-card-title">
                                    Total Sales
                                </div>
                                <img src={TotalSaleIcon} alt="Total Sales Icon" class="sales-data-card-icon" />
                            </div>
                            {(graphLoading || posCsvLoading) ? <Spin indicator={antIcon} className="sales-loader" size="small" /> :
                                <>
                                    <div className="sales-data-value">{`₹${parseFloat(totalSalesData?.totalSales)?.toFixed(2) ?? ""}`}</div>
                                    {(salesGain !== 0 && !hidePercentage) && <div class={`sales-data-growth ${salesGain > 0 ? 'positive' : 'negative'}`}>{`${salesGain > 0 ? (salesGain.toFixed(2)) + '% ▲' : Math.abs(salesGain.toFixed(2)) + '% ▼'}`}<span>{`${salesGain > 0 ? `+₹${salesDifference} More Than Last Week` : `-₹${Math.abs(salesDifference)} Less Than Last Week`}`}</span></div>}
                                </>}
                        </div>
                        <div class="sales-data-card">
                            <div className="sales-data-card-header">
                                <div class="sales-data-card-title">
                                    Total Customer's
                                </div>
                                <img src={TotalCustomerIcon} alt="Total Sales Icon" class="sales-data-card-icon" />
                            </div>
                            {(graphLoading || posCsvLoading) ? <Spin indicator={antIcon} className="sales-loader" size="small" /> :
                                <>
                                    <div className="sales-data-value">{parseInt(totalSalesData?.totalCustomers)}</div>
                                    {(customersGain !== 0 && !hidePercentage) && <div class={`sales-data-growth ${customersGain > 0 ? 'positive' : 'negative'}`}>{`${customersGain > 0 ? (customersGain.toFixed(2)) + '% ▲' : Math.abs(customersGain.toFixed(2)) + '% ▼'}`}<span>{`${customersGain > 0 ? '+ More Than Last Week' : '- Less Than Last Week'}`}</span></div>}
                                </>
                            }
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="home" className="tab-pane active">
                            <div className="filter-form-container">
                                <div className="filter-form-container-inner">
                                    {view === "table" && <span className="d-flex align-items-center gap-2 label-container">
                                        <label className="form-label">Search By:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={productName}
                                            placeholder="Product Name/Invoice ID"
                                            onChange={(e) => setProductName(e.target.value.trim())}
                                        />
                                    </span>}
                                    <DateFilters
                                        changeStartDate={(date) => setStartDate(date)}
                                        changeEndDate={(date) => setEndDate(date)}
                                        startDate={startDate}
                                        endDate={endDate}
                                        title={"Order Date"}
                                    />
                                </div>
                                <div className="button-container">
                                    <button
                                        onClick={() => {
                                            if (view === "table") {
                                                getSellerPOSList(false)
                                            }
                                            else if (view === "graph") {
                                                getSellerPOSGraphData()
                                            }
                                        }}
                                        disabled={!productName && !startDate && !endDate && !hasChanged}
                                        className="btn btn-primary btn-sm me-2-"
                                    >
                                        Search
                                    </button>
                                    <button
                                        onClick={() => {
                                            clearState();
                                        }}
                                        className="btn btn-sm btn-outline"
                                    >
                                        Clear
                                    </button>
                                    {view === "table" && <span className="inventory-select-span">
                                        <select
                                            className="form-select inventory-select"
                                            style={{ padding: "9px 10px" }}
                                            onChange={(e) => {
                                                const newValue = e.target.value === "All" ? "All" : parseInt(e.target.value, 10);
                                                setPagination(newValue);
                                            }}
                                            value={pagination}
                                        >
                                            {[20, 40, 60, 80, 100, 200, "All"].map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </span>}
                                    {view === "table" &&
                                        <span>
                                            <button
                                                onClick={() => {
                                                    getSellerPOSList(true)
                                                }}
                                                disabled={salesData?.length == 0}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                All Export
                                            </button>
                                        </span>}
                                </div>
                            </div>
                            <div className="toggle-container">
                                <button
                                    className={`toggle-button ${view === "graph" ? "active" : ""}`}
                                    onClick={() => {
                                        setView("graph")
                                    }}
                                >
                                    Graph View
                                </button>
                                <button
                                    className={`toggle-button ${view === "table" ? "active" : ""}`}
                                    onClick={() => setView("table")}
                                >
                                    Table View
                                </button>

                            </div>
                            {view === "table" ?
                                salesData?.length > 0 ? (
                                    <div className="table-responsive">
                                        {posCsvLoading ? (
                                            <Spin indicator={antIcon} className="sales-loader" />
                                        ) : (
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Sr No.</th>
                                                        <th scope="col">Invoice ID</th>
                                                        <th scope="col">Creation</th>
                                                        <th scope="col">Product Name</th>
                                                        <th scope="col">Qty</th>
                                                        <th scope="col">Unit</th>
                                                        <th scope="col">MRP</th>
                                                        <th scope="col">Selling Price</th>
                                                        <th scope="col">Total Amount</th>
                                                        <th scope="col">Total Qty</th>
                                                        <th scope="col">Total Item</th>
                                                        <th scope="col">Final Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {salesData.map((order, index) => {
                                                        const creation = moment(order?.["Softupload → Creation"]).format("DD MMMM YYYY hh:mm A")
                                                        const name = order?.["Observed Name"]
                                                        const invoiceId = order?.["Processedreceipt - Processed Receipt → ID"]
                                                        const tItems = order?.["Total Items"]
                                                        const tQuantity = order?.["Total Qty"]
                                                        const tAmount = order?.["Total Amount"]
                                                        const fAmount = order?.["Final Amount"]
                                                        const qty = order?.["Qty"]
                                                        const sellingPrice = order?.["Price"]
                                                        const uom = order?.["Uom"]
                                                        const mrp = order?.["Mrp"]
                                                        return (
                                                            <tr key={index}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{invoiceId}</td>
                                                                <td>{creation}</td>
                                                                <td>{name}</td>
                                                                <td>{qty}</td>
                                                                <td>{uom}</td>
                                                                <td>{mrp}</td>
                                                                <td>{sellingPrice}</td>
                                                                <td>{tAmount}</td>
                                                                <td>{tQuantity}</td>
                                                                <td>{tItems}</td>
                                                                <td>{fAmount}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ) : (
                                    <div className="no-data-status">
                                        {posCsvLoading ? (
                                            <Spin indicator={antIcon} className="sales-loader" size="large" />
                                        ) : (
                                            <div>
                                                <div className="cart-icon">
                                                    <img src={cartIcon} alt="" />
                                                </div>
                                                <h5>No Sales Data Available</h5>
                                                <div className="d-flex gap-2 mt-4 justify-content-center"></div>
                                            </div>
                                        )}
                                    </div>
                                ) :
                                <div className="graph-container">
                                    <div className="graph-card">
                                        <div className="card-header">
                                            <h2 className="card-title">Total Sale Graph</h2>
                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            {
                                                graphLoading ?
                                                    (<div className="no-data-status">
                                                        <Spin indicator={antIcon} className="sales-loader" size="large" />
                                                    </div>) :
                                                    barData?.length > 0 ?
                                                        <BarChart data={barData}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="date" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Bar dataKey="Sales" fill="#7D55C7" radius={[4, 4, 0, 0]} barSize={50} />
                                                        </BarChart> :
                                                        <p>{"No Data Available"}</p>
                                            }
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="graph-card">
                                        <div className="card-header">
                                            <h2 className="card-title">Top Products Sold ( Last 30 Days )</h2>
                                        </div>
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={300}>
                                                {graphLoading ?
                                                    (<div className="no-data-status">
                                                        <Spin indicator={antIcon} className="sales-loader" size="large" />
                                                    </div>) :
                                                    chartData?.length > 0 ?
                                                        <PieChart>
                                                            <Pie
                                                                data={chartData}
                                                                dataKey="value"
                                                                nameKey="name"
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={60}
                                                                outerRadius={90}
                                                                labelLine={false}
                                                                label={({ percent }) => `${(percent)}%`}
                                                            >
                                                                {chartData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                        </PieChart> :
                                                        <p>{"No Data Available"}</p>}
                                            </ResponsiveContainer>
                                            {!graphLoading && chartData?.length > 0 && <div className="table-container">
                                                <table className="product-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Product Name</th>
                                                            <th>% Sold</th>
                                                            <th>Quantity Sold</th>
                                                            <th>Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {chartData.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="name-cell">
                                                                    <span
                                                                        className="color-dot"
                                                                        style={{ backgroundColor: item.color }}
                                                                    ></span>
                                                                    {item.name}
                                                                </td>
                                                                <td>{item.percent}%</td>
                                                                <td>{pieData[idx].quantity.toLocaleString()}</td>
                                                                <td>{parseFloat(pieData[idx].price)?.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SalesData;
