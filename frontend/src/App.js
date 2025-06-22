import React from 'react';
import './App.css';
import TenantList from './TenantList';

function App() {
  return (
    <div className="App">
      <header className="App-header-minimal">
        <div className="header-content">
          <span className="header-logo" role="img" aria-label="building">🏢</span>
          <h1>Property Management Dashboard</h1>
        </div>
        <div className="header-flare"></div>
      </header>
      <main className="App-main">
        <TenantList />
      </main>
    </div>
  );
}

export default App; 