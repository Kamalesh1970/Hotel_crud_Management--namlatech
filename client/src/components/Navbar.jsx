import { Link } from 'react-router-dom';

function Navbar() {
  return (
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
  );
}

export default Navbar;

