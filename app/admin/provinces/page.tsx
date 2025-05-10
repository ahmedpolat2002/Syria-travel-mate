// app/dashboard/provinces/page.tsx
import ProvincesTable from "@/components/ProvincesTable/ProvincesTable";
import { getProvinces } from "@/lib/data/provinces";

export default async function ProvincesPage() {
  const provinces = await getProvinces();

  if (!provinces) {
    return <p>Loading provinces...</p>;
  }

  return (
    <div>
      <ProvincesTable provinces={provinces} />
    </div>
  );
}
