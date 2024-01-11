import { useState } from "react";
import {useJsApiLoader } from "@react-google-maps/api"

export function useOnLoad() {

    // ? reference to the map
    const [map, setMap] = useState(null);
    const [googleMapConPars, setgoogleMapConPars] = useState(null);
    const [libraries] = useState(['places']);

    // remove marker if user searches place
    const [removeMarkerSearch, setRemoveMarkerSearch] = useState(false);


    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  
  // refrence to map
  const onLoad = (mapRef) => {
    setMap(mapRef);
    
    
  };



  // recenter map after search
  const panMap = (map, point, searched) => {
    
    if(map){      
      // data type is {lat: xx, lng: xx}
      map.panTo(point);
      setRemoveMarkerSearch(!removeMarkerSearch);
    }
      
    
  }

  // * pixel to map coordinates ratio
  function pixelToMapRatio(){
    if (isLoaded && map) {
      var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
      var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
      var scale = Math.pow(2, map.getZoom());

      setgoogleMapConPars({
        topRight: topRight,
        bottomLeft: bottomLeft,
        scale: scale
      })
    }
  };


  //  * converts pixels x,y to map coordinates
  const convertPixelToLatLng = (pixelX, pixelY) => {
    if (map && googleMapConPars) {
      const x = (pixelX / googleMapConPars.scale) + googleMapConPars.bottomLeft.x;
      const y = (pixelY / googleMapConPars.scale) + googleMapConPars.bottomLeft.y;

      const LatLng = map.getProjection().fromPointToLatLng(new window.google.maps.Point(x, y));
      
      return { lat: LatLng.lat(), lng: LatLng.lng() };
    }
  };
  

    
  return  { isLoaded, onLoad, map, googleMapConPars, convertPixelToLatLng, pixelToMapRatio, panMap, removeMarkerSearch};
};


