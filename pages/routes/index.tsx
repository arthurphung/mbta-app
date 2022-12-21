import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

enum RouteIndexes {
    RouteType,
    Routes
}

export default function Routes(props: Routes) {
    const [routeTypes, setRouteTypes] = useState<string[]>([]);
    const [routes, setRoutes] = useState<string[]>([]);
    console.log(props);
    const { data } = props;

    useEffect(() => {
        type RoutesObj = {
            [key: string]: any
        };
    
        const routesObj: RoutesObj = {};
    
        for (const route of data) {
            const routeType = route.attributes.description;
    
            if (routeType in routesObj) {
                routesObj[`${routeType}`].push(route.attributes.long_name);
            } else {
                routesObj[`${routeType}`] = [];
            }
        }
    
        setRouteTypes(Object.keys(routesObj));
        setRoutes(Object.values(routesObj));
    }, [])

    return (
        <div>
            <ul>
                {routeTypes.map((el, idx) => {
                    return (
                        <li key={idx}>{el}</li>
                    );
                })}
            </ul>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    const routesResponse = await fetch(`${CONNECTION_STRING}/routes`);
    const routesData = await routesResponse.json();

    return {
        props: routesData
    };
}