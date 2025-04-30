"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  FiMapPin,
  FiMap,
  FiList,
  FiStar,
  FiHeart,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    provincesCount: 0,
    placesCount: 0,
    placeTypesCount: 0,
    reviewsCount: 0,
    likesCount: 0,
    eventsCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    }
    fetchStats();
  }, []);

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>لوحة التحكم</h1>

      <div className={styles.welcome}>
        <h2>مرحباً بك في لوحة التحكم</h2>
        <p>
          من هنا يمكنك إدارة جميع بيانات التطبيق، بما في ذلك المحافظات، الأماكن،
          المراجعات، الإعجابات، الفعاليات، والمزيد.
        </p>
      </div>

      <div className={styles.cards}>
        <Card
          icon={<FiMapPin />}
          title="المحافظات"
          value={stats.provincesCount}
          color="#1c2b1c"
        />
        <Card
          icon={<FiMap />}
          title="الأماكن"
          value={stats.placesCount}
          color="#4caf50"
        />
        <Card
          icon={<FiList />}
          title="أنواع الأماكن"
          value={stats.placeTypesCount}
          color="#9c27b0"
        />
        <Card
          icon={<FiStar />}
          title="المراجعات"
          value={stats.reviewsCount}
          color="rgb(242, 108, 5)"
        />
        <Card
          icon={<FiHeart />}
          title="الإعجابات"
          value={stats.likesCount}
          color="#e91e63"
        />
        <Card
          icon={<FiCalendar />}
          title="الفعاليات"
          value={stats.eventsCount}
          color="#3f51b5"
        />
        <Card
          icon={<FiUsers />}
          title="المستخدمون"
          value={stats.usersCount}
          color="#ff9800"
        />
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className={styles.info}>
        <p className={styles.label}>{title}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}
