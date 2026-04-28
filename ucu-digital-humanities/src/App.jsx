import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Events from './pages/Events';
import Projects from './pages/Projects';

function App() {
  return (
    <div className="app-container">
      <nav style={{ padding: '20px', background: '#f4f4f4' }}>
        <Link to="/" style={{ margin: '10px' }}>Головна</Link>
        <Link to="/about" style={{ margin: '10px' }}>Про центр</Link>
        <Link to="/team" style={{ margin: '10px' }}>Команда</Link>
        <Link to="/events" style={{ margin: '10px' }}>Події</Link>
        <Link to="/projects" style={{ margin: '10px' }}>Проєкти</Link>
      </nav>

      <div className="content" style={{ padding: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;