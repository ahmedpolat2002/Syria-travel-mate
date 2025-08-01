"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./EventForm.module.css";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(
  () => import("../LocationPickerMap/LocationPickerMap"),
  { ssr: false }
);

type Event = {
  id?: number;
  title: string;
  description: string;
  provinceId: number;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  status: "active" | "finished" | "cancelled";
  image: string;
};

type FormData = {
  title: string;
  description: string;
  provinceId: number;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  status: "active" | "finished" | "cancelled";
  image: FileList;
};

type Option = {
  id: number;
  name: string;
};

export default function EventForm({
  event,
  provinces,
}: {
  event?: Event;
  provinces: Option[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(
    event?.latitude ?? null
  );
  const [longitude, setLongitude] = useState<number | null>(
    event?.longitude ?? null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      provinceId: event?.provinceId || undefined,
      startDate: event?.startDate || "",
      endDate: event?.endDate || "",
      latitude: event?.latitude || 0,
      longitude: event?.longitude || 0,
      status: event?.status || "active",
    },
  });

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("جاري الإرسال...");
    try {
      setLoading(true);
      const formData = new FormData();
      for (const key in data) {
        if (key !== "image") {
          formData.append(key, String(data[key as keyof FormData]));
        }
      }
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const method = event ? "PUT" : "POST";
      const url = event?.id ? `/api/events/${event.id}` : "/api/events";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("فشل في حفظ البيانات");

      toast.success(event ? "تم تحديث الفعالية" : "تمت إضافة الفعالية", {
        id: toastId,
      });
      router.push("/admin/events");
      router.refresh();
    } catch {
      toast.error("حدث خطأ", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2>{event ? "تعديل الفعالية" : "إضافة فعالية جديدة"}</h2>

          <div className={styles.grid}>
            <div>
              <label>عنوان الفعالية</label>
              <input
                type="text"
                className={styles.custominput}
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className={styles.error}>العنوان مطلوب</span>
              )}
            </div>

            <div>
              <label>الوصف</label>
              <input
                type="text"
                className={styles.custominput}
                {...register("description", { required: true })}
              />
              {errors.description && (
                <span className={styles.error}>الوصف مطلوب</span>
              )}
            </div>

            <div>
              <label>المحافظة</label>
              <select
                className={styles.customselect}
                {...register("provinceId", { required: "المحافظة مطلوبة" })}
              >
                <option value="">اختر المحافظة</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
              {errors.provinceId && (
                <span className={styles.error}>
                  {errors.provinceId.message}
                </span>
              )}
            </div>

            <div>
              <label>تاريخ البداية</label>
              <input
                type="date"
                className={styles.custominput}
                {...register("startDate", { required: true })}
              />
              {errors.startDate && (
                <span className={styles.error}>تاريخ البداية مطلوب</span>
              )}
            </div>

            <div>
              <label>تاريخ النهاية</label>
              <input
                type="date"
                className={styles.custominput}
                {...register("endDate", { required: true })}
              />
              {errors.endDate && (
                <span className={styles.error}>تاريخ النهاية مطلوب</span>
              )}
            </div>

            <div>
              <label>خط العرض</label>
              <input
                type="number"
                step="any"
                className={styles.custominput}
                {...register("latitude", { required: true })}
              />
              {errors.latitude && (
                <span className={styles.error}>خط العرض مطلوب</span>
              )}
            </div>

            <div>
              <label>خط الطول</label>
              <input
                type="number"
                step="any"
                className={styles.custominput}
                {...register("longitude", { required: true })}
              />
              {errors.longitude && (
                <span className={styles.error}>خط الطول مطلوب</span>
              )}
            </div>

            <div>
              <label>الحالة</label>
              <select
                className={styles.customselect}
                {...register("status", { required: true })}
              >
                <option value="active">نشطة</option>
                <option value="finished">منتهية</option>
                <option value="cancelled">ملغاة</option>
              </select>
              {errors.status && (
                <span className={styles.error}>الحالة مطلوبة</span>
              )}
            </div>

            <div>
              <label>الصورة</label>
              <input
                type="file"
                accept="image/*"
                className={styles.custominput}
                {...register("image", {
                  validate: (files) =>
                    files.length > 0 || event?.image ? true : "الصورة مطلوبة",
                })}
              />
              {errors.image && (
                <span className={styles.error}>{errors.image.message}</span>
              )}
            </div>
          </div>

          {event?.image && (
            <div className={styles.oldImage}>
              <p>الصورة الحالية:</p>
              <img src={event.image} alt={event.title} />
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : event ? "تحديث" : "إضافة"}
          </button>
        </form>

        <LocationPickerMap
          onSelect={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
            setValue("latitude", lat); // تحديث القيمة داخل الفورم
            setValue("longitude", lng);
          }}
          initialPosition={
            latitude && longitude ? [latitude, longitude] : undefined
          }
        />
      </div>
    </>
  );
}
