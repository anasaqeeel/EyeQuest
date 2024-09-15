import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WebGazerComponent = ({ camera, renderer, objectsToCheck, setScore }) => {
  let score = 0;
  let gazeHistory = [];
  const gazedObjects = useRef(new Set()); // Track which objects have been gazed at
  const webgazerTimeout = useRef(null); // Store the timeout for stopping WebGazer

  useEffect(() => {
    // Initialize WebGazer if available
    if (!window.webgazer) {
      console.error('WebGazer not found');
      return;
    }

    // Start WebGazer and set up gaze listener
    window.webgazer
      .setGazeListener((data) => {
        if (!data) {
          console.log('No gaze data available');
          return;
        }
        const { x, y } = data;
        smoothGaze(x, y);
      })
      .begin()
      .catch((error) => console.error('WebGazer Initialization Error:', error));

    window.webgazer.setTracker('TFFacemesh');
    window.webgazer.setRegression('ridge');
    window.webgazer.showPredictionPoints(true);

    // Set timeout to stop WebGazer after 5 minutes
    webgazerTimeout.current = setTimeout(() => {
      console.log('Stopping WebGazer after 5 minutes.');
      window.webgazer.end();
    }, 300000); // 5 minutes = 300000 ms

    // Smooth gaze data function to avoid jitter
    const smoothGaze = (x, y) => {
      gazeHistory.push({ x, y });
      if (gazeHistory.length > 10) {
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
            // If this object hasn't been gazed at before, increase the score
            if (!gazedObjects.current.has(index)) {
              gazedObjects.current.add(index); // Mark this object as gazed at
              score++;
              updateScoreDisplay();
              console.log(`Object ${index} is within gaze range. Score increased.`);
            } else {
              console.log(`Object ${index} has already been gazed at.`);
            }
          }
        } else {
          console.log(`Object ${index} is undefined.`);
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

    // Update score display in the DOM
    const updateScoreDisplay = () => {
      setScore(score);
      console.log(`Score updated: ${score}`);
    };

    // Clean up on unmount
    return () => {
      clearTimeout(webgazerTimeout.current); // Clear the timeout if the component unmounts
      window.webgazer.end();
    };
  }, [camera, renderer, objectsToCheck, setScore]); // Dependencies

  return null; // This component doesn't render anything
};

export default WebGazerComponent;
