import Card from '../components/Card/Card';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-banner">
          <img src="/DH_representing_photos/rectanlge_DH.jpg" alt="UCU Centre for Digital Humanities Banner" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Центр цифрової гуманітаристики
          </h1>
          <p className="hero-description">
            Ми поєднуємо новітні цифрові технології з традиційними гуманітарними дослідженнями.
            Наша місія — збереження культурної спадщини та відкриття нових горизонтів знань за допомогою Data Science, ШІ та ГІС технологій.
          </p>
          <div className="hero-buttons">
            <Link to="/projects">
              <button>Наші проєкти</button>
            </Link>
            <Link to="/about">
              <button className="btn-outline">Дізнатися більше</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div>
          <h2 className="stat-number">15+</h2>
          <p className="stat-label">Активних проєктів</p>
        </div>
        <div>
          <h2 className="stat-number">50K</h2>
          <p className="stat-label">Оцифрованих документів</p>
        </div>
        <div>
          <h2 className="stat-number">12</h2>
          <p className="stat-label">Дослідників у команді</p>
        </div>
      </section>

      <h2 className="section-title">Напрямки діяльності</h2>
      <div className="directions-grid">
        <Card 
          title="Цифрові архіви" 
          description="Створення та підтримка відкритих цифрових баз даних та архівів історичних документів з використанням OCR технологій."
          imageUrl="/home/archives.png"
        />
        <Card 
          title="Аналіз текстів" 
          description="Використання методів машинного навчання (NLP) для аналізу великих масивів літературних творів та періодики."
          imageUrl="/home/text_analysis.png"
        />
        <Card 
          title="Просторова історія" 
          description="Геоінформаційні системи (ГІС) для візуалізації історичних подій, соціальних процесів та демографічних змін."
          imageUrl="/home/hist_event.png"
        />
      </div>

      <section className="cta-section">
        <h2>Готові до співпраці?</h2>
        <p>
          Ми завжди відкриті до нових партнерств, спільних дослідницьких грантів та академічних обмінів. 
          Зв'яжіться з нашою командою для обговорення деталей.
        </p>
        <Link to="/about">
          <button>Зв'язатися з нами</button>
        </Link>
      </section>
    </div>
  );
}