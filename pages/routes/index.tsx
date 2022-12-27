import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import GroupedSelectMenu from '../../components/GroupedSelectMenu';

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
    list: Array<string>
};


const Routes = (props: Routes) => {
    const [routes, setRoutes] = useState<Array<RoutesObj>>([]);
    console.log(props);
    const { data } = props;

    useEffect(() => {
        const routesMap: RoutesMap = {};
    
        for (const route of data) {
            const routeType = route.attributes.description;
    
            if (routeType in routesMap) {
                routesMap[`${routeType}`].push(route.attributes.long_name);
            } else {
                routesMap[`${routeType}`] = [];
            }
        }

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
    
        setRoutes(routesList);
    }, [])

    return (
        <div>
            <ul>
                <GroupedSelectMenu
                    data={routes}
                />
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

export default Routes;