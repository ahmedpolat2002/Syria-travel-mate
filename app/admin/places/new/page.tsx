import PlaceForm from "@/components/PlacesForm/PlacesForm";

async function getData() {
  const [typesRes, provincesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces`),
  ]);

  if (!typesRes.ok || !provincesRes.ok) {
    throw new Error("Failed to fetch types or provinces");
  }

  const types = await typesRes.json();
  const provinces = await provincesRes.json();

  return { types, provinces };
}

export default async function AddPlacePage() {
  const { types, provinces } = await getData();

  return (
    <div>
      <PlaceForm types={types} provinces={provinces} />
    </div>
  );
}
