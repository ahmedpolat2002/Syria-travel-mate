"use client";

import Link from "next/link";
import styles from "./EventsTable.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

type Event = {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  status: "active" | "finished" | "cancelled";
  created_at: string;
  provinceName: string;
};

export default function EventsTable({ events }: { events: Event[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
  const showImage = windowWidth > 400;
  const showDates = windowWidth > 768;
  const showLocation = windowWidth > 992;
  const showCreatedDate = windowWidth > 1100;

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const toastId = toast.loading("جارٍ حذف الفعالية...");

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "فشل الحذف");

      toast.success("تم حذف الفعالية بنجاح", { id: toastId });
      router.refresh();
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
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
          <h2 style={{ color: "var(--color-light--2)" }}>الفعاليات</h2>
          <Link href="/admin/events/new" className={styles.addButton}>
            + إضافة جديد
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.first} style={{ borderLeft: "none" }}>
                العنوان
              </th>
              {showDescription && <th>الوصف</th>}
              {showProvince && <th>المحافظة</th>}
              {showImage && <th>الصورة</th>}
              {showDates && <th>تاريخ البداية</th>}
              {showDates && <th>تاريخ النهاية</th>}
              {showLocation && <th>الموقع</th>}
              <th>الحالة</th>
              {showCreatedDate && <th>تاريخ الإنشاء</th>}
              <th className={styles.last}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr className={styles.scalable} key={event.id}>
                  <td style={{ borderLeft: "none" }}>{event.title}</td>
                  {showDescription && (
                    <td>
                      {truncateWords(
                        event.description,
                        windowWidth < 768 ? 3 : 5
                      )}
                    </td>
                  )}
                  {showProvince && <td>{event.provinceName}</td>}
                  {showImage && (
                    <td>
                      <img
                        src={event.image}
                        alt={event.title}
                        className={styles.image}
                        style={{
                          width: windowWidth < 576 ? "40px" : "50px",
                          height: windowWidth < 576 ? "40px" : "50px",
                        }}
                      />
                    </td>
                  )}
                  {showDates && <td>{event.startDate}</td>}
                  {showDates && <td>{event.endDate}</td>}
                  {showLocation && (
                    <td>
                      {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                    </td>
                  )}
                  <td className={styles[event.status]}>
                    {getStatusText(event.status)}
                  </td>
                  {showCreatedDate && <td>{event.created_at.split("T")[0]}</td>}
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        router.push(`/admin/events/${event.id}/edit`)
                      }
                      style={{
                        fontSize: windowWidth < 576 ? "0.9rem" : "1rem",
                      }}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId === event.id}
                    >
                      {deletingId === event.id ? (
                        <>
                          <span className={styles.spinner}></span>{" "}
                          {windowWidth > 576 ? "جاري الحذف..." : ""}
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
                  colSpan={windowWidth < 576 ? 4 : windowWidth < 768 ? 6 : 10}
                  style={{ textAlign: "center", borderLeft: "none" }}
                >
                  لا توجد فعاليات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusText(status: "active" | "finished" | "cancelled") {
  switch (status) {
    case "active":
      return "نشطة";
    case "finished":
      return "منتهية";
    case "cancelled":
      return "ملغاة";
  }
}
