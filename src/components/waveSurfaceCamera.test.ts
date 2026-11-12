import { expect, it } from "vitest";
import { OrthographicCamera, Vector3 } from "three";
import { fitWaveSurfaceCamera } from "./waveSurfaceCamera";

it.each([[390, 844], [844, 390], [1440, 900], [2560, 1080], [3840, 1080], [7680, 1080]])(
  "extends the surface without zooming at %i x %i", (width, height) => {
    const camera = new OrthographicCamera(-20, 20, 12, -12, 0.1, 100);
    camera.position.set(8, 13, 19);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    camera.left = -12 * width / height;
    camera.right = 12 * width / height;
    camera.updateProjectionMatrix();
    const before = new Vector3(1, 0.5, 1).project(camera);
    const size = fitWaveSurfaceCamera(camera, width, height);
    const after = new Vector3(1, 0.5, 1).project(camera);
    expect(camera.zoom).toBe(1);
    expect(after.x).toBeCloseTo(before.x, 10);
    expect(after.y).toBeCloseTo(before.y, 10);
    expect(size.width * 1.5).toBe(Math.round(size.width * 1.5));
    expect(size.depth * 1.5).toBe(Math.round(size.depth * 1.5));
    const direction = camera.getWorldDirection(new Vector3());
    // Bound the entire animated surface by the sum of the three wave amplitudes.
    for (const elevation of [-1.73, 1.73]) {
      for (const x of [-1, 1]) for (const y of [-1, 1]) {
        const origin = new Vector3(x, y, -1).unproject(camera);
        const intersection = origin.clone().addScaledVector(direction, (elevation - origin.y) / direction.y);
        expect(Math.abs(intersection.x)).toBeLessThan(size.width * 0.38);
        expect(Math.abs(intersection.z)).toBeLessThan(size.depth * 0.38);
        expect(Math.abs(intersection.project(camera).z)).toBeLessThan(1);
      }
    }
    expect(fitWaveSurfaceCamera(camera, width, height)).toEqual(size);
  }
);
