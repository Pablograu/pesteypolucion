import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { lilgui } from './lilgui';
import { directionalLight, ambientLight } from './lights';
import { generatePerspectiveCamera } from './camera';
import { generateRenderer } from './renderer';
import { canvas, mixer, sizes } from './constants';
import scene from './scene';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { particleSystemGenerator } from './utils/particleSystem/particleSystem';
import FakeGlowMaterial from './utils/particleSystem/glowMaterial';
import {
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5,
} from './components/smokeEmitters';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Camera
 */
const camera = generatePerspectiveCamera(sizes);
scene.add(camera);

/**
 * Controls
 */
// to make orbit control work remove z index from canvas
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = generateRenderer(canvas, sizes);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // or your local path

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
// Load the GLB file
gltfLoader.load(
  '/models/scene-compressed.gltf',
  (gltf) => {
    const model = gltf.scene;
    model.castShadow = true;
    model.position.set(-15, -1, -200);

    scene.add(model);
  },
  (xhr) => {
    console.log(`${((xhr.loaded / xhr.total) * 100).toFixed(2)}% loaded`);
  },
  (error) => {
    console.error('An error occurred while loading the GLB file:', error);
  }
);

/**
 * smoke emitters
 */
scene.add(
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5
);

/**
 * Sun and lights
 */

scene.add(ambientLight);
scene.add(directionalLight);

// Create a Sun mesh

const sunGeometry = new THREE.SphereGeometry(150, 32, 32);
const fakeGlowMaterial = new FakeGlowMaterial({
  glowColor: 0xffa500,
  glowInternalRadius: 0.8,
  opacity: 1,
  side: THREE.DoubleSide,
});
const sun = new THREE.Mesh(sunGeometry, fakeGlowMaterial);
sun.position.z = 200;
sun.position.y = -152;

// Create a Point Light that will follow the Sun
const sunLight = new THREE.PointLight(0xffdf00, 50, 50);
sunLight.castShadow = true;

const updateLightPosition = () => {
  sunLight.position.copy(sun.position);
  directionalLight.position.copy(sun.position);
};

scene.add(sunLight, sun);

/**
 * Water
 */
const waterNormals = textureLoader.load(
  'https://threejs.org/examples/textures/waternormals.jpg',
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }
);

const waterGeometry = new THREE.PlaneGeometry(1000, 500);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: waterNormals,
  sunDirection: new THREE.Vector3(1, 1, 1),
  sunColor: 0xfff000,
  waterColor: 0x0077ff,
  distortionScale: 3.7,
  fog: scene.fog !== undefined,
});
water.rotation.x = -Math.PI / 2;
water.position.y = -3;
scene.add(water);

/**
 * smoke
 */

const smokeEffect = particleSystemGenerator({
  camera,
  emitters: [
    smokeEmitterMesh1,
    smokeEmitterMesh2,
    smokeEmitterMesh3,
    smokeEmitterMesh4,
    smokeEmitterMesh5,
  ],
  parent: scene,
  rate: 15,
  texture: '/smoke.png',
});

/**
 * GSAP Animation Timeline with ScrollTrigger
 */
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: document.querySelector('.section1'),
    start: 'top top',
    end: '+=200%', // Extends scroll area for slower progression
    scrub: 1,
    pin: true,
  },
  onComplete: () => console.log('complete'),
  onReverseComplete: () => console.log('reversed complete'),
});

tl.to(camera.position, { y: 50, z: -300, duration: 10 });
tl.to(sun.position, { y: 50, duration: 1 }, '<'); // "<" syncs with the previous animation
tl.to(camera.position, { x: -150, z: -300, duration: 1 });

/**
 * Resize
 */
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // sunlight follows sun
  updateLightPosition();

  // update smoke
  smokeEffect?.update(0.016);

  // Update mixer
  mixer && mixer.update(deltaTime);

  // Update water material (for wave movement)
  water.material.uniforms['time'].value += deltaTime / 10;

  // Update controls only if they are enabled
  if (controls.enabled) {
    controls.update();
  }

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();

lilgui(
  camera,
  sun,
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5,
  directionalLight
);
