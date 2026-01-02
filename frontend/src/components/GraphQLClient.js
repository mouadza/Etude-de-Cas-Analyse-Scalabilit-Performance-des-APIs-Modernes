import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useMutation, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const GET_RESERVATIONS = gql`
  query {
    reservations {
      id
      client {
        id
        nom
        prenom
        email
      }
      chambre {
        id
        type
        prix
      }
      dateDebut
      dateFin
      preferences
    }
  }
`;

const GET_RESERVATION = gql`
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      id
      client {
        id
        nom
        prenom
        email
      }
      chambre {
        id
        type
        prix
      }
      dateDebut
      dateFin
      preferences
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      client {
        id
        nom
        prenom
      }
      chambre {
        id
        type
        prix
      }
      dateDebut
      dateFin
      preferences
    }
  }
`;

const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($input: UpdateReservationInput!) {
    updateReservation(input: $input) {
      id
      client {
        id
        nom
        prenom
      }
      chambre {
        id
        type
        prix
      }
      dateDebut
      dateFin
      preferences
    }
  }
`;

const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(id: $id)
  }
`;

function GraphQLClient() {
  const [formData, setFormData] = useState({
    id: '',
    clientId: '1',
    chambreId: '1',
    dateDebut: '',
    dateFin: '',
    preferences: ''
  });
  const [response, setResponse] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_RESERVATIONS, {
    client,
    onError: (err) => setResponse({ type: 'error', data: err.message })
  });

  const [createReservation] = useMutation(CREATE_RESERVATION, {
    client,
    onCompleted: (data) => {
      setResponse({ type: 'success', data });
      refetch();
    },
    onError: (err) => setResponse({ type: 'error', data: err.message })
  });

  const [updateReservation] = useMutation(UPDATE_RESERVATION, {
    client,
    onCompleted: (data) => {
      setResponse({ type: 'success', data });
      refetch();
    },
    onError: (err) => setResponse({ type: 'error', data: err.message })
  });

  const [deleteReservation] = useMutation(DELETE_RESERVATION, {
    client,
    onCompleted: (data) => {
      setResponse({ type: 'success', data });
      refetch();
    },
    onError: (err) => setResponse({ type: 'error', data: err.message })
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = () => {
    createReservation({
      variables: {
        input: {
          clientId: formData.clientId,
          chambreId: formData.chambreId,
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          preferences: formData.preferences || null
        }
      }
    });
  };

  const handleUpdate = () => {
    if (!formData.id) {
      setResponse({ type: 'error', data: 'Please enter a reservation ID' });
      return;
    }
    updateReservation({
      variables: {
        input: {
          id: formData.id,
          clientId: formData.clientId || null,
          chambreId: formData.chambreId || null,
          dateDebut: formData.dateDebut || null,
          dateFin: formData.dateFin || null,
          preferences: formData.preferences || null
        }
      }
    });
  };

  const handleDelete = () => {
    if (!formData.id) {
      setResponse({ type: 'error', data: 'Please enter a reservation ID' });
      return;
    }
    deleteReservation({
      variables: { id: formData.id }
    });
  };

  return (
    <div>
      <div className="card">
        <h2>GraphQL API - CRUD Operations</h2>
        
        <div className="form-group">
          <label>Reservation ID (for Update/Delete):</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            placeholder="Leave empty for create"
          />
        </div>

        <div className="form-group">
          <label>Client ID:</label>
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Chambre ID:</label>
          <input
            type="text"
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
          <button className="btn btn-success" onClick={handleCreate}>
            Create
          </button>
          <button className="btn btn-secondary" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={() => refetch()}>
            Refresh
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
        {loading && <p>Loading...</p>}
        {error && <div className="response-display error">{error.message}</div>}
        {data && (
          <div className="reservation-list">
            {data.reservations.map((res) => (
              <div key={res.id} className="reservation-item">
                <h3>Reservation #{res.id}</h3>
                <p><strong>Client:</strong> {res.client.prenom} {res.client.nom} ({res.client.email})</p>
                <p><strong>Chambre:</strong> {res.chambre.type} - {res.chambre.prix}€</p>
                <p><strong>Date Début:</strong> {res.dateDebut}</p>
                <p><strong>Date Fin:</strong> {res.dateFin}</p>
                {res.preferences && <p><strong>Préférences:</strong> {res.preferences}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GraphQLClient;

