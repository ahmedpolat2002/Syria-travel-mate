"use client";
import React from "react";
import styles from "./Home.module.css";

const Home: React.FC = () => {
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
        <h1>Discover the Beauty of Syria</h1>
        <p>Explore the rich history, culture, and natural beauty of Syria</p>
        <button className={styles.heroButton}>Explore</button>
      </div>
    </section>
  );
};

export default Home;
