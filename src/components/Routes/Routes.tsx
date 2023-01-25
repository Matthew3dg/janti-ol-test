import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  const [searchString, setSearchString] = useState<string>('');

  const filterRoutes = (routes: IRoute[], searchString: string): IRoute[] => {
    if (searchString.trim() === '') {
      return routes;
    }

    const filteredRoutes = routes.filter((item) => {
      return item.name.trim().toLowerCase().includes(searchString.trim().toLowerCase());
    });

    return filteredRoutes;
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
      <label htmlFor="search">Поиск </label>
      <input
        onChange={(e) => {
          setSearchString(e.target.value);
        }}
        type="text"
        placeholder="Поиск"
        id="search"
      />
      {filterRoutes(routes, searchString).map((route) => {
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
