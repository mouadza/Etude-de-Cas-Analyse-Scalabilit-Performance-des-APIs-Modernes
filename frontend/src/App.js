import React, { useState } from 'react';
import './App.css';
import RestClient from './components/RestClient';
import GraphQLClient from './components/GraphQLClient';

function App() {
  const [activeTab, setActiveTab] = useState('rest');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hotel Management API Testing</h1>
        <p>Compare REST, SOAP, GraphQL, and gRPC APIs</p>
      </header>
      
      <nav className="tab-nav">
        <button 
          className={activeTab === 'rest' ? 'active' : ''}
          onClick={() => setActiveTab('rest')}
        >
          REST API
        </button>
        <button 
          className={activeTab === 'graphql' ? 'active' : ''}
          onClick={() => setActiveTab('graphql')}
        >
          GraphQL API
        </button>
      </nav>
      
      <main className="main-content">
        {activeTab === 'rest' && <RestClient />}
        {activeTab === 'graphql' && <GraphQLClient />}
      </main>
    </div>
  );
}

export default App;

