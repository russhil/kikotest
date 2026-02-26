import React from "react";
import { Modal } from "react-responsive-modal";
import { Spin, Popover } from "antd";
import BlueInfoIcon from "../../images/blue-info.svg";
import { LoadingOutlined } from "@ant-design/icons";
import crossIcon from "../../images/cross-icon.svg";
import { flutterfetchStoragePermission } from "../../utils";

const CatelogModal = ({ catelogId, setCatelogId, user_data, setUpdateStatus, updateStatus }) => {
  return (
    <Modal
      isOpen={catelogId !== ""}
      onClose={() => {
        setCatelogId("");
      }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className="container pt-3 pb-3">
        <div className="packedOrder">
          <h4 className="text-center mb-3">Choose Catelogue Format</h4>
          <form className="type">
            <input
              type="radio"
              checked={catelogId === "Grocery"}
              disabled={user_data?.mainCategory?.trim() === "Food & Beverage"}
              onClick={() => { setCatelogId("Grocery") }}
            />
            <label htmlFor="Grocery">Grocery</label>
            <input
              type="radio"
              disabled={user_data?.mainCategory?.trim() === "Grocery"}
              checked={catelogId === "Food & Beverage"}
              onClick={() => { setCatelogId("Food & Beverage") }}
            />
            <label>
              Food & Beverage
            </label>
          </form>
        </div>

        <div className="text-center" style={{ display: "flex", marginTop: "10px" }}>
          <button
            className="btn btn-md p-0 uploadBtn btn-primary "
            style={{ marginRight: "5px" }}
            disabled={loading}
            onClick={async () => {
              if (window && window.flutter_inappwebview) {
                const tempV = await flutterfetchStoragePermission();
                if (!tempV) {
                  setPermissionAlertPopUp({
                    permission: true,
                    type: "storagePermission",
                  });
                }
                else {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.onchange = async (e) => {
                    handleFileChange(e);
                  };
                  input.click();
                }
              } else {
                const input = document.createElement("input");
                input.type = "file";
                input.onchange = async (e) => {
                  handleFileChange(e);
                };
                input.click();
              }
            }}
          >
            <span className="upload-img">
              {loading && <Spin indicator={antIcon} />}Proceed
            </span>
          </button>
          <button
            className="btn btn-md p-0 uploadBtn btn-danger ml-5"
            style={{ marginLeft: "5px" }}
            disabled={catelogId === ""}
            onClick={() => {
              setCatelogId("")
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CatelogModal;