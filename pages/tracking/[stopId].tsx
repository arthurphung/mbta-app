import { useRouter } from 'next/router';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    console.log(stopId);

    const predictionsStream = new EventSource(`/api/predictions/${stopId}`);
    const events: Array<string> = ['reset', 'add', 'update', 'remove'];

    for (const event of events) {
        predictionsStream.addEventListener(event, (e) => {
            console.log(event, e.data);
        });
    }

    predictionsStream.onopen = () => {
        console.log('connection to stream has been opened');
    };

    predictionsStream.onerror = (error) => {
        console.log('an error occurred while receiving stream', error);
    };
};