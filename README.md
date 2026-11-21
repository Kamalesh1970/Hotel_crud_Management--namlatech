# Hotel Management System

## Overview
A responsive Single Page Application (SPA) for managing hotel listings with complete CRUD functionality, image uploads, price/title filters, pagination, interactive location mapping, and geolocation distance calculation.

## Tech Stack
- **Frontend:** React (Vite), Redux Toolkit, React Router, React Helmet Async, Leaflet, React-Leaflet, Axios, Vanilla CSS
- **Backend:** Node.js, Express, Multer, pg (node-postgres), CORS, Dotenv
- **Database:** PostgreSQL (raw parameterized SQL, no ORM)

## Features
- Hotel card listings with responsive grid layout (mobile, tablet, desktop).
- Debounced keyword search by hotel title.
- Min and max price filtering.
- Offset/limit pagination with active state and prev/next navigation.
- Reusable form component for both adding and editing hotels with validation and live image preview.
- File upload handling restricting to JPEG, PNG, and WebP up to 2MB.
- Automatic image cleanup from the filesystem on hotel deletion or image replacement.
- Hotel details page with dynamic SEO tags (meta title, description, and Open Graph).
- Interactive OpenStreetMap centered on hotel latitude/longitude with popup pin.
- User geolocation button calculating straight-line distance to the hotel in kilometers.

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running locally or via Docker. Create the database:

```bash
# Example using psql
psql -U postgres -c "CREATE DATABASE hotel_db;"

# Run schema and initial seed data
psql -U postgres -d hotel_db -f server/schema.sql
psql -U postgres -d hotel_db -f server/seed.sql
```

*(Alternatively, run PostgreSQL in Docker:)*
```bash
docker run --name hotel-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hotel_db -p 5432:5432 -d postgres:15
docker exec -i hotel-postgres psql -U postgres -d hotel_db < server/schema.sql
docker exec -i hotel-postgres psql -U postgres -d hotel_db < server/seed.sql
```

### 2. Backend Server Setup
```bash
cd server
npm install
node server.js
```
The server will start on `http://localhost:5000`.

### 3. Frontend Client Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:3000`.

## Environment Variables

Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:3000` |
| `PGHOST` | PostgreSQL host | `localhost` |
| `PGPORT` | PostgreSQL port | `5432` |
| `PGUSER` | PostgreSQL user | `postgres` |
| `PGPASSWORD` | PostgreSQL password | `postgres` |
| `PGDATABASE` | Database name | `hotel_db` |

## API Endpoints

| Method | Endpoint | Query / Body | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | `?search=&minPrice=&maxPrice=&limit=&offset=` | Returns `{ data: [...], total: N }` matching filters |
| `GET` | `/api/hotels/:id` | None | Returns single hotel record or 404 |
| `POST` | `/api/hotels` | Multipart (`title`, `description`, `price`, `latitude`, `longitude`, `image`) | Creates a new hotel and saves image to `/uploads` |
| `PUT` | `/api/hotels/:id` | Multipart (`title`, `description`, `price`, `latitude`, `longitude`, optional `image`) | Updates hotel and replaces image if provided |
| `DELETE` | `/api/hotels/:id` | None | Deletes hotel record and removes image file from server |

## Folder Structure

```
hotel-crud-management/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelCard.jsx     # Card component with image, details, edit/delete
│   │   │   ├── HotelForm.jsx     # Reusable form component with validation & preview
│   │   │   └── Pagination.jsx    # Page buttons, prev/next controls
│   │   ├── pages/
│   │   │   ├── Home.jsx           # List view, filter bar, debounced search, deletion
│   │   │   ├── AddHotel.jsx       # Add hotel page wrapping HotelForm
│   │   │   ├── EditHotel.jsx      # Edit hotel page wrapping HotelForm
│   │   │   └── HotelDetail.jsx    # Details page, Leaflet map, distance calculation
│   │   ├── redux/
│   │   │   ├── store.js           # Central Redux store
│   │   │   └── hotelsSlice.js     # Async thunks and reducers for CRUD state
│   │   ├── App.jsx                # Router, header navigation, 404 catch-all
│   │   ├── App.css                # Central responsive stylesheet with CSS variables
│   │   ├── index.css              # Reset and basic typography
│   │   └── main.jsx               # React entry point with Redux and Helmet providers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # Proxies /api and /uploads to port 5000
├── server/
│   ├── routes/
│   │   └── hotels.js              # Express router for all hotel CRUD operations
│   ├── uploads/                   # Statically served local directory for uploaded images
│   ├── db.js                      # PostgreSQL connection pool with node-postgres
│   ├── schema.sql                 # Table definition with check constraints
│   ├── seed.sql                   # 12 initial sample hotel records
│   ├── server.js                  # Express app initialization, static files, error middleware
│   ├── .env.example               # Environment variables template
│   └── package.json
├── docs/
│   └── SPEC.md                    # Project requirements and specification
├── .gitignore
└── README.md
```

## Design Decisions
- **Raw Parameterized SQL over ORM:** Used `pg` with `$1, $2` parameters throughout to keep queries explicit, secure against SQL injection, and lightweight without extra ORM abstractions.
- **Single Reusable Form Component:** Built `HotelForm.jsx` to power both create and update operations, eliminating duplicated form markup and validation logic.
- **Client-Side Debouncing:** Debounced keyword search input by 500ms using a clean `useEffect` timer cleanup to avoid unnecessary API requests while typing.
- **Safe Image Lifecycle Management:** Server automatically deletes previous image files from disk when a hotel is deleted or when an image is replaced, avoiding orphaned files.
- **Pure CSS without UI Frameworks:** Handled responsiveness across mobile, tablet, and desktop using plain CSS grid, flexbox, and CSS variables for fast load times and clean maintenance.
