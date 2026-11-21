import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HotelListPage from './pages/HotelListPage';
import AddHotelPage from './pages/AddHotelPage';
import EditHotelPage from './pages/EditHotelPage';
import HotelDetailPage from './pages/HotelDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HotelListPage />} />
            <Route path="/add" element={<AddHotelPage />} />
            <Route path="/edit/:id" element={<EditHotelPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

