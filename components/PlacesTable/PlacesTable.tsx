"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./PlacesTable.module.css";
import Link from "next/link";
import { toast } from "react-hot-toast";

type Place = {
  id: number;
  name: string;
  description: string;
  typeName: string;
  provinceName: string;
  image: string;
  safetyStatus: "safe" | "warning" | "danger";
  latitude: number;
  longitude: number;
  created_at: string;
};

export default function PlacesTable({ places }: { places: Place[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    setLoading(true);
    const toastId = toast.loading("جاري الحذف...");

    try {
      const res = await fetch(`/api/places/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("فشل الحذف");

      toast.success("تم حذف المكان بنجاح", { id: toastId });
      router.refresh();
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>الأماكن</h2>
        <Link href="/admin/places/new" className={styles.addButton}>
          + إضافة جديد
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الوصف</th>
            <th>المحافظة</th>
            <th>النوع</th>
            <th>حالة الأمان</th>
            <th>الصورة</th>
            <th>خط العرض</th>
            <th>خط الطول</th>
            <th>تاريخ الإنشاء</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {places.length > 0 ? (
            places.map((place) => (
              <tr key={place.id}>
                <td>{place.name}</td>
                <td>{place.description}</td>
                <td>{place.provinceName}</td>
                <td>{place.typeName}</td>
                <td className={styles[place.safetyStatus]}>
                  {getSafetyStatusText(place.safetyStatus)}
                </td>
                <td>
                  <img
                    src={place.image}
                    alt={place.name}
                    className={styles.image}
                  />
                </td>
                <td>{place.latitude}</td>
                <td>{place.longitude}</td>
                <td>{place.created_at.split("T")[0]}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() =>
                      router.push(`/admin/places/${place.id}/edit`)
                    }
                  >
                    تعديل
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(place.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} style={{ textAlign: "center" }}>
                لا توجد أماكن متاحة
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
