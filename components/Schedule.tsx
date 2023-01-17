import { IPrediction } from '../interfaces/IPredictions';
import Countdown from './Countdown';
import RouteSymbol from './RouteSymbol';

type scheduleProps = {
    data: Array<IPrediction>
}

export default function Schedule(props: scheduleProps) {
    return (
        <>
            <div className='primary-prediction'>
                
            </div>
            <div className='secondary-predictions'>
            
            </div>
        </>
    );
};