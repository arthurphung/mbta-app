import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    console.log(stopId);

    useEffect(() => {
        const predictionsStream = new EventSource(`/api/predictions/${stopId}`);
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    
        for (const event of events) {
            predictionsStream.addEventListener(event, (e) => {
                console.log(event, JSON.parse(e.data));
            });
        }
    
        predictionsStream.onopen = () => {
            console.log('connection to stream has been opened');
        };
    
        predictionsStream.onerror = (error) => {
            console.log('an error occurred while receiving stream', error);
        };
    
        predictionsStream.addEventListener('close', () => {
            predictionsStream.close();
        })

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
};