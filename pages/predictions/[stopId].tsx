import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Schedules from '../../components/Schedules';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId as string;
    const routeId = router.query.routeId as string;
    const routeClass = router.query.routeClass as string;
    const routeType = router.query.routeType as string;

    const InteractiveMap = dynamic(() => import('../../components/InteractiveMap'), { ssr: false }); 

    return (
        <>
            <Schedules stopId={stopId} routeClass={routeClass} routeType={routeType} />
            <InteractiveMap routeId={routeId} />
        </>
    );
};