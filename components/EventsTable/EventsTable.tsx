"use client";

import Link from "next/link";
import styles from "./EventsTable.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>الفعاليات</h2>
        <Link href="/admin/events/new" className={styles.addButton}>
          + إضافة جديد
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>العنوان</th>
            <th>الوصف</th>
            <th>المحافظة</th>
            <th>الصورة</th>
            <th>تاريخ البداية</th>
            <th>تاريخ النهاية</th>
            <th>الموقع</th>
            <th>الحالة</th>
            <th>تاريخ الإنشاء</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{event.provinceName}</td>
                <td>
                  <img
                    src={event.image}
                    alt={event.title}
                    className={styles.image}
                  />
                </td>
                <td>{event.startDate}</td>
                <td>{event.endDate}</td>
                <td>
                  {event.latitude}, {event.longitude}
                </td>
                <td className={styles[event.status]}>
                  {getStatusText(event.status)}
                </td>
                <td>{event.created_at.split("T")[0]}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() =>
                      router.push(`/admin/events/${event.id}/edit`)
                    }
                  >
                    تعديل
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                  >
                    {deletingId === event.id ? (
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
              <td colSpan={10} style={{ textAlign: "center" }}>
                لا توجد فعاليات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
