"use client";

import React from "react";
import styles from "./Loading.module.css";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ text = "", fullScreen = true }) => {
  return (
    <div className={fullScreen ? styles.loadingContainer : ""}>
      <div style={!fullScreen ? { textAlign: "center" } : {}}>
        <div className={styles.loadingSpinner}></div>
        {text && <p className={styles.loadingText}>{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
