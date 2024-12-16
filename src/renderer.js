import { WebGLRenderer, PCFSoftShadowMap, ReinhardToneMapping } from 'three';

export const generateRenderer = (canvas, sizes) => {
  const renderer = new WebGLRenderer({
    canvas: canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Set the tone mapping type
  renderer.toneMapping = ReinhardToneMapping; // or THREE.ReinhardToneMapping, THREE.LinearToneMapping, etc.

  // Adjust the exposure
  renderer.toneMappingExposure = 0.1; // Increase or decrease this value as needed

  return renderer;
};
