import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getEventDetailsById } from "@/lib/data/events";
import EventDetails from "@/components/EventDetails/EventDetails";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const event = await getEventDetailsById(id);

  if (!event) {
    return (
      <>
        <Header />
        <div className="pageContainer">
          <p>الفعالية غير موجودة</p>
        </div>
        <Footer />
      </>
    );
  }

  const eventData = {
    ...event,
    id: String(event.id),
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  };

  return (
    <>
      <Header />
      <div className={"pageContainer"}>
        <EventDetails event={eventData} />
      </div>
      <Footer />
    </>
  );
};

export default EventDetailsPage;
