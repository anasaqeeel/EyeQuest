// HardRoomScene.js
import React, { useRef, useState, useEffect } from 'react';
import { useThree, extend } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import WebGazerComponent from '../hooks/WebGazerComponent'; // Moved to components

const HardRoomScene = ({ onLoaded, setScore }) => {
  const snakeRef = useRef();
  const fragKnifeRef = useRef();
  const deadBodyRef = useRef();
  const skullRef = useRef();
  const skeletonRef = useRef();
  const bloodSpatteredRef = useRef();
  const portraitRef = useRef();
  const carpetRef = useRef();

  const [objectsReady, setObjectsReady] = useState(false);

  const horrorRoom = useGLTF('/model/horror_room/scene.gltf');
  const fragKnife = useGLTF('/model/frag_knife/scene.gltf');
  const snake = useGLTF('/model/snake/scene.gltf');
  const deadBody = useGLTF('/model/dead_body/scene.gltf');
  const skull = useGLTF('/model/skull_downloadable/scene.gltf');
  const skeleton = useGLTF('/model/skeleton/scene.gltf');
  const bloodSpattered = useGLTF('/model/blood_spattered/scene.gltf');
  const portrait = useGLTF('/model/peinture_portrait_edmon_picard_1884/scene.gltf');
  const carpet = useGLTF('/model/carpet_fluffy/scene.gltf');

  const { camera, gl: renderer, clock } = useThree();

  const objectsToCheck = [
    snakeRef.current,
    fragKnifeRef.current,
    deadBodyRef.current,
    skullRef.current,
    skeletonRef.current,
    bloodSpatteredRef.current,
    portraitRef.current,
    carpetRef.current,
  ];

  // Ensure all objects are loaded before starting the game and WebGazer
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        snakeRef.current &&
        fragKnifeRef.current &&
        deadBodyRef.current &&
        skullRef.current &&
        skeletonRef.current &&
        bloodSpatteredRef.current &&
        portraitRef.current &&
        carpetRef.current
      ) {
        setObjectsReady(true);
        onLoaded(); // Notify parent that loading is complete
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onLoaded]);

  // Initialize WebGazer and handle snake animation
  useEffect(() => {
    let script;
    if (objectsReady) {
      script = document.createElement('script');
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.webgazer) {
          window.webgazer
            .setRegression('ridge')
            .setGazeListener((data, elapsedTime) => {
              // Your gaze listener code here
            })
            .begin();
        }
      };
    }

    return () => {
      if (window.webgazer && typeof window.webgazer.end === 'function') {
        try {
          window.webgazer.end();
        } catch (error) {
          console.error('Error ending WebGazer:', error);
        }
        window.webgazer = null;
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [objectsReady]);

  // Animation for the snake
  useEffect(() => {
    const animateSnake = () => {
      if (snakeRef.current) {
        // Rotate the snake
        snakeRef.current.rotation.y += 0.05;

        // Move the snake in a figure-eight pattern
        const time = clock.getElapsedTime();
        const radius = 2; // Adjust as needed
        const speed = 1; // Adjust as needed

        snakeRef.current.position.x = radius * Math.sin(speed * time);
        snakeRef.current.position.z = radius * Math.sin(speed * time) * Math.cos(speed * time);
      }
    };

    // Add a frame listener
    const handleFrame = () => animateSnake();

    renderer.setAnimationLoop(handleFrame);

    return () => {
      renderer.setAnimationLoop(null);
    };
  }, [clock, renderer]);

  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight intensity={1} position={[10, 10, 10]} color="#ffffff" />

      <primitive object={horrorRoom.scene} position={[0, 0, 0]} />

      <primitive
        ref={fragKnifeRef}
        object={fragKnife.scene}
        position={[0, 0.2, 0]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, Math.PI / 4, 0]}
      />

      <primitive
        ref={snakeRef}
        object={snake.scene}
        position={[0.5, 0.6, 2.8]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, Math.PI / 4, 0]}
      />

      <primitive
        ref={deadBodyRef}
        object={deadBody.scene}
        position={[1.8, 0.1, 0]}
        scale={[0.009, 0.009, 0.009]}
        rotation={[1.5, 3.0, 0]}
      />

      <primitive
        ref={skullRef}
        object={skull.scene}
        position={[-1.8, 1.0, 1.5]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0.8, 2.5, 0]}
      />

      <primitive
        ref={skeletonRef}
        object={skeleton.scene}
        position={[-2.8, 0.7, 1.5]}
        scale={[0.5, 0.5, 0.5]}
        rotation={[0, 1.8, 0]}
      />

      <primitive
        ref={bloodSpatteredRef}
        object={bloodSpattered.scene}
        position={[0, 0.05, 1.5]}
        scale={[0.05, 0.05, 0.05]}
        rotation={[0, 1.8, 0]}
      />

      <primitive
        ref={portraitRef}
        object={portrait.scene}
        position={[-1.8, 1.6, 3.2]}
        scale={[0.04, 0.04, 0.04]}
        rotation={[0, 3.1, 0]}
      />

      <primitive
        ref={carpetRef}
        object={carpet.scene}
        position={[-1.6, 0.1, 0]}
        scale={[0.6, 0.6, 0.6]}
        rotation={[0, 1.5, 0]}
      />

      {/* Score Display using Html component */}
      {/* <Html position={[0, 2, 0]}>
        <div
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          Score: {score}
        </div>
      </Html> */}

      {/* Start WebGazerComponent */}
      {objectsReady && (
        <WebGazerComponent
          camera={camera}
          renderer={renderer}
          objectsToCheck={objectsToCheck}
          setScore={setScore}
        />
      )}
    </>
  );
};

export default HardRoomScene;