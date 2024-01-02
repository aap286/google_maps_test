import { useState, useEffect } from "react";
import {useJsApiLoader} from "@react-google-maps/api"

export function useOnLoad(center, setZoom, setScale) {

    // ? reference to the map
    const [map, setMap] = useState(null);
    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })


  // initial scale value on map load
  useEffect(() => {
    if (map && center.position.lat !== null) {
      const initialZoom = map.getZoom();
      const initialScale = calculateMeterToPixel(
        center.position.lat,
        initialZoom
      );
      setScale(initialScale);
    }
    
  }, [map, center.position.lat]);

  const onLoad = (map) => {
    setMap(map);
    
    // map.addListener("zoom_changed", () => {
    //   // Get the updated zoom level
    //   const newZoom = map.getZoom();
    //   setZoom(newZoom);

    //   // Calculate scale size
    //   const scaleSize = calculateMeterToPixel(center.position.lat, newZoom);
    //   setScale(scaleSize);
    // });
    
  };

  // return isLoaded ? onLoad : null;
  return { isLoaded, onLoad, map };
};

  const calculateMeterToPixel = (lat, zoom) => {
    return (
      156543.03392 * Math.cos((lat * Math.PI) / 180) / Math.pow(2, zoom)
    );
  };