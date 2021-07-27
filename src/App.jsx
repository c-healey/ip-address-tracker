import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import axios from "axios";

import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";


const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "70vh",
};
const center = {
  lat: 43.653225,
  lng: -79.383186,
};
// snazzymaps.com
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const [ip, setIp] = useState("");
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  const handleIpify = async () => {
    try {
      const { data } = await axios.get(
        `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_IPIFY_KEY}&ipAddress=${ip}`
      );

      const { lat, lng } = data.location;
      const newMarker = {
        lat: lat,
        lng: lng,
        time: new Date(),
        isp: data.isp,
        ip: data.ip,
        location: data.location,
      };

      // pan to the location
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);

      // add a new marker
      setMarkers((current) => [...current, newMarker]);
      setSelected(newMarker);
    } catch (err) {
      console.log(err);
    }
  };
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="App container-fluid d-flex align-items-center bg-dark">
      <div className="header container h-100 d-flex flex-column align-items-center pt-4 px-0 bg-white">
        <h1 className="title mb-4">Ip address tracker</h1>
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control radius"
            placeholder="Search for any IP address or domain"
            aria-label="Ip Address or domain"
            aria-describedby="basic-addon2"
            onChange={(e) => setIp(e.target.value)}
          />
          <span
            className="input-group-text bg-dark border-dark radius"
            id="basic-addon2"
            onClick={() => handleIpify()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill="white"
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </span>
        </div>

        <div className="row ip-list-group border radius p-4 ">
          <div className="col-sm ip-list-group-item   ">
            <h6>IP Address</h6>
            <p>{selected && selected.ip}</p>
          </div>
          <div className="col-sm ip-list-group-item">
            <h6>location</h6>
            <p>
              {selected &&
                `${selected.location.city} ${selected.location.region}  ${selected.location.postalCode}  ${selected.location.country}`}
            </p>
          </div>
          <div className="col-sm ip-list-group-item">
            <h6>timezone</h6>
            <p>{selected && `UTC ${selected.location.timezone}`}</p>
          </div>
          <div className="col-sm ip-list-group-item">
            <h6>ISP</h6>
            <p>{selected && ` ${selected.isp}`}</p>
          </div>
        </div>
        <div className="ip-map-container row w-100">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onLoad={onMapLoad}
          >
            {markers.map((marker) => {
              return (
                <Marker
                  key={marker.time.toISOString()}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{
                    path: "M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z",
                    fillColor: "black",
                    fillOpacity: 0.9,
                    strokeColor: "gold",
                    strokeWeight: 1,
                    scaledSize: new window.google.maps.Size(30, 30),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                  }}
                  onClick={() => {
                    setSelected(marker);
                  }}
                />
              );
            })}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default App;
