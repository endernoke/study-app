import React, { useState, useRef, useEffect } from 'react';
//import { dummyQuestions } from './QuestionData';
import QuestionCard from './QuestionCard';
import ActionButtons from './ActionButtons';
import ProgressBar from './ProgressBar';
import LoadingSpinner from './LoadingSpinner';
import './Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  let touchStartY = useRef(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const changeQuestion = (direction) => {
    if (isTransitioning || isLoading) return;

    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < questions.length) {
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 30) return;
    changeQuestion(e.deltaY > 0 ? 1 : -1);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (touchStartY.current === null) return;

    const touchEndY = e.touches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) { // Threshold for swipe
      changeQuestion(diff > 0 ? 1 : -1);
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  return (
    <div 
      className="questions-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isLoading ? (
        <LoadingSpinner message="Loading questions..." />
      ) : (
        questions.length > 0 && (
          <>
            <div className="question-wrapper">
              <QuestionCard
                question={currentQuestion}
                isActive={true}
                isAnswered={isAnswered}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
              />
            </div>
            <ActionButtons 
              setQuestions={(newQuestions) => {
                setQuestions(newQuestions);
                setCurrentIndex(0);
                setIsAnswered(false);
                setSelectedAnswer(null);
                setIsLoading(false);
              }} 
              setIsLoading={setIsLoading}
            />
            <ProgressBar 
              current={currentIndex + 1} 
              total={questions.length} 
            />
          </>
        )
      )}
    </div>
  );
};

export default Questions;