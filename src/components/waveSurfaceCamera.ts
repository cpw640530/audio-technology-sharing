import { Vector3, type OrthographicCamera } from "three";

export function fitWaveSurfaceCamera(camera: OrthographicCamera, width: number, height: number) {
  const aspect = Math.max(1, width) / Math.max(1, height);
  camera.left = -12 * aspect;
  camera.right = 12 * aspect;
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const direction = camera.getWorldDirection(new Vector3());
  let extentX = 0;
  let extentZ = 0;
  // Intersect corner rays at both wave-height limits, then extend beyond the 12% edge fade.
  for (const elevation of [-1.73, 1.73]) {
    for (const x of [-1, 1]) for (const y of [-1, 1]) {
      const point = new Vector3(x, y, -1).unproject(camera);
      point.addScaledVector(direction, (elevation - point.y) / direction.y);
      extentX = Math.max(extentX, Math.abs(point.x));
      extentZ = Math.max(extentZ, Math.abs(point.z));
    }
  }
  const surfaceWidth = Math.max(44, Math.ceil(extentX / 0.38 / 4) * 4);
  const surfaceDepth = Math.max(28, Math.ceil(extentZ / 0.38 / 4) * 4);
  // Moving an orthographic camera along its view direction changes clipping, not scale.
  const distance = Math.hypot(surfaceWidth, surfaceDepth) * 2;
  camera.position.copy(direction).multiplyScalar(-distance);
  camera.far = distance * 3;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return { width: surfaceWidth, depth: surfaceDepth };
}
