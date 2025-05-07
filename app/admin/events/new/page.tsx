import EventForm from "@/components/EventForm/EventForm";

export default async function page() {
  const provinces = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces`
  );

  if (!provinces.ok) {
    throw new Error("Failed to fetch provinces");
  }
  const provincesData = await provinces.json();

  return (
    <div>
      <EventForm provinces={provincesData} />
    </div>
  );
}
