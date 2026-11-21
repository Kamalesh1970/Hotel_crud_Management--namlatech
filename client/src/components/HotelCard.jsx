import { Link, useNavigate } from 'react-router-dom';

function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();

  // Shorten description to around 100 characters
  const shortDesc =
    hotel.description && hotel.description.length > 100
      ? hotel.description.slice(0, 100) + '...'
      : hotel.description;

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
            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
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

