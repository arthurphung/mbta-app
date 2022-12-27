import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Card.module.css';

interface Route {
    attributes: Attributes,
    id: string,
    links: Links,
    relationships: Relationships,
    type: string
}

interface Attributes {
    color: string,
    description: string,
    direction_destinations: Array<string>,
    direction_names: Array<string>,
    fare_class: string,
    long_name: string,
    short_name: string,
    sort_order: number,
    text_color: string,
    type: number
}

interface Links {
    self: string
}

interface Relationships {
    line: Line
}

interface Line {
    data: LineData
}

interface LineData {
    id: string,
    type: string
}

type RoutesObj = {
    id: string,
    list: Array<Route>
};

interface routeCardProps {
    data: RoutesObj
}

export default function Card(props: routeCardProps) {
    return (
        <div className={styles['items-body-content']}>
            <span>{props.data.id}</span>
            <FontAwesomeIcon icon={faAngleRight} />
        </div>
    );
};