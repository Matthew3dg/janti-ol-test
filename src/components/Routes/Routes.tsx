import axios from 'axios';
import React from 'react';
import { IRoute, IRouteDetails } from '../../types/types';

interface Props {
  routes: IRoute[];
  setRouteDetails: (details: IRouteDetails[]) => void;
  setCurrentRoute: (route: IRoute) => void;
}

const Routes: React.FC<Props> = ({ routes, setRouteDetails, setCurrentRoute }) => {
  const onRouteClick = (currentRoute: IRoute) => {
    fetchRouteDetails(currentRoute.id);
    setCurrentRoute(currentRoute);
  };

  const fetchRouteDetails = async (selectedRouteId: number) => {
    try {
      const routeDetailsResponse = await axios.get<IRouteDetails[]>(
        `https://janti.ru:5381/Main/GetRouteData?id=${selectedRouteId}`
      );
      setRouteDetails(routeDetailsResponse.data);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {routes.map((route) => {
        return (
          <div style={{ color: route.color }} key={route.id}>
            <input
              onChange={() => onRouteClick(route)}
              type="radio"
              name="routes"
              id={route.id.toString()}
            />
            {route.name}
          </div>
        );
      })}
    </div>
  );
};

export default Routes;
