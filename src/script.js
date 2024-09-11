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
const ambientLight = new THREE.AmbientLight(0x000000, 0.5); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Main light source
directionalLight.position.set(10, 10, 10); // Set light position
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let position = 0;

// GLTF Loader for the main room
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

//   console.log('Additional 3D object loaded:', object);
// });
// const gltfLoader4 = new GLTFLoader();
// gltfLoader4.load('/model/goblin/scene.gltf', (gltf) => {
//   const goblin = gltf.scene;
//   scene.add(goblin);

//   // Set the position, scale, and rotation of the object
//   goblin.position.set(1.8, 0.3, 0.9); // Adjust the position as needed
//   goblin.scale.set(0.005, 0.005, 0.005); // Adjust the scale if needed
//   goblin.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// const gltfLoader5 = new GLTFLoader();
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(-1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.5, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
// gltfLoader5.load('/model/spider_web/scene.gltf', (gltf) => {
//   const ghost = gltf.scene;
//   scene.add(ghost);

//   // Set the position, scale, and rotation of the object
//   ghost.position.set(1.8, 1.3, 0.9); // Adjust the position as needed
//   ghost.scale.set(0.0005, 0.0005, 0.0005); // Adjust the scale if needed
//   ghost.rotation.set(0.8, 2.4, 0);

//   console.log('Additional 3D object loaded:', object);
// });
const gltfLoader3 = new GLTFLoader();
gltfLoader3.load('/model/frag_knife/scene.gltf', (gltf) => {
  const object = gltf.scene;
  scene.add(object);

  // Set the position, scale, and rotation of the object
  object.position.set(0, 0.2, 0); // Adjust the position as needed
  object.scale.set(0.2, 0.2, 0.2); // Adjust the scale if needed
  object.rotation.set(0, Math.PI / 4, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});
const gltfLoader6 = new GLTFLoader();
gltfLoader6.load('/model/snake/scene.gltf', (gltf) => {
  const snake = gltf.scene;
  scene.add(snake);

  // Set the position, scale, and rotation of the object
  snake.position.set(0.5, 0.6, 2.8); // Adjust the position as needed
  snake.scale.set(0.2, 0.2, 0.2); // Adjust the scale if needed
  snake.rotation.set(0, Math.PI / 4, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});

// const gltfLoader7 = new GLTFLoader();
// gltfLoader7.load('/model/low_poly_dead_body_covered_game_ready/scene.gltf', (gltf) => {
//   const dead = gltf.scene;
//   scene.add(dead);

//   // Set the position, scale, and rotation of the object
//   dead.position.set(-1.8, 0.92, 1.8); // Adjust the position as needed
//   dead.scale.set(0.6, 0.6, 0.6); // Adjust the scale if needed
//   dead.rotation.set(0, 1.8, 0); // Adjust the rotation if needed

//   console.log('Additional 3D object loaded:', object);
// });
const gltfLoader8 = new GLTFLoader();
gltfLoader8.load('/model/dead_body/scene.gltf', (gltf) => {
  const object = gltf.scene;
  scene.add(object);

  // Set the position, scale, and rotation of the object
  object.position.set(1.8, 0.1, 0); // Adjust the position as needed
  object.scale.set(0.009, 0.009, 0.009); // Adjust the scale if needed
  object.rotation.set(1.5, 3.0, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});
const gltfLoader9 = new GLTFLoader();
gltfLoader9.load('/model/skull_downloadable/scene.gltf', (gltf) => {
  const object = gltf.scene;
  scene.add(object);

  // Set the position, scale, and rotation of the object
  object.position.set(-1.8, 1.0, 1.5); // Adjust the position as needed
  object.scale.set(0.2, 0.2, 0.2); // Adjust the scale if needed
  object.rotation.set(0.8, 2.5, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});
const gltfLoader10 = new GLTFLoader();
gltfLoader10.load('/model/skeleton/scene.gltf', (gltf) => {
  const object = gltf.scene;
  scene.add(object);

  // Set the position, scale, and rotation of the object
  object.position.set(-2.8, 0.7, 1.5); // Adjust the position as needed
  object.scale.set(0.5, 0.5, 0.5); // Adjust the scale if needed
  object.rotation.set(0, 1.8, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});
const gltfLoader11 = new GLTFLoader();
gltfLoader11.load('/model/blood_spattered/scene.gltf', (gltf) => {
  const object = gltf.scene;
  scene.add(object);

  // Set the position, scale, and rotation of the object
  object.position.set(0, 0.05, 1.5); // Adjust the position as needed
  object.scale.set(0.05, 0.05, 0.05); // Adjust the scale if needed
  object.rotation.set(0, 1.8, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});
const gltfLoader12 = new GLTFLoader();
gltfLoader12.load('/model/peinture_portrait_edmon_picard_1884/scene.gltf', (gltf) => {
  const snake = gltf.scene;
  scene.add(snake);

  // Set the position, scale, and rotation of the object
  snake.position.set(-1.8, 1.6, 3.2); // Adjust the position as needed
  snake.scale.set(0.04, 0.04, 0.04); // Adjust the scale if needed
  snake.rotation.set(0, 3.1, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
});
const gltfLoader13 = new GLTFLoader();
gltfLoader13.load('/model/carpet_fluffy/scene.gltf', (gltf) => {
  const snake = gltf.scene;
  scene.add(snake);

  // Set the position, scale, and rotation of the object
  snake.position.set(-1.6, 0.1, 0); // Adjust the position as needed
  snake.scale.set(0.6, 0.6, 0.6); // Adjust the scale if needed
  snake.rotation.set(0, 1.5, 0); // Adjust the rotation if needed

  console.log('Additional 3D object loaded:', object);
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
