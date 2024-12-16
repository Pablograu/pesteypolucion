import { Scene, EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Scene
const scene = new Scene();

// Load the HDR environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  '/background.hdr',
  (texture) => {
    // Set texture properties
    texture.mapping = EquirectangularReflectionMapping;

    // Apply the environment map to the scene
    scene.environment = texture;

    // Optional: Apply the same texture as a background
    scene.background = texture;
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

export default scene;
