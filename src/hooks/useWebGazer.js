// src/hooks/useWebGazer.js
import { useEffect } from 'react';

const useWebGazer = (objectsToCheck) => {
  useEffect(() => {
    if (!window.webgazer) {
      console.error('WebGazer not found');
      return;
    }

    window.webgazer
      .setGazeListener((data, elapsedTime) => {
        if (data == null) return;
        const { x, y } = data;
        // Process gaze data here
        // Check if gaze is on any object in objectsToCheck
      })
      .begin()
      .catch((error) => console.error('WebGazer Error:', error));

    return () => {
      window.webgazer.end();
    };
  }, [objectsToCheck]);
};

export default useWebGazer;
