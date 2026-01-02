const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const { Pool } = require('pg');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Parse DATABASE_URL if provided, otherwise use individual env vars
let dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'hotel_db',
  user: 'hotel_user',
  password: 'hotel_password'
};

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.substring(1),
      user: url.username,
      password: url.password
    };
  } catch (e) {
    console.error('Error parsing DATABASE_URL:', e);
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST || dbConfig.host,
    port: parseInt(process.env.DB_PORT) || dbConfig.port,
    database: process.env.DB_NAME || dbConfig.database,
    user: process.env.DB_USER || dbConfig.user,
    password: process.env.DB_PASSWORD || dbConfig.password
  };
}

const pool = new Pool(dbConfig);

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers(pool),
});

async function startServer() {
  await server.start();
  
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);

