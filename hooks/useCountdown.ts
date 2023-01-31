import { useEffect, useState } from 'react';

const useCountdown = (targetDate: string) => {
    const countdownDate = new Date(targetDate).getTime();
    const [countdown, setCountdown] = useState(countdownDate - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(countdownDate - new Date().getTime());
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