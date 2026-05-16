import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ════════════════════════════════════════════════════════════════

// POST /api/login — authenticate user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.prepare(
    'SELECT id, username, role FROM users WHERE username = ? AND password = ?'
  ).get(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user });
});

// POST /api/register — create a new user account
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3 || password.length < 4) {
    return res.status(400).json({ error: 'Username must be 3+ chars, password 4+ chars' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Це ім\'я вже зайнято' });
  }

  const result = db.prepare(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
  ).run(username, password, 'user');

  const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ user });
});

// GET /api/me — get current user info (simple check)
app.get('/api/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({ user });
});

// ════════════════════════════════════════════════════════════════
// EVENTS ENDPOINTS
// ════════════════════════════════════════════════════════════════

// GET /api/events — list all events (with optional search & pagination)
app.get('/api/events', (req, res) => {
  const { search, page = 1, limit = 6 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let countQuery = 'SELECT COUNT(*) as total FROM events';
  let dataQuery = 'SELECT * FROM events';
  const params = [];

  if (search) {
    const filter = ' WHERE title LIKE ? OR description LIKE ?';
    const searchParam = `%${search}%`;
    countQuery += filter;
    dataQuery += filter;
    params.push(searchParam, searchParam);
  }

  dataQuery += ' ORDER BY date ASC LIMIT ? OFFSET ?';

  const total = db.prepare(countQuery).get(...params).total;
  const events = db.prepare(dataQuery).all(...params, parseInt(limit), offset);

  res.json({
    events,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  });
});

// GET /api/events/:id — get single event
app.get('/api/events/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ event });
});

// POST /api/events — create event (admin only)
app.post('/api/events', (req, res) => {
  const userId = req.headers['x-user-id'];
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { title, description, date, image_url } = req.body;
  if (!title || !description || !date) {
    return res.status(400).json({ error: 'Title, description, and date are required' });
  }

  const result = db.prepare(
    'INSERT INTO events (title, description, date, image_url) VALUES (?, ?, ?, ?)'
  ).run(title, description, date, image_url || null);

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ event });
});

// PUT /api/events/:id — update event (admin only)
app.put('/api/events/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { title, description, date, image_url } = req.body;
  db.prepare(
    'UPDATE events SET title = ?, description = ?, date = ?, image_url = ? WHERE id = ?'
  ).run(
    title || existing.title,
    description || existing.description,
    date || existing.date,
    image_url !== undefined ? image_url : existing.image_url,
    req.params.id
  );

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json({ event });
});

// DELETE /api/events/:id — delete event (admin only)
app.delete('/api/events/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ message: 'Event deleted' });
});

// ════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
