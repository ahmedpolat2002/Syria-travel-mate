"use client";

import Link from "next/link";
import styles from "./ProvincesTable.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const toastId = toast.loading("جارٍ حذف المحافظة...");

    try {
      const res = await fetch(`/api/provinces/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الحذف");
      }

      toast.success("تم حذف المحافظة بنجاح", { id: toastId });
      router.refresh();
    } catch {
      toast.error("لا يمكنك حذف المحافظة لانها تحتوي على اماكن", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>المحافظات</h2>
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
                    disabled={deletingId === province.id} // ❌ قفل الزر أثناء الحذف
                  >
                    {deletingId === province.id ? (
                      <>
                        <span className={styles.spinner}></span> جاري الحذف...
                      </>
                    ) : (
                      "حذف"
                    )}
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
