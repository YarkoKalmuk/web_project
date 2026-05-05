import { useState, useEffect } from 'react';
import Card from '../components/Card/Card';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /* REQUIREMENT: Fetching data from an external API */
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title.charAt(0).toUpperCase() + item.title.slice(1, 30) + '...',
          description: item.body.substring(0, 100) + '...',
          imageUrl: `https://picsum.photos/seed/${item.id + 100}/400/200`,
          extraInfo: `Статус: ${item.id % 2 === 0 ? 'Завершено' : 'В процесі'}`
        }));
        
        setProjects(formattedData);
        setFilteredProjects(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle Search Filtering
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query)
      );
      setFilteredProjects(filtered);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="section-title">Наші проєкти</h1>
        <p style={{ marginBottom: '2rem' }}>Ознайомтеся з останніми дослідженнями та розробками нашого центру.</p>
        
        {/* Creative addition: Search Bar using useState */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Пошук проєктів..." 
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {loading && <div className="loading">Завантаження проєктів...</div>}
      
      {error && <div className="error">Помилка завантаження: {error}</div>}

      {!loading && !error && (
        <>
          {filteredProjects.length === 0 ? (
            <div className="error" style={{ background: 'transparent', border: 'none' }}>
              Нічого не знайдено за запитом "{searchQuery}"
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card-wrapper">
                  <Card 
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl}
                    extraInfo={project.extraInfo}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}