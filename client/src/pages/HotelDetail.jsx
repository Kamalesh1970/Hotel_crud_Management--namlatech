import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatPrice, renderStars, getImageUrl } from '../components/HotelCard';
import { deleteHotel } from '../redux/hotelsSlice';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const placeholderImage =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22200%22%20fill%3D%22%2364748b%22%20font-size%3D%2220%22%20font-family%3D%22sans-serif%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState('');
  const [geoMessage, setGeoMessage] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  async function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this hotel?');
    if (!confirmed) return;

    try {
      setDeleting(true);
      await dispatch(deleteHotel(id)).unwrap();
      setToastMessage('Hotel deleted successfully');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setDeleting(false);
      alert(err || 'Failed to delete hotel');
    }
  }

  if (loading) {
    return (
      <div className="page-container status-container">
        <p className="status-message">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="page-container status-container">
        <h2>Hotel Not Found</h2>
        <p className="status-subtext">
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
  const imageUrl = getImageUrl(hotel.image_path);

  return (
    <div className="hotel-detail-page">
      <Helmet>
        <title>{hotel.title}</title>
        <meta name="description" content={shortMetaDesc} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:description" content={shortMetaDesc} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      {toastMessage && <div className="toast-popup">{toastMessage}</div>}

      <div className="detail-top-nav">
        <Link to="/" className="back-link">
          &larr; Back to list
        </Link>
        <div className="detail-actions">
          <Link to={`/edit/${hotel.id}`} className="edit-btn-link">
            Edit Hotel
          </Link>
          <button
            type="button"
            className="delete-btn-link"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Hotel'}
          </button>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-image-box">
          <img
            src={imageUrl}
            alt={hotel.title}
            className="detail-large-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
        </div>

        <div className="detail-info-box">
          <h1 className="detail-title">{hotel.title}</h1>
          {renderStars(hotel.rating, hotel.review_count)}
          <p className="detail-price">{formatPrice(hotel.price)} / night</p>

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

      <div className="map-section">
        <h3>Location Map</h3>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}
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
