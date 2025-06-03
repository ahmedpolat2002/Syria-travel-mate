"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import styles from "./PlaceTypesTable.module.css";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

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
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 style={{ color: "var(--color-light--2)" }}>أنواع الأماكن</h2>
          <Link href="/admin/places-types/new" className={styles.addButton}>
            + إضافة نوع جديد
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.first} style={{ borderLeft: "none" }}>
                الاسم
              </th>
              <th className={styles.last}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {placeTypes.length > 0 ? (
              placeTypes.map((type) => (
                <tr className={styles.scalable} key={type.id}>
                  <td style={{ borderLeft: "none" }}>{type.name}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        router.push(`/admin/places-types/${type.id}/edit`)
                      }
                      style={{
                        fontSize: windowWidth < 576 ? "0.9rem" : "1rem",
                      }}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(type.id)}
                      disabled={loading}
                      style={{
                        fontSize: windowWidth < 576 ? "0.9rem" : "1rem",
                      }}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", borderLeft: "none" }}
                >
                  لا توجد أنواع متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
