import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useOnLoad } from "./googleMapsHooks";


const LocationSearchInput = ({ map, clearMarker }) => {
    const [address, setAddress] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);


    const { isLoaded, onLoad = null, maps = null, googleMapConPars = null, convertPixelToLatLng = null, pixelToMapRatio = null, panMap } = useOnLoad();

    const handleSelect = async (selected) => {
        const results = await geocodeByAddress(selected);
        const latLng = await getLatLng(results[0]);

        setAddress(selected);
        setSelectedLocation(latLng);

    };


    

    // ! when user search places and re-center map again

    const handlePrintButtonClick = () => {
        
        if (selectedLocation ) {
            
            panMap(map, selectedLocation)
            clearMarker();
            
        } else {
            console.log('No location selected');
        }


    };

    if (!isLoaded) { return (<></>) }

    return (
        <>
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
                // options={options}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input {...getInputProps({ placeholder: 'Search Places' })} key="places-autocomplete-input" style={{ height: '100%', width: '70%' }} />

                        <div>
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion, index) => (
                                <div {...getSuggestionItemProps(suggestion)} key={index}>
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>

            <button 
                onClick={handlePrintButtonClick}
                style={{ height: '100%', width: '30%' }}
            >
                    Print Name and LatLng
                </button>
        </>
    );
};

export default LocationSearchInput;
