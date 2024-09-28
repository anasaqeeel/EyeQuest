import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import EasyRoomScene from '../components/EasyRoomScene';
import { OrbitControls } from '@react-three/drei';
import './LandingPage.css';

const LandingPage = () => (
  <div className="landing-page">
    <div className="background">
      <Canvas
        camera={{ position: [-2, 1.995, 2.9], fov: 45 }}
        className="canvas"
      >
        <ambientLight intensity={0.5} />
        <directionalLight intensity={1} position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <EasyRoomScene />
        </Suspense>
        <OrbitControls enableDamping={true} enableZoom={false} />
      </Canvas>
    </div>
    <div className="content">
      <h1>Welcome to the Virtual Tour Game</h1>
      <div className="game-modes">
        <Link to="/easy">Easy Mode</Link>
        <Link to="/medium">Medium Mode</Link>
        <Link to="/hard">Hard Mode</Link>
      </div>
    </div>
  </div>
);

export default LandingPage;
