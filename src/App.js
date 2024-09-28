import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const EasyRoom = lazy(() => import('./pages/EasyRoom'));
const MediumRoom = lazy(() => import('./pages/MediumRoom'));
const HardRoom = lazy(() => import('./pages/HardRoom'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/easy" element={<EasyRoom />} />
          <Route path="/medium" element={<MediumRoom />} />
          <Route path="/hard" element={<HardRoom />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
