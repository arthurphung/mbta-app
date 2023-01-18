import { IPrediction } from '../interfaces/IPredictions';
import CountdownClock from './CountdownClock';

type scheduleProps = {
    inboundPredictions: Array<IPrediction>,
    outboundPredictions: Array<IPrediction>
}

export default function Schedule(props: scheduleProps) {
    return (
        <div className='schedule-container'>
            <div className='inbound-container'>
                <CountdownClock data={props.inboundPredictions} />
            </div>
            <div className='outbound-container'>
                <CountdownClock data={props.outboundPredictions} />
            </div>
        </div>
    );
};