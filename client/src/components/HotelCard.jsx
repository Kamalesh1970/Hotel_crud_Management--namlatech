import { useNavigate } from 'react-router-dom';

const placeholderImage =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22250%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22125%22%20fill%3D%22%2364748b%22%20font-size%3D%2216%22%20font-family%3D%22sans-serif%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

export const COIMBATORE_AREAS = [
  'RS Puram',
  'Gandhipuram',
  'Race Course',
  'Peelamedu',
  'Saibaba Colony',
  'Avinashi Road',
  'Singanallur',
  'Ukkadam',
];

export function getArea(hotel) {
  const combined = `${hotel.title || ''} ${hotel.description || ''}`;
  for (const area of COIMBATORE_AREAS) {
    if (combined.toLowerCase().includes(area.toLowerCase())) {
      return area;
    }
  }
  return null;
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `http://localhost:5000/${cleanPath}`;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export function renderStars(rating, reviewCount) {
  const count = Number(reviewCount) || 0;
  if (count === 0) {
    return <span className="no-reviews">No reviews yet</span>;
  }

  const num = Number(rating) || 0;
  const isHigh = num >= 4.0;
  const chipClass = isHigh ? 'rating-chip chip-green' : 'rating-chip chip-amber';

  return (
    <div className="rating-wrap">
      <span className={chipClass}>
        ★ {num.toFixed(1)}
      </span>
      <span className="review-count">({count} reviews)</span>
    </div>
  );
}

function HotelCard({ hotel, index = 0 }) {
  const navigate = useNavigate();

  const shortDesc =
    hotel.description && hotel.description.length > 100
      ? hotel.description.slice(0, 100) + '...'
      : hotel.description || '';

  const area = hotel.area || getArea(hotel);

  function handleCardClick() {
    navigate(`/hotel/${hotel.id}`);
  }

  return (
    <div
      className="hotel-card"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-image-wrap">
        <img
          src={getImageUrl(hotel.image_path)}
          alt={hotel.title}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />
        <span className="card-price">{formatPrice(hotel.price)} / night</span>
      </div>

      <div className="card-body">
        {area && <span className="area-pill">{area}</span>}
        <h3 className="card-title">{hotel.title}</h3>
        {renderStars(hotel.rating, hotel.review_count)}
        <p className="card-description">{shortDesc}</p>
      </div>
    </div>
  );
}

export default HotelCard;
