import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';
import HotelDetail from './pages/HotelDetail';
import './App.css';

function NotFound() {
  return (
    <div className="page-container status-container">
      <h2>404 - Page Not Found</h2>
      <p className="status-subtext">The page you are looking for does not exist.</p>
      <Link to="/" className="nav-button">
        Return to Hotels
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="nav-container">
            <Link to="/" className="brand-logo">
              HotelManager
            </Link>
            <nav className="nav-links">
              <Link to="/" className="nav-link">Hotels</Link>
              <Link to="/add" className="nav-button">+ Add Hotel</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddHotel />} />
            <Route path="/edit/:id" element={<EditHotel />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
