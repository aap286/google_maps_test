import { useState, useEffect } from "react";
import {useJsApiLoader} from "@react-google-maps/api"

export function useOnLoad(marker, zoom, setZoom) {

    // ? reference to the map
    const [map, setMap] = useState(null);
    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })

  const [pos, setPos] = useState(null);



  const onLoad = (map) => {
    setMap(map);
    
    map.addListener("zoom_changed", () => {
      console.log('Current map zoom level:', map.getZoom());
      setZoom(map.getZoom());
    });
  };

  // position of marker
  // useEffect(() => {
  //   if (marker.position.lat !== null && marker.position.lng !== null) {
  //     const pixelCoordinates = map.getProjection().fromLatLngToPoint(marker.position);
  //     setPos(pixelCoordinates);
  //   }
  // }, [zoom]);


  

  // return isLoaded ? onLoad : null;
  return { isLoaded, onLoad, map };
};
