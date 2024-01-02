import React, {useEffect, useState} from "react";
import './App.css';
import GoogleMapComponent  from "./Components/googleMap";

// let canavsOuterLayoutStyle = {};

function App() {

  // ! DISABLED zoom control, can be removed


  const [zoomControlEnabled, setZoomControlEnabled] = useState(false);
  const [marker, setMarker] = useState({position: { lat: null, lng: null }});
  const [removeMarker, setRemoveMarker] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [diameter, setDiameter] = useState(null);

  const [canavsOuterLayoutStyle, setCanavsOuterLayoutStyle] = useState(null);
  
  // * adding marker button
  function addMarker() {
    setZoomControlEnabled(!zoomControlEnabled);

  }

  // * remvoing maker button
  function clearMarker() {
    if ( marker.position.lat !== null && marker.position.lng !== null) {
      setRemoveMarker(!removeMarker);
    }
  }

  

  // * draw path button
  function lockPath() {

    if ( marker.position.lat !== null && marker.position.lng !== null) {
      setDrawPath(!drawPath);
    }
  }

  
  // retrieves the latest value of diameter
  useEffect(() => {

    setCanavsOuterLayoutStyle({
      position: 'absolute',
      top: `calc(50% - ${diameter/2}px)`,
      left: `calc(50% - ${diameter / 2}px)`,
      width: `${diameter}px`,
      height: `${diameter}px`,
      // backgroundColor: 'blue',
      border: "1px solid red",
      zIndex: 999,
    });
  }, [diameter]);

  
  return (
    <div className="map-outter-layer">
      <div className="map-layout relative-position">
        {drawPath && marker.position.lat != null && marker.position.lng != null && (
          <div className="absolute-position"  style={canavsOuterLayoutStyle}>
            canavs***
          </div>
        )}

        <GoogleMapComponent
          zoomControlEnabled={zoomControlEnabled}
          marker={marker}
          setMarker={setMarker}
          removeMarker={removeMarker}
          drawPath={drawPath}
          setDiameter={setDiameter}
        />
        </div>

        <div className="map-buttons">
          <div className="map-btn">
            <button onClick={addMarker} disabled={drawPath}>
              Pin Marker
            </button>
          </div>

          <div className="map-btn">
            <button onClick={clearMarker} disabled={marker.position.lat === null || drawPath}  >
              Clear Marker
            </button>
          </div>

          <div className="map-btn">
            <button onClick={lockPath} disabled={zoomControlEnabled || marker.position.lat === null}>
              Draw Path
            </button>
          </div>
        </div>
      
      </div>
  );
}

export default App;

