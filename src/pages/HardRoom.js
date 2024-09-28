import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HardRoomScene from '../components/HardRoomScene';
import { OrbitControls } from '@react-three/drei';
import './HardRoom.css';

const HardRoom = () => {
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const handleVictory = () => {
        setIsGameOver(true);
        alert('You win!');
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Canvas
                camera={{ position: [-2, 1.995, 2.9], fov: 45, near: 0.1, far: 1000 }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.5} color="#ffffff" />
                <directionalLight intensity={1} position={[10, 10, 10]} color="#ffffff" />
                <Suspense fallback={null}>
                    <HardRoomScene setScore={setScore} onVictory={handleVictory} />
                </Suspense>
                <OrbitControls enableDamping={true} />
            </Canvas>

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
                        textAlign: 'center',
                    }}
                >
                    You Win!
                </div>
            )}
        </div>
    );
};

export default HardRoom;
