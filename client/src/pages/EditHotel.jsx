import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { updateHotel } from '../redux/hotelsSlice';
import HotelForm from '../components/HotelForm';

function EditHotel() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/hotels/${id}`);
        setHotelData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setSubmitError('Failed to load hotel data');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
  }, [id]);

  async function handleSubmit(formData) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await dispatch(updateHotel({ id, formData })).unwrap();
      navigate('/');
    } catch (err) {
      setSubmitError(err || 'Failed to update hotel');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (notFound || !hotelData) {
    return (
      <div className="page-container status-container">
        <h2>Hotel Not Found</h2>
        <p className="status-subtext">
          The hotel with ID #{id} does not exist or has been removed.
        </p>
        <Link to="/" className="nav-button">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Helmet>
        <title>Edit Hotel | Hotel Management</title>
      </Helmet>

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" className="back-link">
          &larr; Back to list
        </Link>
      </div>

      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        Edit Hotel #{id}
      </h2>

      {submitError && (
        <div style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>
          {submitError}
        </div>
      )}

      <HotelForm
        initialData={hotelData}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

export default EditHotel;

