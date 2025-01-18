import React, { useState, useRef, useEffect } from 'react';
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
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [forbidTransition, setForbidTransition] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  
  const SWIPE_THRESHOLD = 50;
  const SCROLL_THRESHOLD = 50;

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
      changeQuestion(e.deltaY > 0 ? 'next' : 'prev');
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!touchStartY.current || !touchStartX.current) return;

      const deltaY = touchStartY.current - e.touches[0].clientY;
      const deltaX = touchStartX.current - e.touches[0].clientX;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) >= SWIPE_THRESHOLD) {
        changeQuestion(deltaY > 0 ? 'next' : 'prev');
        touchStartY.current = null;
        touchStartX.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      touchStartX.current = null;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [questions, currentIndex, isTransitioning]);

  const changeQuestion = (direction) => {
    if (isTransitioning) return;
    
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    setIsTransitioning(true);
    setSlideDirection(direction === 'next' ? 'sliding-up' : 'sliding-down');
    
    setTimeout(() => {
      setSlideDirection(null);
      setIsTransitioning(false);
      setCurrentIndex(newIndex);
      setIsAnswered(false);
      setSelectedAnswer(null);
    }, 300);
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentIndex]: {answer}
    }));
  };
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  if (isLoading) {
    return (
      <div className="questions-container">
        <LoadingSpinner message="Loading questions..." />
      </div>
    );
  }

  return (
    <div 
      className={'questions-container'}
      ref={containerRef}
    >
      {questions.length > 0 && (
        <>
          <div className={`question-wrapper current-${slideDirection ? `${slideDirection}` : 'static'}`}>
            <QuestionCard
              question={questions[currentIndex]}
              isActive={true}
              isAnswered={isAnswered || answeredQuestions[currentIndex]?.answer}
              selectedAnswer={selectedAnswer || answeredQuestions[currentIndex]?.answer}
              onAnswerSelect={handleAnswerSelect}
            />
          </div>

          {currentIndex < questions.length - 1 && (
            <div className={`question-wrapper next-${slideDirection ? `${slideDirection}` : 'static'}`}>
              <QuestionCard
                question={questions[currentIndex + 1]}
                isActive={false}
                isAnswered={false}
                selectedAnswer={null}
                onAnswerSelect={() => {}}
              />
            </div>
          )}

          {currentIndex > 0 && (
            <div className={`question-wrapper prev-${slideDirection ? `${slideDirection}` : 'static'}`}>
              <QuestionCard
                question={questions[currentIndex - 1]}
                isActive={false}
                isAnswered={false}
                selectedAnswer={null}
                onAnswerSelect={() => {}}
              />
            </div>
          )}

          <ActionButtons 
            buttonsList={['upload', 'explain', 'bookmark', 'discuss']}
            setQuestions={(newQuestions) => {
              setQuestions(newQuestions);
              setCurrentIndex(0);
              setIsAnswered(false);
              setSelectedAnswer(null);
              setAnsweredQuestions({}); // Clear answered questions
              setIsLoading(false);
            }} 
            setIsLoading={setIsLoading}
          />
          <ProgressBar 
            current={currentIndex + 1} 
            total={questions.length} 
          />
        </>
      )}
    </div>
  );
};

export default Questions;