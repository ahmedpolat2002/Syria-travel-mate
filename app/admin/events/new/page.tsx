import EventForm from "@/components/EventForm/EventForm";
import { getProvinces } from "@/lib/data/provinces";

export default function page() {
  // const provinces = await fetch(
  //   `${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces`
  // );

  const provinces = getProvinces();

  if (!provinces) {
    throw new Error("Failed to fetch provinces");
  }

  return (
    <div>
      <EventForm provinces={provinces} />
    </div>
  );
}
