"use client";

import Link from "next/link";
import styles from "./ProvincesTable.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Provinces } from "@/types/provinces";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";

export default function ProvincesTable({
  provinces,
}: {
  provinces: Provinces[];
}) {
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

  // Determine which columns to show based on screen width
  const showDescription = windowWidth > 640;
  const showSafetyStatus = windowWidth > 480;
  const showCoordinates = windowWidth > 768;
  const showCreatedDate = windowWidth > 992;
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

  function truncateWords(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 style={{ color: "var(--color-light--2)" }}>المحافظات</h2>
          <Link href="/admin/provinces/new" className={styles.addButton}>
            + إضافة جديد
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.first} style={{ borderLeft: "none" }}>
                الاسم
              </th>
              {showDescription && <th style={{ width: "200px" }}>الوصف</th>}
              {showSafetyStatus && <th>حالة الأمان</th>}
              <th>الصورة</th>
              {showCoordinates && <th>خط العرض</th>}
              {showCoordinates && <th>خط الطول</th>}
              {showCreatedDate && <th>تاريخ الإنشاء</th>}
              <th className={styles.last}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {provinces.length > 0 ? (
              provinces.map((province) => (
                <tr key={province.id} className={styles.scalable}>
                  <td style={{ borderLeft: "none" }}>{province.name}</td>
                  {showDescription && (
                    <td>
                      {truncateWords(
                        province.description,
                        windowWidth < 768 ? 3 : 5
                      )}
                    </td>
                  )}
                  {showSafetyStatus && (
                    <td className={styles[province.safetyStatus]}>
                      {getSafetyStatusText(province.safetyStatus)}
                    </td>
                  )}
                  <td>
                    <Image
                      width={800}
                      height={400}
                      src={province.image}
                      alt={province.name}
                      className={styles.image}
                    />
                  </td>
                  {showCoordinates && <td>{province.latitude.toFixed(4)}</td>}
                  {showCoordinates && <td>{province.longitude.toFixed(4)}</td>}
                  {showCreatedDate && (
                    <td>
                      {
                        new Date(province.created_at)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                  )}
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        router.push(`/admin/provinces/${province.id}/edit`)
                      }
                    >
                      <FiEdit2 />
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
                        <RiDeleteBin6Line />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", borderLeft: "none" }}
                >
                  لا توجد محافظات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
