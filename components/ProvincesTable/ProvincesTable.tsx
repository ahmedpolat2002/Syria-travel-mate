"use client";

import Link from "next/link";
import styles from "./ProvincesTable.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Province = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  safetyStatus: "safe" | "warning" | "danger";
  created_at: string;
};

export default function ProvincesTable({
  provinces,
}: {
  provinces: Province[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    setLoading(true);
    await fetch(`/api/provinces/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  if (loading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>المقاطعات</h2>
        <Link href="/admin/provinces/new" className={styles.addButton}>
          + إضافة جديد
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th
              style={{
                width: "200px",
              }}
            >
              الوصف
            </th>
            <th>حالة الأمان</th>
            <th>الصورة</th>
            <th>خط العرض</th>
            <th>خط الطول</th>
            <th>تاريخ الإنشاء</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {provinces.length > 0 ? (
            provinces.map((province) => (
              <tr key={province.id}>
                <td>{province.name}</td>
                <td>{province.description}</td>
                <td className={styles[province.safetyStatus]}>
                  {getSafetyStatusText(province.safetyStatus)}
                </td>
                <td>
                  <img
                    src={province.image}
                    alt={province.name}
                    className={styles.image}
                  />
                </td>
                <td>{province.latitude}</td>
                <td>{province.longitude}</td>
                <td>{province.created_at.split("T")[0]}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() =>
                      router.push(`/admin/provinces/${province.id}/edit`)
                    }
                  >
                    تعديل
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(province.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                لا توجد محافظات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function getSafetyStatusText(status: "safe" | "warning" | "danger") {
  switch (status) {
    case "safe":
      return "آمن";
    case "warning":
      return "تحذير";
    case "danger":
      return "خطر";
  }
}
