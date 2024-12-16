// this file is not in use due to some depth issue with the sun
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

const textureLoader = new THREE.TextureLoader();
/**
 * Water
 */
const waterNormals = textureLoader.load(
  'https://threejs.org/examples/textures/waternormals.jpg',
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }
);

const waterGeometry = new THREE.PlaneGeometry(500, 100);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: waterNormals,
  sunDirection: new THREE.Vector3(1, 1, 1),
  sunColor: 0xfff000,
  waterColor: 0x0077ff,
  distortionScale: 3.7,

  // fog: scene.fog !== undefined,
});
water.rotation.x = -Math.PI / 2;
water.position.y = 0;

export default water;
