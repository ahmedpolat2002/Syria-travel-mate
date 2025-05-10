import EventForm from "@/components/EventForm/EventForm";
import React from "react";

async function getEvents(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/events/${id}`
  );
  return res.json();
}

function getProvinces() {
  return fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/provinces`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch provinces");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching provinces:", error);
      return [];
    });
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await getEvents(id);

  const provinces = await getProvinces();

  if (!event || !provinces) {
    return <p>Loading...</p>;
  }

  return <EventForm event={event} provinces={provinces} />;
}
