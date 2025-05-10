import PlaceTypeForm from "@/components/PlaceTypeForm/PlaceTypeForm";

async function getPlaceType(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/types/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("فشل تحميل بيانات النوع");
  }

  return res.json();
}

export default async function EditPlaceTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const placeType = await getPlaceType(id);

  return (
    <div>
      <PlaceTypeForm placeType={placeType} />
    </div>
  );
}
