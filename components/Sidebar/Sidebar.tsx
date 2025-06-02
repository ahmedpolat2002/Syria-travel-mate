"use client";

import styles from "./Sidebar.module.css";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiMapPin,
  FiMap,
  FiList,
  FiCalendar,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";

const menuItems = [
  { label: "الصفحة الرئيسية", icon: <FiHome />, path: "/" },
  { label: "لوحة التحكم", icon: <LuLayoutDashboard />, path: "/admin" },
  { label: "المحافظات", icon: <FiMapPin />, path: "/admin/provinces" },
  { label: "الأماكن", icon: <FiMap />, path: "/admin/places" },
  { label: "أنواع الأماكن", icon: <FiList />, path: "/admin/places-types" },
  { label: "الفعاليات", icon: <FiCalendar />, path: "/admin/events" },
  { label: "التقييمات", icon: <FiStar />, path: "/admin/reviews" },
  { label: "جدول التقييمات", icon: <FiStar />, path: "/admin/reviews/table" },
  { label: "الإعدادات", icon: <FiSettings />, path: "/admin/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.logoBox}>
          <div className={styles.menuButton}>
            <Image
              src="/icon.png"
              alt="Logo"
              width={40}
              height={40}
              style={{ marginLeft: "10px" }}
            />
          </div>
          {isOpen && (
            <div className={styles.logoText}>
              <span className={styles.brand}>TravelMate</span>
            </div>
          )}
        </div>
      </div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`${styles.menuItem} ${
              pathname === item.path ? styles.active : ""
            }`}
          >
            <Link href={item.path} className={styles.link}>
              <span className={styles.icon}>{item.icon}</span>
              {isOpen && <span className={styles.label}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
