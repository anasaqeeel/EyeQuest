// MediumRoom.js
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import MediumRoomScene from '../components/MediumRoomScene';
import { OrbitControls } from '@react-three/drei';
import WebGazerComponent from '../hooks/WebGazerComponent'; // Import your WebGazerComponent
import './MediumRoom.css';

const MediumRoom = () => {
    const [timeLeft, setTimeLeft] = useState(30); // Timer starts at 30 seconds
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
            if (window.webgazer) {
                window.webgazer.end();
            }
            console.log('Game Over! Your final score:', score);
        }
    }, [isGameOver]);

    return (
        <div className="canvas-container">
            {!isLoaded && <div className="loading-message">Loading...</div>}
            {!isGameOver && isLoaded && (
                <div className="timer-display">
                    Time Left: {timeLeft} seconds
                </div>
            )}
            {isGameOver && <div className="game-over">Game Over!</div>}
            <Canvas
                camera={{ position: [-2, 1.995, 2.9], fov: 45, near: 0.1, far: 1000 }}
                className="canvas"
            >
                <ambientLight intensity={0.5} color={0xffffff} />
                <directionalLight intensity={1} position={[10, 10, 10]} color={0xffffff} />
                <Suspense fallback={null}>
                    <MediumRoomScene onLoaded={() => setIsLoaded(true)} /> {/* Pass onLoaded callback */}
                </Suspense>
                <OrbitControls enableDamping={true} />

                {/* WebGazerComponent will run as part of this Canvas, and we stop it when the game is over */}
                {!isGameOver && isLoaded && (
                    <WebGazerComponent
                        camera={undefined}
                        renderer={undefined}
                        objectsToCheck={undefined}
                        setScore={setScore}
                        isGameOver={isGameOver} // Pass the isGameOver prop here
                    />
                )}
            </Canvas>
        </div>
    );
};

export default MediumRoom;
