import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { lilgui } from './lilgui';
import { directionalLight, ambientLight, hemisphereLight } from './lights';
import camera from './camera';
import renderer from './renderer';
import { canvas, mixer, sizes } from './constants';
import scene from './scene';
import { Water } from 'three/examples/jsm/objects/Water.js';
import sun from './meshes/sun';
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

// Performance monitoring
const stats = new (function () {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';

  let beginTime = Date.now(),
    prevTime = beginTime,
    frames = 0;
  const fpsElement = document.createElement('div');
  fpsElement.style.cssText =
    'padding:0 0 3px 3px;text-align:left;background-color:rgba(0,0,0,0.5);color:#0ff';
  container.appendChild(fpsElement);

  document.body.appendChild(container);

  return {
    update: function () {
      frames++;
      const time = Date.now();

      if (time >= prevTime + 1000) {
        const fps = Math.round((frames * 1000) / (time - prevTime));
        fpsElement.textContent = 'FPS: ' + fps;
        prevTime = time;
        frames = 0;
      }
    },
  };
})();

const loadingModal = document.getElementById('loading-modal');
const progressText = document.getElementById('progress-text');

const updateProgress = (percentage) => {
  progressText.textContent = `${percentage.toFixed(2)}%`;
};

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// === CAMERA SETUP ===
scene.add(camera);

// === CONTROLS SETUP ===
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
// Limit camera movement to improve performance
controls.maxDistance = 500;
controls.minDistance = 10;

// === RENDERER SETUP ===
renderer.toneMapping = THREE.ACESFilmicToneMapping; // More efficient tone mapping
renderer.toneMappingExposure = 0.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Enable performance optimizations
renderer.powerPreference = 'high-performance';

// === TEXTURE AND MODEL LOADING ===
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Cache for object optimization
const geometryCache = new Map();
const materialCache = new Map();

// Optimize model loading
let sceneModel = null;

gltfLoader.load(
  '/models/scene-compressed.gltf',
  (gltf) => {
    // Optimize the loaded model
    const model = gltf.scene;

    // Apply LOD (Level of Detail) technique for complex models
    model.traverse((child) => {
      if (child.isMesh) {
        // Optimize geometry
        if (geometryCache.has(child.geometry.uuid)) {
          child.geometry = geometryCache.get(child.geometry.uuid);
        } else {
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();

          // Store optimized geometries in cache
          geometryCache.set(child.geometry.uuid, child.geometry);
        }

        // Optimize materials
        if (materialCache.has(child.material.uuid)) {
          child.material = materialCache.get(child.material.uuid);
        } else {
          // Set appropriate material properties
          child.material.side = THREE.FrontSide; // Only render front faces
          child.material.needsUpdate = true;

          // Store materials in cache
          materialCache.set(child.material.uuid, child.material);
        }

        // Enable shadows only for larger objects to improve performance
        const size = child.geometry.boundingSphere.radius;
        child.castShadow = size > 10;
        child.receiveShadow = size > 5;

        // Enable frustum culling
        child.frustumCulled = true;
      }
    });

    model.castShadow = true;
    model.position.set(-15, -1, -200);
    sceneModel = model;
    scene.add(model);
    loadingModal.style.display = 'none'; // Hide loading modal when done
    console.log(sceneModel);
  },
  (xhr) => {
    const percentage = (xhr.loaded / xhr.total) * 100;
    updateProgress(percentage);
  },
  (error) => console.error('Error loading GLTF:', error)
);

// === SMOKE EMITTERS ===
// Dynamic emitter activation based on viewport visibility
const emitters = [
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5,
];

emitters.forEach((emitter) => {
  emitter.visible = false; // Start with hidden emitters
  scene.add(emitter);
});

// Function to check if object is in view
const frustum = new THREE.Frustum();
const cameraViewProjectionMatrix = new THREE.Matrix4();

function isInView(object) {
  camera.updateMatrixWorld();
  cameraViewProjectionMatrix.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

  return frustum.intersectsObject(object);
}

// === SUN AND LIGHTS ===
scene.add(ambientLight, directionalLight, hemisphereLight);

// Add Sun Mesh
scene.add(sun);

// Create Sun Light with performance optimizations
const sunLight = new THREE.PointLight(0xffdf00, 50, 50);
sunLight.castShadow = true;
// Optimize shadow map
sunLight.shadow.mapSize.width = 512; // Reduced from default
sunLight.shadow.mapSize.height = 512; // Reduced from default
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 500;
sunLight.shadow.bias = -0.001; // Reduces shadow acne
scene.add(sunLight);

// Update Sun Light position efficiently
let lastSunUpdate = 0;
const sunUpdateInterval = 100; // Update every 100ms instead of every frame

const updateLightPosition = (time) => {
  if (time - lastSunUpdate > sunUpdateInterval) {
    sunLight.position.copy(sun.position);
    directionalLight.position.copy(sun.position);
    lastSunUpdate = time;
  }
};

// === WATER ===
// Optimize water texture
const waterNormals = textureLoader.load(
  'https://threejs.org/examples/textures/waternormals.jpg',
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5); // Increase repeat to show more detail with fewer resources
    // Use mipmap for better performance at different distances
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2; // Use half of max anisotropy
  }
);

