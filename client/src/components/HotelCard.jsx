import { useNavigate } from 'react-router-dom';

const placeholderImage =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22250%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22125%22%20fill%3D%22%2364748b%22%20font-size%3D%2216%22%20font-family%3D%22sans-serif%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();

  const shortDesc =
    hotel.description && hotel.description.length > 100
      ? hotel.description.slice(0, 100) + '...'
      : hotel.description || '';

  function handleCardClick() {
    navigate(`/hotel/${hotel.id}`);
  }

  function handleEditClick(e) {
    e.stopPropagation();
    navigate(`/edit/${hotel.id}`);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    onDelete(hotel.id);
  }

  return (
    <div className="hotel-card" onClick={handleCardClick}>
      <div className="card-image-wrap">
        <img
          src={`/${hotel.image_path}`}
          alt={hotel.title}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />
        <span className="card-price">${Number(hotel.price).toFixed(2)} / night</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{hotel.title}</h3>
        <p className="card-description">{shortDesc}</p>

        <div className="card-actions">
          <button
            type="button"
            className="card-btn edit-btn"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            type="button"
            className="card-btn delete-btn"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
