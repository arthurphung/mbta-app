import { useContext } from 'react';
import { IPrediction } from '../interfaces/IPredictions';
import { RoutesMapContext } from '../pages/_app';
import styles from '../styles/CountdownClock.module.css';
import Countdown from './Countdown';
import RouteSymbol from './RouteSymbol';

type countdownClockProps = {
    data: Array<IPrediction>
};

export default function CountdownClock(props: countdownClockProps) {
    const routesMap = useContext(RoutesMapContext);

    const renderCountdownClock = () => {
        if (props.data.length === 0) {
            return (
                <span>No upcoming trains.</span>
            );
        } else if (props.data.length === 1) {
            return (
                <div className={styles['one-countdown-clock']}>
                    <div className={styles['primary-prediction']}>
                        <Countdown predictedDate={props.data[0].attributes.departure_time} />
                    </div>
                </div>
            );
        } else if (props.data.length === 2) {
            return (
                <div className={styles['two-countdowns-clock']}>
                    <div className={styles['primary-prediction']}>
                        <Countdown predictedDate={props.data[0].attributes.departure_time} />
                    </div>
                    <div className={styles['secondary-prediction']}>
                        <Countdown predictedDate={props.data[1].attributes.departure_time} />
                    </div>
                </div>
            );
        } else if (props.data.length >= 3) {
            const routeDestinations = [];

            return (
                <div className={styles['three-countdowns-clock']}>
                    <div className={styles['primary-prediction']}>
                        <RouteSymbol routeId={props.data[0].relationships.route.data.id} />
                        <h1></h1>
                        <Countdown predictedDate={props.data[0].attributes.departure_time} />
                    </div>
                    <div className={styles['secondary-prediction']}>
                        <Countdown predictedDate={props.data[1].attributes.departure_time} />
                    </div>
                    <div className={styles['secondary-prediction']}>
                        <Countdown predictedDate={props.data[2].attributes.departure_time} />
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            {renderCountdownClock()}
        </>
    );
};