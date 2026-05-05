import { useState } from 'react';
import './About.css';

export default function About() {
  /* REQUIREMENT: Managing form state using useState */
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  /* REQUIREMENT: Managing complex state for interactivity (Accordion) */
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
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

      {/* Creative addition: FAQ Accordion using useState */}
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

      <section className="contact-section">
        {/* REQUIREMENT: Form implementation with state handling */}
        <h2>Зв'язатися з нами</h2>
        {submitted ? (
          <div className="success-message">Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.</div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
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
              <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="submit-btn">Відправити</button>
          </form>
        )}
      </section>
    </div>
  );
}