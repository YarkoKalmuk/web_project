import Card from '../components/Card/Card';

export default function Team() {
  const teamMembers = [
    {
      name: "Yulian Zaiats",
      role: "CEO and lead developer",
      bio: "Керівник проєкту, головний розробник та архітектор системи.",
      image: "/team/Yulian_Zaiats.png"
    },
    {
      name: "Yaropolk Kalmuk",
      role: "Part-time intern",
      bio: "Emotional support.",
      image: "/team/Yaropolk_Kalmuk.png"
    },
    {
      name: "Nazar Mykolaychuk",
      role: "Part-time intern",
      bio: "Emotional support.",
      image: "/team/Nazar_Mykolaychuk.png"
    },
    {
      name: "Marko Zenon",
      role: "Part-time intern",
      bio: "Emotional support.",
      image: "/team/Marko_Zenon.png"
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