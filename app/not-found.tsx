"use client";

import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "var(--color-dark--2)",
        padding: "3rem",
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          color: "var(--color-brand--1)",
        }}
      >
        الصفحة غير موجودة
      </h1>
      <p style={{ marginBottom: "2rem", color: "var(--color-light--2)" }}>
        عذرًا، لا يمكننا العثور على الصفحة التي تبحث عنها.
      </p>
      <div>
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "fit-content",
            backgroundColor: "var(--color-brand--2)",
            color: "var(--color-light--2)",
            padding: "0.75rem 1.5rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            gap: "0.5rem",
            boxShadow: "0 2px 8px rgba(255, 255, 255, 0.18)",
            transition: "background 0.2s",
            fontFamily: "var(--font-ibm-arabic)",
          }}
        >
          <FaArrowRightLong />
          العودة إلى الصفحة السابقة
        </button>
      </div>
    </div>
  );
}
