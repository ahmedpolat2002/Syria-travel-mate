// app/dashboard/types/page.tsx
import PlaceTypesTable from "@/components/PlaceTypesTable/PlaceTypesTable";
import { getAllPlaceTypes } from "@/lib/data/placeTypes";

export default async function PlaceTypesPage() {
  const placeTypes = getAllPlaceTypes();

  return (
    <div>
      <PlaceTypesTable placeTypes={placeTypes} />
    </div>
  );
}
