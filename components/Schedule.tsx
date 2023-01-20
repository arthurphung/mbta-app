import { useEffect } from 'react';
import { IPrediction } from '../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../interfaces/IRoutes';
import CountdownClock from './CountdownClock';

type scheduleProps = {
    routeIdToDestinationsMap: IRouteIdToDestinationsMap,
    inboundPredictions: Array<IPrediction>,
    outboundPredictions: Array<IPrediction>
}

export default function Schedule(props: scheduleProps) {
    return (
        <div className='schedule-container'>
            <div className='inbound-container'>
                <CountdownClock routeIdToDestinationsMap={props.routeIdToDestinationsMap} predictions={props.inboundPredictions} directionId={1} />
            </div>
            <div className='outbound-container'>
                <CountdownClock routeIdToDestinationsMap={props.routeIdToDestinationsMap} predictions={props.outboundPredictions} directionId={0} />
            </div>
        </div>
    );
};