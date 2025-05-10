// app/dashboard/places/page.tsx
import PlacesTable from "@/components/PlacesTable/PlacesTable";
import { getAllPlaces } from "@/lib/data/places";

export default async function PlacesPage() {
  const places = getAllPlaces();

  return (
    <div>
      <PlacesTable places={places} />
    </div>
  );
}
