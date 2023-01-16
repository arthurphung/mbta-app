import { useEffect, useState } from 'react';
import { IPrediction } from '../interfaces/IPredictions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faB, faC, faD, faE } from '@fortawesome/free-solid-svg-icons';

interface countdownProps {
    data: Array<IPrediction>
}

export default function Countdown(props: countdownProps) {
    const renderRouteSymbol = (routeId: string) => {
        const routeSymbol = routeId.split('-')[1];
        switch (routeSymbol) {
            case 'B':
                return (
                    <FontAwesomeIcon icon={faB} />
                );
            case 'C':
                return (
                    <FontAwesomeIcon icon={faC} />
                );
            case 'D':
                return (
                    <FontAwesomeIcon icon={faD} />
                );
            case 'E':
                return (
                    <FontAwesomeIcon icon={faE} />
                );
            default:
                break;
        }
    };

    const renderDestination = (destination: string) => {
        return (
            <></>
        );
    }

    const padTo2Digits = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    useEffect(() => {
        props.data.forEach((prediction) => {
            const predictedDate = Date.parse(prediction.attributes.departure_time);
            const remainingTime = predictedDate - Date.now();

            const date = new Date(remainingTime);
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const seconds = date.getUTCSeconds();
            console.log(`${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
        })
    }, [JSON.stringify(props.data)]);

    return (
        <div className='countdown-container'>
            {props.data.map((el) => {
                return (
                    <>
                        <div className='line-icon'>
                            {renderRouteSymbol(el.relationships.route.data.id)}
                        </div>
                        <div className='destination'>
                            
                        </div>
                        <div className='countdown-timer'>
                            {el.attributes.departure_time}
                        </div>
                    </>
                );
            })}
        </div>
    );
};