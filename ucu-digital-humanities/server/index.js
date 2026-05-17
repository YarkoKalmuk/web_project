import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.prepare(
    'SELECT id, username, role, created_at, avatar_url FROM users WHERE username = ? AND password = ?'
  ).get(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user });
});

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
    "INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, datetime('now', 'localtime'))"
  ).run(username, password, 'user');

  const user = db.prepare('SELECT id, username, role, created_at, avatar_url FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ user });
});

app.get('/api/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = db.prepare('SELECT id, username, role, created_at, avatar_url FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({ user });
});

app.put('/api/me/avatar', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { avatar_url } = req.body;
  if (!avatar_url) {
    return res.status(400).json({ error: 'Avatar URL is required' });
  }

  db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatar_url, userId);
  const user = db.prepare('SELECT id, username, role, created_at, avatar_url FROM users WHERE id = ?').get(userId);

  res.json({ user });
});

app.get('/api/events', (req, res) => {
  const { search, page = 1, limit = 6 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let allEvents = db.prepare('SELECT * FROM events ORDER BY date ASC').all();

  if (search) {
    const s = search.toLowerCase();
    allEvents = allEvents.filter(e => {
      const d = new Date(e.date);
      const dateStrUk = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase();
      const dateStrEn = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase();
      
      return (
        e.title.toLowerCase().includes(s) ||
        e.description.toLowerCase().includes(s) ||
        e.date.includes(s) ||
        dateStrUk.includes(s) ||
        dateStrEn.includes(s)
      );
    });
  }

  const total = allEvents.length;
  const events = allEvents.slice(offset, offset + parseInt(limit));

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

app.get('/api/events/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ event });
});

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

app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const result = db.prepare(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)"
    ).run(name, email, message);

    const savedMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message to database' });
  }
});

app.get('/api/messages', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
