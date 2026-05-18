import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Card from '../components/Card/Card';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';
import './Events.css';

export default function Events() {
  const { events, pagination, loading, error, fetchEvents, deleteEvent } = useEvents();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedTag, setSelectedTag] = useState('Усі');
  const [eventTags, setEventTags] = useState(() => {
    const saved = localStorage.getItem('event_custom_tags');
    return saved ? JSON.parse(saved) : ['Усі', 'Травень', 'Червень', 'Липень'];
  });
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchEvents(searchQuery, 1);
  }, [searchQuery, fetchEvents]);

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const handleAddEventTagInline = (e) => {
    if (e) e.preventDefault();
    if (newTagName && newTagName.trim() !== '') {
      const trimmed = newTagName.trim();
      if (eventTags.includes(trimmed)) {
        alert('Такий фільтр вже існує!');
        return;
      }
      const updated = [...eventTags, trimmed];
      setEventTags(updated);
      localStorage.setItem('event_custom_tags', JSON.stringify(updated));
      setNewTagName('');
      setShowAddInput(false);
    }
  };

  const handleRemoveEventTag = (e, tagToRemove) => {
    e.stopPropagation();
    if (tagToRemove === 'Усі') return;
    const updated = eventTags.filter(t => t !== tagToRemove);
    setEventTags(updated);
    localStorage.setItem('event_custom_tags', JSON.stringify(updated));
    if (selectedTag === tagToRemove) {
      setSelectedTag('Усі');
    }
  };

  const filteredEvents = events.filter(event => {
    if (selectedTag === 'Усі') return true;

    const monthMap = {
      'січень': '-01-', 'лютий': '-02-', 'березень': '-03-', 'квітень': '-04-',
      'травень': '-05-', 'червень': '-06-', 'липень': '-07-', 'серпень': '-08-',
      'вересень': '-09-', 'жовтень': '-10-', 'листопад': '-11-', 'грудень': '-12-'
    };

    const lowerTag = selectedTag.toLowerCase();

    if (monthMap[lowerTag]) {
      return event.date.includes(monthMap[lowerTag]);
    }

    return (
      event.title.toLowerCase().includes(lowerTag) ||
      event.description.toLowerCase().includes(lowerTag) ||
      event.date.includes(selectedTag)
    );
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  };

  const handlePageChange = (newPage) => {
    fetchEvents(searchQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setDeleteConfirm(null);
      fetchEvents(searchQuery, pagination.page);
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="section-title">Майбутні події</h1>
        <p className="events-subtitle">
          Долучайтеся до наших заходів, воркшопів та лекцій.
        </p>

        {isAdmin && (
          <div className="admin-action-bar">
            <Link to="/events/create" className="btn-create">
              + Створити подію
            </Link>
          </div>
        )}
      </div>

      <div className="premium-search-wrapper glassmorphism">
        <div className="search-bar-container">
          <span className="search-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input
            type="text"
            placeholder="Пошук майбутніх подій, лекцій та воркшопів..."
            value={searchInput}
            onChange={handleSearch}
            className="premium-search-input"
            id="events-search"
          />
          {searchInput && (
            <button onClick={clearSearch} className="clear-search-btn" title="Очистити пошук">×</button>
          )}
        </div>

        {/* Категорійні швидкі теги для дат/місяців */}
        <div className="quick-tags-container">
          <span className="tags-label">Швидкий фільтр:</span>
          <div className="quick-tags-list">
            {eventTags.map((tag) => {
              const isDefault = tag === 'Усі';
              return (
                <button
                  key={tag}
                  className={`quick-tag-btn ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                  {!isDefault && (
                    <span 
                      className="remove-tag-x" 
                      onClick={(e) => handleRemoveEventTag(e, tag)}
                      title="Видалити фільтр"
                    >
                      ×
                    </span>
                  )}
                </button>
              );
            })}
            {showAddInput ? (
              <form 
                onSubmit={handleAddEventTagInline} 
                className="inline-add-form animate-fade-in"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setShowAddInput(false);
                    setNewTagName('');
                  }
                }}
              >
                <input
                  type="text"
                  className="inline-add-input"
                  placeholder="Новий фільтр..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowAddInput(false);
                      setNewTagName('');
                    }
                  }}
                />
                <button type="submit" className="inline-add-submit" title="Зберегти">✓</button>
                <button type="button" className="inline-add-cancel" onClick={() => { setShowAddInput(false); setNewTagName(''); }} title="Скасувати">×</button>
              </form>
            ) : (
              <button 
                className="add-tag-btn" 
                onClick={() => setShowAddInput(true)} 
                title="Додати власний фільтр"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="loading">Завантаження подій...</div>}

      {error && <div className="error">Помилка завантаження: {error}</div>}

      {!loading && !error && (
        <>
          {filteredEvents.length === 0 ? (
            <div className="events-empty">
              <p>Нічого не знайдено {searchQuery && `за запитом "${searchQuery}"`} {selectedTag !== 'Усі' && `у розділі "${selectedTag}"`}</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card-wrapper">
                  <Card
                    title={event.title}
                    description={event.description}
                    imageUrl={event.image_url}
                    extraInfo={(
                      <div className="event-meta-details">
                        <div className="event-meta-item event-date">
                          <span className="event-meta-icon" title="Дата проведення">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          </span>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="event-meta-item event-location">
                          <span className="event-meta-icon" title="Місце проведення">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          </span>
                          <span>Де: {event.location || 'Онлайн / Уточнюється'}</span>
                        </div>
                      </div>
                    )}
                    actions={isAdmin ? (
                      <>
                        <Link to={`/events/edit/${event.id}`} className="btn-edit">
                          Редагувати
                        </Link>
                        {deleteConfirm === event.id ? (
                          <>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(event.id)}
                            >
                              Підтвердити
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Скасувати
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteConfirm(event.id)}
                          >
                            Видалити
                          </button>
                        )}
                      </>
                    ) : null}
                  />
                </div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                ← Назад
              </button>

              <div className="pagination-pages">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-page ${page === pagination.page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Далі →
              </button>
            </div>
          )}

          <div className="pagination-info">
            Показано {filteredEvents.length} з {pagination.total} подій
          </div>
        </>
      )}

      <div className="past-events-gallery-section">
        <h2 className="section-title" style={{ marginTop: '2rem' }}>Фото з минулих подій</h2>
        <div className="photo-gallery">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <div key={num} className="gallery-item" onClick={() => setSelectedPhoto(num)}>
              <img src={`/event_photos/${num}.jpg`} alt={`Past event ${num}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && createPortal(
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={() => setSelectedPhoto(null)} aria-label="Close">
              &times;
            </button>
            <img src={`/event_photos/${selectedPhoto}.jpg`} alt={`Enlarged event ${selectedPhoto}`} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}