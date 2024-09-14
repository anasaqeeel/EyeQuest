import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

// Canvas
let objectsToCheck = [];
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
const ambientLight = new THREE.AmbientLight(0xFF7F7F, 0.5); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1); // Main light source
directionalLight.position.set(10, 10, 10); // Set light position
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let position = 0;

// Declare a variable for the snake object
let snake;

// GLTF Loader for the main room
const gltfLoader = new GLTFLoader();
gltfLoader.load('/model/horror_room/scene.gltf', (gltf) => {
  console.log('Our model here!', gltf);
  const model = gltf.scene;
  scene.add(model);

  model.traverse((child) => {
    if (child.isMesh) {
      console.log('Mesh found:', child);
      console.log('Position:', child.position);
      console.log('Scale:', child.scale);
      console.log('Material:', child.material);

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

  // Make the camera look at the center of the model
  camera.lookAt(center);

  // GUI Configurator
  const gui = new lilGui.GUI();
  gui.add(model.position, 'x').min(-100).max(100).step(0.001).name('Model X Axis Position');
  gui.add(model.position, 'y').min(-100).max(100).step(0.001).name('Model Y Axis Position');
  gui.add(model.position, 'z').min(-100).max(100).step(0.001).name('Model Z Axis Position');
});

// GLTF Loader for the additional 3D object
const gltfLoader2 = new GLTFLoader();
// gltfLoader2.load('/model/the_jericho_skull/scene.gltf', (gltf) => {
//   const skull = gltf.scene;
//   scene.add(skull);

//   // Set the position, scale, and rotation of the object
//   skull.position.set(-2.8, 0.8, 0.9); // Adjust the position as needed
//   skull.scale.set(0.05, 0.05, 0.05); // Adjust the scale if needed
//   skull.rotation.set(0.8, 1.8, 0);

//   console.log('Additional 3D object loaded:', skull);
// });
// ... (other commented loaders)

// GLTF Loader for the frag_knife
const gltfLoader3 = new GLTFLoader();
gltfLoader3.load('/model/frag_knife/scene.gltf', (gltf) => {
  const fragKnife = gltf.scene;
  scene.add(fragKnife);

  // Set the position, scale, and rotation of the object
  fragKnife.position.set(0, 0.2, 0); // Adjust the position as needed
  fragKnife.scale.set(0.2, 0.2, 0.2); // Adjust the scale if needed
  fragKnife.rotation.set(0, Math.PI / 4, 0); // Adjust the rotation if needed
  objectsToCheck.push(fragKnife);

  console.log('Additional 3D object loaded:', fragKnife);
});

// GLTF Loader for the snake with movement
const gltfLoader6 = new GLTFLoader();
gltfLoader6.load('/model/snake/scene.gltf', (gltf) => {
  snake = gltf.scene;
  scene.add(snake);

  // Set the position, scale, and rotation of the object
  snake.position.set(0.5, 0.6, 2.8); // Adjust the position as needed
  snake.scale.set(0.2, 0.2, 0.2); // Adjust the scale if needed
  snake.rotation.set(0, Math.PI / 4, 0); // Adjust the rotation if needed
  objectsToCheck.push(snake);

  console.log('Additional 3D object loaded:', snake);
});

// GLTF Loader for other objects
const gltfLoader8 = new GLTFLoader();
gltfLoader8.load('/model/dead_body/scene.gltf', (gltf) => {
  const deadBody = gltf.scene;
  scene.add(deadBody);

  // Set the position, scale, and rotation of the object
  deadBody.position.set(1.8, 0.1, 0); // Adjust the position as needed
  deadBody.scale.set(0.009, 0.009, 0.009); // Adjust the scale if needed
  deadBody.rotation.set(1.5, 3.0, 0); // Adjust the rotation if needed
  objectsToCheck.push(deadBody);

  console.log('Additional 3D object loaded:', deadBody);
});

const gltfLoader9 = new GLTFLoader();
gltfLoader9.load('/model/skull_downloadable/scene.gltf', (gltf) => {
  const skull = gltf.scene;
  scene.add(skull);

  // Set the position, scale, and rotation of the object
  skull.position.set(-1.8, 1.0, 1.5); // Adjust the position as needed
  skull.scale.set(0.2, 0.2, 0.2); // Adjust the scale if needed
  skull.rotation.set(0.8, 2.5, 0); // Adjust the rotation if needed
  objectsToCheck.push(skull);

  console.log('Additional 3D object loaded:', skull);
});

const gltfLoader10 = new GLTFLoader();
gltfLoader10.load('/model/skeleton/scene.gltf', (gltf) => {
  const skeleton = gltf.scene;
  scene.add(skeleton);

  // Set the position, scale, and rotation of the object
  skeleton.position.set(-2.8, 0.7, 1.5); // Adjust the position as needed
  skeleton.scale.set(0.5, 0.5, 0.5); // Adjust the scale if needed
  skeleton.rotation.set(0, 1.8, 0); // Adjust the rotation if needed
  objectsToCheck.push(skeleton);

  console.log('Additional 3D object loaded:', skeleton);
});

const gltfLoader11 = new GLTFLoader();
gltfLoader11.load('/model/blood_spattered/scene.gltf', (gltf) => {
  const bloodSpattered = gltf.scene;
  scene.add(bloodSpattered);

  // Set the position, scale, and rotation of the object
  bloodSpattered.position.set(0, 0.05, 1.5); // Adjust the position as needed
  bloodSpattered.scale.set(0.05, 0.05, 0.05); // Adjust the scale if needed
  bloodSpattered.rotation.set(0, 1.8, 0); // Adjust the rotation if needed
  objectsToCheck.push(bloodSpattered);

  console.log('Additional 3D object loaded:', bloodSpattered);
});

const gltfLoader12 = new GLTFLoader();
gltfLoader12.load('/model/peinture_portrait_edmon_picard_1884/scene.gltf', (gltf) => {
  const portrait = gltf.scene;
  scene.add(portrait);

  // Set the position, scale, and rotation of the object
  portrait.position.set(-1.8, 1.6, 3.2); // Adjust the position as needed
  portrait.scale.set(0.04, 0.04, 0.04); // Adjust the scale if needed
  portrait.rotation.set(0, 3.1, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', portrait);
});

const gltfLoader13 = new GLTFLoader();
gltfLoader13.load('/model/carpet_fluffy/scene.gltf', (gltf) => {
  const carpet = gltf.scene;
  scene.add(carpet);

  // Set the position, scale, and rotation of the object
  carpet.position.set(-1.6, 0.1, 0); // Adjust the position as needed
  carpet.scale.set(0.6, 0.6, 0.6); // Adjust the scale if needed
  carpet.rotation.set(0, 1.5, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', carpet);
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

  // Animate the snake if it's loaded
  if (snake) {
    // Increase the rotation speed
    snake.rotation.y += 0.05; // Increased from 0.01 to 0.05

    // Increase the movement speed
    snake.position.x = 0.5 + Math.sin(Date.now() * 0.005) * 2; // Adjusted multiplier for speed and range

    // Optional: Randomize movement for unpredictability
    snake.position.z = 2.8 + Math.cos(Date.now() * 0.006) * 1; // Added Z-axis movement
  }
};

renderer.setAnimationLoop(animate);

animate();

// Expose shared objects to window for WebGazer
window.sharedScene = scene;
window.sharedCamera = camera;
window.sharedRenderer = renderer;
window.objectsToCheck = objectsToCheck;
