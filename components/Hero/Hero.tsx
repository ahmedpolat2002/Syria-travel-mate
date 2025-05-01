import React from "react";
import styles from "./Hero.module.css";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1>
          Explore <br />
          <span>the world</span> with us
        </h1>
        <p>Discover possibilities of travelling !</p>
        <Link href="/login">Explore</Link>
      </div>
    </section>
  );
};

export default Hero;
