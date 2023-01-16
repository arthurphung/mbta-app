import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Countdown from '../../components/Countdown';
import { IPrediction } from '../../interfaces/IPredictions';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    const [predictions, setPredictions] = useState<Array<IPrediction>>([]);

    useEffect(() => {
        // https://stackoverflow.com/questions/64168907/react-eventsource-is-not-closed
        const predictionsStream = new EventSource(`/api/predictions/${stopId}`);
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    
        for (const event of events) {
            predictionsStream.addEventListener(event, (e) => {
                const eventData = JSON.parse(e.data);
                switch (event) {
                    case 'reset':
                        console.log('initial predictions list', eventData);
                        setPredictions(eventData);
                        break;
                    case 'add':
                        break;
                    case 'update':
                        updatePredictionsList(eventData);
                        break;
                    case 'remove':
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

        setPredictions((predictions) => {
            return [...predictions].map((prediction) => {
                if (prediction.id === data.id) {
                    return data;
                }
                return prediction;
            });
        })
    }

    return (
        <div>
            <Countdown
                data={predictions}
            />
        </div>
    );
};