import React from "react";
import logo from "../kiko-logo.png";
import QrCode from "./qr-code.png";
import moment from "moment";
import "./invoicemodule.css"
import { get } from 'lodash'
import "./invoicemodule.css"

function sellerInvoiceTemplate(props) {
    const getSellerDetails = () => {
        try {
            return JSON.parse(localStorage.getItem("user") || "");
        } catch (error) {
            return null;
        }
    };
    const user_data = getSellerDetails();
    const orderData = props?.orderData;
    const selectedMonth = props?.month
    // function numberToWords(number) {
    //     const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    //     const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    //     const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    //     function convertToWordsLessThanThousand(num) {
    //         if (num === 0) {
    //             return "";
    //         } else if (num < 10) {
    //             return units[num];
    //         } else if (num < 20) {
    //             return teens[num - 10];
    //         } else if (num < 100) {
    //             return tens[Math.floor(num / 10)] + " " + convertToWordsLessThanThousand(num % 10);
    //         } else {
    //             return units[Math.floor(num / 100)] + " Hundred " + convertToWordsLessThanThousand(num % 100);
    //         }
    //     }

    //     function convertDecimalToWords(decimal) {
    //         const decimalWords = decimal.toFixed(2)
    //             .toString()
    //             .split('')
    //             .map(digit => units[parseInt(digit)])
    //             .join(' ');

    //         return decimalWords.length > 0 ? `Point ${decimalWords}` : '';
    //     }

    //     if (number === 0) {
    //         return "Zero";
    //     } else {
    //         const integralPart = Math.floor(number);
    //         const fractionalPart = number % 1;
    //         const integralWords = convertToWordsLessThanThousand(integralPart);
    //         const fractionalWords = convertDecimalToWords(fractionalPart);

    //         return integralWords + (fractionalWords ? ` ${fractionalWords}` : '');
    //     }
    // }

    function numberToWords(number) {
        const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        function convertToWordsLessThanThousand(num) {
            if (num === 0) {
                return "";
            } else if (num < 10) {
                return units[num];
            } else if (num < 20) {
                return teens[num - 10];
            } else if (num < 100) {
                return tens[Math.floor(num / 10)] + " " + convertToWordsLessThanThousand(num % 10);
            } else {
                return units[Math.floor(num / 100)] + " Hundred " + convertToWordsLessThanThousand(num % 100);
            }
        }

        function convertDecimalToWords(decimal) {
            const decimalWords = decimal.toFixed(2)
                .toString()
                .split('')
                .map(digit => units[parseInt(digit)])
                .join(' ');

            return decimalWords.length > 0 ? `Point ${decimalWords}` : '';
        }

        if (isNaN(number) || !isFinite(number)) {
            return "Not a valid number";
        } else if (number === 0) {
            return "Zero";
        } else if (number < 0) {
            return "Minus " + numberToWords(Math.abs(number));
        } else {
            const crore = Math.floor(number / 10000000);
            const lakh = Math.floor((number % 10000000) / 100000);
            const thousand = Math.floor((number % 100000) / 1000);
            const hundred = Math.floor((number % 1000) / 100);
            const rest = Math.floor(number % 100);

            const croreWords = crore > 0 ? convertToWordsLessThanThousand(crore) + " Crore " : "";
            const lakhWords = lakh > 0 ? convertToWordsLessThanThousand(lakh) + " Lakh " : "";
            const thousandWords = thousand > 0 ? convertToWordsLessThanThousand(thousand) + " Thousand " : "";
            const hundredWords = hundred > 0 ? convertToWordsLessThanThousand(hundred) + " Hundred " : "";
            const restWords = convertToWordsLessThanThousand(rest);
            const fractionalWords = convertDecimalToWords(number % 1);

            return croreWords + lakhWords + thousandWords + hundredWords + restWords + (fractionalWords ? ` ${fractionalWords}` : '');
        }
    }

    function getLastDates(selectedMonth) {
        const currentDate = new Date(selectedMonth);
        const lastDateCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const formattedLastDateCurrentMonth = moment(lastDateCurrentMonth).format("DD.MM.yyyy");
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
        const formattedLastDateNextMonth = moment(nextMonth).format("DD.MM.yyyy");
        return {
            lastDateCurrentMonth: formattedLastDateCurrentMonth,
            lastDateNextMonth: formattedLastDateNextMonth
        };
    }
    const mystyle = {
        invoiceTeplate: {
            width: "100%",
            maxWidth: "730px",
            margin: "10px auto",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
    }
    return (
        <>
            <div style={mystyle.invoiceTeplate} >
                <table cellspacing="0">
                    <tr>
                        <td style={{ padding: "15px 25px" }}>
                            <img src={logo} alt="" />
                        </td>
                        <td>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: " 0 0 6px 0" }}>Smooth Tag Technologies Pvt Ltd
                            </h2>
                            <p style={{ fontSize: "13px", marginBottom: "0", fontWeight: "500", margin: " 0 ,", color: "#000" }}>A 603 Emrold court Indore
                                <br />452001 MP,India
                            </p>
                        </td>
                    </tr>
                </table>
                <table style={{ border: " 1px solid #ccc", width: "100%" }}>
                    <tr>
                        <td style={{ padding: "10px 12px", borderRight: "1px solid #ccc" }}>
                            <p style={{ fontSize: "13px", fontWeight: "500", color: "#000", margin: "0 0 4px 0" }}><b
                                style={{ fontWeight: "600", fontSize: "13px" }}>Place Of Supply: </b>{get(user_data, "storeAddress.state", "")}</p>
                            <p style={{ fontSize: "13px", fontWeight: "500", color: "#000", margin: "0" }}><b
                                style={{ fontWeight: "600", fontSize: "13px", }}>Reverse Charge Applicability:</b> No</p>
                        </td>
                        <td style={{ padding: "10px 12px", borderRight: "1px solid #ccc", }}>
                            <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#000", margin: "0" }}>TAX INVOICE</h1>
                        </td>
                        <td style={{ padding: "10px 12px", borderRight: " 1px solid #ccc" }}>
                            <p style={{ fontSize: "13px", fontWeight: "500", color: "#000", marginTop: "0", marginBottom: "4px" }}><b
                                style={{ fontWeight: "600", fontSize: "13px", }}>Invoice No.</b><b>{moment(new Date()).format("yyyyMM") + get(user_data, "mobile", "")}</b></p>
                            <p style={{ fontSize: "13px", fontWeight: "500", color: "#000", margin: "0" }}><b
                                style={{ fontWeight: "600", fontSize: "13px", }}>Invoice Date:</b>{getLastDates(selectedMonth).lastDateCurrentMonth}</p>
                        </td>
                        <td style={{ padding: " 10px 12px" }}>
                            <p style={{ fontSize: "13px", fontWeight: "500", color: "#000", margin: "0 0 6px 0", }}><b
                                style={{ fontWeight: "600", fontSize: "13px", }}>Due Date</b></p>
                            <p style={{ fontWeight: "600", fontSize: "13px", margin: "0" }}>{getLastDates(selectedMonth).lastDateNextMonth}</p>
                        </td>
                    </tr>
                </table>
                <table style={{ width: " 100%", marginBottom: "30px" }}>
                    <tr>
                        <td style={{ height: "35px" }}></td>
                    </tr>
                    <tr>
                        <td style={{ borderRight: "1px solid #ccc", width: "50%" }}>
                            <div style={{ marginBottom: "10px" }}>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: " 0 0 3px 0", color: "#000", }}>Details of
                                    Receiver(Billed to)</p>
                                <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 3px 0", color: " #000", }}>{get(user_data, "storeName", "")}</p>
                                <p style={{ fontsize: '13px', fontWeight: "500", margin: "0 0 3px 0", color: "#000", }}>{get(user_data, "storeAddress.address1", "")},{get(user_data, "storeAddress.address2", "")}</p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000", }}>{get(user_data, "storeAddress.city", "")},{get(user_data, "storeAddress.state", "")}</p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000", }}>{get(user_data, "storeAddress.pincode", "")},{get(user_data, "storeAddress.country", "")}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>
                                    GSTIN/ISD:{get(user_data, "kycDetail.gstNumber", "N/A")}</p>
                                <p style={{ fontSize: "13px", fontWeight: " 500", margin: "0 0 3px 0 ", color: "#000" }}>Customer PO:
                                </p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>PAN:{get(user_data, "kycDetail.panNumber", "N/A")}
                                </p>
                                {/* <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 6px 0", color: "#000" }}>MID:1288472
                                    </p> */}
                            </div>
                        </td>
                        <td style={{ width: "50%", paddingLeft: "15px" }}>
                            <div style={{ marginBottom: "10px" }}>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>Details of
                                    Consignee(Shipped to)</p>
                                <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 3px 0", color: "#000" }}>{get(user_data, "storeName", "")}</p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>{get(user_data, "storeAddress.address1", "")},{get(user_data, "storeAddress.address2", "")}</p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>{get(user_data, "storeAddress.city", "")},{get(user_data, "storeAddress.state", "")}</p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000", }}>{get(user_data, "storeAddress.pincode", "")},{get(user_data, "storeAddress.country", "")}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>
                                    GSTIN/ISD:{get(user_data, "kycDetail.gstNumber", "N/A")}</p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>Customer PO:
                                </p>
                                <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 3px 0", color: "#000" }}>PAN:{get(user_data, "kycDetail.panNumber", "N/A")}
                                </p>
                                {/* <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 6px 0", color: "#000" }}>MID:1288472
                                    </p> */}
                            </div>
                        </td>
                    </tr>
                </table>
                <table style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f1f0f0" }}>
                        <tr>
                            <th className="invoice-igst" style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 6px 0", color: "#000" }}
                                rowspan="2">S.N.</th>
                            <th style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 5px 0", color: "#000" }}
                                rowspan="2">Description Of Goods/ Services
                            </th>
                            <th style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 5px 0", color: "#000" }}
                                rowspan="2">QTY</th>
                            <th style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 5px 0", color: "#000" }}
                                rowspan="2">UNIT</th>
                            <th style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 5px 0", color: "#000" }}
                                rowspan="2">RATE</th>
                            <th style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 5px 0", color: "#000" }}
                                rowspan="2">TAXABLE VALUE </th>
                        </tr>
                        <tr>
                            {orderData?.isMp ?
                                <>
                                    <th
                                        style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 6px 0", color: "#000" }}>
                                        SGST
                                    </th>
                                    <th
                                        style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 6px 0", color: "#000" }}>
                                        CGST</th>
                                </>
                                :
                                <th
                                    style={{ border: "1px solid #ccc", padding: "4px 12px", fontSize: "13px", fontWeight: "600", margin: "0 0 6px 0", color: "#000" }}>
                                    IGST</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="invoice-igst" style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>1
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                <p style={{ margin: "0 0 2px 0", lineHeight: "normal" }}>MarketPlace Marketing Fee <br /> HSN
                                    CODE:998599</p>
                                <p style={{ margin: "0" }}>For the m/o  { moment(selectedMonth).format("MMM,yy")} <br /> Enterprise</p>
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                {get(orderData, "orderCount", "")}</td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>EA
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                5.0</td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                {parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .05).toFixed(2)}</td>
                            {orderData?.isMp ?
                                <>
                                    <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                        {parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .0045).toFixed(2)}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                        {parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .0045).toFixed(2)} </td>
                                </> :
                                <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                    {parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .0090).toFixed(2)}</td>
                            }
                        </tr>
                        <tr>
                            <td className="invoice-igst" style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>2
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                <p style={{ margin: "0 0 2px 0", lineHeight: "normal" }}>Kiko Delivery Charges<br /> HSN
                                    CODE:996813</p>
                                <p style={{ margin: "0" }}>For the m/o  { moment(selectedMonth).format("MMM,yy")} <br /> Enterprise</p>
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                {get(orderData, "kikoOrderCount", "")}</td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>EA
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                1.0</td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                {parseFloat(get(orderData, "kikoShippingAmount", 0) / 1.18).toFixed(2)}</td>
                            {orderData?.isMp ? <>
                                <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                    {parseFloat((get(orderData, "kikoShippingAmount", 0) * 0.1525) / 2).toFixed(2)} </td>
                                <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                    {parseFloat((get(orderData, "kikoShippingAmount", 0) * 0.1525) / 2).toFixed(2)} </td></>
                                :
                                <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                    {parseFloat((get(orderData, "kikoShippingAmount", 0) * 0.1525)).toFixed(2)} </td>
                            }
                        </tr>
                        <tr>
                            <td className="invoice-igst" style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>3
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                <p style={{ margin: " 0 0 2px 0", lineHeight: "" }}>MarketPlace PG Fee <br /> HSN
                                    CODE:997159</p>
                                <p style={{ margin: "0" }}>For the m/o { moment(selectedMonth).format("MMM,yy")} <br /> Enterprise</p>
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                {get(orderData, "orderCount", "")}</td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>EA
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                2.45</td>
                            <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                {parseFloat(get(orderData, "orderCount", "") * 2.45).toFixed(2)}</td>
                            {orderData?.isMp ?
                                <>
                                    <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                        {parseFloat(get(orderData, "orderCount", "") * .22).toFixed(2)}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                        {parseFloat(get(orderData, "orderCount", "") * .22).toFixed(2)} </td>
                                </> :
                                <td style={{ border: "1px solid #ccc", padding: "6px 12px", fontSize: "13px", fontWeight: " 500", color: " #000" }}>
                                    {parseFloat(get(orderData, "orderCount", "") * .44).toFixed(2)}</td>
                            }
                        </tr>

                    </tbody>
                </table>
                <table style={{ width: "100%" }}>
                    <tr>
                        <td style={{ width: "50%" }}></td>
                        <td style={{ width: "50%" }}>
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td colspan="3" style={{ padding: "8px 0", textAlign: " left", fontSize: "13px" }}>Total
                                    </td>
                                    <td className="invoice-totalvalue" colspan="3" style={{ padding: "8px 0", fontSize: "13px", textAlign: 'right' }}>₹{parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .05 + get(orderData, "kikoShippingAmount", 0) / 1.18 + get(orderData, "orderCount", "") * 2.45).toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    {!orderData?.isMp ? <><td colspan="3"
                                        style={{ padding: "8px 0 12px 0", textAlign: "left", borderBottom: "1px solid #ccc", fontSize: "13px", }}>
                                        IGST Total</td>
                                        <td className="invoice-totalvalue" colspan="3"
                                            style={{ padding: "8px 0 12px 0", borderBottom: "1px solid #ccc", fontSize: "13px", textAlign: 'right' }}>
                                            ₹{(get(orderData, "totalShippingAndOrderAmount", 0) * .009 + (get(orderData, "kikoShippingAmount", 0) * 0.1525) + get(orderData, "orderCount", 0) * 0.44).toFixed(2)}
                                        </td> </> :
                                        <>
                                            <td colspan="3"
                                                style={{ padding: "8px 0 12px 0", textAlign: "left", fontSize: "13px", }}>
                                                SGST Total</td>
                                            <td className="invoice-totalvalue" colspan="3"
                                                style={{ padding: "8px 0 12px 0", fontSize: "13px", textAlign: 'right' }}>
                                                ₹{((get(orderData, "totalShippingAndOrderAmount", 0) * .009) / 2 + (get(orderData, "kikoShippingAmount", 0) * 0.1525) / 2 + get(orderData, "orderCount", 0) * 0.22).toFixed(2)}
                                            </td>

                                        </>
                                    }
                                </tr>
                                {orderData?.isMp &&<tr>
                                    <td></td>
                                    <td></td>
                                    <td colspan="3"
                                        style={{ padding: "8px 0 12px 0", textAlign: "left", borderBottom: "1px solid #ccc", fontSize: "13px", }}>
                                        CGST Total</td>
                                    <td className="invoice-totalvalue" colspan="3"
                                        style={{ padding: "8px 0 12px 0", borderBottom: "1px solid #ccc", fontSize: "13px", textAlign: 'right' }}>
                                        ₹{((get(orderData, "totalShippingAndOrderAmount", 0) * .009) / 2 + (get(orderData, "kikoShippingAmount", 0) * 0.1525) / 2 + get(orderData, "orderCount", 0) * 0.22).toFixed(2)}
                                    </td>
                                </tr>}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td colspan="3" style={{ padding: "8px 0", textAlign: " left", fontSize: "13px" }}><b>Invoice Total</b></td>
                                    <td className="invoice-totalvalue" colspan="3" style={{ padding: "8px 0", fontSize: "13px", textAlign: "right" }}><b>₹{parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .009 + get(orderData, "totalShippingAndOrderAmount", 0) * .05 + get(orderData, "kikoShippingAmount", 0) + get(orderData, "orderCount", 0) * 0.44 + get(orderData, "orderCount", 0) * 2.45).toFixed(2)}</b></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    {/* <tr style={{ borderTop: "1px solid #ccc"  }}>
                        <td></td>
                        <td colspan="5">
                            <p
                                style={{ fontSize: "14px",  padding: "8px 0", fontWeight: " 600", margin: "0", color: "#000" }}>
                                Invoice Total(In words): {numberToWords(parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .009 + get(orderData, "totalShippingAndOrderAmount", 0) * .05 + get(orderData, "kikoShippingAmount", 0)).toFixed(2)) + " Only"}</p>
                        </td>
                    </tr> */}
                </table>
                <p
                    style={{ fontSize: "14px", padding: "8px 0", fontWeight: " 600", margin: "0", color: "#000", textAlign: "right" }}>
                    Invoice Total(In words): {numberToWords(parseFloat(get(orderData, "totalShippingAndOrderAmount", 0) * .009 + get(orderData, "totalShippingAndOrderAmount", 0) * .05 + get(orderData, "kikoShippingAmount", 0) + get(orderData, "orderCount", 0) * 0.44 + get(orderData, "orderCount", 0) * 2.45).toFixed(2)) + " Only"}</p>
                <table style={{ width: "100%", }}>
                    <tr>
                        <p style={{ fontSize: "13px", textAlign: "center", fontWeight: "500", margin: "10px 0 10px 0", lineHeight: "19px", color: "#000" }}>
                            Smooth Tag Technologies Private Limited(kiko Live) <br />
                            Address: A 603 Emrold court Indore 452001 MP, India <br />
                            GSTIN: 23ABECS2026C1Z0 </p>
                    </tr>
                </table>
                <table cellspacing="0" style={{ marginTop: "30px" }}>
                    <tr>
                        <td style={{ padding: "15px 25px" }}>
                            <img src={logo} alt="" />
                        </td>
                        <td>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: " 0 0 6px 0" }}>Smooth Tag Technologies Pvt Ltd
                            </h2>
                            <p style={{ fontSize: "13px", marginBottom: "0", fontWeight: "500", margin: " 0 ,", color: "#000" }}>A 603 Emrold court Indore
                                <br />452001 MP,India
                            </p>
                        </td>
                    </tr>
                </table>
                <table style={{ width: " 100%", border: "1px solid #ccc", }}>
                    <tr>
                        <td style={{ padding: "20px", borderRight: "1px solid #ccc", borderBottom: "1px solid #ccc" }}>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>Bank Account Number</p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>Particular of A/C</p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>A/C Holder's Name</p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>Bank Name</p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>IFSC Code</p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>Branch Name/Address</p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", color: "#000" }}>UPI / VPA</p>
                        </td>
                        <td style={{ padding: "20px", borderRight: "1px solid #ccc", borderBottom: "1px solid #ccc" }}>
                            <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>10064850278</p>
                            <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>Current Account</p>
                            <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>Smooth Tag Technologies Private Limited</p>
                            <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>IDFC FIRST Bank</p>
                            <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>IDFB0040109</p>
                            <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 4px 0", color: "#000" }}>Mulund  Branch</p>
                        </td>
                        <td rowspan="2" style={{ verticalAlign: "top", padding: "20px" }}>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 10px 0", color: "#000" }}>IRN </p>
                            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 10px 0", color: "#000" }}>IRN DATE : </p>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "20px", borderRight: "1px solid #ccc", verticalAlign: " top" }}>
                            <p style={{ fontSize: "13px", fontWeight: " 700", margin: "0 0 4px 0", color: "#000" }}>UPI QR</p>
                        </td>
                        <td style={{ padding: "20px", borderRight: "1px solid #ccc" }}>
                            <div style={{ maxWidth: "120px", width: "100%", height: "120px" }}>
                                <img src={QrCode} alt="" style={{ maxWidth: "100%", width: "100%", height: "100%" }} />
                            </div>
                        </td>
                    </tr>
                </table>
                <table style={{ width: "100%", marginTop: "20px" }}>
                    <tr>
                        <p style={{ fontSize: "13px", textAlign: "center", fontWeight: "500", margin: "30px 0 30px 0", lineHeight: "19px", color: "#000" }}>
                            Smooth Tag Technologies Private Limited(kiko Live) <br />
                            Address: A 603 Emrold court Indore 452001 MP, India <br />
                            GSTIN: 23ABECS2026C1Z0 </p>
                    </tr>
                </table>
            </div>
        </>
    );
}
export default sellerInvoiceTemplate;