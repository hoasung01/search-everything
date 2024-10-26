import React, { useState, useEffect } from 'react';
import styles from './IssueModal.module.css'; // Adjust the path based on where the CSS file is located

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string) => Promise<void>;
  repoName: string;
  isSubmitting: boolean;
  error?: string;
}

const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  repoName,
  isSubmitting,
  error,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit(title, body);
    setTitle('');
    setBody('');
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.modalOpen : ''}`}
      onClick={() => onClose()}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`${styles.modalContent} ${isOpen ? styles.modalContentOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>Create New Issue - {repoName}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              className={styles.input}
              required
              autoFocus
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="body">Description</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the issue..."
              className={styles.textarea}
              rows={6}
            />
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.loadingSpinner} />
                  Creating...
                </>
              ) : (
                'Create Issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;
