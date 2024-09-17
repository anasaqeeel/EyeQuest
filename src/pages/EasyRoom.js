import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import EasyRoomScene from '../components/EasyRoomScene';
import { OrbitControls } from '@react-three/drei';
import './EasyRoom.css';

const EasyRoom = () => {
  const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 60 seconds
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); // Track if models are loaded
  const intervalRef = useRef(null); // To keep track of setInterval

  // Start the countdown timer when models are loaded
  useEffect(() => {
    if (isLoaded) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Update every second
    }

    return () => clearInterval(intervalRef.current); // Clean up interval on component unmount
  }, [isLoaded]);

  useEffect(() => {
    if (isGameOver) {
      // Stop the WebGazer when the game is over
      if (window.webgazer && typeof window.webgazer.end === 'function') {
        try {
          window.webgazer.end();
        } catch (error) {
          console.warn('Error stopping WebGazer:', error);
        }
      }
      console.log('Game Over! Your final score:', score);
      alert(`Game Over! Your final score: ${score}`);
    }
  }, [isGameOver, score]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [-2, 1.995, 2.9], fov: 45, near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight intensity={1} position={[10, 10, 10]} color="#ffffff" />
        <Suspense fallback={null}>
          <EasyRoomScene onLoaded={() => setIsLoaded(true)} setScore={setScore} />
        </Suspense>
        <OrbitControls enableDamping={true} />
      </Canvas>
      {/* Timer Display */}
      {!isGameOver && isLoaded && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          Time Left: {timeLeft} seconds
        </div>
      )}
      {/* Score Display */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
        }}
      >
        Score: {score}
      </div>
      {isGameOver && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '36px',
            fontWeight: 'bold',
          }}
        >
          Game Over!
        </div>
      )}
    </div>
  );
};

export default EasyRoom;
