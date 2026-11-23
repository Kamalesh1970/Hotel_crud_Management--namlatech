import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels } from '../redux/hotelsSlice';
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

  const limit = 6;

  // Clear toast timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Find your stay in Coimbatore</h1>
          <p className="hero-subtitle">
            Discover handpicked rooms, suites, and boutique stays across the city
          </p>
        </div>
      </section>

      {/* Floating Filter Bar */}
      <div className="filter-card-wrap">
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
              placeholder="Min ₹"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Max ₹"
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
      </div>

      {/* Section Header */}
      <div className="home-header">
        <div>
          <h2>Available Stays</h2>
          <p className="subtitle">
            {total} {total === 1 ? 'hotel' : 'hotels'} found
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && <p className="status-message error-message">{error}</p>}

      {/* Skeleton Loading Cards */}
      {loading && (
        <div className="hotel-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="hotel-card skeleton-card">
              <div className="skeleton-image" />
              <div className="card-body">
                <div className="skeleton-line skeleton-pill" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-rating" />
                <div className="skeleton-line skeleton-desc" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && list.length === 0 && (
        <div className="empty-state">
          <div className="empty-badge">0 Results</div>
          <h3>No hotels found</h3>
          <p className="empty-text">
            No properties matched your search. Try resetting your search or price filters.
          </p>
          <button
            type="button"
            className="nav-button"
            onClick={handleClearFilters}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Hotel Cards Grid with Staggered Entrance */}
      {!loading && !error && list.length > 0 && (
        <div className="hotel-grid">
          {list.map((hotel, index) => (
            <HotelCard key={hotel.id} hotel={hotel} index={index} />
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
