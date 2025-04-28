import React from "react";
import styles from "./Booking.module.css";

const Booking: React.FC = () => {
  return (
    <section className={styles.booking}>
      <div className={styles.container}>
        <div className={styles.item}>
          <span className={styles.label}>Location</span>
          <span className={styles.value}>Syria</span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>01/09/2025 - 10/09/2025</span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Guests</span>
          <span className={styles.value}>2 member</span>
        </div>

        <button className={styles.searchBtn}>Search</button>
      </div>
    </section>
  );
};

export default Booking;
