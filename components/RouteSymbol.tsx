import styles from '../styles/RouteSymbol.module.css';

type routeProps = {
    routeId: string
}

export default function RouteSymbol(props: routeProps) {
    const renderRouteSymbol = (routeId: string) => {
        const routeSymbol = routeId.split('-')[1];
        switch (routeSymbol) {
            case 'B':
                return (
                    <div className={styles['b-route-symbol']}>B</div>
                );
            case 'C':
                return (
                    <div className={styles['c-route-symbol']}>C</div>
                );
            case 'D':
                return (
                    <div className={styles['d-route-symbol']}>D</div>
                );
            case 'E':
                return (
                    <div className={styles['e-route-symbol']}>E</div>
                );
            default:
                break;
        }
    };

    return (
        <>
            {renderRouteSymbol(props.routeId)}
        </>
    );
};