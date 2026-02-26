import React, { Fragment } from "react";
import { toast } from "react-toastify";
import { get } from "lodash";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import Download from "./components/svgIcons/download";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const CsvGenerator = ({
  data,
  headings,
  exportLoading,
  onClick,
  fileName,
  buttonName,
  myRef
}) => {
  return (
    <div className="float-right mr-2">
      <CSVLink
        ref={myRef}
        className="btn btn-primary btn-icon-text export_btn"
        data={data}
        asyncOnClick={true}
        headers={headings}
        filename={fileName}
        onClick={onClick}
      >
        <Download />
        {exportLoading ? "Loading..." : buttonName}
      </CSVLink>
    </div>
  );
};

export const ExcelGenerator = ({
  data,
  headings,
  exportLoading,
  fileName,
  buttonName,
  myRef
}) => {
  const generateExcel = async () => {
    const wb = XLSX.utils.book_new();
    console.log("wb", wb);
    const ws = XLSX.utils.json_to_sheet(data);
    console.log("ws", ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    console.log("wbout", wbout);
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
  };

  return (
    <div className="float-right mr-2">
      <button
        ref={myRef}
        className="btn btn-primary btn-icon-text export_btn"
        onClick={generateExcel}
        disabled={exportLoading}
      >
        <span className="btn-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-download"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </span>
        {exportLoading ? "Loading..." : buttonName}
      </button>
    </div>
  );
};

export const notify = (type, message) => {
  toast[type](message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};
export const DateFilters = ({
  startDate,
  changeStartDate,
  endDate,
  changeEndDate,
  title,
}) => {
  return (
    <>
      <span className="me-2 ">
        <label className="me-2">{title} : From</label>
        <DatePicker
          className="select_style"
          onChange={(date) => changeStartDate(date)}
          dateFormat="dd/MM/yyyy"
          maxDate={endDate == "" ? new Date() : endDate}
          selected={startDate}
          placeholderText="DD-MM-YYYY"
        />
      </span>
      <span className="me-2">
        <label className="d-md-inline-block d-block me-2 mt-2">To</label>
        <DatePicker
          onChange={(date) => changeEndDate(date)}
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
          minDate={startDate}
          selected={endDate}
          className="select_style"
          placeholderText="DD-MM-YYYY"
        />
      </span>
    </>
  );
};
export const PaginationFilter = ({ onPageChanged, limit, count, page }) => {
  return (
    <Pagination
      className="float-left"
      hideOnSinglePage
      onChange={onPageChanged}
      current={page}
      pageSize={!limit ? count : limit}
      defaultCurrent={page}
      total={count}
      showSizeChanger={false}
    />
  );
};

export const nomenclature = (order) => {
  const status = order;
  switch (status) {
    case "order_created":
      return "Order Created";
    case "looking_for_courier":
      return "Looking For Courier";
    case "courier_assigned":
      return "Courier Assigned";
    case "courier_departed":
      return "Courier Departed";
    case "parcel_picked_up":
      return "Parcel Picked Up";
    case "active":
      return "Active";
    case "pending":
      return "Pending";
    case "Pending":
      return "Pending";
    case "order-pickup":
      return "Order Pickup";
    case "order-delivered":
      return "Order Delivered";
    case "Order-delivered":
      return "Order Delivered";
    case "courier_arrived":
      return "Courier Arrived";
    case "parcel_delivered":
      return "Parcel Delivered";
    case "order_deleted":
      return "Order Deleted";
    case "order_cancelled":
      return "Order Cancelled";
    case "order-cancelled":
      return "Order Cancelled";
    case "delayed":
      return "Delayed";
    case "order_failed":
      return "Order Failed";
    case "runner_cancelled":
      return "Runner Cancelled";
    case "payment-completed":
      return "Payment Completed";
    case "order-ready-to-pickup":
      return "Order Ready To Pickup";
    case "order-place":
      return "Order Place";
    case "drafted":
      return "Drafted";
    case "manual":
      return "Manual";
    case "dunzo":
      return "Dunzo";
    case "borzo":
      return "Borzo";
    case "paid":
      return "Paid";
    case "payment-failed":
      return "Payment Failed";
    case "planned":
      return "Planned";
    case "In transit":
      return "In Transit";
    case "order-dispatch":
      return "Order Dispatch";
    case "agent":
      return "Agent";
    case "callcenter":
      return "Call Center";
    case "influencer":
      return "Influencer";
    case "influence":
      return "Influencer";
    case "marketinguser":
      return "Marketing User";
    case "sadmin":
      return "Super Admin";
    case "semivendor":
      return "SELLER";
    case "store_owner":
      return "Store Owner";
    case "superadmin":
      return "super Admin";
    case "user":
      return "BUYER";
    case "vendor":
      return "VERIFIED SELLER";
    case "deliverypartner":
      return "Delivery Partner";
    case "kikouser":
      return "Kiko User";
    case "orderexpired":
      return "Order Expired";
    case "Return_Initiated":
      return "Return Initiated";
    case "Return_Approved":
      return "Return Approved";
    case "Liquidated":
      return "Liquidated";
    case "Return_Rejected":
      return "Return Rejected";
    case "Return_Picked":
      return "Return Picked";
    case "Return_Delivered":
      return "Return Delivered";
    case "SelfDelivery":
      return "Self Delivery";
    case "KikoDelivery":
      return "Kiko Delivery";
    case "OnNetworkDelivery":
      return "On-Network Delivery";
    case "SelfPayment":
      return "Self Payment";
    case "KikoPayment":
      return "Kiko Payment";
    case "rejected":
      return "Rejected";
    case "cancelledCheque":
      return "Cancelled Cheque";
    case "passbook":
      return "Passbook";
    case "bankStatement":
      return "Bank Statement";
    case "microwebsite":
      return "Micro Website";
    case "app":
      return "App";
    case "ondc":
      return "Ondc";
    case "rts_initiated":
      return "RTS Initiated";
    case "rts_completed":
      return "RTS Completed";
    case "rto_delivered":
      return "RTO Delivered";
    case "rto_initiated":
      return "RTO Initiated";
    case "agent_assigned":
      return "Agent Assigned";
    case "out_for_pickup":
      return "Out For Pickup";
    case "in_transit":
      return "In Transit";
    case "at_destination_hub":
      return "At Destination Hub";
    case "out_for_delivery":
      return "Out For Delivery";
    case "MP2Delivery":
      return "MP2 Delivery";
    case "not-completed":
      return "Not Completed";
    default:
      return status;
  }
};

export const handleError = (error) => {
  if (error.response && error.response.data.message === "Unauthorized access") {
    notify("error", error.response.data.message);
  }

  if (error.response && error.response.data) {
    if (error.response.data.error) {
      const err = get(error, "response.data.error", "");
      if (
        get(err, "code", "") === 401 &&
        get(err, "stack", "") === "Unauthorized access"
      )
        return;
      toast(
        ({ closeToast }) =>
          typeof err === "string"
            ? err.includes("not a valid phone number") ||
              err.includes("is not an SMS enabled phone number")
              ? "That phone number is not recognized"
              : err
            : Object.keys(err).map((element, index) => (
              <Fragment key={index}>
                {err[element]}
                <br />
              </Fragment>
            )),
        {
          type: toast.TYPE.ERROR,
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    } else {
      notify("error", error.response.data.message);
    }
  } else if (error.message) {
    notify(
      "error",
      error.message === "Network Error"
        ? "Your session has been expired please login again!"
        : error.message
    );
  } else {
    notify("error", "Something went wrong!");
  }
};

export const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.setItem("subscriptionPopupShown", "false");
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
};

export const flutterfetchGeolocationPermission = () => {
  return new Promise((resolve, reject) => {
    window.flutter_inappwebview.callHandler("fetchGeolocationPermission")
      .then(async (res) => {
        if (res) {
          return resolve(true);
        }
        else {

          return resolve(false);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export const flutterfetchCameraPermission = () => {
  return new Promise((resolve, reject) => {
    window.flutter_inappwebview.callHandler("fetchCameraPermission")
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export const flutterDownloadPermission = (args) => {
  return new Promise((resolve, reject) => {
    window.flutter_inappwebview.callHandler('downloadFile', ...args)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export const flutterfetchStoragePermission = () => {
  return new Promise((resolve, reject) => {
    window.flutter_inappwebview.callHandler("fetchStoragePermission")
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export const flutterfetchGeolocationCoords = () => {
  return new Promise((resolve, reject) => {
    window.flutter_inappwebview.callHandler("fetchGeolocationCoords")
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const flutterDailPadHandler = (args) => {
  return new Promise((resolve, reject) => {
    window.flutter_inappwebview.callHandler("launchDialpad", ...args)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const handleFileUpload = async (callback, setPermissionAlertPopUp, type) => {
  try {
    // if (window && window.flutter_inappwebview) {
    // const tempV = await flutterfetchCameraPermission();
    // if (!tempV) {
    //   setPermissionAlertPopUp({
    //     permission: true,
    //     type: "cameraPermission",
    //   });
    // } else {
    // openFileInput(callback, type, true);
    // }
    // } else {
    openFileInput(callback, type, false);
    // }
  } catch (error) {
    console.error("Error handling file upload:", error);
  }
};

const openFileInput = (callback, type, isFlutter) => {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async (e) => {
    callback(e.target.files[0], type);
  };
  if (isFlutter) {
    setTimeout(() => {
      input.click();
    }, 1000)
  }
  else {
    setTimeout(() => {
      input.click();
    }, 1000)
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() =>
      // alert(`${text} copied to clipboard!`)
      notify("success", `${text} copied to clipboard!`)
    )
    .catch((error) => notify(error, "Failed to copy text"));
};
