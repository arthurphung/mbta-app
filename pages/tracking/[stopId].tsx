import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import Schedule from '../../components/Schedule';
import { IPrediction } from '../../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../../interfaces/IRoutes';
import { RouteTypesMapContext } from '../_app';


export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    const routeType = router.query.routeType as string;
    const routeTypesMapContext = useContext(RouteTypesMapContext);

    const [inboundPredictions, setInboundPredictions] = useState<Array<IPrediction>>([]);
    const [outboundPredictions, setOutboundPredictions] = useState<Array<IPrediction>>([]);
    const [routeIdToDetailsMap, setRouteIdToDestinationsMap] = useState<IRouteIdToDestinationsMap>({});

    useEffect(() => {
        const predictionsStream = new EventSource(`/api/predictions/${stopId}`);
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    
        for (const event of events) {
            predictionsStream.addEventListener(event, (e) => {
                switch (event) {
                    case 'reset':
                        const resetData: Array<IPrediction> = JSON.parse(e.data);

                        const inboundPredictions: Array<IPrediction> = [];
                        const outboundPredictions: Array<IPrediction> = [];

                        resetData.forEach((prediction) => {
                            if (prediction.attributes.direction_id === 1) {
                                inboundPredictions.push(prediction);
                            } else {
                                outboundPredictions.push(prediction);
                            }
                        })

                        setInboundPredictions(inboundPredictions);
                        setOutboundPredictions(outboundPredictions);

                        const routesList = routeTypesMapContext[routeType];
                        const map: IRouteIdToDestinationsMap = {};

                        routesList.forEach((route) => {
                          map[`${route.id}`] = route.attributes.direction_destinations;
                        });
                        setRouteIdToDestinationsMap(map);
                        break;
                    case 'add':
                        break;
                    case 'update':
                        const updateData: IPrediction = JSON.parse(e.data);
                        updatePredictionsList(updateData);
                        break;
                    case 'remove':
                        const removeData = JSON.parse(e.data);
                        console.log('remove prediction', removeData);
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

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            predictionsStream.close();
            console.log('connection closed');
        }
    }, []);

    const updatePredictionsList = (data: IPrediction) => {
        console.log('updated prediction', data);
        const directionId = data.attributes.direction_id;

        if (directionId === 1) {
            setInboundPredictions((inboundPredictions) => {
                return [...inboundPredictions].map((prediction) => {
                    if (prediction.id === data.id) return data;
                    return prediction;
                })
            })
        } else {
            setOutboundPredictions((outboundPredictions) => {
                return [...outboundPredictions].map((prediction) => {
                    if (prediction.id === data.id) return data;
                    return prediction;
                })
            })
        }
    }

    return (
        <div>
            <Schedule 
                routeIdToDestinationsMap={routeIdToDetailsMap}
                inboundPredictions={inboundPredictions} 
                outboundPredictions={outboundPredictions} 
            />
        </div>
    );
};