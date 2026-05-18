import './Team.css';

export default function Team() {
  const teamMembers = [
    {
      name: "Юліан Заяць",
      role: "Lead Frontend Engineer & UX Designer",
      bio: "Спеціалізується на побудові високоінтерактивних інтерфейсів, ГІС-візуалізаціях та NLP-інструментах. Відповідає за преміальну естетику та плавність користувацького досвіду.",
      image: "/team/Yulian_Zaiats.png"
    },
    {
      name: "Ярополк Кальмук",
      role: "Chief Full-Stack Engineer & Database Architect",
      bio: "Проєктує надійні серверні рішення, API та архітектуру баз даних SQLite. Забезпечує цілісність, швидкість та стабільність обміну даними між усіма вузлами системи.",
      image: "/team/Yaropolk_Kalmuk.png"
    },
    {
      name: "Назар Миколайчук",
      role: "NLP & Computational Linguistics Specialist",
      bio: "Керує розробкою модулів обробки природної мови, аналізу стародруків та морфологічного маркування. Створює інтелектуальні алгоритми розпізнавання сутностей.",
      image: "/team/Nazar_Mykolaychuk.png"
    },
    {
      name: "Марко Зенон",
      role: "GIS Coordinator & Archival Researcher",
      bio: "Займається збором просторових даних, оцифруванням історичних джерел та картографічним аналізом. Досліджує шляхи книговидання XVI-XVIII ст.",
      image: "/team/Marko_Zenon.png"
    }
  ];

  return (
    <div className="team-page">
      <div className="team-header">
        <h1>Наша команда</h1>
        <p>
          Знайомтеся з розробниками та дослідниками, які роблять цифрову гуманітаристику та комп'ютерну лінгвістику реальною.
        </p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-avatar-wrapper">
              <img 
                src={member.image} 
                alt={member.name} 
                className="team-avatar"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/dh_team_${index}/150/150`;
                }}
              />
            </div>
            <div className="team-info">
              <h2 className="team-name">{member.name}</h2>
              <span className="team-role-badge">{member.role}</span>
              <p className="team-bio">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}