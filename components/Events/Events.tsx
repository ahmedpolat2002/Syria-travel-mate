"use client";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import styles from "./Events.module.css";
import Image from "next/image";
import ImagePlaceholder from "../common/ImagePlaceholder";

type Event = {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  provinceName: string;
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events/upcoming");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <section id="events" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>Upcoming Events</h2>
          <p>Explore the most anticipated cultural activities</p>
        </div>

        <div className={styles.eventsGrid}>
          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p>No upcoming events found.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.cardImage}>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={400}
                      height={200}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "200px",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder text={event.title} height="200px" />
                  )}
                  <div className={styles.eventDate}>
                    {formatDate(event.startDate)}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>

                  <div className={styles.eventMeta}>
                    {/* <div>
                      <FaCalendarAlt />
                      {formatDate(event.startDate)}
                    </div> */}
                    <div>
                      <FaClock />
                      {event.startDate} → {event.endDate}
                    </div>
                    <div>
                      <FaMapMarkerAlt />
                      {event.provinceName}
                    </div>
                  </div>

                  <a href={`/events/${event.id}`} className={styles.cardButton}>
                    View Details
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
