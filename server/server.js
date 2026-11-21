const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const hotelRoutes = require('./routes/hotels');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded hotel images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/hotels', hotelRoutes);

app.get('/', (req, res) => {
  res.send('Hotel Management API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

