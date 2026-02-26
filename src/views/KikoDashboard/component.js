import React, { useState } from "react";

import "./styles.scss";
// import profileImg from "../../images/ShopDetails/profile-img.png";
// import Logout from "../../images/ShopDetails/logout.svg";
// import brandLogo from "../../images/Registration/brandlogo.png";
// import Profile from "../../images/ShopDetails/profile.svg";
// //sidebar
// import Product from "../../images/ShopDetails/product-pricing.svg";
// import Order from "../../images/ShopDetails/order.svg";
// import Return from "../../images/ShopDetails/return.svg";
// import Inventory from "../../images/ShopDetails/inventory.svg";
// import Payment from "../../images/ShopDetails/payment.svg";
// import Catalog from "../../images/ShopDetails/catalog-uploads.svg";
// import Advertisement from "../../images/ShopDetails/advertisement.svg";
// import Promotions from "../../images/ShopDetails/promotions.svg";
// import PriceRecommendation from "../../images/ShopDetails/price.svg";
// import BusinessDashboard from "../../images/ShopDetails/business-dashboard.svg";
// import QualityDashboard from "../../images/ShopDetails/quality-dashboard.svg";
// import ImageBulk from "../../images/ShopDetails/image-bulk.svg";
// import notification from "../../images/ShopDetails/notification.svg";
// import Support from "../../images/ShopDetails/support.svg";
// import searchIcon from "../../images/Dashboard/searchIcon.svg";
import rightArrow from "../../images/Dashboard/right-arrow.svg";
//import SideBar from "../SideBar/SideBar";
//sidebar end
const KikoDashboard = (props) => {
  const [menuopen, setmenu] = useState(false);
  //const [ setShow] = useState(false);

  // const openmenu = () => {
  //   setmenu(menuopen ? false : true);
  //   myFunction();
  // };

  // function myFunction() {
  //   var element = document.getElementById("profile-wrapper");
  //   element.classList.toggle("left-wrapper");
  // }

  // const handleShow = () => {
  //   setShow(true);
  // };
  return (
    <>
      {/* <div className="KikoDashboardWrapper">
        <div className="dashboardWrapper"> */}
      {/* <SideBar /> */}
      {/* <div className="RightBlock"> */}
      {/* <div className="section-heading">
              <h1 className="heading">Welcome to Kiko Live</h1>
              <p className="subheading m-0">
                Let’s get your business started in 3 steps
              </p>
            </div> */}
      <div className="section-title">
        <h1>Dashboard</h1>
        {/* <div className="titleRight">
                <button className="btn dashboardBtn">Download</button>
                <div className="searchorder">
                  <div className="searchinput">
                    <input
                      id="autocomplete1"
                      list="country_list"
                      placeholder="Order/Sub order No."
                      className="order-search"
                    />
                  </div>
                  <button id="SelectBtn">
                    <img src={searchIcon} />
                  </button>
                  <datalist id="country_list">
                    <option value="one" />
                    <option value="two" />
                    <option value="three" />
                  </datalist>
                </div>
              </div> */}
      </div>
      <div className="detailsBlock">
        <div className="row w-100 m-0">
          <div className="col-lg-6">
            <div className="dashboardCard">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p>Total Orders</p>
                  <h1>₹0</h1>
                </div>
                <a href="/" className="border-btn">
                  View Details
                </a>
              </div>
              <div className="cardFooter">
                <p>
                  Last Payment : <span>₹0</span>
                </p>
                <a href="/">
                  <img src={rightArrow} alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="dashboardCard">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p>Total Orders</p>
                  <h1>₹0</h1>
                </div>
                <a href="/" className="border-btn">
                  View Details
                </a>
              </div>
              <div className="cardFooter">
                <p>
                  Last Payment : <span>₹0</span>
                </p>
                <a href="/">
                  <img src={rightArrow} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sellingProductsWrapper">
        <div className="row w-100 m-0">
          <div className="col-lg-7">
            <div className="performanceBlock">
              <div>
                <h6>Product list and Performance</h6>
                <span>Sales</span>
              </div>
              <div className="right-section">
                <select className="yearList">
                  <option>2023</option>
                  <option>1</option>
                  <option>1</option>
                </select>
                <select className="monthList">
                  <option>May</option>
                  <option>1</option>
                  <option>1</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="performanceBlock">
              <div className="table-section">
                <h6>Top 5 Selling Products</h6>
                <div className=" table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="">
                      <tr>
                        <th scope="col">Sno</th>
                        <th scope="col">Products</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td scope="row">1</td>
                        <td>iPhone 11</td>
                        <td>$891.2</td>
                      </tr>
                      <tr>
                        <td scope="row">2</td>
                        <td>iPhone 11</td>
                        <td>$891.2</td>
                      </tr>
                      <tr>
                        <td scope="row">3</td>
                        <td>iPhone 11</td>
                        <td>$891.2</td>
                      </tr>
                      <tr>
                        <td scope="row">4</td>
                        <td>iPhone 11</td>
                        <td>$891.2</td>
                      </tr>
                      <tr>
                        <td scope="row">5</td>
                        <td>iPhone 11</td>
                        <td>$891.2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footerWrapper mb-4">
        <div className="row w-100 m-0">
          <div className="col-lg-7">
            <div className="left-section">
              <div className="performanceBlock">
                <div>
                  <h6>Available Balance</h6>
                  <h1>₹500</h1>
                </div>
                <div className="right-section">
                  <select className="yearList">
                    <option>2023</option>
                    <option>1</option>
                    <option>1</option>
                  </select>
                  <select className="monthList">
                    <option>May</option>
                    <option>1</option>
                    <option>1</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0">
                  Total Recharge amount in <strong>₹100</strong>
                </h6>
                <a href="/">View History</a>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="right-section">
              <h6>Other Links</h6>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p>Have a query?</p>
                  <span>Raise a ticket for your payment related matters</span>
                </div>
                <a href="/">
                  <img src={rightArrow} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </div>
      </div> */}
    </>
  );
};
export default KikoDashboard;
