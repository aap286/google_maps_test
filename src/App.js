import React, {useEffect, useState} from "react";
import './App.css';
import GoogleMapComponent  from "./Components/googleMap";
import Canvas from './Components/Canvas';

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


  // TODO: adding canvas

  // boolean for deleting path by button
  const [delPath, setDelPath] = useState(null);

  const [drawingPoints, setDrawingPoints] = useState([]);

  const handlePathDelete = () => {
    setDelPath(true);
  };


  // Function to update the variable
  const updateDrawingPoints = (newPoints) => {

    setDrawingPoints([...drawingPoints, [Math.round(newPoints.x * 1000) / 1000, Math.round(newPoints.y * 1000) / 1000]]);
    
    console.log(drawingPoints);
  };

  
  return (
    <div className="map-outter-layer">
      <div className="map-layout relative-position">
        {diameter !== null && drawPath && marker.position.lat != null && marker.position.lng != null && (
          <div className="absolute-position"  style={canavsOuterLayoutStyle}>
            <Canvas
              width={diameter}
              height={diameter}
              delPath={delPath}
              setDelPath={setDelPath}
              updateDrawingPoints={updateDrawingPoints}
            />
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

        <div className="map-btn">
          <button onClick={handlePathDelete} disabled={zoomControlEnabled || marker.position.lat === null}>
            Delete Path
          </button>
        </div>


        </div>
      </div>
  );
}

export default App;


