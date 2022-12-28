import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { IRoutes, IRoute } from '../interfaces/IRoutes';
import { IStops, IStop } from '../interfaces/IStops';
import styles from '../styles/Home.module.css';

interface RoutesMap {
  [key: string]: Array<IRoute>
}

export const getStaticProps: GetStaticProps = async (context) => {
  const routesResponse = await fetch(`${process.env.NEXT_PUBLIC_CONNECTION_STRING}/routes`);
  const routesData = await routesResponse.json();

  return {
      props: routesData
  };
};

export default function Home(props: IRoutes) {
  const { data } = props;
  const router = useRouter();

  // routesMap = object where key = route type, value = array of routes 
  const [routesMap, setRoutesMap] = useState<RoutesMap>({});
  // routeTypesList = array of route types
  const [routeTypesList, setRouteTypesList] = useState<Array<string>>([]);
  // routesList = array of routes for a specific route type
  const [routesList, setRoutesList] = useState<Array<IRoute>>([]);
  // stopsList = array of stops for a specific route
  const [stopsList, setStopsList] = useState<Array<IStop>>([]); 
  // category = current category list
  const [category, setCategory] = useState<string>('Route Type');

  useEffect(() => {
    const map: RoutesMap = {};

    for (const route of data) {
      const routeClass = route.attributes.fare_class;

      if (routeClass in map) {
          map[`${routeClass}`].push(route);
      } else {
          map[`${routeClass}`] = [route];
      }
    }
    setRoutesMap(map);
    console.log(map);

    const routesList: Array<string> = [];

    for (const key in map) {
      routesList.push(key);
    }

    setRouteTypesList(routesList);
  }, [])

  const handleRouteType = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Get selected route type and update routesList
    const selectedRouteType = e.currentTarget.id;
    setRoutesList(routesMap[selectedRouteType]);
    setCategory('Route');
  }

  const handleRoute = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Get selected route and find associated route id
    const selectedRoute = e.currentTarget.id;
    const route = routesList.find(el => el.attributes.long_name === selectedRoute);
    // Retrieve stops for selected route using route id
    const stopsResponse = await fetch(`${process.env.NEXT_PUBLIC_CONNECTION_STRING}/stops?filter%5Broute%5D=${route?.id}`);
    const stopsData: IStops = await stopsResponse.json();
    setStopsList(stopsData.data);
    setCategory('Stop');
  }

  const handleStop = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Get selected stop and navigate user to tracking page with stop id parameter
    const selectedStop = e.currentTarget.id;
    const stop = stopsList.find(el => el.attributes.name === selectedStop);
    router.push(`/tracking/${stop?.id}`)
  };

  const renderCollection = () => {
    switch (category) {
      case 'Route Type':
        return (
          routeTypesList.map((el, idx) => {
            return (
              <Card 
                key={idx}
                data={el}
                handler={handleRouteType}
              />
            );
          })
        );
      case 'Route':
        return (
          routesList.map((el, idx) => {
            return (
              <Card 
                key={idx}
                data={el.attributes.long_name}
                handler={handleRoute}
              />
            );
          })
        );
      case 'Stop':
        return (
          stopsList.map((el, idx) => {
            return (
              <Card 
                key={idx}
                data={el.attributes.name}
                handler={handleStop}
              />
            );
          })
        );
      default:
        break;
    }
  }

  return (
    <>
      <Head>
        <title>MBTA Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <div className={styles.items}>
            <div className={styles['items-header']}>
              <p>Select {category}</p>
              <hr />
            </div>
            <div className={styles['items-body']}>
              {renderCollection()}
            </div>
          </div>
        </div>
      </main>
    </>
  )
};