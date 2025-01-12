import React from 'react';
import { FaLightbulb, FaBookmark, FaComments, FaUpload } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import './ActionButtons.css';

const ActionButtons = ({ setQuestions, setIsLoading }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.questions);
        setQuestions(JSON.parse(data.questions));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Upload error:', error.message);
      alert('Upload failed');
      setIsLoading(false);
    }
  };


  return (
    <div className="action-buttons">
      <div className="action-button upload-button">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          accept=".txt"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="action-button">
          <FaUpload />
          <span>Upload</span>
        </label>
      </div>
      <button className="action-button">
        <FaLightbulb />
        <span>Explain</span>
      </button>
      <button className="action-button">
        <FaBookmark />
        <span>Bookmark</span>
      </button>
      <button className="action-button">
        <FaComments />
        <span>Discuss</span>
      </button>
    </div>
  );
};

export default ActionButtons;