import { useRouter } from 'next/router';
import { useEffect, useState, useContext, createContext } from 'react';
import { IData, IPrediction } from '../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../interfaces/IRoutes';
import CountdownClock from './CountdownClock';
import { RouteTypesMapContext } from '../pages/_app';

type scheduleProps = {
    stopId: string,
    routeType: string,
    directionId: number
}

export default function Schedule(props: scheduleProps) {
    const router = useRouter();
    const [predictions, setPredictions] = useState<Array<IPrediction>>([]);
    const [routeIdToDestinationsMap, setRouteIdToDestinationsMap] = useState<IRouteIdToDestinationsMap>({});
    const routeTypesMapContext = useContext(RouteTypesMapContext);

    useEffect(() => {
        const predictionsStream = new EventSource(`/api/predictions/${props.stopId}/${props.directionId}`);
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    
        for (const event of events) {
            predictionsStream.addEventListener(event, (e) => {
                switch (event) {
                    case 'reset':
                        const resetData: Array<IPrediction> = JSON.parse(e.data);
                        resetPredictions(resetData);
                        break;
                    case 'add':
                        const addData: IPrediction = JSON.parse(e.data);
                        addPrediction(addData);
                        break;
                    case 'update':
                        const updateData: IPrediction = JSON.parse(e.data);
                        updatePrediction(updateData);
                        break;
                    case 'remove':
                        const removeData: IData = JSON.parse(e.data);
                        const predictionId: string = removeData.id;
                        removePrediction(predictionId);
                        break;
                    default:
                        break;
                }
            });
        }
    
        predictionsStream.onopen = () => {
            console.log('connection to stream has been opened');
        };
    
        predictionsStream.onerror = (error) => {
            console.log('an error occurred while receiving stream', error);
        };
    
        const handleRouteChange = (url: string, { shallow }: { shallow:boolean }) => {
            console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`);
        }

        router.events.on('routeChangeStart', handleRouteChange);

        const routesList = routeTypesMapContext[props.routeType];
        const map: IRouteIdToDestinationsMap = {};

        routesList.forEach((route) => {
            map[`${route.id}`] = route.attributes.direction_destinations;
        });
        setRouteIdToDestinationsMap(map);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            predictionsStream.close();
            console.log('connection closed');
        }
    }, []);

    const resetPredictions = (data: Array<IPrediction>) => {
        setPredictions(data);
    }

    const addPrediction = (data: IPrediction) => {
        console.log('add prediction', data);

        setPredictions((predictions) => {
            return [...predictions, data];
        });
    }

    const updatePrediction = (data: IPrediction) => {
        console.log('updated prediction', data);

        setPredictions((predictions) => {
            return [...predictions].map((prediction) => {
                if (prediction.id === data.id) return data;
                return prediction;
            })
        });
    }

    const removePrediction = (predictionId: string) => {
        console.log('remove prediction', predictionId);

        setPredictions((predictions) => {
            return [...predictions].filter((prediction) => prediction.id !== predictionId);
        });
    }

    return (
        <>
            <CountdownClock routeIdToDestinationsMap={routeIdToDestinationsMap} predictions={predictions} directionId={props.directionId} handleExpiredPrediction={removePrediction} />
        </>
    );
};