import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

const WebGazerComponent = ({ camera, renderer, objectsToCheck, setScore }) => {
  let score = 0;
  let gazeHistory = [];
  const gazedObjects = useRef(new Set()); // Track which objects have been gazed at
  const gazeTimers = useRef({}); // Track how long the user gazes at each object
  const webgazerTimeout = useRef(null); // Store the timeout for stopping WebGazer
  const gameTimeout = useRef(null); // Store the game timeout

  const [isCalibrating, setIsCalibrating] = useState(true); // Toggle between calibration and game modes
  const [clickCounts, setClickCounts] = useState(new Array(9).fill(0)); // Track clicks for each point
  const [isWebGazerInitialized, setIsWebGazerInitialized] = useState(false); // Track WebGazer initialization

  // Define 9 calibration points covering the viewport in a grid format
  const calibrationPoints = Array.from({ length: 9 }, (_, index) => ({
    id: index,
  }));

  // Separate useEffect for initializing WebGazer
  useEffect(() => {
    // Initialize WebGazer if available
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

      // Set up gaze listener
     

      setIsWebGazerInitialized(true); // Mark as initialized to prevent reinitialization
    }

    // Smooth gaze data function to avoid jitter
    const smoothGaze = (x, y) => {
      // console.log(`hello ${isCalibrating}`)
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

      // if (!isCalibrating) {
        checkGazeOnObject(avgGaze.x, avgGaze.y);
      // }
    };

    // Check if gaze falls on any 3D objects
    const checkGazeOnObject = (x, y) => {
      if (!camera || !renderer || !objectsToCheck) {
        console.log('Camera, renderer, or objects not found.');
        return;
      }
      // console.log('check gaze started');
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
              score++;
              updateScoreDisplay();
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

    // Update score display in the DOM
    const updateScoreDisplay = () => {
      setScore(score);
      console.log(`Score updated: ${score}`);
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
      window.webgazer.end();
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
    };
    // Only run once on mount and unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebGazerInitialized]);

  // Separate useEffect for handling calibration state changes
  // useEffect(() => {
  //   if (!isCalibrating) {
  //     console.log('Calibration complete. Starting game...');
  //     // Start game logic here, e.g., set timeouts, reset scores, etc.
  //     // Example:
  //     // gameTimeout.current = setTimeout(() => {
  //     //   declareLoss();
  //     // }, 300000); // 5 minutes
  //   }
  // }, [isCalibrating]);

  // const handleCalibrationClick = (index) => {
  //   console.log('Calibration point clicked:', index);
  //   setClickCounts((prevCounts) => {
  //     const newCounts = [...prevCounts];
  //     newCounts[index] += 1;
  //     console.log('Click counts:', newCounts);
  //     if (newCounts.every((count) => count >= 5)) {
  //       // All points clicked 5 times, start the game
  //       startGame();
  //     }
  //     return newCounts;
  //   });
  // };

  // const startGame = () => {
  //   console.log("hello")
  //   // setIsCalibrating(false);
  //   // Additional game start logic can go here
  // };

  // Render calibration points using CSS Grid
  return null
};

export default WebGazerComponent;