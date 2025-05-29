// components/EventDetails/components/EventStatus.tsx
"use client";
import React from "react";
import { FaPlayCircle, FaCheckCircle, FaBan } from "react-icons/fa";
import styles from "./EventStatus.module.css";

interface EventStatusProps {
  status: "active" | "finished" | "cancelled";
}

const EventStatus: React.FC<EventStatusProps> = ({ status }) => {
  let icon;
  let label;
  let statusClass;

  switch (status) {
    case "active":
      icon = <FaPlayCircle className={styles.icon} />;
      label = "نشطة";
      statusClass = styles.active;
      break;
    case "finished":
      icon = <FaCheckCircle className={styles.icon} />;
      label = "منتهية";
      statusClass = styles.finished;
      break;
    case "cancelled":
      icon = <FaBan className={styles.icon} />;
      label = "ملغاة";
      statusClass = styles.cancelled;
      break;
  }

  return (
    <div className={`${styles.eventStatus} ${statusClass}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default EventStatus;
