import ProvinceCard from "@/components/ProvinceCard/ProvinceCard";
import styles from "./page.module.css";
import { getProvinces } from "@/lib/data/provinces";
import { Provinces } from "@/types/provinces";
import Link from "next/link";

export default async function ProvincesPage() {
  const provinces = await getProvinces();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>المحافظات</h2>
        <Link href="/" className={styles.backButton}>
          العودة إلى الصفحة الرئيسية
          <span style={{ marginRight: "8px" }}>←</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {provinces.map((province: Provinces) => (
          <ProvinceCard key={province.id} province={province} />
        ))}
      </div>
    </div>
  );
}
