import GUI from 'lil-gui';

const gui = new GUI();

export const lilgui = (
  camera,
  sun,
  smokeEmitter1,
  smokeEmitter2,
  smokeEmitter3,
  smokeEmitter4,
  smokeEmitter5,
  directionalLight
) => {
  // Camera lil-gui
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'x', -500, 500, 1).name('Position X');
  cameraFolder.add(camera.position, 'y', -500, 500, 1).name('Position Y');
  cameraFolder.add(camera.position, 'z', -500, 500, 1).name('Position Z');
  cameraFolder
    .add(camera.rotation, 'x', -Math.PI, Math.PI, 0.1)
    .name('Rotation X');
  cameraFolder
    .add(camera.rotation, 'y', -Math.PI, Math.PI, 0.1)
    .name('Rotation Y');
  cameraFolder
    .add(camera.rotation, 'z', -Math.PI, Math.PI, 0.1)
    .name('Rotation Z');
  cameraFolder
    .add(camera, 'fov', 1, 180, 0.1)
    .name('Field of View')
    .onChange(() => {
      camera.updateProjectionMatrix();
    });
  cameraFolder
    .add(camera, 'near', 0.01, 100, 0.1)
    .name('Near Clip')
    .onChange(() => {
      camera.updateProjectionMatrix();
    });
  cameraFolder
    .add(camera, 'far', 1, 5000, 1)
    .name('Far Clip')
    .onChange(() => {
      camera.updateProjectionMatrix();
    });

  cameraFolder.close();

  // sun
  const sunFolder = gui.addFolder('sun');
  sunFolder.add(sun.material, 'wireframe');
  sunFolder.add(sun.position, 'x', -300, 300).name('position X');
  sunFolder.add(sun.position, 'y', -300, 300).name('position Y');
  sunFolder.add(sun.position, 'z', -300, 300).name('position Z');
  sunFolder.add(sun.rotation, 'x', -Math.PI, Math.PI, 0.1).name('Rotation X');
  sunFolder.add(sun.rotation, 'y', -Math.PI, Math.PI, 0.1).name('Rotation Y');
  sunFolder.add(sun.rotation, 'z', -Math.PI, Math.PI, 0.1).name('Rotation Z');
  sunFolder.close();

  // Test Meshes lil-gui
  const smokeEmitter1Folder = gui.addFolder('Test Mesh 1');
  smokeEmitter1Folder
    .add(smokeEmitter1.position, 'x', -200, 200, 1)
    .name('Position X');
  smokeEmitter1Folder
    .add(smokeEmitter1.position, 'y', -200, 200, 1)
    .name('Position Y');
  smokeEmitter1Folder
    .add(smokeEmitter1.position, 'z', -200, 200, 1)
    .name('Position Z');

  const smokeEmitter2Folder = gui.addFolder('Test Mesh 2');
  smokeEmitter2Folder
    .add(smokeEmitter2.position, 'x', -200, 200, 1)
    .name('Position X');
  smokeEmitter2Folder
    .add(smokeEmitter2.position, 'y', -200, 200, 1)
    .name('Position Y');
  smokeEmitter2Folder
    .add(smokeEmitter2.position, 'z', -200, 200, 1)
    .name('Position Z');

  const smokeEmitter3Folder = gui.addFolder('Test Mesh 3');
  smokeEmitter3Folder
    .add(smokeEmitter3.position, 'x', -200, 200, 1)
    .name('Position X');
  smokeEmitter3Folder
    .add(smokeEmitter3.position, 'y', -200, 200, 1)
    .name('Position Y');
  smokeEmitter3Folder
    .add(smokeEmitter3.position, 'z', -200, 200, 1)
    .name('Position Z');

  const smokeEmitter4Folder = gui.addFolder('Test Mesh 3');
  smokeEmitter4Folder
    .add(smokeEmitter4.position, 'x', -200, 200, 1)
    .name('Position X');
  smokeEmitter4Folder
    .add(smokeEmitter4.position, 'y', -200, 200, 1)
    .name('Position Y');
  smokeEmitter4Folder
    .add(smokeEmitter4.position, 'z', -200, 200, 1)
    .name('Position Z');

  const smokeEmitter5Folder = gui.addFolder('Test Mesh 3');
  smokeEmitter5Folder
    .add(smokeEmitter5.position, 'x', -200, 200, 1)
    .name('Position X');
  smokeEmitter5Folder
    .add(smokeEmitter5.position, 'y', -200, 200, 1)
    .name('Position Y');
  smokeEmitter5Folder
    .add(smokeEmitter5.position, 'z', -200, 200, 1)
    .name('Position Z');
  const directionalLightFolder = gui.addFolder('direccional light');
  directionalLightFolder
    .add(directionalLight.position, 'x', -200, 200, 1)
    .name('Position X');
  directionalLightFolder
    .add(directionalLight.position, 'y', -200, 200, 1)
    .name('Position Y');
  directionalLightFolder
    .add(directionalLight.position, 'z', -200, 200, 1)
    .name('Position Z');

  smokeEmitter1Folder.close(); // Optionally close the folder
  smokeEmitter2Folder.close(); // Optionally close the folder
  smokeEmitter3Folder.close(); // Optionally close the folder
  smokeEmitter4Folder.close(); // Optionally close the folder
  smokeEmitter5Folder.close(); // Optionally close the folder
};
