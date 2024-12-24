export const enableLayer = (object, layer) => {
  if (object.children.length > 0) {
    object.children.forEach((child) => {
      enableLayer(child, layer);
    });
  }
  object.layers.set(layer);
};
