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

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/reviews/stats");
      if (!res.ok) {
        console.error("Failed to fetch review stats");
        return;
      }
      const json = await res.json();
      setData(json.stats || []);
      setTotal(json.total || 0);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>إحصائيات المراجعات</h2>

      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <h3>عدد المراجعات حسب التقييم</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartBox}>
          <h3>النسبة المئوية لكل تقييم</h3>
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
                {data?.length > 0 &&
                  data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
