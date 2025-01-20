import React, { useState } from 'react';
import { FaLightbulb, FaBookmark, FaComments, FaUpload } from 'react-icons/fa';
import UploadModal from './UploadModal';
import './ActionButtons.css';
import { ACCEPTED_FILE_TYPES } from './UploadModal';

const ActionButtons = ({ buttonsList, setQuestions, setIsLoading }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUpload = async ({ file, format, questionCount, description }) => {
    if (!file) return;

    setIsLoading(true);
    setIsUploadModalOpen(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestedFormat', format);
    formData.append('requestedQuestionCount', questionCount);
    formData.append('description', description);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(JSON.parse(data.questions));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error('Upload error:', error.message);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="action-buttons">
        {buttonsList.includes('upload') && (
          <button className="action-button" onClick={() => setIsUploadModalOpen(true)}>
            <FaUpload />
            <span>Upload</span>
          </button>
        )}
        {buttonsList.includes('explain') && (
          <button className="action-button">
            <FaLightbulb />
            <span>Explain</span>
          </button>
        )}
        {buttonsList.includes('bookmark') && (
          <button className="action-button">
            <FaBookmark />
            <span>Bookmark</span>
          </button>
        )}
        {buttonsList.includes('discuss') && (
          <button className="action-button">
            <FaComments />
            <span>Discuss</span>
          </button>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default ActionButtons;