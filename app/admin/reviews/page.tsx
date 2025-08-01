"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import styles from "./ReviewsStats.module.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#b554ff"];

export default function ReviewsStatsPage() {
  const [data, setData] = useState<{ rating: number; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState<number | null>(null);
  const [topPlaces, setTopPlaces] = useState<{ name: string; count: number }[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/reviews/stats");
      if (!res.ok) {
        console.error("Failed to fetch review stats");
        return;
      }
      const json = await res.json();
      console.log("Review stats:", json);

      setData(json.distribution || []);
      setTotal(json.total || 0);
      setAverage(Number(json.average) || null);
      setTopPlaces(json.topPlaces || []);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>إحصائيات المراجعات</h2>

      {average !== null && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h3
            style={{ marginBottom: "0.5rem", color: "var(--color-light--2)" }}
          >
            متوسط التقييم العام: ⭐ {average.toFixed(2)}
          </h3>
        </div>
      )}

      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <h3>عدد المراجعات حسب التقييم</h3>
          <p className={styles.description}>
            هذا المخطط يعرض عدد المراجعات التي تم إدخالها لكل تقييم من 1 إلى 5
          </p>
          {data.length === 0 ? (
            <p>لا توجد بيانات لعرضها</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="rating" />
                <YAxis allowDecimals={false} tickMargin={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#00c46a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={styles.chartBox}>
          <h3>النسبة المئوية لكل تقييم</h3>
          <p className={styles.description}>
            يوضح هذا الرسم النسبة المئوية لكل تقييم من إجمالي عدد المراجعات
          </p>
          {data.length === 0 ? (
            <p>لا توجد بيانات لعرضها</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ rating, count }) =>
                    `${rating}★ (${((count / total) * 100).toFixed(1)}%)`
                  }
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {topPlaces.length > 0 && (
        <div
          className={`${styles.topPlaces} ${styles.chartBox}`}
          style={{ direction: "rtl" }}
        >
          <h3>أكثر ٣ أماكن حصولًا على مراجعات</h3>
          <ul className={styles.topPlacesList}>
            {topPlaces.slice(0, 3).map((place, idx) => (
              <li key={idx} className={styles.placeItem}>
                <span className={styles.rank}>{idx + 1}</span>
                <div className={styles.placeContent}>
                  <strong className={styles.placeName}>{place.name}</strong>
                  <span className={styles.reviewCount}>
                    {place.count} مراجعة
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
