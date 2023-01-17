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
                isDanger={props.minutes < 3}
            />
            <p>:</p>
            <DateTimeDisplay 
                value={props.minutes}
                isDanger={props.minutes < 3}
            />
            <p>:</p>
            <DateTimeDisplay 
                value={props.seconds}
                isDanger={props.minutes < 3}
            />
        </div>
    );
};