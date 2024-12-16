import * as THREE from 'three';

const smokeEmitterGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const smokeEmitterMaterial = new THREE.MeshStandardMaterial({
  // color: 0xf3f70a,
  transparent: true,
  opacity: 0.01,
});

const smokeEmitterMesh1 = new THREE.Mesh(
  smokeEmitterGeometry,
  smokeEmitterMaterial
);
smokeEmitterMesh1.position.set(-70, 11, -210);

const smokeEmitterMesh2 = new THREE.Mesh(
  smokeEmitterGeometry,
  smokeEmitterMaterial
);
smokeEmitterMesh2.position.set(-77, 11, -210);

const smokeEmitterMesh3 = new THREE.Mesh(
  smokeEmitterGeometry,
  smokeEmitterMaterial
);
smokeEmitterMesh3.position.set(-89, 11, -210);

const smokeEmitterMesh4 = new THREE.Mesh(
  smokeEmitterGeometry,
  smokeEmitterMaterial
);
smokeEmitterMesh4.position.set(-98, 11, -210);

const smokeEmitterMesh5 = new THREE.Mesh(
  smokeEmitterGeometry,
  smokeEmitterMaterial
);
smokeEmitterMesh5.position.set(-125, 23, -210);

export {
  smokeEmitterMesh1,
  smokeEmitterMesh2,
  smokeEmitterMesh3,
  smokeEmitterMesh4,
  smokeEmitterMesh5,
};
