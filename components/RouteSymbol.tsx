import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faB, faC, faD, faE } from '@fortawesome/free-solid-svg-icons';

type routeProps = {
    routeId: string
}

export default function RouteSymbol(props: routeProps) {
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

    return (
        <div>
            {renderRouteSymbol(props.routeId)}
        </div>
    );
};