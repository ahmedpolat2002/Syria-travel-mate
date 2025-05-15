import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  totalStars = 5,
  onChange,
  readOnly = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (selectedRating: number) => {
    if (readOnly) return;
    setRating(selectedRating);
    if (onChange) {
      onChange(selectedRating);
    }
  };

  return (
    <div className={styles.starRating}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={styles.star}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            {starValue <= (hover || rating) ? (
              <FaStar className={styles.filled} />
            ) : (
              <FaRegStar />
            )}
          </span>
        );
      })}
      <span className={styles.ratingText}>
        {rating.toFixed(1)} / {totalStars.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
