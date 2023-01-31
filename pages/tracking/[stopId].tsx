import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Schedule from '../../components/Schedule';
import { IPrediction, IData } from '../../interfaces/IPredictions';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    const routeType = router.query.routeType as string;

    const [predictions, setPredictions] = useState<Array<IPrediction>>([]);

    useEffect(() => {
        const predictionsStream = new EventSource(`/api/predictions/${stopId}`);
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    
        for (const event of events) {
            predictionsStream.addEventListener(event, (e) => {
                switch (event) {
                    case 'reset':
                        const resetData: Array<IPrediction> = JSON.parse(e.data);
                        resetPredictions(resetData);
                        break;
                    case 'add':
                        const addData = JSON.parse(e.data);
                        addPrediction(addData);
                        break;
                    case 'update':
                        const updateData: IPrediction = JSON.parse(e.data);
                        updatePrediction(updateData);
                        break;
                    case 'remove':
                        const removeData = JSON.parse(e.data);
                        removePrediction(removeData);
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

    const resetPredictions = (data: Array<IPrediction>) => {
        setPredictions(data);
    }

    const addPrediction = (data: unknown) => {
        
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

    const removePrediction = (data: IData) => {
        console.log('remove prediction', data);
    }

    return (
        <div>
            <Schedule 
                predictions={predictions} routeType={routeType}
            />
        </div>
    );
};