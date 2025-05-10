// app/dashboard/places/add/page.tsx
import PlaceForm from "@/components/PlacesForm/PlacesForm";
import { getPlaceTypes, getProvinces } from "@/lib/data/places";

export default async function AddPlacePage() {
  const types = getPlaceTypes();
  const provinces = getProvinces();

  return (
    <div>
      <PlaceForm types={types} provinces={provinces} />
    </div>
  );
}
