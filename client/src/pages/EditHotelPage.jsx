import { useParams } from 'react-router-dom';

function EditHotelPage() {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h2>Edit Hotel #{id}</h2>
      <p>Edit form will be added here in Phase 5.</p>
    </div>
  );
}

export default EditHotelPage;

