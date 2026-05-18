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

const columnsEvents = db.pragma('table_info(events)');
if (columnsEvents.length > 0) {
  const hasLocation = columnsEvents.some(c => c.name === 'location');
  if (!hasLocation) {
    db.exec("ALTER TABLE events ADD COLUMN location TEXT");
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
    location    TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    goal        TEXT NOT NULL,
    image_url   TEXT,
    direction   TEXT NOT NULL,
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
    'INSERT INTO events (title, description, date, image_url, location) VALUES (?, ?, ?, ?, ?)'
  );

  const seedEvents = [
    {
      title: 'Міжнародна конференція з цифрової історії',
      description: 'Обговорення нових методів оцифрування та аналізу історичних даних з провідними європейськими експертами. Захід включає пленарні доповіді, майстер-класи та панельні дискусії.',
      date: '2026-09-15',
      image_url: 'https://picsum.photos/seed/event1/400/200',
      location: 'Центр Шептицького, Конференц-зал'
    },
    {
      title: 'Воркшоп: Вступ до Python для гуманітаріїв',
      description: 'Практичне заняття з основ програмування для студентів гуманітарних спеціальностей. Учасники навчаться працювати з текстовими даними та створювати прості аналітичні скрипти.',
      date: '2026-10-22',
      image_url: 'https://picsum.photos/seed/event2/400/200',
      location: 'УКУ, Комп\'ютерний клас 302'
    },
    {
      title: 'Презентація цифрового архіву самвидаву',
      description: 'Відкриття нового онлайн-архіву українського самвидаву 1960-1980-х років. Демонстрація можливостей пошуку та аналізу оцифрованих документів.',
      date: '2026-11-05',
      image_url: 'https://picsum.photos/seed/event3/400/200',
      location: 'УКУ, Коворкінг ім. митрополита Андрея Шептицького'
    },
    {
      title: 'Семінар з ГІС-технологій в історії',
      description: 'Навчальний семінар з використання геоінформаційних систем для дослідження та візуалізації історичних процесів на території України.',
      date: '2026-11-20',
      image_url: 'https://picsum.photos/seed/event4/400/200',
      location: 'Онлайн-семінар (Zoom)'
    },
    {
      title: 'Хакатон: Digital Humanities Challenge',
      description: 'Двохденний хакатон для студентів та молодих дослідників. Команди працюватимуть над створенням інноваційних цифрових інструментів для гуманітарних досліджень.',
      date: '2026-12-01',
      image_url: 'https://picsum.photos/seed/event5/400/200',
      location: 'Центр Шептицького, Паркова аудиторія'
    },
    {
      title: 'Лекція: Штучний інтелект у музеях',
      description: 'Публічна лекція про застосування технологій ШІ для каталогізації, реставрації та інтерактивних виставок у сучасних музеях світу.',
      date: '2026-12-15',
      image_url: 'https://picsum.photos/seed/event6/400/200',
      location: 'УКУ, Лекторій 101'
    }
  ];

  for (const event of seedEvents) {
    insertEvent.run(event.title, event.description, event.date, event.image_url, event.location);
  }
  console.log('Seeded 6 default events');
}

const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
if (projectCount.count === 0) {
  const insertProject = db.prepare(
    'INSERT INTO projects (title, description, goal, image_url, direction) VALUES (?, ?, ?, ?, ?)'
  );

  const seedProjects = [
    {
      title: "Комп'ютерний аналіз синтаксису козацьких літописів XVII ст.",
      description: "Застосування методів обробки природної мови (NLP) для порівняльного аналізу авторського стилю та синтаксичної структури Літопису Самовидця та Літопису Самійла Величка.",
      image_url: "https://picsum.photos/seed/dh1/400/200",
      direction: "NLP та аналіз текстів",
      goal: "Автоматичне виявлення авторського стилю та стилістичних особливостей літописів."
    },
    {
      title: "ГІС-картування мережі поширення видань Острозької академії",
      description: "Геопросторовий аналіз та інтерактивна візуалізація торговельних шляхів, якими книги Острозької друкарні потрапляли до бібліотек Європи у XVI-XVII ст.",
      image_url: "https://picsum.photos/seed/dh2/400/200",
      direction: "ГІС та цифрові архіви",
      goal: "Візуалізувати інтерактивні маршрути розповсюдження книг Острозької друкарні."
    },
    {
      title: "Розпізнавання скоропису кириличних рукописів за допомогою CNN",
      description: "Навчання глибоких згорткових нейромереж для автоматичного розпізнавання та оцифрування складного українського скоропису з архівів XVII століття.",
      image_url: "https://picsum.photos/seed/dh3/400/200",
      direction: "NLP та аналіз текстів",
      goal: "Розробити модель глибокого навчання для точного OCR рукописних кириличних фондів."
    },
    {
      title: "Стилометричне дослідження авторства полемічних трактатів",
      description: "Аналіз частотності службових слів та n-грам для встановлення ймовірного авторства анонімних релігійних памфлетів періоду Берестейської унії.",
      image_url: "https://picsum.photos/seed/dh4/400/200",
      direction: "NLP та аналіз текстів",
      goal: "Визначити ймовірних авторів анонімних релігійних текстів Берестейської унії."
    },
    {
      title: "Візуалізація соціальної мережі діячів Києво-Могилянської академії",
      description: "Побудова інтерактивного графа зв'язків між викладачами, випускниками та меценатами академії XVIII століття на основі епістолярної спадщини.",
      image_url: "https://picsum.photos/seed/dh5/400/200",
      direction: "ГІС та цифрові архіви",
      goal: "Створити інтерактивний граф листування та інтелектуальних зв'язків випускників."
    },
    {
      title: "Створення моделі OCR для барокових стародруків Чернігова",
      description: "Розробка та тонке налаштування (fine-tuning) моделей оптичного розпізнавання символів для унікальних шрифтів друкарні Лазаря Барановича.",
      image_url: "https://picsum.photos/seed/dh6/400/200",
      direction: "NLP та аналіз текстів",
      goal: "Забезпечити високу точність розпізнавання стародруків Лазаря Барановича."
    },
    {
      title: "Аналіз філіграней паперу Почаївської друкарні методом спектроскопії",
      description: "Класифікація водяних знаків за допомогою комп'ютерного зору для визначення походження та точного датування старовинного паперу.",
      image_url: "https://picsum.photos/seed/dh7/400/200",
      direction: "ГІС та цифрові архіви",
      goal: "Визначити походження та точне датування почаївських паперових водяних знаків."
    },
    {
      title: "Цифровий архів та інтерактивний корпус українського Самвидаву",
      description: "Оцифрування, OCR та лінгвістичне маркування позацензурної преси та літератури 1960-1980-х років для відкритих гуманітарних досліджень.",
      image_url: "https://picsum.photos/seed/dh8/400/200",
      direction: "NLP та аналіз текстів",
      goal: "Створити відкритий NLP-корпус та цифровий архів позацензурної радянської преси."
    }
  ];

  for (const project of seedProjects) {
    insertProject.run(
      project.title,
      project.description,
      project.goal,
      project.image_url,
      project.direction
    );
  }
  console.log('Seeded 8 default research projects');
}

export default db;
