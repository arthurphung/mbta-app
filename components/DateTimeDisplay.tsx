import styles from '../styles/DateTimeDisplay.module.css';

type dateTimeDisplayProps = {
    value: number,
    isDanger: boolean
}

export default function DateTimeDisplay(props: dateTimeDisplayProps) {
    const padTo2Digits = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    return (
        <div className={props.isDanger ? styles['countdown-danger'] : 'countdown'}>
            <p>{padTo2Digits(props.value)}</p>
        </div>
    );
};