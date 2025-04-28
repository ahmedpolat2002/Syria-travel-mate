"use client";

import React from "react";
import { useState } from "react";
import styles from "./Header.module.css";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const [search, setsearsh] = useState("");

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <FaSearch className={styles.logoIcon} />

        <span className={styles.logoText}>TravelMate</span>
      </div>
      <div style={{ display: "flex", gap: "70px" }}>
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}>
            Home
          </a>
          <a href="#" className={styles.navItem}>
            Our offer
          </a>
          <a href="#" className={styles.navItem}>
            Booking
          </a>
          <a href="#" className={styles.navItem}>
            FAQ
          </a>
        </nav>
        <div className={styles.searchBox}>
          <input
            value={search}
            onChange={(e) => {
              setsearsh(e.target.value);
            }}
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
      </div>
    </header>
  );
};

export default Header;
