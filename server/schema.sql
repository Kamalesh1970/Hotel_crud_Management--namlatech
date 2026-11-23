CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    latitude NUMERIC(9, 6) CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC(9, 6) CHECK (longitude >= -180 AND longitude <= 180),
    price NUMERIC(10, 2) CHECK (price >= 0),
    rating NUMERIC(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
