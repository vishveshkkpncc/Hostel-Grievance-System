import { useState } from "react";
import "../styles/StarRating.css";

export default function StarRating({ rating, setRating, readOnly=false }) {
  return (
    <div className="star-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
  onClick={() => {
    if (!readOnly) setRating(star);
  }}
  style={{
    cursor: readOnly ? "default" : "pointer",
    color: star <= rating ? "gold" : "gray",
    fontSize: "24px"
  }}
>
  ★
</span>
      ))}
    </div>
  );
}