"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to a server
    console.log("Newsletter subscription:", email);
    setEmail("");
    // Show success message (in a real app)
    alert(t("newsletterSuccess"));
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
              <p>{t("footerAbout")}</p>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h3>{t("quickLinks")}</h3>
            <div className={styles.footerLinks}>
              <ul>
                <li>
                  <a href="#home">
                    <FaChevronRight /> {t("home")}
                  </a>
                </li>
                <li>
                  <a href="#destinations">
                    <FaChevronRight /> {t("destinations")}
                  </a>
                </li>
                <li>
                  <a href="#events">
                    <FaChevronRight /> {t("events")}
                  </a>
                </li>
                <li>
                  <a href="#about">
                    <FaChevronRight /> {t("about")}
                  </a>
                </li>
                <li>
                  <a href="#contact">
                    <FaChevronRight /> {t("contact")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h3>{t("contactInfo")}</h3>
            <div className={styles.footerContact}>
              <p>
                <FaMapMarkerAlt />
                {t("addressLine1")}, {t("addressLine2")}
              </p>
              <p>
                <FaPhoneAlt />
                +963 11 234 5678
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
            <h3>{t("newsletter")}</h3>
            <div className={styles.footerNewsletter}>
              <p>{t("newsletterText")}</p>
              <form onSubmit={handleSubmit} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
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
            &copy; {new Date().getFullYear()} TravelMate.{" "}
            {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
