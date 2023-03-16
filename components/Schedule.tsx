import { IPrediction } from '../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../interfaces/IRoutes';
import CountdownClock from './CountdownClock';

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