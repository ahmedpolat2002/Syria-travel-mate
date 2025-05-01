"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    setLoading(false);
    router.push("/login"); // أو "/" لو تريد العودة للصفحة الرئيسية
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: "8px 16px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
