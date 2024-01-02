import React, {useState} from "react";
import './App.css';
import GoogleMapComponent  from "./Components/googleMap";

const radius = Math.sqrt(300000 / Math.PI);
let canavsOuterLayoutStyle = {};

function App() {

  // ! DISABLED zoom control, can be removed

  const [scale, setScale] = useState(null);
  const [zoomControlEnabled, setZoomControlEnabled] = useState(false);
  const [marker, setMarker] = useState({position: { lat: null, lng: null }});
  const [removeMarker, setRemoveMarker] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({x: null, y: null});

  
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

    if ( marker.position.lat !== null && marker.position.lng !== null && scale !== null) {
      setDrawPath(!drawPath);

      // setting up canavs layout
      const {width, height, left, top} = styleProperties(scale, cursorCoords);

      console.log(width, height, left, top)
      canavsOuterLayoutStyle = {
        width: `${width}px`,
          height: `${height}px`,
            left: `${left}px`,
              top: `${top}px`,
                position: 'absolute',
                  backgroundColor: 'blue', 
      }


      
    
    
  }
}

  // console.log(cursorCoords);
  return (
    <div className="map-outter-layer">
      <div className="map-layout ">
        <GoogleMapComponent 
        radius = { radius }
        setCursorCoords = {setCursorCoords}
        setScale = {setScale}
        zoomControlEnabled={zoomControlEnabled}
        marker={marker}
        setMarker ={setMarker}
        removeMarker = {removeMarker}
        drawPath = {drawPath}
        scale = {scale}
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
          <button onClick={lockPath} disabled={zoomControlEnabled || marker.position.lat === null }>
            Draw Path
          </button>
        </div>
      </div>

      { drawPath && marker.position.lat != null && marker.position.lng != null &&  (
        <div
          style={canavsOuterLayoutStyle}>
          Div unlocked when draw path is set
        </div>
      )}
    </div>
  );
}

export default App;


// return style properties for canavs outet div
function styleProperties(scale, pixel) {

  console.log(scale);
  const width = radius * 2 * scale;
  const height = radius * 2 * scale;
  const left = pixel.x;
  const top = pixel.y;

  return {width, height, left, top};
};
