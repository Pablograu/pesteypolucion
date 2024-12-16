import { PerspectiveCamera } from 'three';

export const generatePerspectiveCamera = (sizes) => {
  const camera = new PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.1,
    700
  );
  // camera.position.set(-56, 8, -90);

  camera.position.set(0, 4, -25);

  return camera;
};
