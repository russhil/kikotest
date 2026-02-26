import React from "react";

const DeleteModal = ({ onClose, show, onSubmit }) => {
  return (
    <div className="delete-modal-wrapper">
      {show && (
        <div className={`DeleteModal ${show ? "show" : ""}`}>
          <div
            className={`modalContainer ${show ? "show" : ""}`}
            onClick={onClose}
          >
            <div
              className="modalContent delete-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modalBody">
                <h3 className="deletemodal-title">Are you sure?</h3>
                <h6 className="deletemodal-desc">
                  Do you really want to delete these records?
                </h6>
              </div>
              <div className="modalFooter">
                <button className="btn btn-sm btn-primary" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-danger" onClick={onSubmit}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
