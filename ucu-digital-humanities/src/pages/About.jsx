import { useState } from 'react';
import './About.css';

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Помилка сервера. Спробуйте пізніше.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Не вдалося надіслати повідомлення. Спробуйте пізніше.');
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Що таке цифрова гуманітаристика?",
      answer: "Це міждисциплінарна галузь, що використовує комп'ютерні методи та цифрові інструменти для дослідження традиційних гуманітарних дисциплин (історії, літератури, лінгвістики)."
    },
    {
      question: "Як можна долучитися до проєктів?",
      answer: "Ми завжди раді новим волонтерам та дослідникам. Заповніть форму зворотного зв'язку нижче, і ми розповімо про актуальні можливості."
    },
    {
      question: "Чи є доступ до архівів відкритим?",
      answer: "Так, більшість наших оцифрованих колекцій доступні онлайн абсолютно безкоштовно для дослідницьких та освітніх цілей."
    }
  ];

  return (
    <div className="about-page">
      <h1 className="section-title">Про центр</h1>
      <p className="about-description">
        Центр цифрової гуманітаристики займається дослідженням та впровадженням 
        інформаційних технологій у гуманітарні науки. Ми створюємо інноваційні 
        продукти на перетині технологій та культури.
      </p>

      <section className="faq-section" style={{ marginBottom: '4rem' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Часті запитання</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600' }}>
                <span>{faq.question}</span>
                <span>{activeFaq === index ? '−' : '+'}</span>
              </div>
              {activeFaq === index && (
                <div style={{ marginTop: '1rem', opacity: 0.9, lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-wrapper">
        <h2 className="section-title">Зв'язатися з нами</h2>
        <div className="contact-grid">
          <div className="contact-info-card">
            <div className="info-block">
              <h3>Категорії</h3>
              <div className="info-item">
                <div>
                  <div className="info-text">Культурний центр</div>
                </div>
              </div>
            </div>

            <div className="info-block">
              <h3>Контактна інформація</h3>
              <div className="map-container">
                <iframe 
                  src="https://maps.google.com/maps?q=49.8177579,24.0232585+(Ukrainian%20Catholic%20University)&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="250" 
                  style={{ border: 0, borderRadius: '8px', marginBottom: '1.5rem' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  title="Карта УКУ"
                ></iframe>
              </div>
              <div className="info-item">
                <span className="icon">🏠</span>
                <div>
                  <div className="info-text">вул. Козельницька, 2а, Львів, Україна, 79070</div>
                  <div className="info-subtext">Адреса</div>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">📞</span>
                <div>
                  <div className="info-text">093 757 6720</div>
                  <div className="info-subtext">Мобільний телефон</div>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">✉️</span>
                <div>
                  <div className="info-text">digital.humanities@ucu.edu.ua</div>
                  <div className="info-subtext">Електронна пошта</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Напишіть нам</h3>
            {submitted ? (
              <div className="success-message">Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.</div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: '500' }}>{error}</div>}
                <div className="form-group">
                  <label htmlFor="name">Ім'я</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Повідомлення</label>
                  <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="submit-btn">Відправити</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}