"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import {
  FiHome,
  FiMapPin,
  FiMap,
  FiList,
  FiCalendar,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

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

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        <FiMenu />
      </div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`${styles.menuItem} ${
              pathname === item.path ? styles.active : ""
            }`}
          >
            <Link href={item.path} className={`${styles.link}`}>
              <span className={styles.icon}>{item.icon}</span>
              {isOpen && <span className={styles.label}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
