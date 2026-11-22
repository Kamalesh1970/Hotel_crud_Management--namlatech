# Hotel Management System Specification

## Overview
A responsive Single Page Application (SPA) with a Node.js + Express backend and PostgreSQL database to manage hotels (CRUD operations).

## Tech Stack
- **Frontend:** React, Redux, React Router, HTML, CSS, React Helmet
- **Backend:** Node.js, Express, Multer (file upload), pg (node-postgres)
- **Database:** PostgreSQL (Native parameterized SQL queries, no ORM)

---

## Backend Requirements

### Database Schema
Table: `hotels`
- `id` SERIAL PRIMARY KEY
- `title` VARCHAR(255) NOT NULL
- `description` TEXT NOT NULL
- `price` NUMERIC(10, 2) NOT NULL
- `latitude` DOUBLE PRECISION NOT NULL
- `longitude` DOUBLE PRECISION NOT NULL
- `image_url` VARCHAR(500)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### API Endpoints
1. `GET /api/hotels`
   - Query params: `search` (title search), `minPrice`, `maxPrice`, `page`, `limit` (or `offset`, `limit`)
   - Returns paginated list of hotels and total count.
2. `GET /api/hotels/:id`
   - Returns single hotel details by ID.
3. `POST /api/hotels`
   - Multipart form-data with `image`, `title`, `description`, `price`, `latitude`, `longitude`.
   - Validates fields, saves uploaded image to server `uploads/` directory, inserts record into DB using parameterized SQL.
4. `PUT /api/hotels/:id`
   - Updates hotel by ID, optionally updates image.
5. `DELETE /api/hotels/:id`
   - Deletes hotel by ID and removes image file from server.

---

## Frontend Requirements

### 1. Hotel List Page (Responsive Card Layout)
- Card layout displaying image, title, price, and description snippet.
- Search input (filter by title).
- Price range filters (min and max price).
- Pagination controls.
- Edit and Delete buttons on each card.
- Success confirmation popup/modal on delete.
- Clicking card/title redirects to Detail Page.

### 2. Add / Edit Hotel Form (Single Reusable Component)
- Reusable form component for both create and update operations.
- Inputs with validation:
  - Title (required text)
  - Description (required textarea)
  - Price (required number > 0)
  - Latitude & Longitude (required numeric coordinates)
  - Image upload with live preview capability.

### 3. Detail Page
- Displays full hotel details (title, description, price, large image).
- Map showing location based on latitude and longitude coordinates.
- React Helmet for dynamic meta tags (title, description).
- SEO & accessibility: Alt tags on all images.

### 4. State Management & Architecture
- Redux store for state management (hotels list, filters, current hotel, loading/errors).
- Clean, reusable components: Card, Form, Pagination, Map, Modal.

---



