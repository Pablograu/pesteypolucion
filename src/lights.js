import { AmbientLight, DirectionalLight, HemisphereLight } from 'three';

const ambientLight = new AmbientLight(0xffffff, 30);
const hemisphereLight = new HemisphereLight(0xffffff, 0x080820, 1);

// directional light
const directionalLight = new DirectionalLight(0xffffff, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -300;
directionalLight.shadow.camera.top = 300;
directionalLight.shadow.camera.right = 300;
directionalLight.shadow.camera.bottom = -300;
directionalLight.shadow.camera.near = 1;
directionalLight.position.set(0, 20, 200);

export { ambientLight, directionalLight, hemisphereLight };
