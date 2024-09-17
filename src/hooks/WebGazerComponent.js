import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const WebGazerComponent = ({ camera, renderer, objectsToCheck, setScore }) => {
  const gazeHistory = [];
  const gazedObjects = useRef(new Set()); // Track which objects have been gazed at
  const gazeTimers = useRef({}); // Track how long the user gazes at each object
  const gameTimeout = useRef(null); // Store the game timeout

  const [isWebGazerInitialized, setIsWebGazerInitialized] = useState(false); // Track WebGazer initialization

  useEffect(() => {
    // Dynamically load the WebGazer script
    const script = document.createElement('script');
    script.src = 'https://webgazer.cs.brown.edu/webgazer.js'; // Make sure this URL is correct and accessible
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.webgazer) {
        console.error('WebGazer not found');
        return;
      }

      window.webgazer.setGazeListener((data, timestamp) => {
        if (data) {
          const { x, y } = data;
          smoothGaze(x, y);
        }
      });

      if (!isWebGazerInitialized) {
        // Start WebGazer
        window.webgazer
          .begin()
          .then(() => {
            console.log('WebGazer started');
          })
          .catch((error) =>
            console.error('WebGazer Initialization Error:', error)
          );

        window.webgazer.setTracker('TFFacemesh');
        window.webgazer.setRegression('ridge');
        window.webgazer.showPredictionPoints(true);

        setIsWebGazerInitialized(true); // Mark as initialized to prevent reinitialization
      }
    };

    // Smooth gaze data function to avoid jitter
    const smoothGaze = (x, y) => {
      gazeHistory.push({ x, y });
      if (gazeHistory.length > 20) {
        gazeHistory.shift();
      }

      const avgGaze = gazeHistory.reduce(
        (acc, point) => {
          acc.x += point.x;
          acc.y += point.y;
          return acc;
        },
        { x: 0, y: 0 }
      );

      avgGaze.x /= gazeHistory.length;
      avgGaze.y /= gazeHistory.length;

      checkGazeOnObject(avgGaze.x, avgGaze.y);
    };

    // Check if gaze falls on any 3D objects
    const checkGazeOnObject = (x, y) => {
      if (!camera || !renderer || !objectsToCheck) {
        console.log('Camera, renderer, or objects not found.');
        return;
      }

      objectsToCheck.forEach((object, index) => {
        if (object) {
          const screenPosition = toScreenPosition(object, camera, renderer);
          const radius = 50; // Gaze detection threshold in pixels

          if (
            Math.abs(x - screenPosition.x) <= radius &&
            Math.abs(y - screenPosition.y) <= radius
          ) {
            if (!gazedObjects.current.has(index)) {
              gazedObjects.current.add(index); // Mark this object as gazed at
              setScore((prevScore) => prevScore + 1); // Update the top-right score
              checkVictory();
            }
          }
        }
      });
    };

    // Convert 3D object position to 2D screen position
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

    // Check if all objects have been detected
    const checkVictory = () => {
      if (gazedObjects.current.size === objectsToCheck.length) {
        declareVictory();
      }
    };

    // Declare victory and stop WebGazer
    const declareVictory = () => {
      clearTimeout(gameTimeout.current);
      if (window.webgazer && typeof window.webgazer.end === 'function') {
        window.webgazer.end();
      }
      alert('Victory! All objects have been detected.');
    };

    // Clean up on unmount
    return () => {
      if (window.webgazer && typeof window.webgazer.end === 'function') {
        try {
          window.webgazer.end();
          console.log('WebGazer ended');
        } catch (error) {
          console.error('Error ending WebGazer:', error);
        }
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isWebGazerInitialized, camera, renderer, objectsToCheck, setScore]); // Add dependencies for objects that might change

  return null; // No need for additional rendering here
};

export default WebGazerComponent;
