import React from 'react';
import { FaHome, FaQuestion } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: FaHome, label: 'Home' },
    { id: 'questions', icon: FaQuestion, label: 'Questions' },
  ];

  return (
    <nav className="sidebar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="sidebar-icon" />
          <span className="sidebar-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;