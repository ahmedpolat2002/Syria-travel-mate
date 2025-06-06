"use client";

import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setUser(data.user);
      });
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const res = await fetch("/api/users/logout", { method: "POST" });

    if (res.ok) {
      console.log("تم تسجيل الخروج وحذف الكوكي ✅");
      setIsAuthenticated(false);
      setLoading(false);
      router.push("/login");
    } else {
      console.error("فشل تسجيل الخروج ❌");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>TravelMate</h1>
          </Link>
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
          <ul>
            {pathname === "/" ? (
              <>
                <li>
                  <Link href="#home">الرئيسية</Link>
                </li>
                <li>
                  <Link href="#destinations">الوجهات</Link>
                </li>
                <li>
                  <Link href="#events">الفعاليات</Link>
                </li>
                <li>
                  <Link href="#about">من نحن</Link>
                </li>
                <li>
                  <Link href="#contact">اتصل بنا</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/">الرئيسية</Link>
                </li>
                <li>
                  <Link href="/map">الخريطة</Link>
                </li>
                <li>
                  <Link href="/#destinations">الوجهات</Link>
                </li>
                <li>
                  <Link href="/#events">الفعاليات</Link>
                </li>
              </>
            )}

            {user?.role === "admin" && (
              <li>
                <Link href="/admin">لوحة التحكم</Link>
              </li>
            )}
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
              <button
                className={styles.authButton}
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "...جارٍ تسجيل الخروج" : "تسجيل الخروج"}
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
