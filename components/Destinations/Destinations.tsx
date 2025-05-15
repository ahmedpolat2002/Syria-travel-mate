"use client";
import React from "react";
import styles from "./Destinations.module.css";
import ImagePlaceholder from "../common/ImagePlaceholder";

// In a real application, these would come from an API or CMS
const destinations = [
  {
    id: 1,
    name: "Damascus",
    nameAr: "دمشق",
    description:
      "One of the oldest continuously inhabited cities in the world, known for its rich history and culture.",
    descriptionAr:
      "واحدة من أقدم المدن المأهولة باستمرار في العالم، معروفة بتاريخها وثقافتها الغنية.",
    image: "/src/assets/damascus.jpg",
  },
  {
    id: 2,
    name: "Aleppo",
    nameAr: "حلب",
    description:
      "Famous for its ancient citadel, historic markets, and being a major cultural and commercial center.",
    descriptionAr:
      "مشهورة بقلعتها القديمة وأسواقها التاريخية، وكونها مركزًا ثقافيًا وتجاريًا رئيسيًا.",
    image: "/src/assets/aleppo.jpg",
  },
  {
    id: 3,
    name: "Latakia",
    nameAr: "اللاذقية",
    description:
      "A beautiful coastal city with stunning Mediterranean beaches and vibrant culture.",
    descriptionAr:
      "مدينة ساحلية جميلة ذات شواطئ متوسطية خلابة وثقافة نابضة بالحياة.",
    image: "/src/assets/latakia.jpg",
  },
];

const Destinations: React.FC = () => {
  return (
    <section id="destinations" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>Popular Destinations</h2>
          <p>Explore the rich history, culture, and natural beauty of Syria</p>
        </div>

        <div className={styles.destinationsGrid}>
          {destinations.map((destination) => (
            <div key={destination.id} className={styles.destinationCard}>
              <div className={styles.cardImage}>
                <ImagePlaceholder text={destination.name} height="250px" />
              </div>
              <div className={styles.cardContent}>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <a href="#" className={styles.cardButton}>
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
