import GUI from 'lil-gui';

const gui = new GUI();

export const lilgui = (camera, sun, hemisphereLight) => {
  // Ambient Light lil-gui
  const hemisphereLightFolder = gui.addFolder('hemisphereLight');
  hemisphereLightFolder
    .add(hemisphereLight.position, 'x', -300, 300)
    .name('Position X');
  hemisphereLightFolder
    .add(hemisphereLight.position, 'y', -300, 300)
    .name('Position Y');
  hemisphereLightFolder
    .add(hemisphereLight.position, 'z', -300, 300)
    .name('Position Z');
  hemisphereLightFolder.close();
  // Camera lil-gui
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'x', -500, 500, 1).name('Position X');
  cameraFolder.add(camera.position, 'y', -500, 500, 1).name('Position Y');
  cameraFolder.add(camera.position, 'z', -500, 500, 1).name('Position Z');
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

  // Add camera rotation controls
  cameraFolder
    .add(camera.rotation, 'x', -Math.PI, Math.PI, 0.01)
    .name('Rotation X');
  cameraFolder
    .add(camera.rotation, 'y', -Math.PI, Math.PI, 0.01)
    .name('Rotation Y');
  cameraFolder
    .add(camera.rotation, 'z', -Math.PI, Math.PI, 0.01)
    .name('Rotation Z');

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
};
