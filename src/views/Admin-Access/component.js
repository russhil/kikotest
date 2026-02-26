import React, { useState, useEffect } from "react";
import "./styles.scss";
import { get } from "lodash";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { GET_SELLER_LIST } from "../../api/apiList";
import API from "../../api";
import LogoutBlack from "../../images/ShopDetails/logout-black.svg";
import axios from "axios";
import cartIcon from "../../images/Inventry/cart-icon.png";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  DateFilters,
  handleError,
  PaginationFilter,
  handleLogout,
  nomenclature,
} from "../../utils";

function AdminAccess(props) {
  const getAdminDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "");
    } catch (error) {
      return null;
    }
  };
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [startDate, setstartDate] = useState("");
  const [clear, setclear] = useState(false);
  const [endDate, setendDate] = useState("");
  const [role] = useState("seller");
  const [limit] = useState(20);
  const [count, setCount] = useState(0);
  const [page, setpage] = useState(1);
  const [search, setSearch] = useState("");
  const [pincode, setPincode] = useState("");
  const [tableLoading, setTableloading] = useState(false);
  const [componentMounted, setComponentMounted] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (componentMounted) {
      sellerList();
    } else {
      setComponentMounted(true);
    }
  }, [componentMounted, page]);

  useEffect(() => {
    const adminData = getAdminDetails();
    if (!adminData && get(!adminData, "_id", "") === "") {
      handleLogout();
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (
      search === "" &&
      startDate === "" &&
      endDate === "" &&
      clear &&
      pincode === ""
    ) {
      sellerList();
    }
  }, [search, startDate, endDate, pincode]);

  const onPageChanged = (page) => {
    setpage(page);
  };

  const clearState = () => {
    setclear(true);
    setSearch("");
    setstartDate("");
    setendDate("");
    setPincode("");
  };

  const generateToken = async (userId) => {
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_KIKO_API_V1}/kikoweb/generate-user-token`,
      headers: {
        desktop: true,
      },
      data: {
        userId,
      },
    };
    try {
      const result = await axios(options);
      if (result?.data?.status) {
        localStorage.setItem("user", JSON.stringify(result?.data?.data?.user));
        localStorage.setItem("token", JSON.stringify(result?.data?.data?.token));
        navigate("/shopdetails");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const sellerList = async () => {
    setTableloading(true);
    const adminData = getAdminDetails();
    let obj = {
      role: role,
      search,
      startDate,
      endDate,
      limit,
      city: [],
      page,
      pincode: parseInt(pincode),
      franchiseeId: adminData?.franchiseeId
    };
    if (startDate !== "" && endDate !== "") {
      var sDate = new Date(startDate);
      obj.startDate = sDate.setDate(sDate.getDate() + 1);
      var eDate = new Date(endDate);
      obj.endDate = eDate.setDate(eDate.getDate() + 1);
    }
    try {
      const data = await API.post(GET_SELLER_LIST, obj);
      if (data?.data?.success) {
        setTableloading(false);
        setUserList(get(data, "data.result.result", []));
        setCount(get(data, "data.result.count"));
      } else {
        setTableloading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="admin-access-header">
        <div className="admin-acces-container">
          <div className="admin-acces-filter-items">
            <div className="admin-acces-filter-label">
              Filter By:
            </div>

          </div>

          <DateFilters
            changeStartDate={(date) => setstartDate(date)}
            changeEndDate={(date) => setendDate(date)}
            startDate={startDate}
            endDate={endDate}
            title={"Login Date"}
          />

          <div className="admin-acces-filter-items">
            <label className="admin-acces-filter-label">Store Name/Mobile Number/Store Owner’s name/Id</label>
            <input
              className="form-control"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-acces-filter-items">
            <label className="admin-acces-filter-label">Search by Location:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Pin code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <div className="admin-acces-filter-items">
            <button
              onClick={() => {
                sellerList();
              }}
              disabled={
                search === "" &&
                  startDate === "" &&
                  endDate === "" &&
                  pincode === ""
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
                  endDate === "" &&
                  pincode === ""
                  ? true
                  : false
              }
              className="btn btn-sm btn-outline"
            >
              Clear
            </button>
          </div>
        </div>
        <button
          className="logout-icon"
          onClick={() => {
            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            window.location.reload();
          }}
        >
          <img src={LogoutBlack} alt="" />
        </button>
      </div>
      <div className="admin-acces-block">
        <div className="seller-list-heading">
          <p className="m-0">Seller List</p>
        </div>
        {userList.length > 0 ? (
          <div className="Admin-acces-table table-responsive">
            {tableLoading ? (
              <Spin indicator={antIcon} className="loader" />
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">First Login date</th>
                    <th scope="col">Role</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Store Name</th>
                    <th scope="col">Store Owner’s name</th>
                    <th scope="col">City</th>
                    <th scope="col">Pincode</th>
                    <th scope="col">Category</th>
                    <th scope="col">Action</th>
                    <th scope="col">ProviderId</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user, index) => {
                    return (
                      <tr key={index}>
                        <td>{moment(user?.createdAt).format("DD-MMM-YYYY")}</td>
                        <td>{nomenclature(user?.role)}</td>
                        <td>{user?.mobile}</td>
                        <td>{user?.storeName}</td>
                        <td>{user?.name}</td>
                        <td>{user?.storeAddress?.city}</td>
                        <td>{user?.storeAddress?.pincode}</td>
                        <td>{user?.mainCategory}</td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => {
                              generateToken(user?._id);
                            }}
                          >
                            Impersonate
                          </button>
                        </td>
                        <td>{user?._id}</td>
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
                <h5>No Seller Found</h5>
                <div className="d-flex gap-2 mt-4 justify-content-center"></div>
              </div>
            )}
          </div>
        )}
        <div className="d-flex justify-content-center">
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={count}
            page={page}
          />
        </div>
      </div>
    </>
  );
}
export default AdminAccess;
