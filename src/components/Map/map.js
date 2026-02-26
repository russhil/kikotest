import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import "./styles.scss";

function Map(props) {
  const passAr = (latlng) => {
    var objmap = {};
    objmap.latitude = latlng.latitude.toFixed(6);
    objmap.longitude = latlng.longitude.toFixed(6);
    props.func(objmap);
  };
  
  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "15px"
  };

  const center = {

    lat: props.currLatlong1.latitude ? props.currLatlong1.latitude : 22.7196,
    lng: props.currLatlong1.longitude ? props.currLatlong1.longitude : 75.8577,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        defaultZoom={30}
        defaultCenter={center}
        onDragEnd={() => {
          passAr({
            latitude: map.getCenter().lat(),
            longitude: map.getCenter().lng(),
          });
        }}
        options={{ gestureHandling: "greedy" }}
        onLoad={onLoad}
        onUnmount={onUnmount}

      ></GoogleMap>
      <div className="markerbg">
        <h4>Your Order will picked from here</h4>
        <p>Place the pin accurate</p>
      </div>
    </>
  ) : (
    <></>
  );
}
export default Map;
