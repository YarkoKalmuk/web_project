import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Events from './pages/Events';
import Projects from './pages/Projects';
import Login from './pages/Login';
import EventForm from './pages/EventForm';
import ProjectForm from './pages/ProjectForm';

function App() {
  return (
    <>
      <Navbar />
      <main className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/create" element={<EventForm />} />
          <Route path="/events/edit/:id" element={<EventForm />} />
          <Route path="/projects/create" element={<ProjectForm />} />
          <Route path="/projects/edit/:id" element={<ProjectForm />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;