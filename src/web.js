import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

window.onload = function () {
  let score = 0;
  let gazeHistory = [];

  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'scoreDisplay';
  scoreDisplay.style.position = 'absolute';
  scoreDisplay.style.top = '10px';
  scoreDisplay.style.left = '10px';
  scoreDisplay.style.color = 'black';
  scoreDisplay.style.fontSize = '20px';
  document.body.appendChild(scoreDisplay);

  console.log('Score display created.');

  // Start WebGazer with error handling
  webgazer
    .setGazeListener((data, elapsedTime) => {
      if (data == null) {
        console.log('No gaze data available');
        return;
      }

      const xPrediction = data.x;
      const yPrediction = data.y;

      // Smooth the gaze data to avoid jitter
      smoothGaze(xPrediction, yPrediction);
    })
    .begin()
    .catch((error) => {
      console.error('WebGazer Initialization Error:', error);
    });

  webgazer.on('webgazer:started', () => {
    console.log('WebGazer is running.');
  });

  webgazer.on('webgazer:error', (error) => {
    console.error('WebGazer Error:', error);
  });

  webgazer.setTracker('TFFacemesh');
  webgazer.setRegression('ridge');
  webgazer.showPredictionPoints(true);

  // Call the calibration after WebGazer begins
  webgazer.beginCalibration();

  console.log('WebGazer initialized.');

  function smoothGaze(x, y) {
    // Keep a history of the last 10 gaze points for smoothing
    gazeHistory.push({ x, y });
    if (gazeHistory.length > 10) {
      gazeHistory.shift();
    }

    // Average the gaze data to smooth the values
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

    // Now use the smoothed gaze data for object detection
    checkGazeOnObject(avgGaze.x, avgGaze.y);
  }

  function checkGazeOnObject(x, y) {
    const scene = window.sharedScene;
    const camera = window.sharedCamera;
    const renderer = window.sharedRenderer;
    const objectsToCheck = window.objectsToCheck;

    if (!scene || !camera || !renderer || !objectsToCheck) {
      console.log('Scene, camera, renderer, or objects not found.');
      return;
    }

    objectsToCheck.forEach((object, index) => {
      if (object) {
        const screenPosition = toScreenPosition(object, camera, renderer);

        const radius = 50;
        if (
          Math.abs(x - screenPosition.x) <= radius &&
          Math.abs(y - screenPosition.y) <= radius
        ) {
          console.log(`Object ${index} is within gaze range. Increasing score.`);
          score++;
          updateScoreDisplay();
        }
      } else {
        console.log(`Object ${index} is undefined.`);
      }
    });
  }

  function toScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    const widthHalf = 0.5 * renderer.domElement.width;
    const heightHalf = 0.5 * renderer.domElement.height;
    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return { x: vector.x, y: vector.y };
  }

  function updateScoreDisplay() {
    document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
    console.log(`Score updated: ${score}`);
  }

  console.log('Script loaded.');
};
