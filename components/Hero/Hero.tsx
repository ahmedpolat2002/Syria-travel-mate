import React from "react";
import styles from "./Hero.module.css";

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1>
          Explore <br />
          <span>the world</span> with us
        </h1>
        <p>Discover possibilities of travelling !</p>
        <button>Explore</button>
      </div>
    </section>
  );
};

export default Hero;
