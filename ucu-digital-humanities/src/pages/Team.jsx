import Card from '../components/Card/Card';

export default function Team() {
  const teamMembers = [
    {
      name: "Олександр Коваленко",
      role: "Керівник центру",
      bio: "Доктор історичних наук, фахівець з цифрових методів в історії.",
      image: "https://picsum.photos/seed/alex/400/300"
    },
    {
      name: "Марія Мельник",
      role: "Провідний дослідник",
      bio: "Експертка з комп'ютерної лінгвістики та аналізу текстів.",
      image: "https://picsum.photos/seed/maria/400/300"
    },
    {
      name: "Іван Бойко",
      role: "Data Scientist",
      bio: "Розробник архітектури баз даних та алгоритмів машинного навчання.",
      image: "https://picsum.photos/seed/ivan/400/300"
    }
  ];

  return (
    <div className="team-page">
      <h1 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem' }}>Наша команда</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem', opacity: 0.9 }}>
        Знайомтеся з фахівцями, які роблять цифрову гуманітаристику можливою.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {teamMembers.map((member, index) => (
          <div key={index} style={{ display: 'flex' }}>
            <Card 
              title={member.name}
              description={member.bio}
              imageUrl={member.image}
              extraInfo={`Посада: ${member.role}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}