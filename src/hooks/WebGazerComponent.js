import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

import { Html } from '@react-three/drei';
const WebGazerComponent = ({
  camera,
  renderer,
  objectsToCheck,
  objectNames = [],
  setScore,
  onVictory,
}) => {
  const gazeHistory = useRef([]);
  const gazedObjects = useRef(new Set());

  const isWebGazerInitialized = useRef(false);

  const cameraRef = useRef(camera);
  const rendererRef = useRef(renderer);
  const objectsToCheckRef = useRef(objectsToCheck);
  const objectNamesRef = useRef(objectNames);
  const setScoreRef = useRef(setScore);

  const [notification, setNotification] = useState('');

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    rendererRef.current = renderer;
  }, [renderer]);

  useEffect(() => {
    objectsToCheckRef.current = objectsToCheck;
  }, [objectsToCheck]);

  useEffect(() => {
    objectNamesRef.current = objectNames;
  }, [objectNames]);

  useEffect(() => {
    setScoreRef.current = setScore;
  }, [setScore]);

  const smoothGaze = (x, y) => {
    gazeHistory.current.push({ x, y });
    if (gazeHistory.current.length > 20) {
      gazeHistory.current.shift();
    }

    const avgGaze = gazeHistory.current.reduce(
      (acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
      },
      { x: 0, y: 0 }
    );

    avgGaze.x /= gazeHistory.current.length;
    avgGaze.y /= gazeHistory.current.length;

    checkGazeOnObject(avgGaze.x, avgGaze.y);
  };

  const checkGazeOnObject = (x, y) => {
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const objectsToCheck = objectsToCheckRef.current;
    const objectNames = objectNamesRef.current;
    const setScore = setScoreRef.current;

    if (!camera || !renderer || !objectsToCheck) {
      console.log('Camera, renderer, or objects not found.');
      return;
    }

    objectsToCheck.forEach((object, index) => {
      if (object) {
        const screenPosition = toScreenPosition(object, camera, renderer);
        const radius = 100;

        if (
          Math.abs(x - screenPosition.x) <= radius &&
          Math.abs(y - screenPosition.y) <= radius
        ) {
          if (!gazedObjects.current.has(index)) {
            gazedObjects.current.add(index);
            const newScore = gazedObjects.current.size;
            if (typeof setScore === 'function') {
              setScore(newScore);
            } else {
              console.error('setScore is not a function');
            }
            console.log(`Score updated: ${newScore}`);

            if (objectNames && objectNames[index]) {
              setNotification(`Detected: ${objectNames[index]}`);
              setTimeout(() => {
                setNotification('');
              }, 3000);
            }

            if (newScore === objectsToCheck.length) {
              declareVictory();
            }
          }
        }
      }
    });
  };

  const toScreenPosition = (obj, camera, renderer) => {
    const vector = new THREE.Vector3();
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    const widthHalf = 0.5 * renderer.domElement.width;
    const heightHalf = 0.5 * renderer.domElement.height;
    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return { x: vector.x, y: vector.y };
  };

  const declareVictory = () => {
    if (window.webgazer && typeof window.webgazer.end === 'function') {
      window.webgazer.end();
    }
    if (onVictory) {
      onVictory();
    } else {
      alert('Victory! You have won the game.');
    }
  };

  useEffect(() => {
    if (!window.webgazer) {
      console.error('WebGazer not found');
      return;
    }

    if (!isWebGazerInitialized.current) {
      window.webgazer.setGazeListener((data) => {
        if (data) {
          const { x, y } = data;
          smoothGaze(x, y);
        }
      });

      window.webgazer
        .begin()
        .then(() => {
          console.log('WebGazer started');
          window.webgazer.showVideo(true);
          window.webgazer.showFaceOverlay(true);
          window.webgazer.showFaceFeedbackBox(true);
        })
        .catch((error) => console.error('WebGazer Initialization Error:', error));

      window.webgazer.setTracker('TFFacemesh');
      window.webgazer.setRegression('ridge');
      window.webgazer.showPredictionPoints(true);

      isWebGazerInitialized.current = true;
    }

    return () => {
      if (window.webgazer && typeof window.webgazer.end === 'function') {
        try {
          window.webgazer.end();
          console.log('WebGazer ended');
        } catch (error) {
          console.error('Error ending WebGazer:', error);
        }
      }
    };
  }, []);
  return (
    <>
      {notification && (
        <Html fullscreen>
          <div
            style={{
              position: 'fixed',
              bottom: '20%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '24px',
              fontWeight: 'bold',
              zIndex: 1000,
            }}
          >
            {notification}
          </div>
        </Html>
      )}
    </>
  );
};

export default WebGazerComponent;
