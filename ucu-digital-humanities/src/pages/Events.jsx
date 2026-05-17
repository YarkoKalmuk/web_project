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

  useEffect(() => {
    fetchEvents(searchQuery, 1);
  }, [searchQuery, fetchEvents]);

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

        <div className="events-toolbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Пошук подій..."
              value={searchInput}
              onChange={handleSearch}
              className="search-input"
              id="events-search"
            />
          </div>

          {isAdmin && (
            <Link to="/events/create" className="btn-create">
              + Створити подію
            </Link>
          )}
        </div>
      </div>

      {loading && <div className="loading">Завантаження подій...</div>}

      {error && <div className="error">Помилка завантаження: {error}</div>}

      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div className="events-empty">
              <p>Нічого не знайдено {searchQuery && `за запитом "${searchQuery}"`}</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card-wrapper">
                  <Card
                    title={event.title}
                    description={event.description}
                    imageUrl={event.image_url}
                    extraInfo={`📅 ${formatDate(event.date)}`}
                    actions={isAdmin ? (
                      <>
                        <Link to={`/events/edit/${event.id}`} className="btn-edit">
                          ✏️ Редагувати
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
                            🗑️ Видалити
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
            Показано {events.length} з {pagination.total} подій
          </div>
        </>
      )}

      <div className="past-events-gallery-section">
        <h2 className="section-title" style={{ marginTop: '2rem' }}>Фото з минулих подій</h2>
        <div className="photo-gallery">
          {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
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