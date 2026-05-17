import Card from '../components/Card/Card';

export default function Team() {
  const teamMembers = [
    {
      name: "Yulian Zaiats",
      role: "CEO",
      bio: "Тут можна описати більше про діяльність",
      image: "/team/Yulian_Zaiats.png"
    },
    {
      name: "Yaropolk Kalmuk",
      role: "CEO",
      bio: "Тут можна описати більше про діяльність",
      image: "/team/Yaropolk_Kalmuk.png"
    },
    {
      name: "Nazar Mykolaychuk",
      role: "CEO",
      bio: "Тут можна описати більше про діяльність",
      image: "/team/Nazar_Mykolaychuk.png"
    },
    {
      name: "Marko Zenon",
      role: "CEO",
      bio: "Тут можна описати більше про діяльність",
      image: "/team/Marko_Zenon.png"
    }
  ];

  return (
    <div className="team-page">
      <h1 className="section-title">Наша команда</h1>
      <p className="team-description">
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