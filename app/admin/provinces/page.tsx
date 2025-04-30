import ProvincesTable from "@/components/ProvincesTable/ProvincesTable";
import React from "react";

export default async function page() {
  const provinces = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces`,
    {
      cache: "no-store", // مهم لو تبغى البيانات تتحدث مباشرة وما تتخزن بالكاش
    }
  ).then((res) => res.json());

  if (!provinces) {
    return <p>Loading provinces...</p>;
  }

  return (
    <div>
      <ProvincesTable provinces={provinces} />
    </div>
  );
}
