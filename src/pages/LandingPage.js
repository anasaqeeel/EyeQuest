// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';


const LandingPage = () => (
  <div className="landing-page">
    <h1>Welcome to the Virtual Tour Game</h1>
    <div className="game-modes">
      <Link to="/easy">Easy Mode</Link>
      <Link to="/medium">Medium Mode</Link>
      <Link to="/hard">Hard Mode</Link>
    </div>
  </div>
);

export default LandingPage;
