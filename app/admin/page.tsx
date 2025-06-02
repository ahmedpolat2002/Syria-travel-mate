"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";

interface PlacePerType {
  typeName: string;
  count: number;
}

interface PlacePerProvince {
  provinceName: string;
  count: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface PlacesStatus {
  active: number;
  deleted: number;
}

interface Stats {
  provincesCount: number;
  placesCount: number;
  placeTypesCount: number;
  reviewsCount: number;
  likesCount: number;
  eventsCount: number;
  usersCount: number;
  placesPerType: PlacePerType[];
  placesPerProvince: PlacePerProvince[];
  usersPerMonth: MonthlyData[];
  placesGrowth: MonthlyData[];
  placesStatus: PlacesStatus;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    provincesCount: 0,
    placesCount: 0,
    placeTypesCount: 0,
    reviewsCount: 0,
    likesCount: 0,
    eventsCount: 0,
    usersCount: 0,
    placesPerType: [],
    placesPerProvince: [],
    usersPerMonth: [],
    placesGrowth: [],
    placesStatus: { active: 0, deleted: 0 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("فشل تحميل الإحصائيات", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p className={styles.loading}>...جارِ تحميل لوحة التحكم</p>;
  }

  // بيانات مخطط الأعمدة (BarChart) - إجمالي البيانات
  const totalData = [
    { name: "المحافظات", value: stats.provincesCount },
    { name: "الأماكن", value: stats.placesCount },
    { name: "أنواع الأماكن", value: stats.placeTypesCount },
    { name: "المراجعات", value: stats.reviewsCount },
    { name: "الإعجابات", value: stats.likesCount },
    { name: "الفعاليات", value: stats.eventsCount },
    { name: "المستخدمون", value: stats.usersCount },
  ];

  // بيانات مخطط PieChart - الأماكن حسب النوع
  const pieData =
    stats.placesPerType?.map((item) => ({
      name: item.typeName,
      value: item.count,
    })) || [];

  // بيانات مخطط BarChart - الأماكن حسب المحافظة
  const provinceData =
    stats.placesPerProvince?.map((item) => ({
      name: item.provinceName,
      value: item.count,
    })) || [];

  // بيانات مخطط LineChart - نمو الأماكن شهريًا
  const placesGrowthData =
    stats.placesGrowth?.map((item) => ({
      month: item.month,
      عدد_الأماكن: item.count,
    })) || [];

  // بيانات مخطط LineChart - نمو المستخدمين شهريًا
  const usersGrowthData =
    stats.usersPerMonth?.map((item) => ({
      month: item.month,
      عدد_المستخدمين: item.count,
    })) || [];

  // بيانات مخطط PieChart - حالة الأماكن (نشط/محذوف)
  const placesStatusData = [
    { name: "نشط", value: stats.placesStatus?.active || 0 },
    { name: "محذوف", value: stats.placesStatus?.deleted || 0 },
  ];

  // دمج بيانات نمو الأماكن والمستخدمين شهريًا لمخطط مركب
  interface MergedMonthlyData {
    month: string;
    أماكن: number;
    مستخدمين: number;
  }

  const mergedMonthlyData: MergedMonthlyData[] = [];
  const allMonths = new Set([
    ...(stats.placesGrowth || []).map((item) => item.month),
    ...(stats.usersPerMonth || []).map((item) => item.month),
  ]);

  Array.from(allMonths)
    .sort()
    .forEach((month) => {
      const places =
        stats.placesGrowth?.find((p) => p.month === month)?.count || 0;
      const users =
        stats.usersPerMonth?.find((u) => u.month === month)?.count || 0;
      mergedMonthlyData.push({
        month,
        أماكن: places,
        مستخدمين: users,
      });
    });

  // ألوان للمخططات
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#E74C3C",
    "#3498DB",
    "#27AE60",
    "#F1C40F",
    "#8E44AD",
    "#D35400",
    "#16A085",
  ];

