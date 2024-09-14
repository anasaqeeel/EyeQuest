import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near
  1000 // Far
);

// Initial position of the camera
camera.position.set(-2, 1.995, 2.9);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high-DPI screens

// Scene background color
scene.background = new THREE.Color(0xcccccc); // Light gray background for better visibility

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Main light source
directionalLight.position.set(10, 10, 10); // Set light position
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let position = 0;

// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/model/horror_room/scene.gltf', (gltf) => {
  console.log('Our model here!', gltf);
  const model = gltf.scene;
  scene.add(model);

  model.traverse((child) => {
    if (child.isMesh) {
      console.log(`Mesh found:`, child);
      console.log(`Position:`, child.position);
      console.log(`Scale:`, child.scale);
      console.log(`Material:`, child.material);

      // Ensure materials are visible
      child.material.transparent = false;
      child.material.opacity = 1;
      child.material.side = THREE.DoubleSide;
      child.material.color.set(0xffffff); // Set to white color
      child.material.needsUpdate = true;
    }
  });

  // Find the center of the loaded model
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());

  // Set the camera to the opposite position relative to the center
  camera.position.set(
    2 * center.x - camera.position.x,
    2 * center.y - camera.position.y,
    2 * center.z - camera.position.z
  );
  //  window.addEventListener('mouseup', function () {
  //   // Log camera position and rotation on click
  //   // console.log(Camera Position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z});
  //   // console.log(Camera Rotation: x=${camera.rotation.x}, y=${camera.rotation.y}, z=${camera.rotation.z});

  //   switch (position) {
  //     case 0:
  //       cameraMovement(-6.0, 1.72, 1.34);
  //       cameraRotation(-2.75, -1.24, -2.77);
  //       position = 1;
  //       break;

  //     case 1:
  //       cameraMovement(0.48, 2.09, -2.11);
  //       cameraRotation(-3.12, 0.22, 3.13);
  //       position = 2;
  //       break;
  //    case 2:
  //       cameraMovement(-1.49, 1.7, 0.48);
  //       cameraRotation(0.44, 1.43, -0.44);
  //       position = 0;
  //   }
  // });

  // Make the camera look at the center of the model
  camera.lookAt(center);

  // GUI Configurator
  const gui = new lilGui.GUI();
  gui.add(model.position, 'x').min(-100).max(100).step(0.001).name('Model X Axis Position');
  gui.add(model.position, 'y').min(-100).max(100).step(0.001).name('Model Y Axis Position');
  gui.add(model.position, 'z').min(-100).max(100).step(0.001).name('Model Z Axis Position');
});

// Functions to move and rotate the camera
function cameraMovement(x, y, z) {
  gsap.to(camera.position, {
    x,
    y,
    z,
    duration: 3,
  });
}

function cameraRotation(x, y, z) {
  gsap.to(camera.rotation, {
    x,
    y,
    z,
    duration: 3,
  });
}

// Animation and loop
const animate = () => {
  renderer.render(scene, camera);
  controls.update();
};

renderer.setAnimationLoop(animate);

animate();
