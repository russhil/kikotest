import React, { useState, useEffect } from "react";
import logo from "../kiko-logo.png";
import moment from "moment";

function InvoiceTemplate(props) {
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const user_data = useState(getSellerDetails());
  const orderData = useState(props?.orderData);
  const itemData = useState(props?.itemData);

  const mystyle = {
    mainDiv: {
      width: "100%",
      maxWidth: "670px",
      margin: "30px auto",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    table: {
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
      borderCollapse: "collapse",
      marginBottom: "15px",
    },
    tr: {
      borderBottom: "4px solid #6379f757",
    },
    rightsection: {
      padding: "10px",
    },
    headertitle: {
      color: "#000",
      fontSize: "16px",
      margin: "10px 0",
    },
    p: {
      color: "#5c5c5c",
      fontSize: "14px",
      margin: "10px 0",
    },
    bottomLine: {
      maxWidth: "400px",
      margin: "0 auto",
      color: "#000",
      textAlign: "center",
      fontWeight: "500",
    },
    leftsection: {
      borderRight: "4px solid #6379f757",
      padding: "10px",
    },
    headerbg: {
      background: "#6834ff14",
    },
    span: {
      color: "#5c5c5c",
    },
    shopname: {
      color: "#000",
      fontSize: "17px",
      margin: "10px 0",
    },
    shopdetail: {
      margin: "10px 0",
      fontSize: "17px",
      color: " #5c5c5c",
    },
    footertext: {
      fontWeight: "600",
      background: "#6834ff14",
      padding: "10px 16px",
    },
    footerrow: {
      borderBottom: "3px solid #fff",
    },
    bottomhight: {
      height: "80px",
    },
    bottomcaption: {
      maxWidth: "500px",
      margin: "0 auto 12px",
      color: "#000",
      textAlign: "center",
      fontWeight: "500",
      fontSize: "17px",
    },
  };

  return (
    <div style={mystyle.mainDiv}>
      <table style={mystyle.table} cellSpacing="0">
        <tr style={mystyle.tr}>
          <td colSpan="3" style={mystyle.td}>
            <span style={mystyle.span}>Invoice No.</span>
            <p style={mystyle.headertitle}>
              <strong>{orderData?.ondcOrderId}</strong>
            </p>
            <span style={mystyle.span}>Invoice Date.</span>
            <p style={mystyle.headertitle}>
              <strong>
                {moment(orderData?.createdAt).format("DD MMMM YYYY")}
              </strong>
            </p>
          </td>
          <td colSpan="2">
            <img src={logo} alt="" />
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={mystyle.leftsection}>
            <p style={mystyle.p}>Invoice issued by:</p>
            <p style={mystyle.p}>
              Smooth Tag Technologies Private Limited on behalf of
            </p>
            <p style={mystyle.p}>Billed By</p>
            <p style={mystyle.p}>
              <strong style={mystyle.shopname}>{user_data?.storeName}</strong>
            </p>
            <p style={mystyle.shopdetail}>
              {user_data?.storeAddress?.address1}
              {user_data?.storeAddress?.address2}
            </p>
            <p style={mystyle.shopdetail}>
              {user_data?.storeAddress?.city}, {user_data?.storeAddress?.state}
            </p>
            <p style={mystyle.shopdetail}>
              Pincode: {user_data?.storeAddress?.pincode}
            </p>
            <p style={mystyle.shopdetail}>
              <strong style={mystyle.shopname}>Mobile Number:</strong>{" "}
              {user_data?.storeAddress?.contactPersonName}
            </p>
            <p style={mystyle.shopdetail}>
              <strong style={mystyle.shopname}>Seller GSTIN:</strong>{" "}
              {user_data?.kycDetail?.gstNumber}
            </p>
          </td>
          <td colSpan="2" style={mystyle.rightsection}>
            <p style={mystyle.p}>Ship To</p>
            <p style={mystyle.shopdetail}>
              <strong style={mystyle.shopname}>
                {orderData?.address?.name}
              </strong>
            </p>
            <p style={mystyle.shopdetail}>
              {orderData?.address?.address?.door},{" "}
              {orderData?.address?.address?.building},
              {orderData?.address?.address?.city},
              <br />
              {orderData?.address?.address?.locality}
              <br />
              {/* Bandra W. */}
            </p>
            <p>
              {" "}
              {orderData?.address?.address?.city},{" "}
              {orderData?.address?.address?.state}
            </p>
            <p style={mystyle.shopdetail}>
              Pincode: {orderData?.address?.address?.area_code}
            </p>
            <p style={mystyle.shopdetail}>
              <strong style={mystyle.shopname}>Mobile Number:</strong>{" "}
              {orderData?.address?.phone}
            </p>
          </td>
        </tr>
      </table>
      <table style={mystyle.table}>
        <thead className="text-center">
          <tr style={mystyle.headerbg}>
            <th style={mystyle.rightsection}>Sr No.</th>
            <th style={mystyle.rightsection}>Product Name</th>
            <th style={mystyle.rightsection}>Net Weight</th>
            <th style={mystyle.rightsection}>Quantity</th>
            <th style={mystyle.rightsection}>Price</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {itemData.map((item, index) => {
            return (
              <tr style={{ textAlign: "center" }}>
                <th style={mystyle.rightsection} className="text-start">
                  {index + 1}
                </th>
                <td style={mystyle.rightsection}>{item?.productName}</td>
                <td style={mystyle.rightsection}>
                  {item?.weight}
                  {item?.weightUnit}
                </td>
                <td style={mystyle.rightsection}>{item?.quantity?.count}</td>
                <td style={mystyle.rightsection} className="text-end">
                  {item?.discountedPrice}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td style={mystyle.footertext} colSpan="4">
              Order amount
            </td>
            <td style={mystyle.footertext}>₹{orderData?.orderAmount}</td>
          </tr>
          <tr style={mystyle.footerrow}>
            <td style={mystyle.footertext} colSpan="4">
              Delivery Charges
            </td>
            <td style={mystyle.footertext}>
              ₹{orderData?.deliveryChargesValue}
            </td>
          </tr>
          <tr style={mystyle.footerrow}>
            <td style={mystyle.footertext} colSpan="4">
              Tax
            </td>
            <td style={mystyle.footertext}>₹{orderData?.tax}</td>
          </tr>
          <tr style={mystyle.footerrow}>
            <td style={mystyle.footertext} colSpan="4">
              Packing Fee
            </td>
            <td style={mystyle.footertext}>₹{orderData?.packingCharges}</td>
          </tr>
          <tr>
            <td style={mystyle.footertext} colSpan="4">
              Total amount{" "}
              <span style={{ fontSize: "13px" }}>(Including all taxes)</span>
            </td>
            <td style={mystyle.footertext}>
              ₹
              {Math.round(
                parseFloat(orderData?.orderAmount) +
                  parseFloat(orderData?.deliveryChargesValue) +
                  parseFloat(orderData?.tax) +
                  parseFloat(orderData?.packingCharges)
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      <div style={mystyle.bottomhight}></div>
      <p style={mystyle.bottomcaption}>
        Name: Smooth Tag Technologies Private Limited(Kiko Live) Address: A-60,
        Emrold court, Indore 452001, MP India
      </p>
      <p style={mystyle.bottomcaption}>GSTIN: 23ABCS2026C1Z0</p>
    </div>
  );
}

export default InvoiceTemplate;
