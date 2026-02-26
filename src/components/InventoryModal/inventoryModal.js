import React from "react";
import { Modal } from "react-responsive-modal";
import { Spin, Popover } from "antd";
import BlueInfoIcon from "../../images/blue-info.svg";
import { LoadingOutlined } from "@ant-design/icons";
import crossIcon from "../../images/cross-icon.svg";

const InventoryModal = ({ openVarient, setOpenVarient, variants, setUpdateStatus,updateStatus }) => {
    const platformIcon = (
        <ul className="platformContent">
          <li className="mb-3">
            The <span>Buyer and Seller platform applies a 5% transaction fee</span>,
            which is deducted from the selling price of your item.{" "}
          </li>
          <li>
            Eg.{" "}
            <span>
              Selling Price - Platform Fees = Settlement amount. ₹500 - 5% = ₹475
            </span>
          </li>
        </ul>
      );
      const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <Modal
            open={openVarient}
            onClose={setOpenVarient}
            classNames={{
                modal: 'custom-modal- view-variants-modal'
            }}
            center
        >
            <div className="add-variants-table">
                <div className="d-flex align-items-center  mb-3" style={{ paddingLeft: '30px' }}>
                    <h3>View Variants</h3>
                    <div className="PlatPopover m-0">
                        <Popover content={platformIcon} trigger="hover">
                            <img src={BlueInfoIcon} className="me-1 " alt="" />
                        </Popover>
                        Platform Fees (5%)
                    </div>
                    <img
                        src={crossIcon}
                        className="varientCross"
                        alt=""
                        onClick={setOpenVarient}
                    />
                </div>
                <div className="table-responsive">
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <td>
                                    EAN Number
                                </td>
                                <td>
                                    Net Weight(gms/kg)
                                </td>
                                <td>
                                    Unit
                                </td>
                                <td>
                                    Available Quantity
                                </td>
                                <td>
                                    Price
                                </td>
                                <td>
                                    Selling Price
                                </td>
                                <td>Settlement Price</td>
                                <td>Stock Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map((variant, index) => (
                                <tr
                                    style={{ verticalAlign: "middle" }}
                                    key={index}
                                >
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter EAN Number*"
                                            className="form-control"
                                            disabled
                                            value={variant.productId}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter Net Weight*"
                                            className="form-control"
                                            disabled
                                            value={variant.weight}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter Net Weight*"
                                            className="form-control"
                                            disabled
                                            value={variant.weightUnit}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter Quantity*"
                                            className="form-control"
                                            disabled
                                            value={variant.availableQuantity}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter Price*"
                                            className="form-control"
                                            disabled
                                            value={variant.price}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Selling Price*"
                                            className="form-control"
                                            disabled
                                            value={variant.discountedPrice}
                                        />
                                    </td>
                                    <td>
                                        {variant.discountedPrice !== 0 &&
                                            variant.discountedPrice !== "" && (
                                                <label className="form-control">
                                                    {variant.discountedPrice -
                                                        variant.discountedPrice * 0.05}
                                                </label>
                                            )}
                                    </td>
                                    <td>
                                        <td>
                                            {updateStatus == variant._id ? (
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
                                                                    variant.availableQuantity
                                                                ) > 0
                                                                    ? true
                                                                    : false
                                                            }
                                                            disabled={updateStatus != ""}
                                                            onChange={()=>{setUpdateStatus(variant)}}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            )}
                                        </td>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
};

export default InventoryModal;
