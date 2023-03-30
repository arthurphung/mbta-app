import { useCountdown } from '../hooks/useCountdown';
import { IPrediction } from '../interfaces/IPredictions';
import Counter from './Counter';

type countdownProps = {
    prediction: IPrediction,
    directionId: number,
    handleExpiredPrediction: Function
}

export default function Countdown(props: countdownProps) {
    const [hours, minutes, seconds] = useCountdown(props.prediction, props.directionId, props.handleExpiredPrediction);

    return (
        <div className='vertical-text-center'>
            <Counter hours={hours} minutes={minutes} seconds={seconds} />
        </div>
    );
};