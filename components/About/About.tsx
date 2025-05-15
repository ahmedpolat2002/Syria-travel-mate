"use client";
import React from "react";
import { FaMapMarkedAlt, FaUserFriends, FaShieldAlt } from "react-icons/fa";
import styles from "./About.module.css";

const About: React.FC = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src="aboutUs.png" alt="" />
        </div>

        <div className={styles.content}>
          <div className={styles.sectionTitle}>
            <h2>About Us</h2>
            <p>
              Explore the rich history, culture, and natural beauty of Syria
            </p>
          </div>

          <p>
            TravelMate is your ultimate guide to exploring Syria&apos;s rich
            cultural heritage and beautiful destinations. Join us on a journey
            through this historic land.
          </p>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaMapMarkedAlt size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>Expert Guides</h3>
                <p>
                  Our team of local guides is passionate about sharing the rich
                  history and culture of Syria with visitors.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaUserFriends size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>Personalized Experience</h3>
                <p>
                  Our team of local guides is passionate about sharing the rich
                  history and culture of Syria with visitors.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaShieldAlt size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>Safety First</h3>
                <p>
                  Our team of local guides is passionate about sharing the rich
                  history and culture of Syria with visitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
