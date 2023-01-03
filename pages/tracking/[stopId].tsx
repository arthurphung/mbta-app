import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

// export const getStaticPaths = () => {
//     return {
//         paths: [{ params: {stopId: 'place-harvd'}}],
//         fallback: false,
//     };
// }

// export const getStaticProps: GetStaticProps = async (context) => {


//     return {
//         props: {}
//     };
// };

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    console.log(stopId);

    const predictionsStream = new EventSource(`/api/predictions/${stopId}`);
    predictionsStream.onmessage = (event) => {
        console.log('received stream', event.data);
    };

    // const predictionsStream = new EventSource(`${process.env.NEXT_PUBLIC_CONNECTION_STRING}/predictions?filter%5Bstop%5D=${stopId}&api_key=${process.env.NEXT_PUBLIC_API_KEY}`, {withCredentials: false});
    predictionsStream.onopen = () => {
        console.log('connection to stream has been opened');
    };

    predictionsStream.onerror = (error) => {
        console.log('an error occurred while receiving stream', error);
    };
};