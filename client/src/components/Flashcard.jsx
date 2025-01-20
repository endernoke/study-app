import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = ({ question, isActive, isFlipped, onFlip }) => {
  const handleClick = () => {
    if (!isActive) return;
    onFlip();
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''} ${!isActive ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          {question.description}
        </div>
        <div className="flashcard-back">
          {question.answer}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;