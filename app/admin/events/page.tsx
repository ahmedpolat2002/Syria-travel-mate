import EventsTable from "@/components/EventsTable/EventsTable";
import { getAllEvents } from "@/lib/data/events";

export default async function EventsPage() {
  const events = getAllEvents();

  return (
    <div>
      <EventsTable events={events} />
    </div>
  );
}
