import { useRouter } from 'next/router';
import Schedule from '../../components/Schedule';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId as string;
    const routeType = router.query.routeType as string;
    const outboundDirectionId = 0;
    const inboundDirectionId = 1;

    return (
        <div className='centered-page-contents'>
            <div className='mb-spacing'>
                <Schedule stopId={stopId} routeType={routeType} directionId={inboundDirectionId} />
            </div>
            <div>
                <Schedule stopId={stopId} routeType={routeType} directionId={outboundDirectionId} />
            </div>
        </div>
    );
};