import React, { useState } from "react";
import "./FlipCard.css";

function FlipCard({ frontContent, backContent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-card" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card ${isFlipped ? "flipped" : ""}`}>
        <div className="card-face card-front">{frontContent}</div>
        <div className="card-face card-back">{backContent}</div>
      </div>
    </div>
  );
}

export default FlipCard;
