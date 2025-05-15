"use client";
import React from "react";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import styles from "./PlaceDetails.module.css";

// Import sub-components
import StarRating from "./components/StarRating";
import LikeButton from "./components/LikeButton";
import Comments from "./components/Comments";
import SafetyStatus from "./components/SafetyStatus";

// Define the Place interface
interface Place {
  id: string;
  name: string;
  governorate: string;
  type: string;
  description: string;
  isSafe: boolean;
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
  const handleRatingChange = (newRating: number) => {
    console.log(`Rating changed to ${newRating}`);
    // Here you would typically update the rating in your backend
  };

  // const handleLikeChange = (liked: boolean) => {
  //   console.log(`Place ${liked ? "liked" : "unliked"}`);
  //   // Here you would typically update the like status in your backend
  // };

  const handleAddComment = (comment: { username: string; text: string }) => {
    console.log("New comment added:", comment);
    // Here you would typically send the new comment to your backend
  };

  return (
    <div className={styles.placeDetails}>
      <div className={styles.imageContainer}>
        <img
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
            <SafetyStatus isSafe={place.isSafe} />
          </div>
        </div>

        <div className={styles.ratingSection}>
          <StarRating
            initialRating={place.rating}
            onChange={handleRatingChange}
          />
          <LikeButton placeId={place.id} />
        </div>

        <div className={styles.description}>
          <h2>Description</h2>
          <p>{place.description}</p>
        </div>

        <Comments
          initialComments={place.comments}
          onAddComment={handleAddComment}
          placeId={place.id}
        />
      </div>
    </div>
  );
};

export default PlaceDetails;
