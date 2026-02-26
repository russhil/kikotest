import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "./styles.scss";
import axios from "axios";
import WrappedMap from "../Map/map";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
    width: "772px",
    maxWidth: "94%",
    padding: "30px 30px 18px",
    zIndex: 9,
  },
};

function MapModal({ updateAddress, props, map }) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [title, setTitle] = useState("");
  const [showMap, setShowMap] = useState(map);


  useEffect(() => {
    var obj = { latitude: parseFloat(19.1721), longitude: parseFloat(72.9483) };
    getPlacesDetails(obj);
  }, []);

  const getPlacesDetails = async (obj) => {
    // var config = {
    //   method: "get",
    //   url:
    //     "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    //     obj.latitude +
    //     "," +
    //     obj.longitude +
    //     process.env.REACT_APP_LAT_LONG,
    // };
    // let response = await axios(config);
    // const place_detail = response?.data.results[0];

    const body = {
      latitude: obj.latitude,
      longitude: obj.longitude,
    };
    var config = {
      method: "post",
      url: "https://ondc.kiko.live/api/v1/maps/getlocation-ola",
      headers: {
        Authorization: `${token}`,
        desktop: true,
      },
      data: body,
    };
    let response = await axios(config);
    // const place_detail = response?.data.results[0];
    const place_detail = response?.data?.data?.results[0];

    const postal_code = place_detail.address_components.findIndex((ele) =>
      ele.types.includes("postal_code")
    );
    const zipcode =
      postal_code !== -1
        ? place_detail.address_components[postal_code].long_name
        : "";
    const country_level = place_detail.address_components.findIndex((ele) =>
      ele.types.includes("country")
    );
    const country =
      country_level !== -1
        ? place_detail.address_components[country_level].long_name
        : "";
    const sublocality_level_1 = place_detail.address_components.findIndex(
      (ele) => ele.types.includes("sublocality_level_1")
    );
    const nearBy =
      sublocality_level_1 !== -1
        ? place_detail.address_components[sublocality_level_1].long_name
        : "";
    const administrative_area_level_3 =
      place_detail.address_components.findIndex((ele) =>
        ele.types.includes("administrative_area_level_3")
      );
    const administrative_area_level_1 =
      place_detail.address_components.findIndex((ele) =>
        ele.types.includes("administrative_area_level_1")
      );
    const city =
      administrative_area_level_3 !== -1
        ? place_detail.address_components[administrative_area_level_3].long_name
        : "";
    const state =
      administrative_area_level_1 !== -1
        ? place_detail.address_components[administrative_area_level_1].long_name
        : "";
  };

  const addDetails = () => {
    setShowMap = false;
    const address = {
      state,
      city,
      zipcode,
      showMap,
    };
    updateAddress(address);
  };


  return (
    <>
      <Modal isOpen={showMap} style={customStyles} contentLabel="Example Modal">
        <div className="DropLocationModal">
          <h2>Set Drop Location</h2>
          <div className="DroMapBlock">
            {
              <WrappedMap
                func={(obj) => {
                  getPlacesDetails(obj);
                }}
              />
            }
          </div>
          <div className="apartmentBlock mb-4">
            <div class="apartmentText">
              <div>
                <h4>{title}</h4>
                <p className="m-0">{addressLine2}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              addDetails();
            }}
          >
            Proceed to add details
          </button>
        </div>
      </Modal>
    </>
  );
}

export default MapModal;
