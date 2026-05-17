import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateAvatar, logout, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handlePaste = (e) => {
      if (!isEditing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          handleFileUpload(file);
          break;
        }
      }
    };

    if (isOpen && isEditing) {
      document.addEventListener('paste', handlePaste);
    }
    return () => document.removeEventListener('paste', handlePaste);
  }, [isOpen, isEditing]);

  if (!isOpen || !user) return null;

  const handleFileUpload = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Файл занадто великий (макс. 5МБ)');
      return;
    }
    setError(null);
    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      try {
        await updateAvatar(base64Image);
        setIsEditing(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setError('Помилка читання файлу');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        setError('Будь ласка, завантажте зображення');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Невідомо';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const defaultAvatar = 'https://ui-avatars.com/api/?name=' + user.username + '&background=random';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img 
              src={user.avatar_url || defaultAvatar} 
              alt="Profile Avatar" 
              className="profile-avatar-large" 
            />
            <button className="edit-avatar-btn" onClick={() => setIsEditing(!isEditing)} title="Змінити фото">
              ✎
            </button>
          </div>
          <h2>{user.username}</h2>
          <span className="profile-role">{isAdmin ? 'Адміністратор' : 'Користувач'}</span>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Акаунт створено:</span>
            <span className="detail-value">{formatDate(user.created_at)}</span>
          </div>
        </div>

        {isEditing && (
          <div 
            className="edit-avatar-dropzone" 
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            {uploading ? (
              <p>Завантаження...</p>
            ) : (
              <>
                <p>Клікніть щоб обрати файл,</p>
                <p>перетягніть сюди, або <strong>вставте (Ctrl+V)</strong></p>
              </>
            )}
            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        <div className="profile-actions">
          <button 
            onClick={() => {
              logout();
              onClose();
            }} 
            className="auth-btn logout-btn full-width"
          >
            Вийти з акаунта
          </button>
        </div>
      </div>
    </div>
  );
}
