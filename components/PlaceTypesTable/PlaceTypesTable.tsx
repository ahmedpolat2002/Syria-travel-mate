"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./PlaceTypesTable.module.css";

type PlaceType = {
  id: number;
  name: string;
};

export default function PlaceTypesTable({
  placeTypes,
}: {
  placeTypes: PlaceType[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    const toastId = toast.loading("جاري الحذف...");
    setLoading(true);

    try {
      const res = await fetch(`/api/types/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("فشل حذف النوع");
      }

      toast.success("تم حذف النوع بنجاح", { id: toastId });
      router.refresh();
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>أنواع الأماكن</h2>
        <Link href="/admin/places-types/new" className={styles.addButton}>
          + إضافة نوع جديد
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {placeTypes.length > 0 ? (
            placeTypes.map((type) => (
              <tr key={type.id}>
                <td>{type.name}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() =>
                      router.push(`/admin/places-types/${type.id}/edit`)
                    }
                  >
                    تعديل
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(type.id)}
                    disabled={loading}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                لا توجد أنواع متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
