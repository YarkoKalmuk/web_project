import Card from '../components/Card/Card';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page" style={{ textAlign: 'center' }}>
      <section style={{ 
        padding: '5rem 2rem', 
        marginBottom: '3rem', 
        background: 'var(--gradient-bg)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}>
        <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 700 }}>
          Центр цифрової гуманітаристики
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 2.5rem auto', opacity: 0.9, lineHeight: 1.8 }}>
          Ми поєднуємо новітні цифрові технології з традиційними гуманітарними дослідженнями.
          Наша місія — збереження культурної спадщини та відкриття нових горизонтів знань за допомогою Data Science, ШІ та ГІС технологій.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/projects">
            <button style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Наші проєкти</button>
          </Link>
          <Link to="/about">
            <button style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', background: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }}>Дізнатися більше</button>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        flexWrap: 'wrap',
        gap: '2rem',
        padding: '3rem 0',
        marginBottom: '4rem',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h2 style={{ fontSize: '3rem', color: 'var(--primary)', margin: 0 }}>15+</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Активних проєктів</p>
        </div>
        <div>
          <h2 style={{ fontSize: '3rem', color: 'var(--primary)', margin: 0 }}>50K</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Оцифрованих документів</p>
        </div>
        <div>
          <h2 style={{ fontSize: '3rem', color: 'var(--primary)', margin: 0 }}>12</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Дослідників у команді</p>
        </div>
      </section>

      <h2 className="section-title">Напрямки діяльності</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left', marginBottom: '4rem' }}>
        <Card 
          title="Цифрові архіви" 
          description="Створення та підтримка відкритих цифрових баз даних та архівів історичних документів з використанням OCR технологій."
          imageUrl="https://picsum.photos/seed/archive/400/200"
        />
        <Card 
          title="Аналіз текстів" 
          description="Використання методів машинного навчання (NLP) для аналізу великих масивів літературних творів та періодики."
          imageUrl="https://picsum.photos/seed/text/400/200"
        />
        <Card 
          title="Просторова історія" 
          description="Геоінформаційні системи (ГІС) для візуалізації історичних подій, соціальних процесів та демографічних змін."
          imageUrl="https://picsum.photos/seed/map/400/200"
        />
      </div>
      
      {/* Call to Action */}
      <section style={{ 
        padding: '4rem 2rem', 
        background: 'var(--card-bg)', 
        borderRadius: 'var(--radius)', 
        border: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Готові до співпраці?</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
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