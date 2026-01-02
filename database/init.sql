-- Création de la base de données pour le système de gestion d'hôtel

CREATE TABLE IF NOT EXISTS client (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chambre (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservation (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    chambre_id INTEGER NOT NULL REFERENCES chambre(id) ON DELETE CASCADE,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (date_fin > date_debut)
);

-- Index pour améliorer les performances
CREATE INDEX idx_reservation_client ON reservation(client_id);
CREATE INDEX idx_reservation_chambre ON reservation(chambre_id);
CREATE INDEX idx_reservation_dates ON reservation(date_debut, date_fin);
CREATE INDEX idx_chambre_disponible ON chambre(disponible);

-- Données de test
INSERT INTO client (nom, prenom, email, telephone) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '0123456789'),
('Martin', 'Marie', 'marie.martin@email.com', '0987654321'),
('Bernard', 'Pierre', 'pierre.bernard@email.com', '0111223344');

INSERT INTO chambre (type, prix, disponible) VALUES
('Simple', 50.00, TRUE),
('Double', 80.00, TRUE),
('Suite', 150.00, TRUE),
('Simple', 50.00, TRUE),
('Double', 80.00, TRUE);

INSERT INTO reservation (client_id, chambre_id, date_debut, date_fin, preferences) VALUES
(1, 1, '2024-06-01', '2024-06-05', 'Vue sur jardin, lit king-size'),
(2, 2, '2024-06-10', '2024-06-15', 'Étage élevé, minibar');

