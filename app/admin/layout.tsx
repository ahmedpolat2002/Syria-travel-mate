import React, { Suspense } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";

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
        // gap: 10,
      }}
    >
      <div
        style={{
          // paddingRight: 10,
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Suspense>{children}</Suspense>
      </div>
      <Sidebar />
    </div>
  );
}
