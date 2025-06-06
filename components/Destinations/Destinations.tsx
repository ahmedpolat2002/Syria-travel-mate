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
          <h2>الأماكن الأكثر إعجاباً لدى الزوار</h2>
          <p>
            استكشف الأماكن الأكثر شعبية في سوريا والعالم والتي حازت على إعجاب
            الزوار
            <br /> اكتشف جمالها وتاريخها وثقافتها من خلال تجاربهم
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            جارٍ تحميل الأماكن... يرجى الانتظار.
          </p>
        ) : places.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            لا توجد أماكن متاحة حالياً. يرجى التحقق لاحقاً.
          </p>
        ) : (
          <div className={styles.destinationsGrid}>
            {places.map((place) => (
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
                    <strong>الاعجابات: </strong> {place.likeCount}
                  </p>
                  <Link
                    href={`/places/${place.id}`}
                    className={styles.cardButton}
                  >
                    اكتشف المزيد
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Destinations;
