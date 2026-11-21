import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';
import HotelDetail from './pages/HotelDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddHotel />} />
            <Route path="/edit/:id" element={<EditHotel />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
