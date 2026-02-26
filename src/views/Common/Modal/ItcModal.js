import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
function ItcModal() {
    return (
        <>
            <Modal
                isOpen={true}
                onClose={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className="container pb-3 pt-3">
                    <div className="py-4">
                        <h4 className="text-center mb-0">
                          we need this permission  
                        </h4>
                        <p>
                        we need this permission  .
                        </p>
                    </div>
                    <div className="d-flex gap-2 justify-content-center">
                        <button
                            className="btn btn-sm btn-success"
                            // disabled={bulkLoading}
                            // onClick={() => {
                            //     bulkUpdateStatus();
                            // }}
                        >
                            Yes
                        </button>
                        {/* <button
                            className="btn btn-sm btn-danger"
                            disabled={loading}
                            onClick={() => {
                                setOpenBulkStatusConfirm(false);
                            }}
                        >
                            No
                        </button> */}
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default ItcModal;