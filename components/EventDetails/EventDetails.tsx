"use client";
import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./EventDetails.module.css";
import EventStatus from "./components/EventStatus";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./components/EventMap"), { ssr: false });

interface Event {
  id: string;
  title: string;
  description: string;
  provinceId: number;
  provinceName: string;
  image: string;
  startDate: Date;
  endDate: Date;
  latitude: number;
  longitude: number;
  status?: "active" | "finished" | "cancelled";
}

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className={styles.eventDetails}>
      <div className={styles.imageContainer}>
        <img
          src={event.image}
          alt={event.title}
          className={styles.eventImage}
        />
        <div className={styles.imageOverlay}>
          <h1 className={styles.overlayTitle}>{event.title}</h1>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <div className={styles.eventMetadata}>
            <div className={styles.metaItem}>
              <FaMapMarkerAlt />
              <span>{event.provinceName}</span>
            </div>
            <div className={styles.metaItem}>
              <FaCalendarAlt />
              <span>
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </span>
            </div>
            <EventStatus status={event.status ?? "active"} />
          </div>
        </div>

        <div className={styles.description}>
          <h2>الوصف</h2>
          <p>{event.description}</p>
        </div>

        <div>
          <h3 className={styles.h3}>موقع الفعالية</h3>
          <div className={styles.mapContainer}>
            <EventMap
              latitude={event.latitude}
              longitude={event.longitude}
              title={event.title}
              provinceName={event.provinceName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
