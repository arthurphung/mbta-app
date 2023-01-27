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
                    <div className={styles['route-symbol']} id={styles['b-route']}>B</div>
                );
            case 'C':
                return (
                    <div className={styles['route-symbol']} id={styles['c-route']}>C</div>
                );
            case 'D':
                return (
                    <div className={styles['route-symbol']} id={styles['d-route']}>D</div>
                );
            case 'E':
                return (
                    <div className={styles['route-symbol']} id={styles['e-route']}>E</div>
                );
            default:
                break;
        }
    };

    return (
        <div className={styles['symbol-container']}>
            {renderRouteSymbol(props.routeId)}
        </div>
    );
};