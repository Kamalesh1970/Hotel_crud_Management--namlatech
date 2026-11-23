const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');

// Handler to fetch reviews for a hotel (newest first)
async function getReviews(req, res) {
  try {
    const { id } = req.params;

    const hotelCheck = await pool.query('SELECT id FROM hotels WHERE id = $1', [id]);
    if (hotelCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const result = await pool.query(
      'SELECT * FROM reviews WHERE hotel_id = $1 ORDER BY created_at DESC, id DESC',
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Handler to validate and insert a new review, then update hotel rating & count
async function createReview(req, res) {
  try {
    const { id } = req.params;
    const { name, rating, comment } = req.body;

    const hotelCheck = await pool.query('SELECT id FROM hotels WHERE id = $1', [id]);
    if (hotelCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5 || comment.trim().length > 500) {
      return res.status(400).json({ error: 'Comment must be between 5 and 500 characters long' });
    }

    // Insert new review
    const insertQuery = `
      INSERT INTO reviews (hotel_id, name, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const insertResult = await pool.query(insertQuery, [
      id,
      name.trim(),
      numRating,
      comment.trim()
    ]);
    const newReview = insertResult.rows[0];

    // Recalculate hotel rating and review_count
    const updateHotelQuery = `
      UPDATE hotels
      SET rating = (
        SELECT ROUND(AVG(rating), 1)
        FROM reviews
        WHERE hotel_id = $1
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE hotel_id = $1
      )
      WHERE id = $1
      RETURNING rating, review_count
    `;
    const hotelUpdateResult = await pool.query(updateHotelQuery, [id]);
    const updatedHotelStats = hotelUpdateResult.rows[0];

    res.status(201).json({
      ...newReview,
      hotel_rating: updatedHotelStats ? updatedHotelStats.rating : newReview.rating,
      hotel_review_count: updatedHotelStats ? updatedHotelStats.review_count : 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Support both mount styles:
// 1) Mounted under /api/hotels/:id/reviews -> router handles '/'
// 2) Mounted under /api/hotels -> router handles '/:id/reviews'
router.get('/', getReviews);
router.get('/:id/reviews', getReviews);
router.post('/', createReview);
router.post('/:id/reviews', createReview);

module.exports = router;
