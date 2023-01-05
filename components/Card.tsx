import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Card.module.css';
import React from 'react';

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