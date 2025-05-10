import PlaceForm from "@/components/PlacesForm/PlacesForm";

async function getData(id: string) {
  const [placeRes, typesRes, provincesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/places/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces`),
  ]);

  if (!placeRes.ok || !typesRes.ok || !provincesRes.ok) {
    throw new Error("Failed to fetch place, types, or provinces");
  }

  const place = await placeRes.json();
  const types = await typesRes.json();
  const provinces = await provincesRes.json();

  return { place, types, provinces };
}

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { place, types, provinces } = await getData(id);

  return (
    <div>
      <PlaceForm place={place} types={types} provinces={provinces} />
    </div>
  );
}
