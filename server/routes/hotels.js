const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');

// Multer storage for uploaded hotel images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

// Allow only JPG, PNG, and WebP images up to 2MB
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

function handleUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

function validateHotel(body) {
  const { title, description, price, latitude, longitude, area, rooms_available } = body;

  if (!title || !title.trim()) {
    return 'Title is required';
  }

  if (!description || !description.trim()) {
    return 'Description is required';
  }

  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return 'Price must be a valid number greater than or equal to 0';
  }

  const numLat = Number(latitude);
  if (isNaN(numLat) || numLat < -90 || numLat > 90) {
    return 'Latitude must be between -90 and 90';
  }

  const numLng = Number(longitude);
  if (isNaN(numLng) || numLng < -180 || numLng > 180) {
    return 'Longitude must be between -180 and 180';
  }

  if (rooms_available !== undefined && rooms_available !== '') {
    const numRooms = Number(rooms_available);
    if (isNaN(numRooms) || numRooms < 0 || !Number.isInteger(numRooms)) {
      return 'Rooms available must be an integer greater than or equal to 0';
    }
  }

  return null;
}

function deleteFile(filePath) {
  if (!filePath) return;
  const fileName = path.basename(filePath);
  const fullPath = path.join(__dirname, '../uploads', fileName);
  fs.unlink(fullPath, () => {});
}

// GET /api/hotels (search, price filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, minRating, area, limit, offset } = req.query;

    const conditions = [];
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`title ILIKE $${params.length}`);
    }

    if (minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice))) {
      params.push(Number(minPrice));
      conditions.push(`price >= $${params.length}`);
    }

    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice))) {
      params.push(Number(maxPrice));
      conditions.push(`price <= $${params.length}`);
    }

    if (minRating !== undefined && minRating !== '' && !isNaN(Number(minRating))) {
      params.push(Number(minRating));
      conditions.push(`rating >= $${params.length}`);
    }

    if (area && area.trim() && area.trim().toLowerCase() !== 'all') {
      params.push(area.trim());
      conditions.push(`area = $${params.length}`);
    }

    let whereSql = '';
    if (conditions.length > 0) {
      whereSql = 'WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) FROM hotels ${whereSql}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const pageLimit = limit ? parseInt(limit, 10) : 6;
    const pageOffset = offset ? parseInt(offset, 10) : 0;

    const dataParams = [...params];
    dataParams.push(pageLimit);
    const limitIndex = dataParams.length;
    dataParams.push(pageOffset);
    const offsetIndex = dataParams.length;

    const dataQuery = `
      SELECT * FROM hotels
      ${whereSql}
      ORDER BY id DESC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
    `;

    const dataResult = await pool.query(dataQuery, dataParams);

    res.json({
      data: dataResult.rows,
      total: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/hotels
router.post('/', handleUpload, async (req, res) => {
  try {
    const error = validateHotel(req.body);
    if (error) {
      if (req.file) deleteFile(req.file.filename);
      return res.status(400).json({ error });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { title, description, price, latitude, longitude, area, rooms_available } = req.body;
    const imagePath = 'uploads/' + req.file.filename;

    const query = `
      INSERT INTO hotels (title, description, price, latitude, longitude, image_path, area, rooms_available)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      title.trim(),
      description.trim(),
      Number(price),
      Number(latitude),
      Number(longitude),
      imagePath,
      area && area.trim() ? area.trim() : null,
      rooms_available !== undefined && rooms_available !== '' ? Number(rooms_available) : 0
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (req.file) deleteFile(req.file.filename);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/hotels/:id
router.put('/:id', handleUpload, async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      if (req.file) deleteFile(req.file.filename);
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const error = validateHotel(req.body);
    if (error) {
      if (req.file) deleteFile(req.file.filename);
      return res.status(400).json({ error });
    }

    const existingHotel = existingResult.rows[0];
    const { title, description, price, latitude, longitude, area, rooms_available } = req.body;

    let imagePath = existingHotel.image_path;
    if (req.file) {
      deleteFile(existingHotel.image_path);
      imagePath = 'uploads/' + req.file.filename;
    }

    const updateTitle = title !== undefined ? title.trim() : existingHotel.title;
    const updateDescription = description !== undefined ? description.trim() : existingHotel.description;
    const updatePrice = price !== undefined ? Number(price) : existingHotel.price;
    const updateLat = latitude !== undefined ? Number(latitude) : existingHotel.latitude;
    const updateLng = longitude !== undefined ? Number(longitude) : existingHotel.longitude;
    const updateArea = area !== undefined ? (area.trim() || null) : existingHotel.area;
    const updateRooms = rooms_available !== undefined && rooms_available !== '' ? Number(rooms_available) : existingHotel.rooms_available;

    const query = `
      UPDATE hotels
      SET title = $1, description = $2, price = $3, latitude = $4, longitude = $5,
          image_path = $6, area = $7, rooms_available = $8
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      updateTitle,
      updateDescription,
      updatePrice,
      updateLat,
      updateLng,
      imagePath,
      updateArea,
      updateRooms,
      id
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    if (req.file) deleteFile(req.file.filename);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/hotels/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const hotel = existingResult.rows[0];

    await pool.query('DELETE FROM hotels WHERE id = $1', [id]);
    deleteFile(hotel.image_path);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
