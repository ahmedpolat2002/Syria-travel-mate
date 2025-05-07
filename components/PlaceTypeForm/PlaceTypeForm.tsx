"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./PlaceTypeForm.module.css";

type PlaceType = {
  id?: number;
  name: string;
};

export default function PlaceTypeForm({
  placeType,
}: {
  placeType?: PlaceType;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaceType>({
    defaultValues: {
      name: placeType?.name || "",
    },
  });

  const onSubmit = async (data: PlaceType) => {
    const toastId = toast.loading("جاري الإرسال...");

    try {
      setLoading(true);
      const method = placeType ? "PUT" : "POST";
      const url =
        placeType && placeType.id ? `/api/types/${placeType.id}` : "/api/types";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء الإرسال");
      }

      toast.success(
        placeType ? "تم تعديل النوع بنجاح" : "تم إضافة النوع بنجاح",
        { id: toastId }
      );
      router.push("/admin/places-types");
      router.refresh();
    } catch {
      toast.error("فشل في الإرسال", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>{placeType ? "تعديل النوع" : "إضافة نوع جديد"}</h2>

      <div className={styles.grid}>
        <div>
          <label>الاسم</label>
          <input
            type="text"
            {...register("name", { required: "اسم النوع مطلوب" })}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "جاري المعالجة..." : placeType ? "تحديث" : "إضافة"}
      </button>
    </form>
  );
}
