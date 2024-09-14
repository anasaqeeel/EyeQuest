// src/pages/EasyRoom.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import EasyRoomScene from '../components/MediumRoomScene';
import { OrbitControls } from '@react-three/drei';
import './EasyRoom.css';

const EasyRoom = () => (
  <div className="canvas-container">
    {/* This div ensures the Canvas fills the viewport */}
    <Canvas
      camera={{ position: [-2, 1.995, 2.9], fov: 45, near: 0.1, far: 1000 }}
      className="canvas"
    >
      <ambientLight intensity={0.5} color={0xffffff} />
      <directionalLight intensity={1} position={[10, 10, 10]} color={0xffffff} />
      <Suspense fallback={null}>
        <EasyRoomScene />
      </Suspense>
      <OrbitControls enableDamping={true} />
    </Canvas>
  </div>
);

export default EasyRoom;
