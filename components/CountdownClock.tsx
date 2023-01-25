import { IPrediction } from '../interfaces/IPredictions';
import { IRouteIdToDestinationsMap } from '../interfaces/IRoutes';
import styles from '../styles/CountdownClock.module.css';
import Countdown from './Countdown';
import RouteSymbol from './RouteSymbol';

type countdownClockProps = {
    routeIdToDestinationsMap: IRouteIdToDestinationsMap,
    predictions: Array<IPrediction>,
    directionId: number
};

export default function CountdownClock(props: countdownClockProps) {
    const renderCountdownClock = () => {
        if (props.predictions.length === 0) {
            return (
                <span>No upcoming trains.</span>
            );
        } else if (props.predictions.length === 1) {
            return (
                <div className={styles['one-countdown-clock']}>
                    <div className={styles['first-prediction']}>
                        <Countdown predictedDate={props.predictions[0].attributes.departure_time} />
                    </div>
                </div>
            );
        } else if (props.predictions.length === 2) {
            return (
                <div className={styles['two-countdowns-clock']}>
                    <div className={styles['first-prediction']}>
                        <Countdown predictedDate={props.predictions[0].attributes.departure_time} />
                    </div>
                    <div className={styles['second-prediction']}>
                        <Countdown predictedDate={props.predictions[1].attributes.departure_time} />
                    </div>
                </div>
            );
        } else if (props.predictions.length >= 3) {
            return (
                <div className={styles['three-countdowns-clock']}>
                    <div className={styles['first-prediction']}>
                        <RouteSymbol routeId={props.predictions[0].relationships.route.data.id} />
                        <div>{props.routeIdToDestinationsMap[props.predictions[0].relationships.route.data.id][props.directionId]}</div>
                        <Countdown predictedDate={props.predictions[0].attributes.departure_time} />
                    </div>
                    <div className={styles['second-prediction']}>
                        <Countdown predictedDate={props.predictions[1].attributes.departure_time} />
                    </div>
                    <div className={styles['third-prediction']}>
                        <Countdown predictedDate={props.predictions[2].attributes.departure_time} />
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