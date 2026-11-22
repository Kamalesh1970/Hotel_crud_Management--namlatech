import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, deleteHotel } from '../redux/hotelsSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';

function Home() {
  const dispatch = useDispatch();
  const { list, total, loading, error } = useSelector((state) => state.hotels);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState(false);
  const toastTimerRef = useRef(null);

  // Clear toast timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const limit = 6;

  // Debounce search input by 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch hotels whenever debounced search, prices, or page change
  useEffect(() => {
    dispatch(
      fetchHotels({
        search: debouncedSearch,
        minPrice,
        maxPrice,
        page,
        limit,
      })
    );
  }, [dispatch, debouncedSearch, minPrice, maxPrice, page]);

  function handleMinPriceChange(e) {
    setMinPrice(e.target.value);
    setPage(1);
  }

  function handleMaxPriceChange(e) {
    setMaxPrice(e.target.value);
    setPage(1);
  }

  function handleClearFilters() {
    setSearchInput('');
    setDebouncedSearch('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this hotel?');
    if (!confirmed) return;

    try {
      await dispatch(deleteHotel(id)).unwrap();

      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToastError(false);
      setToastMessage('Hotel deleted successfully');
      toastTimerRef.current = setTimeout(() => {
        setToastMessage('');
      }, 2000);

      // If this was the last item on current page and not on page 1, go back one page
      if (list.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // Refresh current page
        dispatch(
          fetchHotels({
            search: debouncedSearch,
            minPrice,
            maxPrice,
            page,
            limit,
          })
        );
      }
    } catch (err) {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToastError(true);
      setToastMessage(err || 'Failed to delete hotel');
      toastTimerRef.current = setTimeout(() => {
        setToastMessage('');
        setToastError(false);
      }, 3000);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="home-page">
      <Helmet>
        <title>Hotels</title>
      </Helmet>

      {toastMessage && (
        <div className={`toast-popup ${toastError ? 'toast-error' : ''}`}>
          {toastMessage}
        </div>
      )}

      <div className="home-header">
        <div>
          <h2>Available Hotels</h2>
          <p className="subtitle">Explore and manage our collection of stays</p>
        </div>
        <Link to="/add" className="add-hotel-btn">
          + Add Hotel
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by hotel title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price</label>
          <input
            id="minPrice"
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            id="maxPrice"
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>

        <button
          type="button"
          className="clear-btn"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="status-message">Loading hotels...</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {/* Hotel Cards Grid */}
      {!loading && !error && list.length === 0 && (
        <p className="status-message">No hotels found.</p>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="hotel-grid">
          {list.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default Home;

