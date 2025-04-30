import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for managing provinces, places, and reviews.",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          margin: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
}
