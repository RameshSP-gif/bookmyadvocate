import React, { useState, useEffect } from 'react';
import { bookingService, serviceService } from '../services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdvocateDashboard.css';

const AdvocateDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    service_type: 'both',
    category: '',
    price: '',
    duration_minutes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, servicesData] = await Promise.all([
        bookingService.getAdvocateBookings(),
        serviceService.getMyServices()
      ]);
      setBookings(bookingsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({ 
      title: '', 
      description: '', 
      service_type: 'both',
      category: '',
      price: '', 
      duration_minutes: '' 
    });
    setShowServiceModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      service_type: service.service_type,
      category: service.category,
      price: service.price,
      duration_minutes: service.duration_minutes
    });
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure all required fields are present
    const serviceData = {
      title: serviceForm.title,
      description: serviceForm.description,
      service_type: serviceForm.service_type || 'both',
      category: serviceForm.category || '',
      price: parseFloat(serviceForm.price),
      duration_minutes: parseInt(serviceForm.duration_minutes)
    };

    try {
      if (editingService) {
        await serviceService.update(editingService.id, serviceData);
        toast.success('Service updated successfully');
      } else {
        await serviceService.create(serviceData);
        toast.success('Service added successfully');
      }
      setShowServiceModal(false);
      fetchData();
    } catch (error) {
      console.error('Service operation error:', error);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.delete(id);
        toast.success('Service deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingService.updateStatus(bookingId, status);
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="advocate-dashboard-page">
      <div className="container">
        <h1>Advocate Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name}!</p>

        <div className="dashboard-stats">
          <div className="stat-card card">
            <h3>Total Bookings</h3>
            <p className="stat-number">{bookings.length}</p>
          </div>
          <div className="stat-card card">
            <h3>Pending</h3>
            <p className="stat-number">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="stat-card card">
            <h3>Services</h3>
            <p className="stat-number">{services.length}</p>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h2>My Services</h2>
            <button className="btn btn-primary" onClick={handleAddService}>
              Add Service
            </button>
          </div>
          
          {services.length === 0 ? (
            <p>No services added yet. Add your first service!</p>
          ) : (
            <div className="services-grid">
              {services.map(service => (
                <div key={service.id} className="service-card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="service-meta">
                    <span className="price">₹{service.price}</span>
                    <span className="duration">{service.duration_minutes} mins</span>
                    <span className="badge badge-info">{service.service_type}</span>
                  </div>
                  <div className="service-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEditService(service)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.userName}</td>
                      <td>{booking.serviceName}</td>
                      <td>{new Date(booking.scheduledDate).toLocaleString()}</td>
                      <td>{booking.serviceType}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            >
                              Confirm
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showServiceModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <form onSubmit={handleServiceSubmit}>
                <div className="form-group">
                  <label>Service Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                    required
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Service Type</label>
                  <select
                    className="form-control"
                    value={serviceForm.service_type}
                    onChange={(e) => setServiceForm({...serviceForm, service_type: e.target.value})}
                    required
                  >
                    <option value="both">Both (Online & Offline)</option>
                    <option value="online">Online Only</option>
                    <option value="offline">Offline Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                    placeholder="e.g., Legal Consultation, Court Representation"
                  />
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceForm.duration_minutes}
                      onChange={(e) => setServiceForm({...serviceForm, duration_minutes: e.target.value})}
                      required
                      min="15"
                      step="15"
                    />
                  </div>
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Update' : 'Add'} Service
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowServiceModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvocateDashboard;
