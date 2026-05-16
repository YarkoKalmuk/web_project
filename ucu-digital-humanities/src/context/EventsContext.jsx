import { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (user) headers['x-user-id'] = user.id;
    return headers;
  }, [user]);

  const fetchEvents = useCallback(async (search = '', page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 6 });
      if (search) params.set('search', search);

      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) throw new Error('Failed to fetch events');

      const data = await res.json();
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create event');
    }
    return (await res.json()).event;
  }, [authHeaders]);

  const updateEvent = useCallback(async (id, eventData) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update event');
    }
    return (await res.json()).event;
  }, [authHeaders]);

  const deleteEvent = useCallback(async (id) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete event');
    }
  }, [authHeaders]);

  const getEvent = useCallback(async (id) => {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) throw new Error('Event not found');
    return (await res.json()).event;
  }, []);

  return (
    <EventsContext.Provider value={{
      events, pagination, loading, error,
      fetchEvents, createEvent, updateEvent, deleteEvent, getEvent
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}
