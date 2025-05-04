import { PerspectiveCamera } from 'three';
import { sizes } from './constants';

const camera = new PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 1000);

camera.position.set(0, 4, -25);

export default camera;
