import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import EventDetails from "@/components/EventDetails/EventDetails";
import { notFound } from "next/navigation";
import { getEventDetailsById } from "@/lib/data/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<{ title: string; description: string }> {
  const { id } = await params;
  const event = await getEventDetailsById(id);

  if (!event) {
    notFound();
  }

  const start = new Date(event.startDate).toLocaleDateString("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const end = new Date(event.endDate).toLocaleDateString("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    title: `فعالية ${event.title} في ${event.provinceName}`,
    description: `تفاصيل فعالية "${event.title}" المقامة في ${event.provinceName}، من ${start} إلى ${end}. ${event.description}`,
  };
}

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
