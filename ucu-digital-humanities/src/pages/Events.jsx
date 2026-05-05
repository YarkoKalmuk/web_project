import Card from '../components/Card/Card';

export default function Events() {
  const eventsList = [
    {
      title: "Міжнародна конференція з цифрової історії",
      description: "Обговорення нових методів оцифрування та аналізу історичних даних з провідними європейськими експертами.",
      image: "https://picsum.photos/seed/event1/400/200",
      date: "15 Вересня 2026"
    },
    {
      title: "Воркшоп: Вступ до Python для гуманітаріїв",
      description: "Практичне заняття з основ програмування для студентів гуманітарних спеціальностей.",
      image: "https://picsum.photos/seed/event2/400/200",
      date: "22 Жовтня 2026"
    },
    {
      title: "Презентація архіву",
      description: "Відкриття нового онлайн-архіву українського самвидаву 1960-1980-х років.",
      image: "https://picsum.photos/seed/event3/400/200",
      date: "05 Листопада 2026"
    }
  ];

  return (
    <div className="events-page">
      <h1 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem' }}>Майбутні події</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem', opacity: 0.9 }}>
        Долучайтеся до наших заходів, воркшопів та лекцій.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {eventsList.map((event, index) => (
          <div key={index} style={{ display: 'flex' }}>
            <Card 
              title={event.title}
              description={event.description}
              imageUrl={event.image}
              extraInfo={`Дата: ${event.date}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}