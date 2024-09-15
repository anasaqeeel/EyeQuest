import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EasyRoom from './pages/EasyRoom';
import HardRoom from './pages/HardRoom'
import MediumRoom from './pages/MediumRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/easy" element={<EasyRoom />} />
        <Route path="/medium" element={<MediumRoom />} />
        <Route path="/hard" element={<HardRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
