import { createContext, useState, useEffect } from 'react';
import '../styles/globals.css'
import { Roboto } from '@next/font/google';
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { IRoute } from '../interfaces/IRoutes';
config.autoAddCss = false;

const roboto = Roboto({ 
  weight: '400',
  subsets: ['latin']
});

interface RouteClassesMapContextType {
  [key: string]: Array<IRoute>
}

export const RouteClassesMapContext = createContext<RouteClassesMapContextType>({});

export default function App({ Component, pageProps }: AppProps) {
  const [routeClassesMap, setRouteClassesMap] = useState<RouteClassesMapContextType>({});

  useEffect(() => {
    const populateRouteClassesMap = async () => {
      const routesResponse = await fetch('api/routes/routes');
      const routesData = await routesResponse.json();

      const map: RouteClassesMapContextType = {};

      for (const route of routesData.data) {
        const routeClass = route.attributes.fare_class;
  
        if (routeClass in map) {
            map[`${routeClass}`].push(route);
        } else {
            map[`${routeClass}`] = [route];
        }
      }
      setRouteClassesMap(map);
    }
    populateRouteClassesMap();
  }, []);

  return (
    <main className={roboto.className}>
      <RouteClassesMapContext.Provider value={routeClassesMap}>
        <Component {...pageProps} />
      </RouteClassesMapContext.Provider>
    </main>
);
}
