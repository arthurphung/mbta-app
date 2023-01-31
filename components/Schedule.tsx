import { useEffect, useState, useContext } from 'react';
import { IPrediction } from '../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../interfaces/IRoutes';
import CountdownClock from './CountdownClock';
import { RouteTypesMapContext } from '../pages/_app';
import styles from '../styles/Schedule.module.css';

type scheduleProps = {
    predictions: Array<IPrediction>,
    routeType: string
}

export default function Schedule(props: scheduleProps) {
    const [inboundPredictions, setInboundPredictions] = useState<Array<IPrediction>>([]);
    const [outboundPredictions, setOutboundPredictions] = useState<Array<IPrediction>>([]);
    const [routeIdToDestinationsMap, setRouteIdToDestinationsMap] = useState<IRouteIdToDestinationsMap>({});
    const routeTypesMapContext = useContext(RouteTypesMapContext);

    useEffect(() => {
        const inboundPredictions: Array<IPrediction> = [];
        const outboundPredictions: Array<IPrediction> = [];

        props.predictions.forEach((prediction) => {
            if (prediction.attributes.direction_id === 1) {
                inboundPredictions.push(prediction);
            } else {
                outboundPredictions.push(prediction);
            }
        })

        setInboundPredictions(inboundPredictions);
        setOutboundPredictions(outboundPredictions);

        const routesList = routeTypesMapContext[props.routeType];
        const map: IRouteIdToDestinationsMap = {};

        routesList.forEach((route) => {
            map[`${route.id}`] = route.attributes.direction_destinations;
        });
        setRouteIdToDestinationsMap(map);
    }, [props.predictions]);

    return (
        <div className='schedule-container'>
            <div className={styles['schedule-container']}>
                <CountdownClock routeIdToDestinationsMap={routeIdToDestinationsMap} predictions={inboundPredictions} directionId={1} />
            </div>
            <div className={styles['schedule-container']}>
                <CountdownClock routeIdToDestinationsMap={routeIdToDestinationsMap} predictions={outboundPredictions} directionId={0} />
            </div>
        </div>
    );
};