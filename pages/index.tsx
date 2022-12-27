import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import styles from '../styles/Home.module.css';

const { CONNECTION_STRING } = process.env;

interface Routes {
  data: Array<Route>
}

interface Route {
  attributes: Attributes,
  id: string,
  links: Links,
  relationships: Relationships,
  type: string
}

interface Attributes {
  color: string,
  description: string,
  direction_destinations: Array<string>,
  direction_names: Array<string>,
  fare_class: string,
  long_name: string,
  short_name: string,
  sort_order: number,
  text_color: string,
  type: number
}

interface Links {
  self: string
}

interface Relationships {
  line: Line
}

interface Line {
  data: LineData
}

interface LineData {
  id: string,
  type: string
}

interface RoutesMap {
  [key: string]: any
}

type RoutesObj = {
  id: string,
  list: Array<Route>
};

export default function Home(props: Routes) {
  const { data } = props;
  const [routesData, setRoutesData] = useState({});
  const [routesList, setRoutesList] = useState<Array<RoutesObj>>([]);

  useEffect(() => {
    const routesMap: RoutesMap = {};

    for (const route of data) {
      const routeClass = route.attributes.fare_class;

      if (routeClass in routesMap) {
          routesMap[`${routeClass}`].push(route);
      } else {
          routesMap[`${routeClass}`] = [route];
      }
    }
    setRoutesData(routesMap);
    console.log(routesMap);

    const routesList: Array<RoutesObj> = [];

    for (const key in routesMap) {
      const routesListObj: RoutesObj = {
          id: '',
          list: []
      };
      routesListObj.id = key;
      routesListObj.list = routesMap[key];
      routesList.push(routesListObj);
    }

    setRoutesList(routesList);
  }, [])

  const handleRouteSelection = (e: HTMLDivElement) => {
    console.log(e);
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
              <p>Select Route Type</p>
              <hr />
            </div>
            <div className={styles['items-body']}>
              {routesList.map((el, idx) => {
                return (
                  <Card 
                    key={idx}
                    data={el}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
};

export const getStaticProps: GetStaticProps = async (context) => {
  const routesResponse = await fetch(`${CONNECTION_STRING}/routes`);
  const routesData = await routesResponse.json();

  return {
      props: routesData
  };
}
