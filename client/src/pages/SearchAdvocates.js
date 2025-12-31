import React, { useState, useEffect } from 'react';
import { advocateService } from '../services';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SearchAdvocates.css';

const SearchAdvocates = () => {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    city: '',
    minExperience: ''
  });

  const specializations = [
    'Criminal Law',
    'Civil Law',
    'Corporate Law',
    'Family Law',
    'Property Law',
    'Tax Law',
    'Labour Law',
    'Constitutional Law',
    'IPR Law',
    'Other'
  ];

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const data = await advocateService.search(filters);
      setAdvocates(data);
    } catch (error) {
      toast.error('Failed to fetch advocates');
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

  const handleReset = () => {
    setFilters({
      specialization: '',
      city: '',
      minExperience: ''
    });
  };

  return (
    <div className="search-page">
      <div className="container">
        <h1>Find Your Advocate</h1>
        
        <div className="search-filters card">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-3">
              <div className="form-group">
                <label>Specialization</label>
                <select
                  name="specialization"
                  className="form-control"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="form-group">
                <label>Min Experience (Years)</label>
                <input
                  type="number"
                  name="minExperience"
                  className="form-control"
                  placeholder="0"
                  value={filters.minExperience}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>

            <div className="filter-buttons">
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="loading">Loading advocates...</div>
        ) : (
          <div className="advocates-grid">
            {advocates.length === 0 ? (
              <p className="no-results">No advocates found. Try adjusting your filters.</p>
            ) : (
              advocates.map(advocate => (
                <div key={advocate.id} className="advocate-card card">
                  <h3>{advocate.name}</h3>
                  <p className="specialization">{advocate.specialization}</p>
                  <div className="advocate-info">
                    <p><strong>Experience:</strong> {advocate.experience} years</p>
                    <p><strong>Location:</strong> {advocate.city}, {advocate.state}</p>
                    <p><strong>Rating:</strong> ⭐ {advocate.rating || 'N/A'}</p>
                  </div>
                  <Link to={`/advocate/${advocate.id}`} className="btn btn-primary btn-block">
                    View Profile
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAdvocates;
