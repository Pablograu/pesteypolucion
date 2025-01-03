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
import { particleSystemGenerator } from './utils/particleSystem';
import {
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5,
} from './components/smokeEmitters';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// === CAMERA SETUP ===
const camera = generatePerspectiveCamera(sizes);
scene.add(camera);

// === CONTROLS SETUP ===
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

// === RENDERER SETUP ===
const renderer = generateRenderer(canvas, sizes);
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 0.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// === TEXTURE AND MODEL LOADING ===
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Load GLTF Model
gltfLoader.load(
  '/models/scene-compressed.gltf',
  (gltf) => {
    const model = gltf.scene;
    model.castShadow = true;
    model.position.set(-15, -1, -200);
    scene.add(model);
  },
  (xhr) =>
    // console.log(`${((xhr.loaded / xhr.total) * 100).toFixed(2)}% loaded`),
    (error) =>
      console.error('Error loading GLTF:', error)
);

// === SMOKE EMITTERS ===
scene.add(
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5
);

// === SUN AND LIGHTS ===
scene.add(ambientLight, directionalLight);

// Create Sun Mesh
const sunGeometry = new THREE.SphereGeometry(40, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffcc33,
  emissive: 0xffa500,
  emissiveIntensity: 1.5,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, -152, 300);

scene.add(sun);

// Create Sun Light
const sunLight = new THREE.PointLight(0xffdf00, 50, 50);
sunLight.castShadow = true;
scene.add(sunLight);
// Update Sun Light position to follow the Sun
const updateLightPosition = () => {
  sunLight.position.copy(sun.position);
  directionalLight.position.copy(sun.position);
};

// === WATER ===
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

// === SMOKE SYSTEM ===
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

// === GSAP ANIMATIONS ===
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: document.querySelector('.section1'),
    start: 'top top',
    end: '+=200%',
    scrub: 2,
    pin: true,
  },
  onComplete: () => console.log('complete'),
  onReverseComplete: () => console.log('reversed complete'),
});

tl.to(camera.position, { y: 50, z: -300, duration: 1 });
tl.to(renderer, { toneMappingExposure: 0.1, duration: 1 }, '<'); // "<" syncs with the previous animation
tl.to(sun.position, { y: 50, duration: 1 }, '<');
tl.to(camera.position, { x: -157, z: -325, duration: 1 });
tl.to(camera.rotation, { y: -0.46, duration: 1 }, '<');

// === POSTPROCESSING WITH SELECTIVE BLOOM ===
const composer = new EffectComposer(renderer);

// RenderPass: Renders the full scene
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// BloomPass: Applies bloom effect to objects in BLOOM_LAYER
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8, // strength
  0.5, // radius
  0.3 // threshold
);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const mixPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: composer.renderTarget2.texture },
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
  }),
  'baseTexture'
);

const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderPass);
finalComposer.addPass(mixPass);
finalComposer.addPass(outputPass);

// layers
const BLOOM_LAYER = 1; // Layer for selective bloom
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = {};

const nonBloomed = (obj) => {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
};

const restoreMaterial = (obj) => {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
};

// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// const onPointerDown = (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(scene.children, false);
//   if (intersects.length > 0) {
//     const object = intersects[0].object;
//     object.layers.toggle(BLOOM_LAYER);
//   }
// };

// window.addEventListener('pointerdown', onPointerDown);

sun.layers.enable(BLOOM_LAYER);

// === MAIN ANIMATION LOOP ===
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update positions and effects
  updateLightPosition();
  smokeEffect?.update(deltaTime);
  mixer?.update(deltaTime);

  water.material.uniforms['time'].value += deltaTime / 10;

  // Render bloom layer separately
  scene.traverse(nonBloomed);
  composer.render();

  scene.traverse(restoreMaterial);
  finalComposer.render();

  requestAnimationFrame(tick);
};

tick();

// === RESIZE EVENT ===
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.setSize(sizes.width, sizes.height);
  finalComposer.setSize(sizes.width, sizes.height);
});

// === DEBUG UI ===
lilgui(camera, sun);
