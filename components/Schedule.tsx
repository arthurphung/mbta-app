import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { IData, IPrediction } from '../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../interfaces/IRoutes';
import CountdownClock from './CountdownClock';
import { RouteTypesMapContext } from '../pages/_app';

type scheduleProps = {
    routeIdToDestinationsMap: IRouteIdToDestinationsMap,
    predictions: Array<IPrediction>,
    directionId: number,
    handleExpiredPrediction: Function
}

export default function Schedule(props: scheduleProps) {


    return (
        <>
            <CountdownClock routeIdToDestinationsMap={props.routeIdToDestinationsMap} predictions={props.predictions} directionId={props.directionId} handleExpiredPrediction={props.handleExpiredPrediction} />
        </>
    );
};