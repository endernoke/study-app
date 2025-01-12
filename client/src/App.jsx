import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router>
      <div className="app">
        <div className="desktop-sidebar">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="main-content">
          <MainContent activeTab={activeTab} />
        </div>
        <div className="mobile-sidebar">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </Router>
  );
}

export default App;