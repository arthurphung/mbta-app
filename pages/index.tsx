import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { IRoute } from '../interfaces/IRoutes';
import { IStops, IStop } from '../interfaces/IStops';
import styles from '../styles/Home.module.css';
import { RouteTypesMapContext } from './_app';

export default function Home() {
  console.log('Home');
  const router = useRouter();
  const routeTypesMapContext = useContext(RouteTypesMapContext);

  // routeTypesList = array of route types
  const [routeTypesList, setRouteTypesList] = useState<Array<string>>([]);
  // routeType = selected route type
  const [routeType, setRouteType] = useState<string>('');
  // routesList = array of routes for a specific route type
  const [routesList, setRoutesList] = useState<Array<IRoute>>([]);
  // stopsList = array of stops for a specific route
  const [stopsList, setStopsList] = useState<Array<IStop>>([]); 
  // category = current category list
  const [category, setCategory] = useState<string>('Route Type');

  useEffect(() => {
    const routesList: Array<string> = [];

    if (routeTypesMapContext) {
      for (const key in routeTypesMapContext) {
        routesList.push(key);
      }
    }

    setRouteTypesList(routesList);
  }, [routeTypesMapContext])

  const handleRouteType = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Get selected route type and update routesList
    const selectedRouteType = e.currentTarget.id;
    const routesList = routeTypesMapContext[selectedRouteType]
    setRoutesList(routesList);

    setCategory('Route');
    setRouteType(selectedRouteType);
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
    router.push({
      pathname: `/tracking/${stop?.id}`,
      query: { routeType: routeType }
    });
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