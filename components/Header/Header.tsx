"use client";

import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import {
  FaBars,
  FaTimes,
  // FaGlobe,
  // FaSignInAlt,
  // FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

// interface User {
//   username: string;
//   id: number;
//   role: string;
//   iat: number;
//   exp: number;
// }

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  // التحقق من التوكن عند تحميل الصفحة
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        // setUser(data.user);
      });
  }, []);

  // تسجيل الخروج
  const handleLogout = async () => {
    setLoading(true);
    const res = await fetch("/api/users/logout", { method: "POST" });

    // تحقق من أنه تم الحذف
    if (res.ok) {
      console.log("تم تسجيل الخروج وحذف الكوكي ✅");
      setIsAuthenticated(false);
      // setUser(null);
      setLoading(false);
      router.push("/login");
    } else {
      console.error("فشل تسجيل الخروج ❌");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const changeLanguage = () => {
  //   const newLang = i18n.language === "en" ? "ar" : "en";
  //   i18n.changeLanguage(newLang);
  //   document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  //   document.documentElement.lang = newLang;
  // };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>TravelMate</h1>
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
          <ul>
            <li>
              <a href="#home">{t("home")}</a>
            </li>
            <li>
              <a href="#destinations">{t("destinations")}</a>
            </li>
            <li>
              <a href="#events">{t("events")}</a>
            </li>
            <li>
              <a href="#about">{t("about")}</a>
            </li>
            <li>
              <a href="#contact">{t("contact")}</a>
            </li>
          </ul>
          <div className={styles.buttonGroup}>
            {!isAuthenticated ? (
              <>
                <button
                  className={styles.authButton}
                  onClick={() => router.push("/login")}
                >
                  تسجيل الدخول
                </button>
                <button
                  className={styles.authButton}
                  onClick={() => router.push("/register")}
                >
                  إنشاء حساب
                </button>
              </>
            ) : (
              <>
                {/* <span className={styles.userName}>{user?.username}</span> */}
                <button
                  className={styles.authButton}
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
                </button>
              </>
            )}

            {/* <button className={styles.langButton} onClick={changeLanguage}>
              <FaGlobe /> {i18n.language === "en" ? "العربية" : "English"}
            </button> */}
          </div>
        </nav>
      </div>
    </header>

    // <header className={styles.header}>
    //   <div className={styles.logo}>
    //     <FaSearch className={styles.logoIcon} />
    //     <span className={styles.logoText}>TravelMate</span>
    //   </div>

    //   <div style={{ display: "flex", gap: "70px", alignItems: "center" }}>
    //     <nav className={styles.nav}>
    //       <a href="#" className={`${styles.navItem} ${styles.active}`}>
    //         Home
    //       </a>
    //       <a href="#" className={styles.navItem}>
    //         Our offer
    //       </a>
    //       <a href="#" className={styles.navItem}>
    //         Booking
    //       </a>
    //       <a href="#" className={styles.navItem}>
    //         FAQ
    //       </a>
    //     </nav>

    //     <div>
    //       {!isAuthenticated ? (
    //         <>
    //           <button
    //             className={styles.authButton}
    //             onClick={() => router.push("/login")}
    //           >
    //             تسجيل الدخول
    //           </button>
    //           <button
    //             className={styles.authButton}
    //             onClick={() => router.push("/register")}
    //           >
    //             إنشاء حساب
    //           </button>
    //         </>
    //       ) : (
    //         <>
    //           <span className={styles.userName}>{user?.username}</span>
    //           <button
    //             className={styles.logoutButton}
    //             onClick={handleLogout}
    //             disabled={loading}
    //           >
    //             {loading ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
    //           </button>
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </header>
  );
};

export default Header;
