import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProjectForm.css';

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { isAdmin, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    imageUrl: '',
    direction: 'NLP та аналіз текстів',
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProject, setFetchingProject] = useState(isEdit);
  const [error, setError] = useState('');
  const [customDirection, setCustomDirection] = useState('');
  const [showCustomDirection, setShowCustomDirection] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchProject = async () => {
      if (isEdit) {
        setFetchingProject(true);
        try {
          const res = await fetch(`/api/projects/${id}`);
          if (!res.ok) {
            throw new Error('Проєкт не знайдено');
          }
          const data = await res.json();
          const project = data.project;

          if (project) {
            const isStandardDirection = 
              project.direction === 'NLP та аналіз текстів' || 
              project.direction === 'ГІС та цифрові архіви';
            
            setFormData({
              title: project.title,
              description: project.description,
              goal: project.goal || '',
              imageUrl: project.imageUrl || '',
              direction: isStandardDirection ? project.direction : 'Інше (кастомний)',
            });

            if (!isStandardDirection) {
              setCustomDirection(project.direction);
              setShowCustomDirection(true);
            }
          } else {
            setError('Проєкт не знайдено');
          }
        } catch (err) {
          setError(err.message || 'Помилка завантаження проєкту');
        } finally {
          setFetchingProject(false);
        }
      }
    };

    fetchProject();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'direction') {
      if (value === 'Інше (кастомний)') {
        setShowCustomDirection(true);
      } else {
        setShowCustomDirection(false);
        setCustomDirection('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalDirection = formData.direction === 'Інше (кастомний)' ? customDirection : formData.direction;

      if (!finalDirection || finalDirection.trim() === '') {
        throw new Error('Будь ласка, вкажіть напрямок проєкту');
      }

      const body = {
        title: formData.title,
        description: formData.description,
        goal: formData.goal,
        imageUrl: formData.imageUrl || (isEdit ? 'https://picsum.photos/seed/dh_default/400/200' : `https://picsum.photos/seed/${Date.now()}/400/200`),
        direction: finalDirection
      };

      const url = isEdit ? `/api/projects/${id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const headers = {
        'Content-Type': 'application/json'
      };
      if (user) headers['x-user-id'] = user.id;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Не вдалося зберегти проєкт');
      }

      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingProject) {
    return (
      <div className="project-form-page">
        <div className="project-form-card">
          <div className="loading">Завантаження...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-form-page">
      <div className="project-form-card">
        <h1 className="form-title">
          {isEdit ? 'Редагувати проєкт' : 'Створити новий проєкт'}
        </h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="project-title">Назва проєкту *</label>
            <input
              type="text"
              id="project-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введіть назву проєкту"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-description">Опис *</label>
            <textarea
              id="project-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишіть деталі вашого дослідження..."
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="project-goal">Мета проєкту *</label>
            <input
              type="text"
              id="project-goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Наприклад: Автоматичне розпізнавання кириличних лігатур"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="project-direction">Напрямок проєкту *</label>
              <select
                id="project-direction"
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                required
              >
                <option value="NLP та аналіз текстів">NLP та аналіз текстів</option>
                <option value="ГІС та цифрові архіви">ГІС та цифрові архіви</option>
                <option value="Інше (кастомний)">Інше (кастомний фільтр)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="project-image">URL зображення</label>
              <input
                type="url"
                id="project-image"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {showCustomDirection && (
            <div className="form-group animate-fade-in">
              <label htmlFor="custom-direction">Введіть свій напрямок *</label>
              <input
                type="text"
                id="custom-direction"
                value={customDirection}
                onChange={(e) => setCustomDirection(e.target.value)}
                placeholder="Наприклад: Оцифрування стародруків"
                required
              />
            </div>
          )}

          {formData.imageUrl && (
            <div className="image-preview">
              <p className="preview-label">Попередній перегляд:</p>
              <img
                src={formData.imageUrl}
                alt="Preview"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Збереження...' : (isEdit ? 'Зберегти зміни' : 'Створити проєкт')}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/projects')}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
