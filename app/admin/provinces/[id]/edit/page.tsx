import ProvinceForm from "@/components/ProvincesForm/ProvinceForm";

async function getProvince(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces/${id}`
  );
  return res.json();
}

export default async function EditProvincePage({
  params,
}: {
  params: { id: string };
}) {
  const province = await getProvince(params.id);

  if (!province) {
    return <p>Loading province...</p>;
  }

  return <ProvinceForm province={province} />;
}
