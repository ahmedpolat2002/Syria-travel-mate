// src/components/Event/EventCard.tsx

import React from 'react';
import styles from './EventSection.module.css';

interface EventCardProps {
    title: string;
    images: string[];
    isHotOffer?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ title, images, isHotOffer }) => {
    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <h2>{title}</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores eos error cupiditate temporibus, at alias</p>
                <button className={styles.btn}>Explore now</button>
            </div>
            <div className={styles.right}>
                <div className={styles.images}>
                    <img src={images[0]} alt="event 1" />
                    <img src={images[1]} alt="event 2" className={styles.extend} />
                    <img src={images[2]} alt="event 3" />
                </div>
                {isHotOffer && <div className={styles.badge}>HOT OFFER</div>}
            </div>
        </div>
    );
};

export default EventCard;
