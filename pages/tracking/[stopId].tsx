import { useRouter } from 'next/router';

export default function Tracking() {
    const router = useRouter();
    const stopId = router.query.stopId;
    console.log(stopId);
};