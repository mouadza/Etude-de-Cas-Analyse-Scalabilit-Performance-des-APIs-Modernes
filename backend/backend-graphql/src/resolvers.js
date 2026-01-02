module.exports = (pool) => ({
  Query: {
    reservation: async (_, { id }) => {
      const result = await pool.query(
        `SELECT r.*, 
         c.id as client_id, c.nom as client_nom, c.prenom as client_prenom, 
         c.email as client_email, c.telephone as client_telephone,
         ch.id as chambre_id, ch.type as chambre_type, ch.prix as chambre_prix, 
         ch.disponible as chambre_disponible
         FROM reservation r
         JOIN client c ON r.client_id = c.id
         JOIN chambre ch ON r.chambre_id = ch.id
         WHERE r.id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Reservation not found');
      }
      
      const row = result.rows[0];
      return {
        id: row.id.toString(),
        client: {
          id: row.client_id.toString(),
          nom: row.client_nom,
          prenom: row.client_prenom,
          email: row.client_email,
          telephone: row.client_telephone,
        },
        chambre: {
          id: row.chambre_id.toString(),
          type: row.chambre_type,
          prix: parseFloat(row.chambre_prix),
          disponible: row.chambre_disponible,
        },
        dateDebut: row.date_debut.toISOString().split('T')[0],
        dateFin: row.date_fin.toISOString().split('T')[0],
        preferences: row.preferences,
      };
    },
    
    reservations: async () => {
      const result = await pool.query(
        `SELECT r.*, 
         c.id as client_id, c.nom as client_nom, c.prenom as client_prenom, 
         c.email as client_email, c.telephone as client_telephone,
         ch.id as chambre_id, ch.type as chambre_type, ch.prix as chambre_prix, 
         ch.disponible as chambre_disponible
         FROM reservation r
         JOIN client c ON r.client_id = c.id
         JOIN chambre ch ON r.chambre_id = ch.id
         ORDER BY r.id`
      );
      
      return result.rows.map(row => ({
        id: row.id.toString(),
        client: {
          id: row.client_id.toString(),
          nom: row.client_nom,
          prenom: row.client_prenom,
          email: row.client_email,
          telephone: row.client_telephone,
        },
        chambre: {
          id: row.chambre_id.toString(),
          type: row.chambre_type,
          prix: parseFloat(row.chambre_prix),
          disponible: row.chambre_disponible,
        },
        dateDebut: row.date_debut.toISOString().split('T')[0],
        dateFin: row.date_fin.toISOString().split('T')[0],
        preferences: row.preferences,
      }));
    },
  },
  
  Mutation: {
    createReservation: async (_, { input }) => {
      const { clientId, chambreId, dateDebut, dateFin, preferences } = input;
      
      const result = await pool.query(
        `INSERT INTO reservation (client_id, chambre_id, date_debut, date_fin, preferences)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [clientId, chambreId, dateDebut, dateFin, preferences]
      );
      
      const reservation = result.rows[0];
      
      const clientResult = await pool.query('SELECT * FROM client WHERE id = $1', [clientId]);
      const chambreResult = await pool.query('SELECT * FROM chambre WHERE id = $1', [chambreId]);
      
      return {
        id: reservation.id.toString(),
        client: {
          id: clientResult.rows[0].id.toString(),
          nom: clientResult.rows[0].nom,
          prenom: clientResult.rows[0].prenom,
          email: clientResult.rows[0].email,
          telephone: clientResult.rows[0].telephone,
        },
        chambre: {
          id: chambreResult.rows[0].id.toString(),
          type: chambreResult.rows[0].type,
          prix: parseFloat(chambreResult.rows[0].prix),
          disponible: chambreResult.rows[0].disponible,
        },
        dateDebut: reservation.date_debut.toISOString().split('T')[0],
        dateFin: reservation.date_fin.toISOString().split('T')[0],
        preferences: reservation.preferences,
      };
    },
    
    updateReservation: async (_, { input }) => {
      const { id, clientId, chambreId, dateDebut, dateFin, preferences } = input;
      
      const updates = [];
      const values = [];
      let paramCount = 1;
      
      if (clientId !== undefined) {
        updates.push(`client_id = $${paramCount++}`);
        values.push(clientId);
      }
      if (chambreId !== undefined) {
        updates.push(`chambre_id = $${paramCount++}`);
        values.push(chambreId);
      }
      if (dateDebut !== undefined) {
        updates.push(`date_debut = $${paramCount++}`);
        values.push(dateDebut);
      }
      if (dateFin !== undefined) {
        updates.push(`date_fin = $${paramCount++}`);
        values.push(dateFin);
      }
      if (preferences !== undefined) {
        updates.push(`preferences = $${paramCount++}`);
        values.push(preferences);
      }
      
      if (updates.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      const result = await pool.query(
        `UPDATE reservation SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        throw new Error('Reservation not found');
      }
      
      const reservation = result.rows[0];
      const clientResult = await pool.query('SELECT * FROM client WHERE id = $1', [reservation.client_id]);
      const chambreResult = await pool.query('SELECT * FROM chambre WHERE id = $1', [reservation.chambre_id]);
      
      return {
        id: reservation.id.toString(),
        client: {
          id: clientResult.rows[0].id.toString(),
          nom: clientResult.rows[0].nom,
          prenom: clientResult.rows[0].prenom,
          email: clientResult.rows[0].email,
          telephone: clientResult.rows[0].telephone,
        },
        chambre: {
          id: chambreResult.rows[0].id.toString(),
          type: chambreResult.rows[0].type,
          prix: parseFloat(chambreResult.rows[0].prix),
          disponible: chambreResult.rows[0].disponible,
        },
        dateDebut: reservation.date_debut.toISOString().split('T')[0],
        dateFin: reservation.date_fin.toISOString().split('T')[0],
        preferences: reservation.preferences,
      };
    },
    
    deleteReservation: async (_, { id }) => {
      const result = await pool.query('DELETE FROM reservation WHERE id = $1', [id]);
      return result.rowCount > 0;
    },
  },
});

