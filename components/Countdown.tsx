import { useCountdown } from '../hooks/useCountdown';
import Counter from './Counter';

type countdownProps = {
    predictedDate: string
}

export default function Countdown(props: countdownProps) {
    const [hours, minutes, seconds] = useCountdown(props.predictedDate);

    return (
        <div className='vertical-text-center'>
            <Counter hours={hours} minutes={minutes} seconds={seconds} />
        </div>
    );
};