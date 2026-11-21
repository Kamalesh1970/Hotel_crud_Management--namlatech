import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState('');
  const [geoMessage, setGeoMessage] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/hotels/${id}`);
        setHotel(response.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Hotel not found' : 'Failed to load hotel');
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
  }, [id]);

  function handleGetDistance() {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const km = calculateDistance(
          userLat,
          userLng,
          Number(hotel.latitude),
          Number(hotel.longitude)
        );
        setDistance(`${km} km away from your location`);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === 1) {
          setGeoMessage('Location permission was denied');
        } else {
          setGeoMessage('Unable to retrieve your location');
        }
      }
    );
  }

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Hotel Not Found</h2>
        <p style={{ margin: '1rem 0', color: '#64748b' }}>
          We could not find the hotel with ID #{id}.
        </p>
        <Link to="/" className="nav-button">
          Back to list
        </Link>
      </div>
    );
  }

  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);
  const shortMetaDesc = hotel.description ? hotel.description.slice(0, 150) : '';
  const imageUrl = `${window.location.origin}/${hotel.image_path}`;

  return (
    <div className="hotel-detail-page">
      <Helmet>
        <title>{hotel.title}</title>
        <meta name="description" content={shortMetaDesc} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:description" content={shortMetaDesc} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      <div className="detail-top-nav">
        <Link to="/" className="back-link">
          &larr; Back to list
        </Link>
        <Link to={`/edit/${hotel.id}`} className="edit-btn-link">
          Edit Hotel
        </Link>
      </div>

      {/* Main Info (Desktop: side by side, Mobile: stacked) */}
      <div className="detail-layout">
        <div className="detail-image-box">
          <img
            src={`/${hotel.image_path}`}
            alt={hotel.title}
            className="detail-large-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
            }}
          />
        </div>

        <div className="detail-info-box">
          <h1 className="detail-title">{hotel.title}</h1>
          <p className="detail-price">${Number(hotel.price).toFixed(2)} / night</p>

          <div className="detail-coordinates">
            <span><strong>Latitude:</strong> {hotel.latitude}</span>
            <span><strong>Longitude:</strong> {hotel.longitude}</span>
          </div>

          <div className="distance-section">
            <button
              type="button"
              className="geo-btn"
              onClick={handleGetDistance}
              disabled={geoLoading}
            >
              {geoLoading ? 'Calculating distance...' : 'Show distance from me'}
            </button>
            {distance && <p className="distance-result">{distance}</p>}
            {geoMessage && <p className="distance-error">{geoMessage}</p>}
          </div>

          <div className="detail-description-wrap">
            <h3>About this hotel</h3>
            <p className="detail-description">{hotel.description}</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <h3>Location Map</h3>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '350px', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>{hotel.title}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default HotelDetail;

