/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL, { FlyToInterpolator } from 'deck.gl';
import axios from 'axios';
import { ScenegraphLayer } from 'deck.gl'
import { ScatterplotLayer } from '@deck.gl/layers';
import Menu from './UiMap';


const DATA_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';


export default function ISSTracker() {
    const [issData, setIssData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = (await axios.get(DATA_URL)).data;
            const latitude = response.latitude;
            const longitude = response.longitude;
            const altitude = response.altitude * 10000;
            const velocity = parseInt(response.velocity);
            const formatData = [
                {
                    name: 'ISS',
                    coordinates: [longitude, latitude, altitude],
                    velocity,
                }
            ];
            setIssData(formatData);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, []);

    useEffect(() => {
        // Fetch data initially
        fetchData();

        // Fetch data at regular intervals using debouncing
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        const checkbox = document.getElementById('flexCheckDefault');
        if (issData && issData.length > 0 && checkbox.checked) {  // Check if issData is not null and has elements
            setInitialViewState({
                longitude: issData[0].coordinates[0],  // Access coordinates using an index
                latitude: issData[0].coordinates[1],  // Access coordinates using an index
                zoom: 3.2,
                pitch: 0,
                bearing: 0,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator()
            });
        }
    }, [issData]);

    const layers = [issData &&
        new ScenegraphLayer({
            id: 'scenegraph-layer',
            data: issData,
            pickable: true,
            scenegraph: 'https://raw.githubusercontent.com/tipodice/3Dmodels/main/iss_collapse_73k.glb',
            getPosition: d => d.coordinates,
            getOrientation: [20, 15, 90],
            _animations: null,
            sizeScale: 65000,
            _lighting: 'flat'
        }),
    new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: issData,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: false,
        radiusScale: 1,
        radiusMinPixels: 100,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: d => d.coordinates,
        getRadius: 100,
        getFillColor: [255, 140, 0],
        getLineColor: [0, 247, 255]
    })
    ];

    const [initialViewState, setInitialViewState] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 1,
        bearing: 0,
        pitch: 0,
    });

    return (
        <>
            <DeckGL
                layers={layers}
                initialViewState={initialViewState}
                controller={{ dragRotate: false }}
            >
                <Map reuseMaps mapLib={maplibregl} mapStyle={MAP_STYLE} preventStyleDiffing={true} />
            </DeckGL>
            <Menu menuData={issData} />
        </>
    );
}