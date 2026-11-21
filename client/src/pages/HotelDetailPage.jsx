import { useParams } from 'react-router-dom';

function HotelDetailPage() {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h2>Hotel Detail #{id}</h2>
      <p>Hotel details and map will be displayed here in Phase 6.</p>
    </div>
  );
}

export default HotelDetailPage;

