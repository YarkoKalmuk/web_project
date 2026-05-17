import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'db', 'database.sqlite'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const columns = db.pragma('table_info(users)');
if (columns.length > 0) {
  const hasCreatedAt = columns.some(c => c.name === 'created_at');
  if (!hasCreatedAt) {
    db.exec("ALTER TABLE users ADD COLUMN created_at TEXT");
  }
  const hasAvatarUrl = columns.some(c => c.name === 'avatar_url');
  if (!hasAvatarUrl) {
    db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT");
  }
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role     TEXT NOT NULL DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    avatar_url TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    date        TEXT NOT NULL,
    image_url   TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
  );
  insertUser.run('admin', 'admin123', 'admin');
  console.log('✅ Seeded admin user (admin / admin123)');
}

const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get();
if (eventCount.count === 0) {
  const insertEvent = db.prepare(
    'INSERT INTO events (title, description, date, image_url) VALUES (?, ?, ?, ?)'
  );

  const seedEvents = [
    {
      title: 'Міжнародна конференція з цифрової історії',
      description: 'Обговорення нових методів оцифрування та аналізу історичних даних з провідними європейськими експертами. Захід включає пленарні доповіді, майстер-класи та панельні дискусії.',
      date: '2026-09-15',
      image_url: 'https://picsum.photos/seed/event1/400/200'
    },
    {
      title: 'Воркшоп: Вступ до Python для гуманітаріїв',
      description: 'Практичне заняття з основ програмування для студентів гуманітарних спеціальностей. Учасники навчаться працювати з текстовими даними та створювати прості аналітичні скрипти.',
      date: '2026-10-22',
      image_url: 'https://picsum.photos/seed/event2/400/200'
    },
    {
      title: 'Презентація цифрового архіву самвидаву',
      description: 'Відкриття нового онлайн-архіву українського самвидаву 1960-1980-х років. Демонстрація можливостей пошуку та аналізу оцифрованих документів.',
      date: '2026-11-05',
      image_url: 'https://picsum.photos/seed/event3/400/200'
    },
    {
      title: 'Семінар з ГІС-технологій в історії',
      description: 'Навчальний семінар з використання геоінформаційних систем для дослідження та візуалізації історичних процесів на території України.',
      date: '2026-11-20',
      image_url: 'https://picsum.photos/seed/event4/400/200'
    },
    {
      title: 'Хакатон: Digital Humanities Challenge',
      description: 'Двохденний хакатон для студентів та молодих дослідників. Команди працюватимуть над створенням інноваційних цифрових інструментів для гуманітарних досліджень.',
      date: '2026-12-01',
      image_url: 'https://picsum.photos/seed/event5/400/200'
    },
    {
      title: 'Лекція: Штучний інтелект у музеях',
      description: 'Публічна лекція про застосування технологій ШІ для каталогізації, реставрації та інтерактивних виставок у сучасних музеях світу.',
      date: '2026-12-15',
      image_url: 'https://picsum.photos/seed/event6/400/200'
    }
  ];

  for (const event of seedEvents) {
    insertEvent.run(event.title, event.description, event.date, event.image_url);
  }
  console.log('✅ Seeded 6 default events');
}

export default db;
