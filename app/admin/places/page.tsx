import PlacesTable from "@/components/PlacesTable/PlacesTable";

async function getPlaces() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/places`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch places");
  }

  const data = await res.json();
  return data;
}

export default async function PlacesPage() {
  const places = await getPlaces();

  return (
    <div>
      <PlacesTable places={places} />
    </div>
  );
}
