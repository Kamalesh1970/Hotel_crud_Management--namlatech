import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { addHotel } from '../redux/hotelsSlice';
import HotelForm from '../components/HotelForm';

function AddHotel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(formData) {
    setSubmitting(true);
    setSubmitError('');
    try {
      await dispatch(addHotel(formData)).unwrap();
      navigate('/');
    } catch (err) {
      setSubmitError(err || 'Failed to create hotel');
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <Helmet>
        <title>Add Hotel | Hotel Management</title>
      </Helmet>

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" className="back-link">
          &larr; Back to list
        </Link>
      </div>

      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Add New Hotel</h2>

      {submitError && (
        <div style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>
          {submitError}
        </div>
      )}

      <HotelForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default AddHotel;

