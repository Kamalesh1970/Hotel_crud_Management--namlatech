# Hotel Management System

A responsive single-page application for managing hotel listings with search, price filters, image uploads, and interactive maps.

## Features
- Add, edit, view, and delete hotel listings.
- Image upload with live preview and automatic server storage.
- Old image files are removed on hotel deletion and image updates.
- Debounced search by title and filter by price range.
- Pagination with limit and offset controls.
- Hotel details page with OpenStreetMap location view.
- Distance calculation from user location using browser geolocation.
- Dynamic SEO meta tags and image fallback for broken URLs.

## Tech Stack
- Frontend: React, Redux Toolkit, React Router, React Helmet Async, Leaflet, React-Leaflet, Axios, Vanilla CSS
- Backend: Node.js, Express, Multer, pg (node-postgres), CORS, Dotenv
- Database: PostgreSQL
- Testing: Jest, Supertest, Vitest, React Testing Library

## Setup

### Database
Start the PostgreSQL container and apply the database schema:

```bash
docker start hotel-postgres || docker run --name hotel-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hotel_db -p 5432:5432 -d postgres:15-alpine
docker exec -i hotel-postgres psql -U postgres -c "CREATE DATABASE hotel_db;" 2>/dev/null || true
docker exec -i hotel-postgres psql -U postgres -c "CREATE DATABASE hotel_test_db;" 2>/dev/null || true
docker exec -i hotel-postgres psql -U postgres -d hotel_db < server/schema.sql
docker exec -i hotel-postgres psql -U postgres -d hotel_db < server/seed.sql
```

### Server
Install backend dependencies and run the server:

```bash
cd server
npm install
npm start
```
The server runs on http://localhost:5000.

### Client
In a separate terminal, install frontend dependencies and run the dev server:

```bash
cd client
npm install
npm run dev
```
The client runs on http://localhost:3000.

## Environment Variables
Server configuration is loaded from `server/.env`. Reference `server/.env.example` for available options:

- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Allowed CORS origin (default: http://localhost:3000)
- `PGHOST`: PostgreSQL host (default: localhost)
- `PGPORT`: PostgreSQL port (default: 5432)
- `PGUSER`: PostgreSQL user (default: postgres)
- `PGPASSWORD`: PostgreSQL password (default: postgres)
- `PGDATABASE`: PostgreSQL database name (default: hotel_db)
- `TEST_DATABASE_URL`: Connection string for running server tests

## Running Tests

Run backend tests:
```bash
cd server
npm test
```

Run frontend tests:
```bash
cd client
npm test
```

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | /api/hotels | Fetch paginated list of hotels with search and price filters |
| GET | /api/hotels/:id | Fetch a single hotel by ID |
| POST | /api/hotels | Create a new hotel with image upload |
| PUT | /api/hotels/:id | Update an existing hotel by ID |
| DELETE | /api/hotels/:id | Delete a hotel by ID and remove its image file |

## Folder Structure

```
hotel-crud-management/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelCard.jsx
│   │   │   ├── HotelForm.jsx
│   │   │   └── Pagination.jsx
│   │   ├── pages/
│   │   │   ├── AddHotel.jsx
│   │   │   ├── EditHotel.jsx
│   │   │   ├── Home.jsx
│   │   │   └── HotelDetail.jsx
│   │   ├── redux/
│   │   │   ├── hotelsSlice.js
│   │   │   └── store.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── HotelForm.test.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── routes/
│   │   └── hotels.js
│   ├── tests/
│   │   └── hotels.test.js
│   ├── uploads/
│   ├── db.js
│   ├── package.json
│   ├── schema.sql
│   ├── seed.sql
│   └── server.js
├── docs/
│   └── SPEC.md
├── .gitignore
├── README.md
└── requirements.txt
```
