const typeDefs = `
  type Client {
    id: ID!
    nom: String!
    prenom: String!
    email: String!
    telephone: String!
  }

  type Chambre {
    id: ID!
    type: String!
    prix: Float!
    disponible: Boolean!
  }

  type Reservation {
    id: ID!
    client: Client!
    chambre: Chambre!
    dateDebut: String!
    dateFin: String!
    preferences: String
  }

  input CreateReservationInput {
    clientId: ID!
    chambreId: ID!
    dateDebut: String!
    dateFin: String!
    preferences: String
  }

  input UpdateReservationInput {
    id: ID!
    clientId: ID
    chambreId: ID
    dateDebut: String
    dateFin: String
    preferences: String
  }

  type Query {
    reservation(id: ID!): Reservation
    reservations: [Reservation!]!
  }

  type Mutation {
    createReservation(input: CreateReservationInput!): Reservation!
    updateReservation(input: UpdateReservationInput!): Reservation!
    deleteReservation(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
