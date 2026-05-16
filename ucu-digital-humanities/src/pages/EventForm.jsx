import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';
import './EventForm.css';

export default function EventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { createEvent, updateEvent, getEvent } = useEvents();
  const { isAdmin, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(isEdit);
  const [error, setError] = useState('');

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  // Load event data for editing
  useEffect(() => {
    if (isEdit) {
      setFetchingEvent(true);
      getEvent(id)
        .then((event) => {
          setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            image_url: event.image_url || '',
          });
        })
        .catch(() => {
          setError('Подію не знайдено');
        })
        .finally(() => setFetchingEvent(false));
    }
  }, [id, isEdit, getEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await updateEvent(id, formData);
      } else {
        await createEvent(formData);
      }
      navigate('/events');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingEvent) {
    return (
      <div className="event-form-page">
        <div className="event-form-card">
          <div className="loading">Завантаження...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-form-page">
      <div className="event-form-card">
        <h1 className="form-title">
          {isEdit ? '✏️ Редагувати подію' : '✨ Створити нову подію'}
        </h1>

        {error && <div className="form-error">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="event-title">Назва події *</label>
            <input
              type="text"
              id="event-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введіть назву події"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-description">Опис *</label>
            <textarea
              id="event-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишіть подію"
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-date">Дата *</label>
              <input
                type="date"
                id="event-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-image">URL зображення</label>
              <input
                type="url"
                id="event-image"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {formData.image_url && (
            <div className="image-preview">
              <p className="preview-label">Попередній перегляд:</p>
              <img
                src={formData.image_url}
                alt="Preview"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Збереження...' : (isEdit ? 'Зберегти зміни' : 'Створити подію')}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/events')}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
