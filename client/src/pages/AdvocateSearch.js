import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdvocateSearch.css';

const AdvocateSearch = () => {
  const navigate = useNavigate();
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    location: '',
    minRating: '',
    serviceType: ''
  });

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key];
      });
      
      const response = await api.get('/advocates', { params });
      setAdvocates(response.data);
    } catch (error) {
      console.error('Error fetching advocates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdvocates();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      location: '',
      minRating: '',
      serviceType: ''
    });
    setTimeout(fetchAdvocates, 100);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="advocate-search-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Legal Advocates</h1>
          <p>Search and connect with experienced legal professionals</p>
        </div>

        <div className="search-section card">
          <form onSubmit={handleSearch}>
            <div className="search-grid">
              <div className="form-group">
                <input
                  type="text"
                  name="search"
                  className="form-control"
                  placeholder="Search by name, specialization..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="form-group">
                <select
                  name="specialization"
                  className="form-control"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                >
                  <option value="">All Specializations</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Property Law">Property Law</option>
                  <option value="Civil Litigation">Civil Litigation</option>
                  <option value="Tax Law">Tax Law</option>
                  <option value="Labour Law">Labour Law</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Location"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="form-group">
                <select
                  name="minRating"
                  className="form-control"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="serviceType"
                  className="form-control"
                  value={filters.serviceType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Services</option>
                  <option value="online">Online Only</option>
                  <option value="offline">Offline Only</option>
                </select>
              </div>

              <div className="search-buttons">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="results-section">
          <h2>{advocates.length} Advocates Found</h2>

          {advocates.length === 0 ? (
            <div className="card no-results">
              <p>No advocates found matching your criteria</p>
            </div>
          ) : (
            <div className="advocates-grid">
              {advocates.map((advocate) => (
                <div key={advocate.id} className="advocate-card card">
                  <div className="advocate-header">
                    <h3>{advocate.name}</h3>
                    {advocate.is_verified && (
                      <span className="badge badge-success">✓ Verified</span>
                    )}
                  </div>

                  <p className="specialization">{advocate.specialization}</p>
                  <p className="location">📍 {advocate.location}</p>

                  <div className="advocate-stats">
                    <span className="rating">
                      ⭐ {advocate.rating ? advocate.rating.toFixed(1) : 'New'}
                    </span>
                    <span className="reviews">
                      ({advocate.total_reviews} reviews)
                    </span>
                    <span className="experience">
                      💼 {advocate.experience_years} years
                    </span>
                  </div>

                  {advocate.bio && (
                    <p className="bio">{advocate.bio.substring(0, 120)}...</p>
                  )}

                  <div className="advocate-pricing">
                    <span className="price">₹{advocate.hourly_rate}/hr</span>
                    {advocate.is_available ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-danger">Busy</span>
                    )}
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => navigate(`/advocates/${advocate.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvocateSearch;
