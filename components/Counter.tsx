import DateTimeDisplay from './DateTimeDisplay';
import styles from '../styles/Counter.module.css';

type counterProps = {
    hours: number,
    minutes: number,
    seconds: number
};

export default function Counter(props: counterProps) {
    return (
        <div className={styles["counter-container"]}>
            <DateTimeDisplay
                value={props.hours}
                type={'Hours'}
                isDanger={props.minutes < 1}
            />
            <p>|</p>
            <DateTimeDisplay 
                value={props.minutes}
                type={'Mins'}
                isDanger={props.minutes < 1}
            />
            <p>|</p>
            <DateTimeDisplay 
                value={props.seconds}
                type={'Secs'}
                isDanger={props.minutes < 1}
            />
        </div>
    );
};