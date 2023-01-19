import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IRoute, IRouteDetails } from '../../types/types';
import s from './MapView.module.css';
import Routes from '../Routes/Routes';

const {
  interaction, //name spaces
  layer,
  custom,
  control,
  Interactions, //group
  Overlays,
  Controls,
  Map, //objects
  Layers,
  Overlay,
  Util,
} = require('react-openlayers');

const MapView = () => {
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [routeDetails, setRouteDetails] = useState<IRouteDetails[]>([]);

  console.log('routeDetails');
  console.log(routeDetails);

  const fetchRoutes = async () => {
    try {
      const routesResponse = await axios.get<IRoute[]>('https://janti.ru:5381/Main/GetRoutes');
      setRoutes(routesResponse.data);
      console.log('routes');
      console.log(routes);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <>
      <Map className={s.mapContainer} view={{ center: [0, 0], zoom: 2 }}>
        <Layers>
          <layer.Tile />
        </Layers>

        <Controls attribution={false} zoom={true}>
          <control.FullScreen />
          <control.ZoomSlider />
          <control.Zoom />
        </Controls>
      </Map>

      <Routes routes={routes} setRouteDetails={setRouteDetails} />
    </>
  );
};

export default MapView;
