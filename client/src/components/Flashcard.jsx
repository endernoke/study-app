import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={handleClick}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <h2>{data.question}</h2>
          <span className="category-tag">{data.category}</span>
        </div>
        <div className="flashcard-back">
          <p>{data.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;