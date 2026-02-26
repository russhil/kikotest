import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "reactstrap";
import "./styles.scss";


function PermissionAlertP({ permissionAlertPopUp, setPermissionAlertPopUp }) {
    return (
        <>
            <Modal
                isOpen={permissionAlertPopUp?.permission}
                onClose={() => { setPermissionAlertPopUp({ permission: false, type: "" }) }}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className="container pb-3 pt-3">
                    <div className="py-4">
                        <h4 className="text-center mb-0">
                            {permissionAlertPopUp?.type === "geoPermission" ? "Geo Location" : permissionAlertPopUp?.type === "cameraPermission" ? "Camera " : permissionAlertPopUp?.type === "storagePermission" ? "Storage " : permissionAlertPopUp?.type === "Geolocation" ? "Latitude & Longitude " : permissionAlertPopUp?.type} Permission required
                        </h4>
                    </div>
                    <div className="d-flex gap-2 justify-content-center">
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                                setPermissionAlertPopUp({ permission: false, type: "" })
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default PermissionAlertP;
