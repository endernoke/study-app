import React from 'react';
import Home from './Home';
import Questions from './Questions';
import Settings from './Settings';
import './MainContent.css';

const MainContent = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'questions':
        return <Questions />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return <div className="main-content-container">{renderContent()}</div>;
};

export default MainContent;