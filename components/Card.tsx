import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Card.module.css';
import React from 'react';

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

interface cardProps {
    data: any,
    handler: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export default function Card(props: cardProps) {
    return (
        <div 
            className={styles['items-body-content']}
            id={props.data}
            onClick={props.handler}
        >
            <span>{props.data}</span>
            <FontAwesomeIcon icon={faAngleRight} className={styles['items-body-icon']} />
        </div>
    );
};