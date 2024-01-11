import { GoogleMap, MarkerF, CircleF } from "@react-google-maps/api";
import { useOnLoad } from "./googleMapsHooks";
import {useState, useEffect, useRef} from "react";
import _debounce from 'lodash/debounce';


const defaultLocation = { position: { lat: 48.8584, lng: 2.2945 } };
const defaultZoom = 13;
const maximumZoom = 14;
const minimumZoom = 16;
const radius = Math.sqrt(300000 / Math.PI);

const GoogleMapComponent = ({ zoomControlEnabled, marker, setMarker, removeMarker, drawPath, setDiameter, submittedPath, drawingPoints, convertToCoordinates, setMap }) => {



    const [center, setCenter] = useState(defaultLocation);
    const [zoom, setZoom] = useState(defaultZoom);  
    const { isLoaded, onLoad, map, googleMapConPars, convertPixelToLatLng, pixelToMapRatio, panMap = null, removeMarkerSearch } = useOnLoad();


    // Call setMap when the map is loaded
    useEffect(() => {
        if (isLoaded) {
            setMap(map);
            setZoom(defaultZoom);
        }
    }, [isLoaded, map, setMap]);

    
    // * constriant zoom level too a minimum
    function constriantZoom(zoom) {

        if (zoom > minimumZoom ) {
            setZoom(minimumZoom);
            return minimumZoom;
        } else if(zoom < maximumZoom) {
            setZoom(maximumZoom);
            return maximumZoom;
        }
        return zoom;
        
    }

    // * adding marker to map 
    const handleAddMarker = (e) => {
        if (e.latLng && zoomControlEnabled) {
            const newMarker = { position: { lat: e.latLng.lat(), lng: e.latLng.lng() } };
            setCenter(newMarker);
            setMarker(newMarker);

            console.log(newMarker);
        };
    }

    // * call when removing markers
    useEffect(() => {
        if (removeMarker) { setMarker({ position: { lat: null, lng: null } }) }
    }, [removeMarker]);



    // * lockLatLng;he map for drawing
    useEffect(() => {
        if (drawPath) {

            const activeZoom = constriantZoom(map.getZoom());
            const newCenter = { position: { lat: center.position.lat, lng: center.position.lng } };
            const diameterCal = metersToPixel(newCenter.position.lat, activeZoom);
            
            setDiameter(diameterCal);;
            setCenter(newCenter);
        } 
    }, [drawPath]);


    // * when submit button is clicked calculates the google coordinates
    useEffect(() => {
        
        if (submittedPath && drawingPoints.length !== 0 && googleMapConPars !== null) {
            const newPoints = []
            for (let i = 0; i < drawingPoints.length; i++) {

                const {lat, lng} = (convertPixelToLatLng(drawingPoints[i].x, drawingPoints[i].y));
                
                newPoints.push([lat, lng]); 
            }
            
            if(newPoints.length > 0) {
                convertToCoordinates(newPoints);};

            
        }
    }, [submittedPath]);

    // * when zoom level chnages find the pixel to map changes
    useEffect(() => {
        if(isLoaded && zoom ) {
            // console.log('MAP', map);
            pixelToMapRatio()
        }

    }, [isLoaded, zoom])

    // * removes maeker when user search place
    useEffect(() => {
        if (removeMarkerSearch) {
            setMarker({ position: { lat: null, lng: null } })
        }
    }, [removeMarkerSearch])


    // ! Handle map drag

    const googleMapRef = useRef(null);

    

    const [googleMapDimensions, setGoogleMapDimensions] = useState({
        width: null,
        height: null,
    });

    useEffect(() => {
        if (googleMapRef.current && googleMapRef.current.mapRef) {
            const { width, height } = googleMapRef.current.mapRef.getBoundingClientRect();
            console.log('Google map width & height:', width, height);
            setGoogleMapDimensions({
                width,
                height,
            });
        }
    }, [googleMapRef.current]);


    // const handleMouseMove = (e) => {
        
    //     const pixelX = e.pixel.x
    //     const pixelY = e.pixel.y

    //     // Define a threshold (in pixels) to trigger map movement
    //     const threshold = 10;
        
        

    //     if(pixelX + 10 > googleMapDimensions.width) {
        //     setCenter((prevOptions) => ({
        //       ...prevOptions,
        //         position: {
        //             lat: prevOptions.position.lat,
        //             lng: prevOptions.position.lng + threshold,
        //         },
        //     }));
        // } else if (pixelX - 10 < 0){
    //         setCenter((prevOptions) => ({
    //          ...prevOptions,
    //             position: {
    //                 lat: prevOptions.position.lat,
    //                 lng: prevOptions.position.lng - threshold,
    //             },
    //         }));
    //     }
    // };

    const handleMouseMove = _debounce((e) => {
        const pixelX = e.pixel.x;
        const pixelY = e.pixel.y;

        // threshold to mark when to trigger 
        const threshold = 10;
        const dispalcement = 0;

        // console.log(pixelX, pixelY, threshold);
        // if (pixelX + threshold > googleMapDimensions.width) {
        // setCenter((prevOptions) => ({
        //     ...prevOptions,
        //     position: {
        //     lat: prevOptions.position.lat,
        //     lng: prevOptions.position.lng + threshold,
        //     },
        // }));
        // } else if (pixelX - threshold < 0) {
        // setCenter((prevOptions) => ({
        //     ...prevOptions,
        //     position: {
        //     lat: prevOptions.position.lat,
        //     lng: prevOptions.position.lng - threshold,
        //     },
        // }));
        // }
  }, 200);


    if (!isLoaded) {
        return (
            <></>
        );
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
            onMouseMove={handleMouseMove}
                ref = {googleMapRef}
            >

                {marker !== null && marker.position.lat !== null && marker.position.lng !== null && (
                    <>

                        {!drawPath && (
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


