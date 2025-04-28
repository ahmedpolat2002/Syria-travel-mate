import React from "react";
import styles from "./CardsSection.module.css";
import Card from "./Card";
import SectionName from "../SectionName/SectionName";

const cardsData = [
  {
    image: "/images/card1.jpg",
    title: "Aleppo",
    location: "Syria",
    description: "Experience the stunning sunsets and beautiful architecture.",
    price: "$1,200",
  },
  {
    image: "/images/card2.jpg",
    title: "Latakia",
    location: "Syria",
    description: "Explore ancient temples and vibrant culture.",
    price: "$1,500",
  },
  {
    image: "/images/card3.jpg",
    title: "Idlib",
    location: "Syria",
    description: "Enjoy the romantic city of lights and its cuisine.",
    price: "$1,800",
  },
];

const CardsSection: React.FC = () => {
  return (
    <div>
      <SectionName title="Best offer this days" />
      <section className={styles.cardsSection}>
        {cardsData.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            title={card.title}
            location={card.location}
            description={card.description}
          />
        ))}
      </section>
    </div>
  );
};

export default CardsSection;
