import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import ThreeDots from "../../images/threesot.svg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { read, utils } from "xlsx";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  INVENTORY,
  DELETE_INVENTORY,
  UPDATE_CATELOGUE,
  CATELOGUE_BRAND,
  CATELOGUE_LIST,
  UPDATE_CATELOGUE_EXCEL,
  GET_CATELOGUE_VARIENT,
} from "../../api/apiList";
import API from "../../api";
import "react-responsive-modal/styles.css";
import DeleteModal from "../../components/DeleteModal/deletemodal";
import InventoryModal from "../../components/InventoryModal/inventoryModal";
import {
  notify,
  handleError,
  nomenclature,
  PaginationFilter,
  CsvGenerator,
  handleLogout,
} from "../../utils";
import DeleteIcon from "../../images/Inventry/delete-icon.svg";
import Select from 'react-select';
import EditIcon from "../../images/Inventry/edit-icon.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import cartIcon from "../../images/Inventry/cart-icon.png";
import "./styles.scss";

function Inventory(props) {
  const myRef = useRef();
  const getSellerDetails = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [editInventory, setEditInventory] = useState({});
  const [count, setcount] = useState({});
  const [search, setSearch] = useState("");
  const [clear, setclear] = useState(false);
  const [realCount, setrealCount] = useState(0);
  const [limit] = useState(20);
  const [page, setpage] = useState(1);
  const [stocks, setstocks] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [inventory, setinventory] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [status, setstatus] = useState("");
  const [wrongRecord, setWrongRecord] = useState([])
  const [componentMounted, setComponentMounted] = useState(false);
  const [user_data] = useState(getSellerDetails());
  const navigate = useNavigate();
  const isAppView = localStorage.getItem("isAppView") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [variants, setVariants] = useState([]);
  const [openVarient, setOpenVarient] = useState(false);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelectedBrandName(selectedOption?.value)
  };

  const getInventory = async (loading) => {
    try {
      if (!user_data._id || user_data._id == "") {
        handleLogout();
      }
      setLoading(loading);
      const obj = {
        userId: user_data && user_data._id ? user_data._id : "",
        status,
        stocks,
        limit,
        page,
        search,
        brand: selectedBrandName
      };
      const response = await API.post(INVENTORY, obj);
      setLoading(false);
      if (response?.data?.success) {
        setcount(response?.data?.data?.count);
        setrealCount(response?.data?.data?.catCount);
        setinventory(response?.data?.data?.results);
        setUpdateStatus("");
      } else {
        notify("error", "Please Login Again!");
        if (response?.data?.userUnauthorized) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie =
              name +
              "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=" +
              window.location.hostname;
          }
          navigate("/");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getCatelogueVarient = async (catelogData) => {
    try {
      const response = await API.post(GET_CATELOGUE_VARIENT, {
        _id: catelogData?._id,
      });
      if (response.data?.success) {
        setVariants(response.data.result);
        setOpenVarient(true)
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getInventoryList = async () => {
    try {
      setCsvLoading(true);
      const obj = {
        userId: user_data && user_data._id ? user_data._id : "",
        status: "active",
        stocks,
        limit,
        page,
        search,
        brand: selectedBrandName
      };
      const response = await API.post(CATELOGUE_LIST, obj);
      setCsvLoading(false);
      if (response?.data?.isSuccess) {
        window.open(
          response?.data?.data?.allExportData.file_url,
          `CatelogData.csv`
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (componentMounted) {
      getInventory(true);
      catelogBrand()
    } else {
      setComponentMounted(true);
    }
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [componentMounted, status, page]);

  const deleteInventor = async () => {
    const _id = editInventory._id;
    try {
      setShowModal(false);
      const response = await API.delete(DELETE_INVENTORY, { data: { _id } });
      if (response?.data?.success) {
        getInventory(true);
        setEditInventory({});
        notify("success", response?.data?.message);
      }
    } catch (error) {
      setEditInventory({});
      handleError(error);
    }
  };

  const catelogBrand = async () => {
    try {
      setShowModal(false);
      const response = await API.post(CATELOGUE_BRAND, { userId: user_data && user_data._id ? user_data._id : "", });
      if (response?.data?.success) {
        setBrandName(response?.data?.result)
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onPageChanged = (page) => {
    setpage(page);
  };

  const updateStockStatus = async (Inv) => {
    let body = {
      availableQuantity: parseInt(Inv.availableQuantity) > 0 ? "0" : "250",
      _id: Inv && Inv._id ? Inv._id : "",
    };
    try {
      //
       const objIncremental = {
        "sellerId": Inv?.userId,
        "type": "updateItem",
        "itemId": Inv && Inv._id ? Inv._id : "",
      }
      if (Inv?.categoryId == "Food & Beverage") {
        objIncremental.domain = "ONDC:RET11"
      }
      else {
        objIncremental.domain = "ONDC:RET10"
      }
      const options = {
        method: "post",
        url: `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/incremental-search`,
        headers: {
          desktop: true,
        },
        data: objIncremental,
      };
      //
      const response = await API.post(UPDATE_CATELOGUE, body);
      if (response?.data?.success) {
        await axios(options);
        getInventory(false);
        setOpenVarient(false);
        notify("success", response?.data?.message);
      } else {
        setUpdateStatus("");
        notify("error", response?.data?.message);
      }
    } catch (error) {
      setUpdateStatus("");
      handleError(error);
    }
  };

  function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
const convertExcelToJson = (file) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith(".xlsx")) {
        notify("error", "Invalid file format. Only XLSX files are allowed.");
        setLoading(false);
        return; // Return early and do not proceed further
      }
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const filteredData = utils.sheet_to_json(worksheet, { header: 1 });

        const jsonData = filteredData.filter(
          (row) => Array.isArray(row) && row?.length > 0
        );
        const headers = jsonData[0];
        const headerTransformations = {
          'ID': '_id',
          'Product Name': 'productName',
          'Available Quantity': 'availableQuantity',
          'Price': 'price',
          'Selling Price': 'discountedPrice',
          'Product Image 1': 'image1',
          'Product Image 2': 'image2',
          'Product Image 3': 'image3',
          'Product Image 4': 'image4',
          'Product Image 5': 'image5',
          'Product Image 6': 'image6',
          'Product Image 7': 'image7',
        };
        const isValidImage = (imageString) => {
          if (!imageString || typeof imageString !== 'string') return false;
          
          const allowedExtensions = ['jpeg', 'jpg', 'png', 'webp'];
         
          const isURL = imageString.toLowerCase().startsWith('http://') || 
                       imageString.toLowerCase().startsWith('https://');
          
          if (isURL) {
            return true; 
          }          
         
          const extension = imageString.split('.').pop().toLowerCase();
          return allowedExtensions.includes(extension);
        };

        const result = jsonData.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            const modifiedHeader = headerTransformations[header.trim()];
            if (modifiedHeader === '_id') {
              obj[modifiedHeader] = row[index].replace(/"/g, ''); // Remove double quotes
            } else {
              obj[modifiedHeader] = row[index];
            }
          });

          if (
            // !obj.productId ||
            !obj._id ||
            (!obj.price && obj.price != 0) ||
            (!obj.discountedPrice && obj.discountedPrice != 0) ||
            (!obj.availableQuantity && obj.availableQuantity !== 0) ||
            parseInt(obj.availableQuantity) > 999 ||
            !obj.productName ||
            !obj.image1
          ) {
            if (!obj._id) {
              obj.Error = "ID is not valid"
            }
            else if ((!obj.price && obj.price != 0)) {
              obj.Error = "Price is not valid"
            }
            else if ((!obj.discountedPrice && obj.discountedPrice != 0)) {
              obj.Error = "Discounted Price is not valid"
            }
            else if ((!obj.availableQuantity && obj.availableQuantity !== 0) || parseInt(obj.availableQuantity) > 999) {
              obj.Error = "Available Quantity is not valid"
            }
            else if (!obj.image1) {
              obj.Error = "Image is not valid"
            }
            else if (!obj.productName) {
              obj.Error = "Product Name is not valid"
            }
            wrongRecord.push(obj);
            return null;
          }
          
          const imageProperties = [
            "image1",
            "image2",
            "image3",
            "image4",
            "image5",
            "image6",
            "image7",
          ];
          let productImages = [];
          const isAllowed = obj.categoryId?.trim() === "Food & Beverage" ? true : false;
          
          for (const propName of imageProperties) {
            if (obj[propName] && typeof obj[propName] === 'string' && obj[propName] !== null) {
              // Use the new validation function that supports both extensions and URLs
              if (isValidImage(obj[propName]) || isAllowed) {
                productImages.push(obj[propName]);
              }
            }
            delete obj[propName];
          }
          if (productImages?.length < 1 && !isAllowed) {
            obj.Error = "Image is not valid"
            wrongRecord.push(obj);
            return null;
          }
          obj.productImages = productImages;
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
      const finalData = jsonData.filter((item) => { return item != null })
      if (wrongRecord.length > 0) { notify("error", `${wrongRecord.length} records are Wrong`); }
      const hasValidationError = finalData.some((item) => item === false);
      if (!hasValidationError) {
        const chunkSize = 500;
        const chunks = chunkArray(finalData.flat(), chunkSize);
        try {
          await Promise.all(
            chunks.map((chunk) =>
              API.post(UPDATE_CATELOGUE_EXCEL, { remittanceArray: chunk })
                .then(({ data }) => {
                  if (!data.success) {
                    throw new Error('Chunk update failed');
                  }
                })
                .catch((error) => {
                  handleError(error); // Handle errors for each chunk
                })
            )
          );

          toast(`Catalogue updated successfully`);
          getInventory(true);

          if (wrongRecord.length > 0) {
            setTimeout(() => {
              myRef.current.link.click();
              setWrongRecord([]);
            }, 1000);
          }
        } catch (error) {
          console.error("Error processing chunks", error);
          notify('error', 'Something went wrong');
        }
      }

    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (clear) {
      getInventory(true);
      setclear(false)
    }
  }, [clear])

  const clearState = () => {
    setpage(1);
    setstocks("");
    setSearch("");
    setSelectedBrandName("")
    setSelectedOption(null)
    if (page === 1) { setclear(true); }
    else {
      setpage(1);
    }
  };

  const searchState = () => {
    if (page === 1) { getInventory(true) }
    else {
      setpage(1);
    }
  };

  const header = [
    { label: "Error Cause", key: "Error" },
    { label: "ID", key: "_id" },
    { label: "Product Name", key: "productName" },
    { label: "Available Quantity", key: "availableQuantity" },
    { label: "Price", key: "price" },
    { label: "Selling Price", key: "discountedPrice" },
    { label: "Product Image1", key: "image1" },
    { label: "Product Image2", key: "image2" },
    { label: "Product Image3", key: "image3" },
    { label: "Product Image4", key: "image4" },
    { label: "Product Image5", key: "image5" },
    { label: "Product Image6", key: "image6" },
    { label: "Product Image7", key: "image7" },
  ];

  return (
    <>
      <div
        className="RightBlock"
        style={
          isMobile
            ? {
              width: "100%",
              left: "0",
              top: isAppView === "true" ? "0px" : "68px",
            }
            : {}
        }
      >
        <div className="inventry-section">
          <div>
            <div className="section-title">
              <h1 className="m-0">Inventory</h1>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-primary" onClick={() => { navigate("/sales-data") }}>{"View Sales Data"}</button>
                <button disabled={csvLoading} className="btn btn-sm btn-primary" onClick={() => getInventoryList()}>{csvLoading ? "Loading" : "Download Catalog"}</button>
                <label className="btn btn-sm btn-primary">Bulk Catalog Update
                  <input style={{ display: 'none' }} type="file" onChange={(e) => handleFileChange(e)} />
                </label>
              </div>
            </div>
            <ul className="nav nav-pills" role="tablist">
              <li className={status === "" ? "nav-item active" : "nav-item"}>
                <a
                  data-toggle="tab"
                  onClick={() => {
                    setpage(1);
                    setstatus("");
                  }}
                >
                  All<span>({count.totalCount})</span>
                </a>
              </li>
              <li
                className={status === "active" ? "nav-item active" : "nav-item"}
              >
                <a
                  data-toggle="tab"
                  onClick={() => {
                    setpage(1);
                    setstatus("active");
                  }}
                >
                  Active<span>({count.activeCount})</span>
                </a>
              </li>
              <li
                className={
                  status === "pending" ? "nav-item active" : "nav-item"
                }
              >
                <a
                  data-toggle="tab"
                  onClick={() => {
                    setpage(1);
                    setstatus("pending");
                  }}
                >
                  Pending<span>({count.pendingCount})</span>
                </a>
              </li>
              <li
                className={
                  status === "rejected" ? "nav-item active" : "nav-item"
                }
              >
                <a
                  data-toggle="tab"
                  onClick={() => {
                    setpage(1);
                    setstatus("rejected");
                  }}
                >
                  Rejected<span>({count.rejectedCount})</span>
                </a>
              </li>
              <li
                className={
                  status === "drafted" ? "nav-item active" : "nav-item"
                }
              >
                <a
                  data-toggle="tab"
                  onClick={() => {
                    setpage(1);
                    setstatus("drafted");
                  }}
                >
                  Drafted<span>({count.draftedCount})</span>
                </a>
              </li>
            </ul>
            <div className="col-lg-12">
              <div className="tab-content">
                <div id="home" className="tab-pane active">
                  <div className="filter">
                    <span className="inventory-select-span p-0">
                      <label>Search By: </label>
                      <span className="inventory-select-span">
                        <input
                          type="text"
                          value={search}
                          placeholder="Product Name/EAN Number"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </span>
                    </span>
                    <span className="inventory-select-span p-0">
                      <label>Brand Filter:</label>
                      <span className="inventory-select-span" style={{ width: "250px", height: "39px" }}>
                        <Select
                          value={selectedOption}
                          onChange={handleChange}
                          placeholder={"Select Brand..."}
                          options={brandName.map(option => ({ value: option, label: option }))}
                        />
                      </span>
                    </span>
                    <span className="inventory-select-span p-0">
                      <label>Filter By:</label>
                      <span className="inventory-select-span">
                        <select
                          className="form-select inventory-select"
                          style={{ padding: "9px 10px" }}
                          onChange={(e) => {
                            setstocks(e.target.value);
                          }}
                          value={stocks}
                        >
                          <option value={""}>Select</option>
                          <option value={"0"}>In Stocks</option>
                          <option value={"1"}>Out Of Stocks</option>
                          <option value={"50"}>Low Stocks</option>
                        </select>
                      </span>
                    </span>

                    <button
                      onClick={() => {
                        searchState()
                      }}
                      disabled={search === "" && stocks === "" && selectedBrandName === ""}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Search
                    </button>
                    <button
                      onClick={() => {
                        clearState()
                      }}
                      disabled={search === "" && stocks === "" && selectedBrandName === ""}
                      className="btn btn-sm btn-outline"
                    >
                      Clear
                    </button>
                  </div>
                  {inventory.length > 0 ? (
                    <>
                      <div className="inventory-container">
                        <div className="table-responsive">
                          {loading ? (
                            <Spin indicator={antIcon} className="loader" />
                          ) : (
                            <table className="table table-borderless">
                              <thead>
                                <tr>
                                  <th scope="col">Sr No.</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Product Name</th>
                                  <th scope="col">Action</th>
                                  <th scope="col">Stock Status</th>
                                  <th scope="col">Available Quantity</th>
                                  <th scope="col">Net Weight</th>
                                  <th scope="col">Unit</th>
                                  <th scope="col">Price</th>
                                  <th scope="col">Discount Price</th>
                                  <th scope="col">EAN/Barcode Number</th>
                                  <th scope="col">Country of origin</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inventory.map((Inv, index) => {
                                  return (
                                    <tr key={index}>
                                      <th scope="row">{index + 1}</th>
                                      <td>
                                        {" "}
                                        {Inv.status === "rejected" ? (
                                          <p className="red status-border">
                                            {" "}
                                            {nomenclature(Inv.status)}{" "}
                                          </p>
                                        ) : Inv.status === "pending" ? (
                                          <p className="yellow status-border">
                                            {" "}
                                            {nomenclature(Inv.status)}{" "}
                                          </p>
                                        ) : Inv.status === "active" ? (
                                          <p className="Darkgreen status-border">
                                            {" "}
                                            {nomenclature(Inv.status)}{" "}
                                          </p>
                                        ) : Inv.status === "drafted" ? (
                                          <p className="blue status-border">
                                            {" "}
                                            {nomenclature(Inv.status)}{" "}
                                          </p>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>{Inv.productName}</td>
                                      <td>
                                        {Inv.isVariant && (
                                          <button
                                            onClick={() => {
                                              getCatelogueVarient(Inv)
                                            }}
                                            className="btn btn-primary btn-sm me-2"
                                          >
                                            View variant
                                          </button>
                                        )}
                                      </td>
                                      <td>
                                        {updateStatus == Inv._id ? (
                                          <Spin
                                            indicator={antIcon}
                                            size="small"
                                          />
                                        ) : (
                                          <div className="invSwitchBtn">
                                            <label className="switch">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  parseInt(
                                                    Inv.availableQuantity
                                                  ) > 0
                                                    ? true
                                                    : false
                                                }
                                                disabled={updateStatus != ""}
                                                onChange={() => {
                                                  setUpdateStatus(Inv._id);
                                                  updateStockStatus(Inv);
                                                }}
                                              />
                                              <span className="slider round"></span>
                                            </label>
                                          </div>
                                        )}
                                      </td>
                                      <td>{Inv.availableQuantity}</td>
                                      <td>{Inv.weight}</td>
                                      <td>{Inv.weightUnit}</td>
                                      <td>{parseFloat(Inv.price).toFixed(2)}</td>
                                      <td>{parseFloat(Inv.discountedPrice).toFixed(2)}</td>
                                      <td>{Inv.productId}</td>
                                      <td>{Inv.countryOfOrigin}</td>
                                      <td>
                                        <button
                                          onClick={() => {
                                            navigate("/categories", {
                                              state: { catelogData: Inv },
                                            });
                                          }}
                                        >
                                          <img
                                            src={EditIcon}
                                            alt=""
                                            variant="outlined"
                                            color="neutral"
                                          />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setShowModal(true);
                                            setEditInventory(Inv);
                                          }}
                                        >
                                          <img src={DeleteIcon} alt="" />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                      <div className="mobile-inventory">
                        <div className="inventory-flex">
                          {loading ? (
                            <Spin indicator={antIcon} className="loader" />
                          ) : inventory.map((Inv, index) => {
                            return (
                              <div className="inventory-list" key={index}>
                                <div className="d-flex align-items-center justify-content-between mb-2" style={{ position: "relative" }}>
                                  <h6 className="m-0"> {Inv?.productName?.length > 35 ? Inv?.productName?.slice(0, 35) + "..." : Inv.productName}</h6>
                                  <div className="threedotsDropdown">
                                    <div className="dropdown">
                                      <button
                                        className=" threedots"
                                        type="button"
                                        id="dropdownMenuButton1"
                                        aria-haspopup="true"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <img
                                          src={ThreeDots}
                                          className="three-dots"
                                          alt="Three Dots"
                                        />
                                      </button>
                                      <div
                                        className="dropdown-menu"
                                        aria-labelledby="dropdownMenuButton1"
                                      >
                                        <p className="dropdown-item m-0"
                                          onClick={() => {
                                            navigate("/categories", {
                                              state: { catelogData: Inv },
                                            });
                                          }}
                                        >Edit</p>
                                        <p className="dropdown-item m-0"
                                          onClick={() => {
                                            setShowModal(true);
                                            setEditInventory(Inv);
                                          }} >
                                          Delete
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <p>EAN / Barcode No: {Inv.productId}</p>
                                  {Inv.status === "rejected" ? (
                                    <div className="yellow-border">Inacitve</div>
                                  ) : Inv.status === "pending" ? (
                                    <div className="red-border">Pending</div>
                                  ) : Inv.status === "active" ? (
                                    <div className="green-border">Active</div>
                                  ) : Inv.status === "drafted" ? (
                                    <p className="blue status-border">
                                      {" "}
                                      {nomenclature(Inv.status)}{" "}
                                    </p>
                                  ) : (
                                    ""
                                  )}

                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <p>
                                      Price: <span>₹{Inv.price}</span>
                                    </p>
                                    <span className="divder"></span>
                                    <p>
                                      Discount Price: <span>₹{Inv.discountedPrice}</span>
                                    </p>
                                  </div>
                                  <p>Stock Status:</p>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center gap-2">
                                    <p>Net weight: {Inv.weight}{" "}{Inv.weightUnit}</p>
                                    <span className="divder"></span>
                                    <p>Available Qty:{Inv.availableQuantity}</p>
                                  </div>
                                  <div className="inventory-switch">
                                    <div className="invSwitchBtn p-0">
                                      <label className="switch">
                                        {updateStatus == Inv._id ? (
                                          <Spin
                                            indicator={antIcon}
                                            size="small"
                                          />
                                        ) : (
                                          <>
                                            <input
                                              type="checkbox"
                                              checked={
                                                parseInt(
                                                  Inv.availableQuantity
                                                ) > 0
                                                  ? true
                                                  : false
                                              }
                                              disabled={updateStatus != ""}
                                              onChange={() => {
                                                setUpdateStatus(Inv._id);
                                                updateStockStatus(Inv);
                                              }}
                                            />
                                            <span className="slider round"></span>
                                          </>
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  ) : loading ? (
                    <Spin indicator={antIcon} className="loader" size="large" />
                  ) : (
                    <div className="no-data-status">
                      <div className="upload-catalog-modal">
                        <div className="cart-icon">
                          <img src={cartIcon} alt="" />
                        </div>
                        <p>No Catalogue has been Uploaded </p>
                        <p>Kindly Upload Catalogue </p>
                        <div className="d-flex gap-2 mt-3 justify-content-center">
                          <Link
                            to="/addsinglecatalog"
                            className="btn btn-primary"
                          >
                            {" "}
                            Upload Catalogue
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'none' }}>
          <CsvGenerator
            myRef={myRef}
            data={wrongRecord}
            headings={header}
            fileName={"CatelogError.csv"}
            buttonName={"Error "}
            exportLoading={false}
          />
        </div>
        <div className="d-flex justify-content-center">
          <PaginationFilter
            onPageChanged={onPageChanged}
            limit={limit}
            count={realCount}
            page={page}
          />
        </div>
      </div>
      <InventoryModal
        openVarient={openVarient}
        setOpenVarient={() => {
          setOpenVarient(false);
        }}
        variants={variants}
        setUpdateStatus={(variant) => {
          setUpdateStatus(variant._id);
          updateStockStatus(variant);
        }}
        updateStatus={updateStatus}
      />
      <DeleteModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditInventory({});
        }}
        onSubmit={() => {
          deleteInventor();
        }}
        title={"Your Lot"}
      />
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        toastStyle={{ backgroundColor: "crimson" }}
      />
    </>
  );
}
export default Inventory;
