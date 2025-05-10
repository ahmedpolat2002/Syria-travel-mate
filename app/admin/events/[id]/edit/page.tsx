import EventForm from "@/components/EventForm/EventForm";
import { getEventById, getProvinces } from "@/lib/data/events";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = getEventById(id);
  const provinces = getProvinces();

  if (!event || !provinces) {
    return <p>Loading...</p>;
  }

  return <EventForm event={event} provinces={provinces} />;
}
