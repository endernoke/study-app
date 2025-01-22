import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to StudyCards AI</h1>
        <p>Generate study questions from your learning materials using AI</p>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Upload study materials (PDF, TXT, RTF, MD files up to 20MB)</li>
          <li>Generate multiple-choice questions or flashcards</li>
          <li>Customize number of questions</li>
          <li>Add context for focused question generation</li>
        </ul>
      </div>

      <div className="instructions-section">
        <h2>How to Use</h2>
        <ol>
          <li>Click on the "Questions" tab or use the navigation menu</li>
          <li>Click the "Upload" button in the bottom-right corner</li>
          <li>Choose your study material file</li>
          <li>Select question format and count</li>
          <li>Optionally add specific topics or focus areas</li>
          <li>Click "Upload" to generate questions</li>
        </ol>
      </div>

      <div className="about-section">
        <h2>About</h2>
        <p>This is a project that uses Google's Generative AI to create study questions from your materials.</p>
        <p>
          <a 
            href="https://github.com/endernoke/study-app" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;