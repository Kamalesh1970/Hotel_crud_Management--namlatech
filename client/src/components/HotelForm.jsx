import { useState, useEffect } from 'react';
import './HotelForm.css';

function HotelForm({ initialData, onSubmit, submitting }) {
  const isEdit = Boolean(initialData && initialData.id);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [latitude, setLatitude] = useState(initialData?.latitude || '');
  const [longitude, setLongitude] = useState(initialData?.longitude || '');
  const [imageFile, setImageFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(() => {
    if (initialData?.image_path) {
      return `/${initialData.image_path}`;
    }
    return '';
  });

  const [errors, setErrors] = useState({});

  // Preview local image selection and revoke URL on cleanup
  useEffect(() => {
    let createdUrl = null;
    if (imageFile) {
      createdUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(createdUrl);
    }
    return () => {
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [imageFile]);

  function validate(values) {
    const newErrors = {};

    if (!values.title || values.title.trim().length < 3) {
      newErrors.title = 'Title is required (minimum 3 characters)';
    }

    if (!values.description || values.description.trim().length < 10) {
      newErrors.description = 'Description is required (minimum 10 characters)';
    }

    const numPrice = Number(values.price);
    if (!values.price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Price is required and must be greater than 0';
    }

    const numLat = Number(values.latitude);
    if (values.latitude === '' || isNaN(numLat) || numLat < -90 || numLat > 90) {
      newErrors.latitude = 'Latitude is required (between -90 and 90)';
    }

    const numLng = Number(values.longitude);
    if (values.longitude === '' || isNaN(numLng) || numLng < -180 || numLng > 180) {
      newErrors.longitude = 'Longitude is required (between -180 and 180)';
    }

    if (!isEdit && !values.imageFile) {
      newErrors.image = 'Hotel image is required';
    } else if (values.imageFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(values.imageFile.type)) {
        newErrors.image = 'Only JPG, PNG, and WebP images are allowed';
      } else if (values.imageFile.size > 2 * 1024 * 1024) {
        newErrors.image = 'Image size must be less than 2MB';
      }
    }

    return newErrors;
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
  }

  function handlePriceChange(e) {
    setPrice(e.target.value);
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  }

  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
    if (errors.latitude) setErrors((prev) => ({ ...prev, latitude: '' }));
  }

  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
    if (errors.longitude) setErrors((prev) => ({ ...prev, longitude: '' }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setImageFile(file || null);
    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formValues = {
      title,
      description,
      price,
      latitude,
      longitude,
      imageFile,
    };

    const validationErrors = validate(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    onSubmit(formData);
  }

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Hotel Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="e.g. Grand Palace Hotel"
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Describe amenities, location, rooms..."
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price (per night)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={handlePriceChange}
            placeholder="e.g. 150.00"
            className={errors.price ? 'input-error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={handleLatitudeChange}
            placeholder="-90 to 90"
            className={errors.latitude ? 'input-error' : ''}
          />
          {errors.latitude && <span className="error-text">{errors.latitude}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={handleLongitudeChange}
            placeholder="-180 to 180"
            className={errors.longitude ? 'input-error' : ''}
          />
          {errors.longitude && <span className="error-text">{errors.longitude}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">
          Hotel Image {isEdit ? '(optional, choose file to replace)' : '(required)'}
        </label>
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className={errors.image ? 'input-error' : ''}
        />
        {errors.image && <span className="error-text">{errors.image}</span>}

        {previewUrl && (
          <div className="image-preview-box">
            <p className="preview-label">Image Preview:</p>
            <img src={previewUrl} alt="Hotel preview" className="preview-image" />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Saving Hotel...' : isEdit ? 'Update Hotel' : 'Create Hotel'}
        </button>
      </div>
    </form>
  );
}

export default HotelForm;

