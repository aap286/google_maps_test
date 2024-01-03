import React, {useEffect, useState} from "react";
import './App.css';
import GoogleMapComponent from "./Components/googleMap";
import Canvas from './Components/Canvas';

// pre css styling
const googleMapwidth = 600;
const googleMapheight = 450;

function App() {

  // ! DISABLED zoom control, can be removed

  const [zoomControlEnabled, setZoomControlEnabled] = useState(false);
  const [marker, setMarker] = useState({position: { lat: null, lng: null }});
  const [removeMarker, setRemoveMarker] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [diameter, setDiameter] = useState(null);
  const [canavsOuterLayoutStyle, setCanavsOuterLayoutStyle] = useState(null);
  const [googleMapffset, setGoogleMapffset] = useState({widthOffset:null, heightOffset:null});

  // boolean for deleting path by button
  // const [delPath, setDelPath] = useState(null);
  const [delPath, setDelPath] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [submittedPath, setSubmittedPath] = useState(false);


  
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
      setDrawingPoints([]);
    }
  }


  // * delete path button
  function handlePathDelete() {
    setDelPath(prev => !prev);
    setDrawingPoints([]);
  };

  // * submit path button
  function submittedPathBtn() {
    setSubmittedPath(!submittedPath);

  }

  // * refreshes the page
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // retrieves the latest value of diameter
  useEffect(() => {
    
    if(diameter != null){

      const width = googleMapwidth * 0.5 - diameter / 2;
      const height = googleMapheight * 0.5 - diameter / 2;

      // * canavas out div tag styles
      setCanavsOuterLayoutStyle({
        position: 'absolute',
        // top: `calc(50% - ${diameter/2}px)`,
        // left: `calc(50% - ${diameter / 2}px)`,
        top: `${height}px`,
        left: `${width}px`,
        width: `${diameter}px`,
        height: `${diameter}px`,
        border: "1px solid red",
        zIndex: 999,
      });

      // * offesting points by this
      setGoogleMapffset({
        widthOffset: width,
        heightOffset: height
      })
    }
  }, [diameter]);



  // Function to update the variable
  const updateDrawingPoints = (newPoints) => {
    const widthOffsetCal = newPoints.x + googleMapffset.widthOffset;
    const heightOffsetCal = newPoints.y + googleMapffset.heightOffset;
    
    setDrawingPoints([...drawingPoints, { x: round(widthOffsetCal), y:round(heightOffsetCal) }]);
    
  };

  // function to convert pixel values to coordinates
  const convertToCoordinates = (point) => {

    setDrawingPoints(point);
  }

  // display new path
  useEffect(() => {
    if (submittedPath && drawingPoints[0].length === 2){
      console.log(drawingPoints);
    }
  }, [submittedPath, convertToCoordinates])

  return (
    <div className="map-outter-layer">
      <div className="map-layout relative-position">
        {diameter !== null && drawPath && marker.position.lat != null && marker.position.lng != null && (
          <div className="absolute-position"  style={canavsOuterLayoutStyle}>
            <Canvas
              width={diameter.toString()}
              height={diameter.toString()}
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
          submittedPath={submittedPath}
          drawingPoints={drawingPoints}
          convertToCoordinates={convertToCoordinates}
          diameter={diameter}
        />
        </div>

        <div className="map-buttons">
          <div className="map-btn">
          <button onClick={addMarker} disabled={drawPath || submittedPath}>
              Add Pin

            </button>
          </div>

          <div className="map-btn">
          <button onClick={clearMarker} disabled={marker.position.lat === null || drawPath || submittedPath}  >
              Clear Marker
            </button>
          </div>

          <div className="map-btn">
          <button onClick={lockPath} disabled={ zoomControlEnabled || marker.position.lat === null || submittedPath}>
              Draw Path
            </button>
          </div>

        <div className="map-btn">
          <button onClick={handlePathDelete} disabled={drawingPoints.length === 0 || submittedPath}>
            Delete Path
          </button>
        </div>

        <div className="map-btn">
          <button onClick={submittedPathBtn} disabled={drawingPoints.length === 0 || submittedPath}>
            Submit Path
          </button>
        </div>

        <div className="map-btn">
          <button onClick={handleRefresh} >
            Refresh Page
          </button>
        </div>

        </div>
      </div>
  );
}

export default App;

// rounding number 
function round(point) {return Math.round(point * 1000)/1000}
