"use client";
import React from "react";
import styles from "./Home.module.css";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();
  const handleExploreClick = () => {
    router.push("/map");
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroBackground}>
        <video
          className={styles.heroVideo}
          src="Home.mp4"
          autoPlay
          loop
          muted
        />
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.heroContent}>
        <h1>اكتشف جمال سوريا</h1>
        <p>
          استمتع بتجربة فريدة من نوعها في استكشاف الأماكن السياحية والفعاليات
          الثقافية والتاريخية في سوريا
          <br />
          انطلق في رحلة لا تُنسى عبر تاريخ وثقافة هذا البلد الرائع
        </p>
        <button onClick={handleExploreClick} className={styles.heroButton}>
          استكشف الآن
        </button>
      </div>
    </section>
  );
};

export default Home;
