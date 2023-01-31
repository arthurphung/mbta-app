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

interface RoutesMapContextType {
  [key: string]: Array<IRoute>
}

const RouteTypesMapContext = createContext<RoutesMapContextType>({});
export { RouteTypesMapContext };

export default function App({ Component, pageProps }: AppProps) {
  const [routeTypesMap, setRouteTypesMap] = useState<RoutesMapContextType>({});

  useEffect(() => {
    const populateRoutesMap = async () => {
      const routesResponse = await fetch(`${process.env.NEXT_PUBLIC_CONNECTION_STRING}/routes`);
      const routesData = await routesResponse.json();

      const map: RoutesMapContextType = {};

      for (const route of routesData.data) {
        const routeClass = route.attributes.fare_class;
  
        if (routeClass in map) {
            map[`${routeClass}`].push(route);
        } else {
            map[`${routeClass}`] = [route];
        }
      }
      setRouteTypesMap(map);
    }
    populateRoutesMap();
  }, []);

  return (
    <main className={roboto.className}>
      <RouteTypesMapContext.Provider value={routeTypesMap}>
        <Component {...pageProps} />
      </RouteTypesMapContext.Provider>
    </main>
  );
}
