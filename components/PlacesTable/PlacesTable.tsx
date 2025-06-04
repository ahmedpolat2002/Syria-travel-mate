"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./PlacesTable.module.css";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
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
  const showProvince = windowWidth > 576;
  const showType = windowWidth > 768;
  const showSafetyStatus = windowWidth > 480;
  const showCoordinates = windowWidth > 992;
  const showCreatedDate = windowWidth > 1100;

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
  function truncateWords(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  function truncateDecimalNumber(num: number, digits: number): number {
    return parseFloat(num.toFixed(digits));
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 style={{ color: "var(--color-light--2)" }}>الأماكن</h2>
          <Link href="/admin/places/new" className={styles.addButton}>
            + إضافة جديد
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.first} style={{ borderLeft: "none" }}>
                الاسم
              </th>
              {showDescription && <th>الوصف</th>}
              {showProvince && <th>المحافظة</th>}
              {showType && <th>النوع</th>}
              {showSafetyStatus && <th>حالة الأمان</th>}
              <th>الصورة</th>
              {showCoordinates && <th>خط العرض</th>}
              {showCoordinates && <th>خط الطول</th>}
              {showCreatedDate && <th>تاريخ الإنشاء</th>}
              <th className={styles.last}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {places.length > 0 ? (
              places.map((place) => (
                <tr key={place.id} className={styles.scalable}>
                  <td style={{ borderLeft: "none" }}>{place.name}</td>
                  {showDescription && (
                    <td>
                      {truncateWords(
                        place.description,
                        windowWidth < 768 ? 3 : 5
                      )}
                    </td>
                  )}
                  {showProvince && <td>{place.provinceName}</td>}
                  {showType && <td>{place.typeName}</td>}
                  {showSafetyStatus && (
                    <td className={styles[place.safetyStatus]}>
                      {getSafetyStatusText(place.safetyStatus)}
                    </td>
                  )}
                  <td>
                    <Image
                      width={800}
                      height={400}
                      src={place.image}
                      alt={place.name}
                      className={styles.image}
                    />
                  </td>
                  {showCoordinates && (
                    <td>{truncateDecimalNumber(place.latitude, 4)}</td>
                  )}
                  {showCoordinates && (
                    <td>{truncateDecimalNumber(place.longitude, 4)}</td>
                  )}
                  {showCreatedDate && <td>{place.created_at.split("T")[0]}</td>}
                  <td style={{ height: "100%" }}>
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        router.push(`/admin/places/${place.id}/edit`)
                      }
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(place.id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  style={{ textAlign: "center", borderLeft: "none" }}
                >
                  لا توجد أماكن متاحة
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
