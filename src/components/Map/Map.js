import React, { useRef, useState, useEffect } from 'react';
import './Map.css';
import '../../../node_modules/ol/ol.css';

import MapContext from './MapContext';
import * as ol from 'ol';
import { ZoomSlider, Zoom, FullScreen } from 'ol/control.js';

const Map = ({ children, zoom, center }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    };

    const mapObject = new ol.Map(options);
    const zoomsliderControl = new ZoomSlider();
    const zoomControl = new Zoom();
    const fullScreenControl = new FullScreen();
    mapObject.addControl(zoomsliderControl);
    mapObject.addControl(zoomControl);
    mapObject.addControl(fullScreenControl);

    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;

    map.getView().setCenter(center);
  }, [center]);

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
