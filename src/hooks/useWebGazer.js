import { useEffect } from 'react';
import * as THREE from 'three';

const useWebGazer = (camera, objectsToCheck) => {
  useEffect(() => {
    if (!window.webgazer) {
      console.error('WebGazer not found');
      return;
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.webgazer
      .setGazeListener((data) => {
        if (data == null) return;
        const { x, y } = data;

        // Convert gaze coordinates to normalized device coordinates (NDC) for Three.js
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        // Use raycaster to find intersected objects
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objectsToCheck, true);

        if (intersects.length > 0) {
          console.log('Gaze intersects with:', intersects[0].object.name);
          // Perform action based on gaze intersection
        }
      })
      .begin()
      .catch((error) => console.error('WebGazer Error:', error));

    return () => {
      window.webgazer.end();
    };
  }, [camera, objectsToCheck]);
};

export default useWebGazer;
