"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ProvinceForm.module.css";
import { toast } from "react-hot-toast";

type Province = {
  id?: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  safetyStatus: "safe" | "warning" | "danger";
};

type FormData = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  safetyStatus: "safe" | "warning" | "danger";
  image: FileList;
};

export default function ProvinceForm({ province }: { province?: Province }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: province?.name || "",
      description: province?.description || "",
      latitude: province?.latitude || 0,
      longitude: province?.longitude || 0,
      safetyStatus: province?.safetyStatus || "safe",
    },
  });

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("جاري الإرسال...");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      formData.append("safetyStatus", data.safetyStatus);

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const method = province ? "PUT" : "POST";
      const url =
        province && province.id
          ? `/api/provinces/${province.id}`
          : "/api/provinces";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء الإرسال");
      }

      toast.success(
        province ? "تم تحديث المحافظة بنجاح" : "تم إضافة المحافظة بنجاح",
        { id: toastId }
      );

      router.push("/admin/provinces");
      router.refresh();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>{province ? "تعديل المحافظة" : "إضافة محافظة جديدة"}</h2>

      <div className={styles.grid}>
        <div>
          <label>الاسم</label>
          <input
            type="text"
            {...register("name", { required: "الاسم مطلوب" })}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>

        <div>
          <label>الوصف</label>
          <input
            type="text"
            {...register("description", { required: "الوصف مطلوب" })}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description.message}</span>
          )}
        </div>

        <div>
          <label>خط العرض</label>
          <input
            type="number"
            step="any"
            {...register("latitude", { required: "خط العرض مطلوب" })}
          />
          {errors.latitude && (
            <span className={styles.error}>{errors.latitude.message}</span>
          )}
        </div>

        <div>
          <label>خط الطول</label>
          <input
            type="number"
            step="any"
            {...register("longitude", { required: "خط الطول مطلوب" })}
          />
          {errors.longitude && (
            <span className={styles.error}>{errors.longitude.message}</span>
          )}
        </div>

        <div>
          <label>حالة الأمان</label>
          <select
            {...register("safetyStatus", { required: "حالة الأمان مطلوبة" })}
          >
            <option value="safe">آمن</option>
            <option value="warning">تحذير</option>
            <option value="danger">خطر</option>
          </select>
          {errors.safetyStatus && (
            <span className={styles.error}>{errors.safetyStatus.message}</span>
          )}
        </div>

        <div>
          <label>الصورة</label>
          <input type="file" accept="image/*" {...register("image")} />
          {province && !province.image && (
            <span className={styles.error}>يجب اختيار صورة</span>
          )}
        </div>
      </div>

      {province && province.image && (
        <div className={styles.oldImage}>
          <p>الصورة الحالية:</p>
          <img src={province.image} alt={province.name} />
        </div>
      )}

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "جاري المعالجة..." : province ? "تحديث" : "إضافة"}
      </button>
    </form>
  );
}
