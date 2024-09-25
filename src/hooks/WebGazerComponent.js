// WebGazerComponent.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WebGazerComponent = ({
  camera,
  renderer,
  objectsToCheck,
  setScore,
  onVictory,
}) => {
  const gazeHistory = useRef([]);
  const gazedObjects = useRef(new Set());

  const isWebGazerInitialized = useRef(false);

  // Refs to hold the latest values
  const cameraRef = useRef(camera);
  const rendererRef = useRef(renderer);
  const objectsToCheckRef = useRef(objectsToCheck);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    rendererRef.current = renderer;
  }, [renderer]);

  useEffect(() => {
    objectsToCheckRef.current = objectsToCheck;
  }, [objectsToCheck]);

  // Initialize WebGazer only once
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
  }, []); // Empty dependency array

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

    if (!camera || !renderer || !objectsToCheck) {
      console.log('Camera, renderer, or objects not found.');
      return;
    }

    objectsToCheck.forEach((object, index) => {
      if (object) {
        const screenPosition = toScreenPosition(object, camera, renderer);
        const radius = 100; // Adjust the radius as needed

        if (
          Math.abs(x - screenPosition.x) <= radius &&
          Math.abs(y - screenPosition.y) <= radius
        ) {
          if (!gazedObjects.current.has(index)) {
            gazedObjects.current.add(index);
            const newScore = gazedObjects.current.size;
            setScore(newScore);
            console.log(`Score updated: ${newScore}`);

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

  return null;
};

export default WebGazerComponent;
