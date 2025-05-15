"use client";
import React from "react";
import { FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import styles from "./SafetyStatus.module.css";

interface SafetyStatusProps {
  isSafe: boolean;
}

const SafetyStatus: React.FC<SafetyStatusProps> = ({ isSafe }) => {
  return (
    <div
      className={`${styles.safetyStatus} ${
        isSafe ? styles.safe : styles.unsafe
      }`}
    >
      {isSafe ? (
        <>
          <FaShieldAlt className={styles.icon} />
          <span>Safe</span>
        </>
      ) : (
        <>
          <FaExclamationTriangle className={styles.icon} />
          <span>Unsafe</span>
        </>
      )}
    </div>
  );
};

export default SafetyStatus;
