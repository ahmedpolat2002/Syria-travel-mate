"use client";
import React from "react";

interface ImagePlaceholderProps {
  width?: string;
  height?: string;
  text?: string;
  bgColor?: string;
  textColor?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = "100%",
  height = "250px",
  text = "Image Placeholder",
  bgColor = "#e0e0e0",
  textColor = "#666",
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.9rem",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      {text}
    </div>
  );
};

export default ImagePlaceholder;
