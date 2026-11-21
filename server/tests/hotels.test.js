const request = require('supertest');
const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hotel_test_db';

const app = require('../server');
const pool = require('../db');

describe('Hotels API Endpoints', () => {
  beforeAll(async () => {
    // Ensure table exists in test database
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_path VARCHAR(255),
        latitude NUMERIC(9, 6) CHECK (latitude >= -90 AND latitude <= 90),
        longitude NUMERIC(9, 6) CHECK (longitude >= -180 AND longitude <= 180),
        price NUMERIC(10, 2) CHECK (price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE hotels RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    // Clean up uploaded test files from uploads directory (keep .gitkeep)
    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file !== '.gitkeep') {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      }
    }
    await pool.end();
  });

  // 1. POST valid fields and image
  test('POST with valid fields and an image returns 201 and the saved record', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .field('title', 'Ocean View Hotel')
      .field('description', 'A lovely beachfront resort with great amenities.')
      .field('price', '150.00')
      .field('latitude', '12.971598')
      .field('longitude', '77.594562')
      .attach('image', Buffer.from('fake-image-data'), 'hotel.png');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Ocean View Hotel');
    expect(res.body.image_path).toContain('uploads/');
  });

  // 2. POST missing title
  test('POST with a missing title returns 400', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .field('description', 'Missing title in this payload.')
      .field('price', '150.00')
      .field('latitude', '12.971598')
      .field('longitude', '77.594562')
      .attach('image', Buffer.from('fake-image-data'), 'hotel.png');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Title is required');
  });

  // 3. POST price -5
  test('POST with price -5 returns 400', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .field('title', 'Budget Stay')
      .field('description', 'Description with negative price.')
      .field('price', '-5')
      .field('latitude', '12.971598')
      .field('longitude', '77.594562')
      .attach('image', Buffer.from('fake-image-data'), 'hotel.png');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Price');
  });

  // 4. POST latitude 120
  test('POST with latitude 120 returns 400', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .field('title', 'Mountain Cabin')
      .field('description', 'Description with invalid latitude.')
      .field('price', '120.00')
      .field('latitude', '120')
      .field('longitude', '77.594562')
      .attach('image', Buffer.from('fake-image-data'), 'hotel.png');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Latitude');
  });

  // 5. POST with a .pdf as image
  test('POST with a .pdf as the image returns 400', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .field('title', 'Invalid Format Hotel')
      .field('description', 'Description with pdf file attached.')
      .field('price', '120.00')
      .field('latitude', '12.971598')
      .field('longitude', '77.594562')
      .attach('image', Buffer.from('%PDF-1.4'), 'document.pdf');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Only JPEG, PNG, and WebP');
  });

  // 6. GET returns list with { data, total }
  test('GET returns the list with { data, total }', async () => {
    await pool.query(`
      INSERT INTO hotels (title, description, price, latitude, longitude, image_path)
      VALUES ('Hotel A', 'Desc A', 100, 10, 20, 'uploads/a.png'),
             ('Hotel B', 'Desc B', 200, 15, 25, 'uploads/b.png')
    `);

    const res = await request(app).get('/api/hotels');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body.total).toBe(2);
    expect(res.body.data.length).toBe(2);
  });

  // 7. GET ?search= filters by title case-insensitively
  test('GET ?search= filters by title, case-insensitive', async () => {
    await pool.query(`
      INSERT INTO hotels (title, description, price, latitude, longitude, image_path)
      VALUES ('Grand Palace', 'Desc', 100, 10, 20, 'uploads/a.png'),
             ('Seaside View', 'Desc', 200, 15, 25, 'uploads/b.png')
    `);

    const res = await request(app).get('/api/hotels?search=grand');

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].title).toBe('Grand Palace');
  });

  // 8. GET ?minPrice= and ?maxPrice= filter correctly
  test('GET ?minPrice= and ?maxPrice= filter correctly', async () => {
    await pool.query(`
      INSERT INTO hotels (title, description, price, latitude, longitude, image_path)
      VALUES ('Budget Hotel', 'Desc', 50, 10, 20, 'uploads/a.png'),
             ('Mid Hotel', 'Desc', 150, 15, 25, 'uploads/b.png'),
             ('Luxury Hotel', 'Desc', 300, 20, 30, 'uploads/c.png')
    `);

    const res = await request(app).get('/api/hotels?minPrice=100&maxPrice=200');

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].title).toBe('Mid Hotel');
  });

  // 9. GET ?limit=2&offset=2 returns the right slice
  test('GET ?limit=2&offset=2 returns the right slice', async () => {
    await pool.query(`
      INSERT INTO hotels (id, title, description, price, latitude, longitude, image_path)
      VALUES (1, 'H1', 'Desc', 100, 10, 20, 'uploads/1.png'),
             (2, 'H2', 'Desc', 100, 10, 20, 'uploads/2.png'),
             (3, 'H3', 'Desc', 100, 10, 20, 'uploads/3.png'),
             (4, 'H4', 'Desc', 100, 10, 20, 'uploads/4.png')
    `);

    const res = await request(app).get('/api/hotels?limit=2&offset=2');

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.data.length).toBe(2);
    // Ordered by id DESC: ids 4, 3, 2, 1 -> offset 2 gives ids 2 and 1
    expect(res.body.data[0].id).toBe(2);
    expect(res.body.data[1].id).toBe(1);
  });

  // 10. PUT updates title and keeps old image when no new one sent
  test('PUT updates the title and keeps the old image when no new one is sent', async () => {
    const insertRes = await pool.query(`
      INSERT INTO hotels (title, description, price, latitude, longitude, image_path)
      VALUES ('Original Title', 'Desc', 100, 10, 20, 'uploads/original.png')
      RETURNING id
    `);
    const hotelId = insertRes.rows[0].id;

    const res = await request(app)
      .put(`/api/hotels/${hotelId}`)
      .field('title', 'Updated Title')
      .field('description', 'Desc')
      .field('price', '110')
      .field('latitude', '10')
      .field('longitude', '20');

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.image_path).toBe('uploads/original.png');
  });

  // 11. PUT on nonexistent ID returns 404
  test('PUT on an id that does not exist returns 404', async () => {
    const res = await request(app)
      .put('/api/hotels/999999')
      .field('title', 'Updated')
      .field('description', 'Desc')
      .field('price', '100')
      .field('latitude', '10')
      .field('longitude', '20');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain('Hotel not found');
  });

  // 12. DELETE returns success and removes image file
  test('DELETE returns success, and the image file is removed from uploads', async () => {
    const testImageName = 'test-delete-file.png';
    const testImagePath = path.join(__dirname, '../uploads', testImageName);
    fs.writeFileSync(testImagePath, 'dummy-image-content');

    const insertRes = await pool.query(`
      INSERT INTO hotels (title, description, price, latitude, longitude, image_path)
      VALUES ('To Delete', 'Desc', 100, 10, 20, 'uploads/${testImageName}')
      RETURNING id
    `);
    const hotelId = insertRes.rows[0].id;

    const res = await request(app).delete(`/api/hotels/${hotelId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('deleted successfully');
    expect(fs.existsSync(testImagePath)).toBe(false);
  });

  // 13. DELETE on missing ID returns 404
  test('DELETE on a missing id returns 404', async () => {
    const res = await request(app).delete('/api/hotels/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain('Hotel not found');
  });
});

