"use client";
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
    alert("Thank you for subscribing to our newsletter!"); // رسالة نجاح
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <h2>TravelMate</h2>
            </div>
            <div className={styles.footerAbout}>
              <p>
                Your trusted travel companion, helping you discover amazing
                places and unforgettable experiences.
              </p>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h3>Quick Links</h3>
            <div className={styles.footerLinks}>
              <ul>
                <li>
                  <a href="#home">
                    <FaChevronRight /> Home
                  </a>
                </li>
                <li>
                  <a href="#destinations">
                    <FaChevronRight /> Destinations
                  </a>
                </li>
                <li>
                  <a href="#events">
                    <FaChevronRight /> Events
                  </a>
                </li>
                <li>
                  <a href="#about">
                    <FaChevronRight /> About
                  </a>
                </li>
                <li>
                  <a href="#contact">
                    <FaChevronRight /> Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h3>Contact Info</h3>
            <div className={styles.footerContact}>
              <p>
                <FaMapMarkerAlt />
                123 Main Street, Aleppo, Syria
              </p>
              <p>
                <FaPhoneAlt />
                +90 531 772 35 82
              </p>
              <p>
                <FaEnvelope />
                info@travelmate-syria.com
              </p>
            </div>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <FaFacebookF />
              </a>
              <a href="#" className={styles.socialLink}>
                <FaTwitter />
              </a>
              <a href="#" className={styles.socialLink}>
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h3>Newsletter</h3>
            <div className={styles.footerNewsletter}>
              <p>Subscribe to our newsletter to get the latest updates.</p>
              <form onSubmit={handleSubmit} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className={styles.newsletterButton}>
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} TravelMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
