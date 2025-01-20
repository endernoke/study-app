import React from 'react';
import Flashcard from './Flashcard';
import './QuestionCard.css';

const QuestionCard = ({ 
  question, 
  isActive, 
  isAnswered, 
  selectedAnswer,
  isFlipped,
  onAnswerSelect,
  onFlip 
}) => {
  if (question.type === 'flashcard') {
    return (
      <Flashcard 
        question={question} 
        isActive={isActive} 
        isAnswered={isAnswered} 
        isFlipped={isFlipped}
        onFlip={onFlip}
      />
    );
  }
  
  const getChoiceClassName = (choice) => {
    if (!isAnswered) return 'choice';
    
    let className = 'choice';
    if (choice === question.answer) {
      className += ' correct';
    } else if (choice === selectedAnswer) {
      className += ' incorrect';
    } else {
      className += ' disabled';
    }
    return className;
  };

  return (
    <div className={`question-card ${isActive ? 'active' : ''}`}>
      <div className="question-description">
        {question.description}
      </div>
      <div className="choices-container">
        {Object.entries(question.choices).map(([key, value]) => (
          <button
            key={key}
            className={getChoiceClassName(key)}
            onClick={() => onAnswerSelect(key)}
            disabled={isAnswered}
          >
            <span className="choice-label">{key}</span>
            <span className="choice-text">{value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;