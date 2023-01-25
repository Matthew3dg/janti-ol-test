import { useContext, useEffect } from 'react';
import MapContext from '../Map/MapContext';
import OLVectorLayer from 'ol/layer/Vector';

const VectorLayer = ({ source }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new OLVectorLayer({
      source,
      zIndex: 0,
    });

    map.addLayer(vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source]);

  return null;
};

export default VectorLayer;
