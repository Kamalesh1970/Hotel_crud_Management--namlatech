import { useState, useEffect } from 'react';
import axios from 'axios';

function Reviews({ hotelId, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/hotels/${hotelId}/reviews`);
        if (isMounted) {
          const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
          setReviews(list);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const serverError =
            err.response?.data?.error ||
            (typeof err.response?.data === 'string' &&
            err.response.data.length < 200 &&
            !err.response.data.includes('<!DOCTYPE')
              ? err.response.data
              : null) ||
            (err.response?.status
              ? `Server error (${err.response.status}: ${err.response.statusText || 'Not Found'})`
              : null) ||
            err.message ||
            'Failed to load reviews';
          setError(serverError);
          setLoading(false);
        }
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  function validateForm() {
    const errors = {};
    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      errors.rating = 'Please select a rating between 1 and 5';
    }
    if (!comment || comment.trim().length < 5) {
      errors.comment = 'Comment must be at least 5 characters long';
    } else if (comment.trim().length > 500) {
      errors.comment = 'Comment cannot exceed 500 characters';
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        rating: Number(rating),
        comment: comment.trim(),
      };
      const res = await axios.post(`/api/hotels/${hotelId}/reviews`, payload);
      const newReview = res.data;

      // Prepend the new review so it appears at the top immediately
      setReviews((prev) => [newReview, ...prev]);

      // Reset form
      setName('');
      setRating(5);
      setComment('');

      // Notify parent to update hotel's average rating and review_count
      if (onReviewAdded) {
        onReviewAdded({
          rating: newReview.hotel_rating,
          review_count: newReview.hotel_review_count,
        });
      }
    } catch (err) {
      const serverError =
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' &&
        err.response.data.length < 200 &&
        !err.response.data.includes('<!DOCTYPE')
          ? err.response.data
          : null) ||
        (err.response?.status
          ? `Server error (${err.response.status}: ${err.response.statusText || 'Bad Request'})`
          : null) ||
        err.message ||
        'Failed to post review';
      setSubmitError(serverError);
    } finally {
      setSubmitting(false);
    }
  }

  // Calculate current average & count for local display
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviewCount).toFixed(1)
      : null;

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h3 className="reviews-title">Guest Reviews & Ratings</h3>
        {reviewCount > 0 ? (
          <div className="reviews-summary-badge">
            <span className="summary-stars">★ {avgRating}</span>
            <span className="summary-count">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        ) : (
          <span className="no-reviews">No reviews yet</span>
        )}
      </div>

      {/* Review Form */}
      <form className="review-form" onSubmit={handleSubmit}>
        <h4 className="form-heading">Leave a Review</h4>

        {submitError && <div className="error-text form-alert">{submitError}</div>}

        <div className="review-form-row">
          <div className="form-group review-name-group">
            <label htmlFor="reviewer-name">Your Name</label>
            <input
              id="reviewer-name"
              type="text"
              placeholder="e.g. Priya S."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={formErrors.name ? 'input-error' : ''}
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group review-star-group">
            <label>Rating</label>
            <div className="star-picker" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-pick-btn ${
                    (hoverRating || rating) >= star ? 'star-filled' : 'star-empty'
                  }`}
                  onClick={() => {
                    setRating(star);
                    if (formErrors.rating) setFormErrors((prev) => ({ ...prev, rating: '' }));
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
              <span className="star-picker-label">
                {(hoverRating || rating)} / 5
              </span>
            </div>
            {formErrors.rating && <span className="error-text">{formErrors.rating}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reviewer-comment">Your Experience</label>
          <textarea
            id="reviewer-comment"
            rows="3"
            placeholder="Share details of your stay, cleanliness, location, or hospitality..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (formErrors.comment) setFormErrors((prev) => ({ ...prev, comment: '' }));
            }}
            className={formErrors.comment ? 'input-error' : ''}
          />
          {formErrors.comment && <span className="error-text">{formErrors.comment}</span>}
        </div>

        <button type="submit" className="submit-review-btn" disabled={submitting}>
          {submitting ? 'Submitting Review...' : 'Submit Review'}
        </button>
      </form>

      {/* Reviews List */}
      <div className="reviews-list-section">
        {loading ? (
          <p className="status-message">Loading reviews...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : reviews.length === 0 ? (
          <div className="empty-reviews-state">
            <p className="empty-text">Be the first to review this hotel!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((rev) => {
              const reviewDate = rev.created_at
                ? new Date(rev.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '';

              return (
                <div key={rev.id} className="review-item">
                  <div className="review-item-header">
                    <div className="reviewer-info">
                      <span className="reviewer-avatar">
                        {(rev.name || 'G')[0].toUpperCase()}
                      </span>
                      <div>
                        <strong className="reviewer-name">{rev.name}</strong>
                        {reviewDate && <span className="review-date">{reviewDate}</span>}
                      </div>
                    </div>
                    <div className="review-rating-stars">
                      {'★'.repeat(Number(rev.rating))}
                      {'☆'.repeat(Math.max(0, 5 - Number(rev.rating)))}
                    </div>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;

