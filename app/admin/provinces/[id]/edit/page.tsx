// app/dashboard/provinces/[id]/page.tsx
import ProvinceForm from "@/components/ProvincesForm/ProvinceForm";
import { getProvinceById } from "@/lib/data/provinces";

export default async function EditProvincePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const province = getProvinceById(id);

  if (!province) {
    return <p>Loading province...</p>;
  }

  return <ProvinceForm province={province} />;
}