// Optimize water geometry - use a more efficient resolution
const waterResolution = window.innerWidth < 768 ? 64 : 128; // Adapt based on device
const waterGeometry = new THREE.PlaneGeometry(
  1000,
  500,
  waterResolution,
  waterResolution
);

// Create optimized water
const water = new Water(waterGeometry, {
  textureWidth: 256, // Reduced from 512
  textureHeight: 256, // Reduced from 512
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

// Variables for adaptive water animation
let waterAnimationSpeed = 1 / 10;
let lastWaterUpdate = 0;
const waterUpdateInterval = 16; // Update at 60fps

// === SMOKE SYSTEM ===
// Create a throttled version of the smoke system
let activeEmitters = [];

const updateActiveEmitters = () => {
  activeEmitters = emitters.filter((emitter) => {
    const isVisible = isInView(emitter);
    emitter.visible = isVisible;
    return isVisible;
  });
};

// Dynamic particle rate based on performance
let particleRate = 15; // Start with your default
let lastFpsCheck = 0;
const fpsCheckInterval = 2000; // Check every 2 seconds
let currentFps = 60;

const smokeEffect = particleSystemGenerator({
  camera,
  emitters: emitters, // Only pass active emitters
  parent: scene,
  rate: particleRate, // Dynamic rate based on performance
  texture: '/smoke.png',
});

// === POSTPROCESSING WITH SELECTIVE BLOOM ===
// Optimize composer resolution based on device
const dpr = Math.min(window.devicePixelRatio, 2);
const composerWidth = window.innerWidth * dpr;
const composerHeight = window.innerHeight * dpr;

const composer = new EffectComposer(renderer);
composer.setSize(composerWidth, composerHeight);

// RenderPass: Renders the full scene
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Optimize bloom pass
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(composerWidth, composerHeight),
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
finalComposer.setSize(composerWidth, composerHeight);
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

sun.layers.enable(BLOOM_LAYER);

// === MAIN ANIMATION LOOP ===
const clock = new THREE.Clock();
let previousTime = 0;
let frameCount = 0;

// Adaptive rendering based on performance
let renderQuality = 1.0; // Start at full quality

const updateRenderQuality = (fps) => {
  if (fps < 30) {
    renderQuality = Math.max(0.5, renderQuality - 0.05);
    particleRate = Math.max(5, particleRate - 1);
    waterAnimationSpeed = Math.max(1 / 20, waterAnimationSpeed - 0.01);
  } else if (fps > 55 && renderQuality < 1.0) {
    renderQuality = Math.min(1.0, renderQuality + 0.05);
    particleRate = Math.min(15, particleRate + 1);
    waterAnimationSpeed = Math.min(1 / 10, waterAnimationSpeed + 0.01);
  }

  // Apply quality settings
  renderer.setPixelRatio(Math.min(window.devicePixelRatio * renderQuality, 2));
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Performance monitoring
  frameCount++;
  if (elapsedTime - lastFpsCheck > fpsCheckInterval / 1000) {
    currentFps = Math.round(frameCount / (elapsedTime - lastFpsCheck || 1));
    updateRenderQuality(currentFps);
    frameCount = 0;
    lastFpsCheck = elapsedTime;

    // Update active emitters less frequently
    updateActiveEmitters();
  }

  // Update positions and effects
  updateLightPosition(elapsedTime * 1000);

  // Only update smoke for visible emitters
  if (smokeEffect && activeEmitters.length > 0) {
    smokeEffect.update(deltaTime);
  }

  if (mixer) {
    mixer.update(deltaTime);
  }

  controls.update();

  // Optimize water animation with time-based updates
  if (elapsedTime * 1000 - lastWaterUpdate > waterUpdateInterval) {
    water.material.uniforms['time'].value += deltaTime * waterAnimationSpeed;
    lastWaterUpdate = elapsedTime * 1000;
  }

  // Adaptive rendering - skip frames if performance is low
  if (currentFps < 30 && frameCount % 2 !== 0) {
    requestAnimationFrame(tick);
    return;
  }

  // Render bloom layer separately
  scene.traverse(nonBloomed);
  composer.render();

  scene.traverse(restoreMaterial);
  finalComposer.render();

  // Update stats
  stats.update();

  requestAnimationFrame(tick);
};

tick();

// === RESIZE EVENT ===
// Debounce resize for better performance
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Adjust quality based on screen size
    const isMobile = window.innerWidth < 768;
    renderQuality = isMobile ? 0.75 : 1.0;

    // Update renderer and composers
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio * renderQuality, 2)
    );

    const composerWidth = sizes.width * renderQuality;
    const composerHeight = sizes.height * renderQuality;
    composer.setSize(composerWidth, composerHeight);
    finalComposer.setSize(composerWidth, composerHeight);
  }, 250); // Wait 250ms after resize ends
});

// === VISIBILITY API for better performance when tab is not visible ===
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.stop(); // Pause the clock when tab is not visible
  } else {
    clock.start(); // Resume the clock when tab becomes visible again
  }
});

// === DEBUG UI ===
// Only initialize debug UI if not on mobile
if (window.innerWidth >= 768) {
  lilgui(camera, sun, hemisphereLight);
}
