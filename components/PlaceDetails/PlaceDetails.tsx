"use client";
import React from "react";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import styles from "./PlaceDetails.module.css";

// Import sub-components
import StarRating from "./components/StarRating";
import LikeButton from "./components/LikeButton";
import Comments from "./components/Comments";
import SafetyStatus from "./components/SafetyStatus";
import Image from "next/image";

// Define the Place interface
interface Place {
  id: string;
  name: string;
  governorate: string;
  type: string;
  description: string;
  safetyStatus: "safe" | "warning" | "danger";
  rating: number;
  likes: number;
  imageUrl: string;
  comments: {
    id: string;
    username: string;
    text: string;
    rating: number;
    date: Date;
  }[];
}

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => {
  return (
    <div className={styles.placeDetails}>
      <div className={styles.imageContainer}>
        <Image
          width={800}
          height={400}
          src={place.imageUrl}
          alt={place.name}
          className={styles.placeImage}
        />
        <div className={styles.imageOverlay}>
          <h1 className={styles.overlayTitle}>{place.name}</h1>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.header}>
          {/* Place name moved to overlay */}
          <div className={styles.placeMetadata}>
            <div className={styles.metaItem}>
              <FaMapMarkerAlt />
              <span>{place.governorate}</span>
            </div>
            <div className={styles.metaItem}>
              <FaBuilding />
              <span>{place.type}</span>
            </div>
            <SafetyStatus safetyStatus={place.safetyStatus} />
          </div>
        </div>

        <div className={styles.ratingSection}>
          <StarRating initialRating={place.rating} readOnly />
          <LikeButton placeId={place.id} />
        </div>

        <div className={styles.description}>
          <h2>الوصف:</h2>
          <p>{place.description}</p>
        </div>

        <Comments
          initialComments={place.comments}
          // onAddComment={handleAddComment}
          placeId={place.id}
        />
      </div>
    </div>
  );
};

export default PlaceDetails;
