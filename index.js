import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// --- Scene Setup ---
const scene = new THREE.Scene();

// --- Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Camera Setup ---
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1.5, 3);

// --- Orbit Controls Setup ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// --- Lighting Setup ---
const hemisphereLight = new THREE.HemisphereLight(0xe0f2f7, 0xa0c0d0, 0.9);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Brighter white light
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.bias = -0.001;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // White light, moderate intensity
scene.add(ambientLight);

// --- Gradient Background Setup ---
function createGradientBackground(color1, color2) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const topColor = "#ADD8E6";
const bottomColor = "#E0F2F7";
scene.background = createGradientBackground(topColor, bottomColor);

// --- GLTF Loader Setup ---
const gltfLoader = new GLTFLoader();

// --- Load GLTF Model ---
gltfLoader.load("Duck.glb", (gltf) => {
  const duck = gltf.scene;
  duck.traverse((child) => {
    if (child.isMesh) {
      child.geometry.center();
    }
  });
  scene.add(duck);
});

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// --- Event Listeners ---
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}
window.addEventListener("resize", onWindowResize);

// --- Start Animation ---
animate();
