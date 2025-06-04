// components/ProvinceCard.tsx
import React from "react";
import styles from "./ProvinceCard.module.css";
import Image from "next/image";

type Province = {
  id: number;
  name: string;
  description: string;
  safetyStatus: "safe" | "warning" | "danger";
  image: string;
};

const ProvinceCard: React.FC<{ province: Province }> = ({ province }) => {
  const getStatusColor = () => {
    switch (province.safetyStatus) {
      case "safe":
        return styles.safe;
      case "warning":
        return styles.warning;
      case "danger":
        return styles.danger;
    }
  };

  return (
    <div className={styles.card}>
      <Image
        width={800}
        height={400}
        src={province.image}
        alt={province.name}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{province.name}</h3>
        <p>
          {province.description.slice(0, 50)}
          {province.description.length > 50 ? "..." : ""}
        </p>
        <span className={`${styles.status} ${getStatusColor()}`}>
          {province.safetyStatus === "safe"
            ? "آمن"
            : province.safetyStatus === "warning"
            ? "تحذير"
            : "خطر"}
        </span>
      </div>
    </div>
  );
};

export default ProvinceCard;
