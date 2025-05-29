"use client";
import React from "react";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import styles from "./SafetyStatus.module.css";

interface SafetyStatusProps {
  safetyStatus: "safe" | "warning" | "danger";
}

const SafetyStatus: React.FC<SafetyStatusProps> = ({ safetyStatus }) => {
  let icon;
  let label;
  let statusClass;

  switch (safetyStatus) {
    case "safe":
      icon = <FaShieldAlt className={styles.icon} />;
      label = "آمن";
      statusClass = styles.safe;
      break;
    case "warning":
      icon = <FaExclamationTriangle className={styles.icon} />;
      label = "توخَّ الحذر";
      statusClass = styles.warning;
      break;
    case "danger":
      icon = <FaTimesCircle className={styles.icon} />;
      label = "خطير";
      statusClass = styles.danger;
      break;
  }

  return (
    <div className={`${styles.safetyStatus} ${statusClass}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default SafetyStatus;
