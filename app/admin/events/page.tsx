import EventsTable from "@/components/EventsTable/EventsTable";

async function getEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await res.json();
  return data;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div>
      <EventsTable events={events} />
    </div>
  );
}
