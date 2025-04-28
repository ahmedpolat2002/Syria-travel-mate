"use client";

import React, { useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";
import styles from "./EventSection.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sectionname from "../SectionName/SectionName";

const events = [
  {
    title: "Visit Azores",
    images: ["/images/card1.jpg", "/images/card2.jpg", "/images/card3.jpg"],
    isHotOffer: true,
  },
  {
    title: "Live Concert",
    images: ["/images/card1.jpg", "/images/card2.jpg", "/images/card3.jpg"],
    isHotOffer: true,
  },
  {
    title: "Old City",
    images: ["/images/card1.jpg", "/images/card2.jpg", "/images/card3.jpg"],
    isHotOffer: true,
  },
];

const EventSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % events.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + events.length) % events.length);
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      next();
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  return (
    <div>
      <Sectionname title="Event Section" />
      <section className={styles.slider}>
        <button className={styles.nav} onClick={prev}>
          <FaChevronLeft />
        </button>

        <div className={styles.sliderWrapper}>
          <div
            className={styles.sliderInner}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {events.map((event, index) => (
              <div className={styles.slide} key={index}>
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>

        <button className={styles.nav} onClick={next}>
          <FaChevronRight />
        </button>
      </section>
    </div>
  );
};

export default EventSection;
