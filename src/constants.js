/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// body
const body = document.querySelector('body');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// mixer
let mixer = null;

export { body, sizes, canvas, mixer };
