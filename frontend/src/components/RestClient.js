import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reservations';

function RestClient() {
  const [reservations, setReservations] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    clientId: '1',
    chambreId: '1',
    dateDebut: '',
    dateFin: '',
    preferences: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createReservation = async () => {
    try {
      setError(null);
      const res = await axios.post(API_BASE_URL, {
        clientId: parseInt(formData.clientId),
        chambreId: parseInt(formData.chambreId),
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        preferences: formData.preferences
      });
      setResponse({ type: 'success', data: res.data });
      loadReservations();
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({ type: 'error', data: err.response?.data || err.message });
    }
  };

  const getReservation = async () => {
    if (!formData.id) {
      setError('Please enter a reservation ID');
      return;
    }
    try {
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/${formData.id}`);
      setResponse({ type: 'success', data: res.data });
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({ type: 'error', data: err.response?.data || err.message });
    }
  };

  const loadReservations = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setReservations(res.data);
    } catch (err) {
      console.error('Error loading reservations:', err);
    }
  };

  const updateReservation = async () => {
    if (!formData.id) {
      setError('Please enter a reservation ID');
      return;
    }
    try {
      setError(null);
      const res = await axios.put(`${API_BASE_URL}/${formData.id}`, {
        clientId: formData.clientId ? parseInt(formData.clientId) : undefined,
        chambreId: formData.chambreId ? parseInt(formData.chambreId) : undefined,
        dateDebut: formData.dateDebut || undefined,
        dateFin: formData.dateFin || undefined,
        preferences: formData.preferences || undefined
      });
      setResponse({ type: 'success', data: res.data });
      loadReservations();
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({ type: 'error', data: err.response?.data || err.message });
    }
  };

  const deleteReservation = async () => {
    if (!formData.id) {
      setError('Please enter a reservation ID');
      return;
    }
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/${formData.id}`);
      setResponse({ type: 'success', data: { message: 'Reservation deleted successfully' } });
      loadReservations();
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({ type: 'error', data: err.response?.data || err.message });
    }
  };

  React.useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div>
      <div className="card">
        <h2>REST API - CRUD Operations</h2>
        
        <div className="form-group">
          <label>Reservation ID (for Get/Update/Delete):</label>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            placeholder="Leave empty for create"
          />
        </div>

        <div className="form-group">
          <label>Client ID:</label>
          <input
            type="number"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Chambre ID:</label>
          <input
            type="number"
            name="chambreId"
            value={formData.chambreId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Date Début:</label>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Date Fin:</label>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Préférences:</label>
          <textarea
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            placeholder="Enter preferences..."
          />
        </div>

        <div className="button-group">
          <button className="btn btn-success" onClick={createReservation}>
            Create
          </button>
          <button className="btn btn-primary" onClick={getReservation}>
            Get
          </button>
          <button className="btn btn-secondary" onClick={updateReservation}>
            Update
          </button>
          <button className="btn btn-danger" onClick={deleteReservation}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={loadReservations}>
            Load All
          </button>
        </div>

        {response && (
          <div className={`response-display ${response.type}`}>
            <pre>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="card">
        <h2>All Reservations</h2>
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-item">
              <h3>Reservation #{res.id}</h3>
              <p><strong>Client ID:</strong> {res.clientId}</p>
              <p><strong>Chambre ID:</strong> {res.chambreId}</p>
              <p><strong>Date Début:</strong> {res.dateDebut}</p>
              <p><strong>Date Fin:</strong> {res.dateFin}</p>
              {res.preferences && <p><strong>Préférences:</strong> {res.preferences}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestClient;

