import { useRouter } from 'next/router';
import Schedule from '../../components/Schedule';
import dynamic from 'next/dynamic';
import styles from '../../styles/Predictions.module.css';
import { useContext, useEffect, useMemo, useState } from 'react';
import { IData, IPrediction } from '../../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../../interfaces/IRoutes';
import { RouteClassesMapContext } from '../_app';
import { GetStaticProps } from 'next';
import { ICoordinates } from '../../interfaces/IMap';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId as string;
    const routeClass = router.query.routeClass as string;
    const routeType = router.query.routeType as string;
    const inboundDirectionId = 1;
    const outboundDirectionId = 0;

    const [inboundPredictions, setInboundPredictions] = useState<Array<IPrediction>>([]);
    const [outboundPredictions, setOutboundPredictions] = useState<Array<IPrediction>>([]);
    const [inboundCoordinates, setInboundCoordinates] = useState<Array<ICoordinates>>([]);

    const [routeIdToDestinationsMap, setRouteIdToDestinationsMap] = useState<IRouteIdToDestinationsMap>({});
    const routeClassesMapContext = useContext(RouteClassesMapContext);

    useEffect(() => {
        const inboundPredictionsStream = new EventSource(`/api/predictions/${stopId}/${routeType}/${inboundDirectionId}`);
        const outboundPredictionsStream = new EventSource(`/api/predictions/${stopId}/${routeType}/${outboundDirectionId}`);
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    
        for (const event of events) {
            inboundPredictionsStream.addEventListener(event, (e) => {
                switch (event) {
                    case 'reset':
                        const resetData: Array<IPrediction> = JSON.parse(e.data);
                        console.log(resetData);
                        resetPredictions(resetData, inboundDirectionId);
                        break;
                    case 'add':
                        const addData: IPrediction = JSON.parse(e.data);
                        addPrediction(addData, inboundDirectionId);
                        break;
                    case 'update':
                        const updateData: IPrediction = JSON.parse(e.data);
                        updatePrediction(updateData, inboundDirectionId);
                        break;
                    case 'remove':
                        const removeData: IData = JSON.parse(e.data);
                        const predictionId: string = removeData.id;
                        removePrediction(predictionId, inboundDirectionId);
                        break;
                    default:
                        break;
                }
            });

            outboundPredictionsStream.addEventListener(event, (e) => {
                switch (event) {
                    case 'reset':
                        const resetData: Array<IPrediction> = JSON.parse(e.data);
                        resetPredictions(resetData, outboundDirectionId);
                        break;
                    case 'add':
                        const addData: IPrediction = JSON.parse(e.data);
                        addPrediction(addData, outboundDirectionId);
                        break;
                    case 'update':
                        const updateData: IPrediction = JSON.parse(e.data);
                        updatePrediction(updateData, outboundDirectionId);
                        break;
                    case 'remove':
                        const removeData: IData = JSON.parse(e.data);
                        const predictionId: string = removeData.id;
                        removePrediction(predictionId, outboundDirectionId);
                        break;
                    default:
                        break;
                }
            });
        }
    
        inboundPredictionsStream.onopen = () => {
            console.log('connection to stream has been opened');
        };
    
        inboundPredictionsStream.onerror = (error) => {
            console.log('an error occurred while receiving stream', error);
        };

        outboundPredictionsStream.onopen = () => {
            console.log('connection to stream has been opened');
        };
    
        outboundPredictionsStream.onerror = (error) => {
            console.log('an error occurred while receiving stream', error);
        };
    
        const handleRouteChange = (url: string, { shallow }: { shallow:boolean }) => {
            console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`);
        }

        router.events.on('routeChangeStart', handleRouteChange);

        const routesList = routeClassesMapContext[routeClass];
        const map: IRouteIdToDestinationsMap = {};

        routesList.forEach((route) => {
            map[`${route.id}`] = route.attributes.direction_destinations;
        });
        setRouteIdToDestinationsMap(map);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            inboundPredictionsStream.close();
            outboundPredictionsStream.close();
            console.log('connection closed');
        }
    }, []);

    const resetPredictions = (data: Array<IPrediction>, directionId: number) => {
        switch (directionId) {
            case 0:
                setOutboundPredictions(data);
                break;
            case 1:
                setInboundPredictions(data);
                break;
            default:
                break;
        }
    }

    const addPrediction = (data: IPrediction, directionId: number) => {
        switch (directionId) {
            case 0:
                setOutboundPredictions((predictions) => {
                    return [...predictions, data];
                });
                break;
            case 1:
                setInboundPredictions((predictions) => {
                    return [...predictions, data];
                });
                break;
            default:
                break;
        }
    }

    const updatePrediction = (data: IPrediction, directionId: number) => {
        switch (directionId) {
            case 0:
                setOutboundPredictions((predictions) => {
                    return [...predictions].map((prediction) => {
                        if (prediction.id === data.id) return data;
                        return prediction;
                    })
                });
                break;
            case 1:
                setInboundPredictions((predictions) => {
                    return [...predictions].map((prediction) => {
                        if (prediction.id === data.id) return data;
                        return prediction;
                    })
                });
                break;
            default:
                break;
        }
    }

    const removePrediction = (predictionId: string, directionId: number) => {
        switch (directionId) {
            case 0:
                setOutboundPredictions((predictions) => {
                    return [...predictions].filter((prediction) => prediction.id !== predictionId);
                });
                break;
            case 1:
                setInboundPredictions((predictions) => {
                    return [...predictions].filter((prediction) => prediction.id !== predictionId);
                });
                break;
            default:
                break;
        }
    }

    const InteractiveMap = dynamic(() => import('../../components/InteractiveMap'), { ssr: false }); 

    return (
        <>
            <div className={styles['centered-page-contents']}>
                <div className={styles['mb-spacing']}>
                    <div>Inbound</div>
                    <Schedule routeIdToDestinationsMap={routeIdToDestinationsMap} predictions={inboundPredictions} directionId={inboundDirectionId} handleExpiredPrediction={removePrediction} />
                </div>
                <div className={styles['mb-spacing']}>
                    <div>Outbound</div>
                    <Schedule routeIdToDestinationsMap={routeIdToDestinationsMap} predictions={outboundPredictions} directionId={outboundDirectionId} handleExpiredPrediction={removePrediction} />
                </div>
            </div>
            {/* <InteractiveMap inboundCoordinates={} /> */}
        </>
    );
};

// export const getStaticProps: GetStaticProps = async () => {
//     const 
// };