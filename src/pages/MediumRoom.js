import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import MediumRoomScene from '../components/MediumRoomScene';
import { OrbitControls } from '@react-three/drei';
import './MediumRoom.css';

const MediumRoom = () => {
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameOver(true);
        }, 25000); // 25 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="canvas-container">
            {isGameOver && <div className="game-over">Game Over!</div>}
            <Canvas
                camera={{ position: [-2, 1.995, 2.9], fov: 45, near: 0.1, far: 1000 }}
                className="canvas"
            >
                <ambientLight intensity={0.5} color={0xffffff} />
                <directionalLight intensity={1} position={[10, 10, 10]} color={0xffffff} />
                <Suspense fallback={null}>
                    <MediumRoomScene />
                </Suspense>
                <OrbitControls enableDamping={true} />
            </Canvas>
        </div>
    );
};

export default MediumRoom;
