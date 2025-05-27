"use client";
import React, { useEffect, useState } from "react";
import styles from "./Destinations.module.css";
import Image from "next/image";
import ImagePlaceholder from "../common/ImagePlaceholder";
import Link from "next/link";

type Place = {
  id: number;
  name: string;
  description: string;
  image: string;
  typeName: string;
  provinceName: string;
  likeCount: number;
};

const Destinations: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopLikedPlaces = async () => {
      try {
        const res = await fetch("/api/places/top-liked");
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error("Failed to fetch top liked places:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLikedPlaces();
  }, []);

  return (
    <section id="destinations" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>Most Liked Places</h2>
          <p>Explore the most loved destinations by visitors</p>
        </div>

        <div className={styles.destinationsGrid}>
          {loading ? (
            <p>Loading...</p>
          ) : places.length === 0 ? (
            <p>No popular places found.</p>
          ) : (
            places.map((place) => (
              <div key={place.id} className={styles.destinationCard}>
                <div className={styles.cardImage}>
                  {place.image ? (
                    <Image
                      src={place.image}
                      alt={place.name}
                      width={400}
                      height={250}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "250px",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder text={place.name} height="250px" />
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <p>
                    <strong>Likes:</strong> {place.likeCount}
                  </p>
                  <Link
                    href={`/places/${place.id}`}
                    className={styles.cardButton}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
