// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EasyRoom from './pages/EasyRoom';
// Import MediumRoom and HardRoom when ready

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/easy" element={<EasyRoom />} />
        {/* Add routes for MediumRoom and HardRoom */}
      </Routes>
    </Router>
  );
}

export default App;
