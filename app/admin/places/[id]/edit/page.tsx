// app/dashboard/places/[id]/page.tsx
import PlaceForm from "@/components/PlacesForm/PlacesForm";
import { getPlaceById, getPlaceTypes, getProvinces } from "@/lib/data/places";

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const place = getPlaceById(id);
  const types = getPlaceTypes();
  const provinces = getProvinces();

  if (!place || !types || !provinces) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <PlaceForm place={place} types={types} provinces={provinces} />
    </div>
  );
}
