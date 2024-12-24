import {
  Scene,
  EquirectangularReflectionMapping,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  BackSide,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Scene
const scene = new Scene();
const sphereGeometry = new SphereGeometry(500, 60, 40); // Adjust size as needed

// Rotate the sphere
sphereGeometry.rotateY(Math.PI / 2); // Rotate 85 degrees around the Y axis

// Load the HDR environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  '/sky.hdr',
  (texture) => {
    // Set texture properties
    texture.mapping = EquirectangularReflectionMapping;

    // Create a sphere geometry for the skydome
    const sphereMaterial = new MeshBasicMaterial({
      map: texture,
      side: BackSide, // Render the inside of the sphere
    });

    // Create the skydome mesh
    const skydome = new Mesh(sphereGeometry, sphereMaterial);
    skydome.name = 'skydome';
    scene.add(skydome);

    // Optional: Apply the same texture as an environment map
    scene.environment = texture;
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

export default scene;
