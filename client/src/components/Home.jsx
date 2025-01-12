import React from 'react';
import './Home.css';

const Home = () => {
  const stats = {
    cardsReviewed: 150,
    timeSpent: '2.5 hours',
    streakDays: 7,
  };

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to StudyCards</h1>
        <p>Your personal flashcard study assistant</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Cards Reviewed</h3>
          <p className="stat-number">{stats.cardsReviewed}</p>
        </div>
        <div className="stat-card">
          <h3>Time Spent</h3>
          <p className="stat-number">{stats.timeSpent}</p>
        </div>
        <div className="stat-card">
          <h3>Day Streak</h3>
          <p className="stat-number">{stats.streakDays}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-button">
            Start Study Session
          </button>
          <button className="action-button">
            Create Flashcards
          </button>
          <button className="action-button">
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;