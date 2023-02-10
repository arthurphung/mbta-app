import { useEffect, useState } from 'react';
import { IPrediction } from '../interfaces/IPredictions';

const useCountdown = (targetPrediction: IPrediction, handleExpiredPrediction: Function) => {
    const countdownDate = new Date(targetPrediction.attributes.departure_time).getTime();
    const [countdown, setCountdown] = useState(countdownDate - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const remainingTime = countdownDate - new Date().getTime();
            if (remainingTime < 1000) {
                clearInterval(interval);
                handleExpiredPrediction(targetPrediction.id);
            }
            setCountdown(remainingTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [countdownDate]);

    return getCountDownValues(countdown);
};

const getCountDownValues = (countDown: number) => {
    const date = new Date(countDown);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return [hours, minutes, seconds];
}

export { useCountdown };