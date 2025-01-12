import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    cardFlipAnimation: true,
    autoPlayCards: false,
    cardFlipDuration: 5,
    notificationsEnabled: true,
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSliderChange = (e) => {
    setSettings(prev => ({
      ...prev,
      cardFlipDuration: parseInt(e.target.value)
    }));
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Display</h2>
        <div className="setting-item">
          <span>Dark Mode</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <span>Card Flip Animation</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.cardFlipAnimation}
              onChange={() => handleToggle('cardFlipAnimation')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Study Preferences</h2>
        <div className="setting-item">
          <span>Auto-Play Cards</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.autoPlayCards}
              onChange={() => handleToggle('autoPlayCards')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <span>Card Flip Duration (seconds)</span>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.cardFlipDuration}
            onChange={handleSliderChange}
            className="slider"
          />
          <span className="slider-value">{settings.cardFlipDuration}s</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="setting-item">
          <span>Enable Notifications</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={() => handleToggle('notificationsEnabled')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Data Management</h2>
        <button className="settings-button">Export Study Data</button>
        <button className="settings-button danger">Clear All Data</button>
      </div>
    </div>
  );
};

export default Settings;