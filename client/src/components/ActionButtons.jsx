import React from 'react';
import { FaLightbulb, FaBookmark, FaComments, FaUpload } from 'react-icons/fa';
import './ActionButtons.css';

const ActionButtons = ({ setQuestions }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(JSON.parse(data.questions));
        alert('File uploaded successfully!');
      } else {
        alert('Upload failed.');
        const errorData = await response.json(); // Parse the JSON body
        throw new Error(errorData.error); // Throw the error message
      }
    } catch (error) {
      console.error('Upload error:', error.message);
      alert('Upload failed');
    }
  };

  return (
    <div className="action-buttons">
      <div className="action-button upload-button">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          accept=".docx,.doc,.pptx,.pdf,.txt"
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
