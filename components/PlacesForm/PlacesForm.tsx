"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./PlacesForm.module.css";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
const LocationPickerMap = dynamic(
  () => import("../LocationPickerMap/LocationPickerMap"),
  { ssr: false }
);

type Place = {
  id?: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  safetyStatus: "safe" | "warning" | "danger";
  typeId: number;
  provinceId: number;
};

type FormData = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  safetyStatus: "safe" | "warning" | "danger";
  image: FileList;
  typeId: number;
  provinceId: number;
};

type Option = {
  id: number;
  name: string;
};

export default function PlaceForm({
  place,
  types,
  provinces,
}: {
  place?: Place;
  types: Option[];
  provinces: Option[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(
    place?.latitude ?? null
  );
  const [longitude, setLongitude] = useState<number | null>(
    place?.longitude ?? null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: place?.name || "",
      description: place?.description || "",
      latitude: place?.latitude || 0,
      longitude: place?.longitude || 0,
      safetyStatus: place?.safetyStatus || "safe",
      typeId: place?.typeId || undefined,
      provinceId: place?.provinceId || undefined,
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
      formData.append("typeId", data.typeId.toString());
      formData.append("provinceId", data.provinceId.toString());

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const method = place ? "PUT" : "POST";
      const url = place?.id ? `/api/places/${place.id}` : "/api/places";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء الإرسال");
      }

      toast.success(place ? "تم تحديث المكان بنجاح" : "تم إضافة المكان بنجاح", {
        id: toastId,
      });

      router.push("/admin/places");
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
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>{place ? "تعديل مكان" : "إضافة مكان جديد"}</h2>

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
            <textarea
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
              <span className={styles.error}>
                {errors.safetyStatus.message}
              </span>
            )}
          </div>

          <div>
            <label>النوع</label>
            <select {...register("typeId", { required: "النوع مطلوب" })}>
              <option value="">اختر النوع</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.typeId && (
              <span className={styles.error}>{errors.typeId.message}</span>
            )}
          </div>

          <div>
            <label>المحافظة</label>
            <select
              {...register("provinceId", { required: "المحافظة مطلوبة" })}
            >
              <option value="">اختر المحافظة</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {errors.provinceId && (
              <span className={styles.error}>{errors.provinceId.message}</span>
            )}
          </div>

          <div>
            <label>الصورة</label>
            <input type="file" accept="image/*" {...register("image")} />
          </div>
        </div>

        {place?.image && (
          <div className={styles.oldImage}>
            <p>الصورة الحالية:</p>
            <img src={place.image} alt={place.name} />
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "جاري المعالجة..." : place ? "تحديث" : "إضافة"}
        </button>
      </form>

      <LocationPickerMap
        onSelect={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);

          setValue("latitude", lat);
          setValue("longitude", lng);
        }}
        initialPosition={
          latitude && longitude ? [latitude, longitude] : undefined
        }
      />
    </>
  );
}
