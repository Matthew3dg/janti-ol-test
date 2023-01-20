import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IRoute, IRouteDetails } from './types/types';
import Routes from './components/Routes/Routes';

import Map from './components/Map/Map';
import { Layers, TileLayer, VectorLayer } from './components/Layers';
import { Style, Circle as CircleStyle, Fill } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { osm, vector } from './components/Source';
import { fromLonLat } from 'ol/proj';

function App() {
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [currentRoute, setCurrentRoute] = useState<IRoute>({} as IRoute);
  const [routeDetails, setRouteDetails] = useState<IRouteDetails[]>([{} as IRouteDetails]);
  const [features, setFeatures] = useState<Feature<Point>[]>([]);

  const [center, setCenter] = useState<[number, number]>([76, 66]);
  const [zoom, setZoom] = useState(3);

  const createMarkersFromDetails = (details: IRouteDetails[]): [number, number][] => {
    if (details.length > 0) {
      return details.map((item) => {
        return [Number(item.lon), Number(item.lat)];
      });
    } else {
      alert('В данном маршруте не заданы точки');
      return [];
    }
  };

  const fetchRoutes = async () => {
    try {
      const routesResponse = await axios.get<IRoute[]>('https://janti.ru:5381/Main/GetRoutes');
      setRoutes(routesResponse.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const marks = createMarkersFromDetails(routeDetails);
    setFeatures(addMarkers(marks, currentRoute.color));
    if (marks && marks[1]) {
      setCenter(marks[1]);
      setZoom(8);
    } else setZoom(3);
  }, [routeDetails]);

  function addMarkers(lonLatArray: [number, number][], color: string) {
    const pointStyle = new Style({
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({
          color: color,
        }),
      }),
    });
    const features = lonLatArray.map((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(pointStyle);
      return feature;
    });
    return features;
  }

  return (
    <div>
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          <VectorLayer source={vector({ features })} />
        </Layers>
      </Map>

      <Routes routes={routes} setRouteDetails={setRouteDetails} setCurrentRoute={setCurrentRoute} />
    </div>
  );
}

export default App;
