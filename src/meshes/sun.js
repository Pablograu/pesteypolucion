import * as THREE from 'three';

const sunGeometry = new THREE.SphereGeometry(40, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffcc33,
  emissive: 0xffa500,
  emissiveIntensity: 1.5,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, -152, 300);

export default sun;
