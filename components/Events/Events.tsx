"use client";
import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import styles from "./Events.module.css";
import ImagePlaceholder from "../common/ImagePlaceholder";

// In a real application, these would come from an API or CMS
const events = [
  {
    id: 1,
    title: "Damascus International Fair",
    titleAr: "معرض دمشق الدولي",
    description:
      "The largest trade fair in Syria showcasing local and international products and services.",
    descriptionAr:
      "أكبر معرض تجاري في سوريا يعرض المنتجات والخدمات المحلية والدولية.",
    date: "2025-08-15",
    time: "10:00 AM - 8:00 PM",
    location: "Damascus Fairgrounds",
    locationAr: "أرض المعارض في دمشق",
    image: "/src/assets/damascus-fair.jpg",
  },
  {
    id: 2,
    title: "Aleppo Cultural Festival",
    titleAr: "مهرجان حلب الثقافي",
    description:
      "A celebration of Syrian culture with music, dance, art exhibitions, and traditional food.",
    descriptionAr:
      "احتفال بالثقافة السورية مع الموسيقى والرقص والمعارض الفنية والطعام التقليدي.",
    date: "2025-09-05",
    time: "4:00 PM - 11:00 PM",
    location: "Aleppo Citadel",
    locationAr: "قلعة حلب",
    image: "/src/assets/aleppo-festival.jpg",
  },
  {
    id: 3,
    title: "Latakia Summer Festival",
    titleAr: "مهرجان اللاذقية الصيفي",
    description:
      "Beach activities, water sports, concerts, and entertainment on the beautiful Mediterranean coast.",
    descriptionAr:
      "أنشطة شاطئية ورياضات مائية وحفلات موسيقية وترفيه على ساحل البحر المتوسط الجميل.",
    date: "2025-07-20",
    time: "11:00 AM - 10:00 PM",
    location: "Latakia Corniche",
    locationAr: "كورنيش اللاذقية",
    image: "/src/assets/latakia-festival.jpg",
  },
];

const Events: React.FC = () => {
  // Format date for display
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
          <p>Explore the rich history, culture, and natural beauty of Syria</p>
        </div>

        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.cardImage}>
                <ImagePlaceholder text={event.title} height="200px" />
                <div className={styles.eventDate}>{formatDate(event.date)}</div>
              </div>
              <div className={styles.cardContent}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>

                <div className={styles.eventMeta}>
                  <div>
                    <FaCalendarAlt />
                    {formatDate(event.date)}
                  </div>
                  <div>
                    <FaClock />
                    {event.time}
                  </div>
                </div>

                <div className={styles.eventMeta}>
                  <div>
                    <FaMapMarkerAlt />
                    {event.location}
                  </div>
                </div>

                <a href="#" className={styles.cardButton}>
                  Register Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
