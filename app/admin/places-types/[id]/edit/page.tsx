// app/dashboard/types/[id]/page.tsx
import PlaceTypeForm from "@/components/PlaceTypeForm/PlaceTypeForm";
import { getPlaceTypeById } from "@/lib/data/placeTypes";

export default async function EditPlaceTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const placeType = getPlaceTypeById(id);

  if (!placeType) {
    return <p>النوع غير موجود</p>;
  }

  return (
    <div>
      <PlaceTypeForm placeType={placeType} />
    </div>
  );
}
