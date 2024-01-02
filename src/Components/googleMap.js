import { GoogleMap, MarkerF, CircleF } from "@react-google-maps/api";
import { useOnLoad } from "./googleMapsHooks";
import {useState, useEffect} from "react";


const defaultLocation = { position: { lat: 48.8584, lng: 2.2945 } };
const defaultZoom = 13;
const minimumZoom = 16;
const radius = Math.sqrt(300000 / Math.PI);


const GoogleMapComponent = ({ zoomControlEnabled, marker, setMarker, removeMarker, drawPath, setDiameter }) => {


    const [center, setCenter] = useState(defaultLocation);
    const [zoom, setZoom] = useState(defaultZoom);  
    const { isLoaded, onLoad, map } = useOnLoad(marker, zoom, setZoom);
    
    // * constriant zoom level too a minimum
    function constriantZoom() {
        if (zoom > minimumZoom) {
            setZoom(minimumZoom);
            return minimumZoom;
        }

        return zoom;
    }

    useEffect(() => {
        setMarker({ position: { lat: null, lng: null } })
    }, [removeMarker]);



    // lock the map for drawing
    useEffect(() => {
        if (drawPath) {

            if (marker.position.lat !== null && marker.position.lng !== null) {
                const pixelCoordinates = map.getProjection().fromLatLngToPoint(marker.position);
                // setPos(pixelCoordinates);
                console.log(pixelCoordinates);
            }

            const activeZoom = constriantZoom();
            const newCenter = { position: { lat: center.position.lat, lng: center.position.lng } };
            const diameterCal = metersToPixel(newCenter.position.lat, activeZoom);
            
            setDiameter(diameterCal);
            setCenter(newCenter);
        } 
    }, [drawPath]);


    // adding coordinate 
    const handleAddMarker = (e) => {
        if (e.latLng && zoomControlEnabled) {
            const newMarker = { position: { lat: e.latLng.lat(), lng: e.latLng.lng() } };
            setCenter(newMarker);
            setMarker(newMarker);
            
            
      };
    }

    
    
    if (!isLoaded) {
        return <div>Loading...</div>;
    }


    return (
        
        <GoogleMap
        center={center.position}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
            streetViewControl: false,
            fullscreenControl: false,
            scrollwheel: !drawPath,
            zoomControl: !drawPath,
            gestureHandling: drawPath ? 'none' : 'cooperative',
            clickableIcons: drawPath ? false : true,
        }}
        onLoad={onLoad}
        onClick={handleAddMarker}
        >
        
            {marker !== null && marker.position.lat !== null && marker.position.lng !== null && (
                <>
                
                    { !drawPath &&(
                        <MarkerF key="marker" position={marker.position} />
                    )}
                    
                        <CircleF
                            key="circle"
                            center={marker.position}
                            radius={radius}
                            options={circleOptions}
                        />
                </>
        )}
        </GoogleMap>
    );
};

//  style for the circle
const circleOptions = {
    // fillColor: 'blue',
    fillOpacity: 0.1,
    strokeColor: 'blue',
    strokeOpacity: 1,
    strokeWeight: 1,
};

export default GoogleMapComponent;

// converting meters into pixel
function metersPerPixel(lat, zoom) {

    const earthCircumference = 40075017;
    const latitudeRadians = lat * (Math.PI / 180);
    return earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoom + 8);
}


function metersToPixel(lat, zoom) { return radius / metersPerPixel(lat, zoom) * 2; }

