import React, { useState, useRef, useEffect } from 'react';
import './UploadModal.css';

export const ACCEPTED_FILE_TYPES = ['.pdf', '.txt', '.rtf', '.md'];
const MAX_FILE_SIZE = 19.9 * 1024 * 1024; // 19.9MB in bytes
const MAX_DESCRIPTION_LENGTH = 200;

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [format, setFormat] = useState('multiple-choice');
  const [questionCount, setQuestionCount] = useState(10);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Reset all form values when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormat('multiple-choice');
      setQuestionCount(10);
      setDescription('');
      setFile(null);
      setUploadError('');
      setIsDragging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)
        || e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    const handleScroll = (e) => {
      // Allow scroll events to propagate
      e.stopPropagation();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      modalRef.current?.addEventListener('wheel', handleScroll);
      modalRef.current?.addEventListener('touchmove', handleScroll);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      modalRef.current?.removeEventListener('wheel', handleScroll);
      modalRef.current?.removeEventListener('touchmove', handleScroll);
    };
  }, [isOpen, onClose]);

  const handleQuestionCountChange = (value) => {
    const count = Math.min(Math.max(parseInt(value) || 1, 1), 30);
    setQuestionCount(count);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onSelectFile(droppedFile);
  };

  const validateFile = (selectedFile) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError('File size must be less than 19.9 MB');
      return false;
    }
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(fileExtension)) {
      setUploadError('Please upload only PDF, TXT, RTF, or MD files');
      return false;
    }
    return true;
  };

  const onSelectFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      return;
    }
    setUploadError('');
    setFile(selectedFile);
  };
  
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
    setDescription(newDescription);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload({ file, format, questionCount, description });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Upload Content</h2>
        <form onSubmit={handleSubmit}>
          <div className="format-section">
          <h3>Question Format</h3>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="format"
                  value="multiple-choice"
                  checked={format === 'multiple-choice'}
                  onChange={(e) => setFormat(e.target.value)}
                />
                <span>Multiple Choice</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="format"
                  value="flashcard"
                  checked={format === 'flashcard'}
                  onChange={(e) => setFormat(e.target.value)}
                />
                <span>Flashcard</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="format"
                  value="both"
                  checked={format === 'both'}
                  onChange={(e) => setFormat(e.target.value)}
                />
                <span>Both</span>
              </label>
            </div>
          </div>

          <div className="question-count-section">
            <h3>Number of Questions</h3>
            <div className="question-count-controls">
              <input
                type="range"
                min="1"
                max="30"
                value={questionCount}
                onChange={(e) => handleQuestionCountChange(e.target.value)}
                className="question-slider"
              />
              <input
                type="number"
                min="1"
                max="30"
                value={questionCount}
                onChange={(e) => handleQuestionCountChange(e.target.value)}
                className="question-input"
              />
            </div>
          </div>

          <div className="description-section">
            <label htmlFor="description">Description (optional)</label>
            <div className="textarea-container">
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="e.g. Focus on topic 3.1"
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <span className="character-count">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => onSelectFile(e.target.files[0])}
              accept=".txt,.pdf,.md,.rtf"
              style={{ display: 'none' }}
            />
            {file ? (
              <p>Selected file: {file.name}</p>
            ) : (
              <>
                <p>Drag and drop a file here</p>
                <p>or</p>
                <button type="button" className="select-file-btn">
                  Select File
                </button>
              </>
            )}
          </div>

          <div className={uploadError? "error-message" : "file-types-info"}>
            {uploadError? uploadError : `Accepted file types: ${ACCEPTED_FILE_TYPES.join(', ')}`}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={!file}>
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;