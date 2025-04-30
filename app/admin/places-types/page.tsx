import PlaceTypesTable from "@/components/PlaceTypesTable/PlaceTypesTable";

async function getPlaceTypes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("فشل تحميل أنواع الأماكن");
  }

  return res.json();
}

export default async function PlaceTypesPage() {
  const placeTypes = await getPlaceTypes();

  return (
    <div>
      <PlaceTypesTable placeTypes={placeTypes} />
    </div>
  );
}
