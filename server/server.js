const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const hotelRoutes = require('./routes/hotels');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Ensure uploads folder exists on startup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Serve uploaded hotel images statically
app.use('/uploads', express.static(uploadsDir));

app.use('/api/hotels', hotelRoutes);

app.get('/', (req, res) => {
  res.send('Hotel Management API is running');
});

// Global error handler to prevent server crashes
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
