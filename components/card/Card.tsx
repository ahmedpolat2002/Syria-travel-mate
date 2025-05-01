import React from "react";
import styles from "./card.module.css";

interface CardProps {
  image: string;
  title: string;
  location: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ image, title, location, description }) => {
  return (
    <article className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <div className={styles.cardData}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <span className={styles.cardLocation}>{location}</span>
        <p className={styles.cardDescription}>{description}</p>
        <h3>
          <a className={styles.cardInfo} href="">
            See more
          </a>
        </h3>
      </div>
    </article>
  );
};

export default Card;
