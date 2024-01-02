import { GoogleMap, MarkerF, CircleF } from "@react-google-maps/api";
import { useOnLoad } from "./googleMapsHooks";
import {useState, useEffect} from "react";


const defaultLocation = { position: { lat: 48.8584, lng: 2.2945 } };
const defaultZoom = 14;
const activeZoom = 16;

const GoogleMapComponent = ({ radius, setCursorCoords, setScale, zoomControlEnabled, marker, setMarker, removeMarker, drawPath}) => {


    const [center, setCenter] = useState(defaultLocation);
    const [zoom, setZoom] = useState(defaultZoom);
    // const setGoogleMap = useOnLoad(center, setZoom, setScale);
    const { isLoaded, onLoad, map } = useOnLoad(center, setZoom, setScale);

    useEffect(() => {
        setMarker({ position: { lat: null, lng: null } })
    }, [removeMarker]);


    // lock the map for drawing
    // unlock map for drawing
    useEffect(() => {

        if (drawPath) {
            const newCenter = { position: { lat: center.position.lat, lng: center.position.lng } };
            setCenter(newCenter);
            setZoom(activeZoom);
        } else {
            setZoom(defaultZoom);
        }
    }, [drawPath]);


    // adding coordinate 
    const handleAddMarker = (e) => {
        if (e.latLng && zoomControlEnabled) {

            const pixel = map.getProjection().fromLatLngToPoint(e.latLng);
            const mouseLoc = { x: pixel.x, y: pixel.y };
            setCursorCoords(mouseLoc);

            const newMarker = { position: { lat: e.latLng.lat(), lng: e.latLng.lng() } };
            setCenter(newMarker);
            setMarker(newMarker);

            console.log('Cursur location', mouseLoc);
            console.log('Marker location', newMarker);
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
                
                    <MarkerF key="marker" position={marker.position} />
                    
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