  const formatMonthLabel = (month: string): string => {
    if (!month) return "";
    const [year, monthNum] = month.split("-");
    const date = new Date(`${year}-${monthNum}-01`);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" }); // "May 2025"
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>لوحة التحكم - الإحصائيات</h1>

      <div className={styles.summaryStats}>
        <div className={styles.statCard}>
          <h3>المستخدمون</h3>
          <p>{stats.usersCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>الأماكن</h3>
          <p>{stats.placesCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>المراجعات</h3>
          <p>{stats.reviewsCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>الإعجابات</h3>
          <p>{stats.likesCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>الفعاليات</h3>
          <p>{stats.eventsCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>المحافظات</h3>
          <p>{stats.provincesCount}</p>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* مخطط الأعمدة - إجمالي البيانات */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>إحصائيات النظام</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={totalData}
              margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={90}
                textAnchor="end"
                height={60}
                tick={{ fill: "#fff" }}
              />
              <YAxis
                allowDecimals={false}
                // domain={[0, Math.max(...totalData.map((item) => item.value))]}
                // tickFormatter={(value) => value.toLocaleString("ar-EG")}
                tickMargin={10} // Add space between Y-axis and numbers
                tick={{ fill: "#fff" }}
              />
              <Tooltip formatter={(value) => [value, "العدد"]} />
              <Bar dataKey="value" fill="#00c46a" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* مخطط Bar - الأماكن حسب المحافظة */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>توزيع الأماكن حسب المحافظة</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={provinceData}
              layout="vertical"
              margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: "#fff" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tickMargin={80}
                tick={{ fill: "#fff" }}
              />
              <Tooltip formatter={(value) => [value, "عدد الأماكن"]} />
              <Bar dataKey="value" fill="#ffb545" radius={[0, 10, 10, 0]}>
                {provinceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* مخطط مركب - نمو الأماكن والمستخدمين شهريًا */}
        <section className={`${styles.chartSection} ${styles.fullWidth}`}>
          <h2 className={styles.chartTitle}>نمو الأماكن والمستخدمين شهريًا</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={mergedMonthlyData}
              margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={45}
                textAnchor="end"
                height={60}
                tickFormatter={formatMonthLabel}
                tick={{ fill: "#fff" }}
              />
              <YAxis
                tick={{ fill: "#fff" }}
                allowDecimals={false}
                tickMargin={10} // Add space between Y-axis and numbers
              />
              <Tooltip labelFormatter={formatMonthLabel} />
              <Legend />
              <Area
                type="monotone"
                dataKey="أماكن"
                fill="#00c46a"
                stroke="#00c46a"
              />
              <Line
                type="monotone"
                dataKey="مستخدمين"
                stroke="#ffb545"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </section>

        {/* مخطط Pie - الأماكن حسب النوع */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>توزيع الأماكن حسب النوع</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                // fill="#82ca9d"
                // stroke="#fff"
                label={(entry) => `(${entry.value})`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                labelFormatter={(name) => `نوع المكان: ${name}`}
              />
              <Legend layout="vertical" verticalAlign="bottom" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* مخطط Line - نمو الأماكن شهريًا */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>نمو الأماكن شهريًا</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={placesGrowthData}
              margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={45}
                textAnchor="end"
                height={60}
                tickFormatter={formatMonthLabel}
                tick={{ fill: "#fff" }}
              />
              <YAxis
                allowDecimals={false}
                tickMargin={10}
                tick={{ fill: "#fff" }}
              />
              <Tooltip labelFormatter={formatMonthLabel} />
              <Line
                type="monotone"
                dataKey="عدد_الأماكن"
                stroke="#ffb545"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* مخطط Line - نمو المستخدمين شهريًا */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>نمو المستخدمين شهريًا</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={usersGrowthData}
              margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={45}
                textAnchor="end"
                height={60}
                tickFormatter={formatMonthLabel}
                tick={{ fill: "#fff" }}
              />
              <YAxis
                allowDecimals={false}
                tickMargin={10}
                tick={{ fill: "#fff" }}
              />
              <Tooltip labelFormatter={formatMonthLabel} />
              <Line
                type="monotone"
                dataKey="عدد_المستخدمين"
                stroke="#00c46a"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* مخطط Pie - حالة الأماكن (نشط/محذوف) */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>حالة الأماكن</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={placesStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#82ca9d"
                label={(entry) => `(${entry.value})`}
              >
                <Cell fill="#00c46a" />
                <Cell fill="#E74C3C" />
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}
