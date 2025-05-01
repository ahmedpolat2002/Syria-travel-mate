"use client";

import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  id: number;
  role: string;
  iat: number;
  exp: number;
}

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // التحقق من التوكن عند تحميل الصفحة
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setUser(data.user);
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
      setUser(null);
      setLoading(false);
      router.push("/login");
    } else {
      console.error("فشل تسجيل الخروج ❌");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <FaSearch className={styles.logoIcon} />
        <span className={styles.logoText}>TravelMate</span>
      </div>

      <div style={{ display: "flex", gap: "70px", alignItems: "center" }}>
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

        <div>
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
              <span className={styles.userName}>{user?.username}</span>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
