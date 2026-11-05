import { expect, it } from "vitest";
import { createSoundGas } from "./soundGasModel";

it("uses equal initial kinetic energy for volume comparisons", () => {
  const large = createSoundGas(1), small = createSoundGas(.5);
  expect(small.side ** 3 / large.side ** 3).toBeCloseTo(.5);
  expect(small.bodies.map(b => b.velocity.lengthSquared())).toEqual(large.bodies.map(b => b.velocity.lengthSquared()));
});

it("moves, collides and contains particles without large energy drift", () => {
  const gas = createSoundGas(.5);
  const initial = gas.bodies.reduce((sum, b) => sum + b.velocity.lengthSquared(), 0);
  const start = gas.bodies[0].position.clone();
  for (let i = 0; i < 1200; i++) gas.step();
  const final = gas.bodies.reduce((sum, b) => sum + b.velocity.lengthSquared(), 0);
  expect(gas.wallHits).toBeGreaterThan(0);
  expect(gas.bodies[0].position.distanceTo(start)).toBeGreaterThan(.01);
  expect(final / initial).toBeGreaterThan(.85);
  expect(final / initial).toBeLessThan(1.15);
  for (const b of gas.bodies) for (const v of [b.position.x, b.position.y, b.position.z]) expect(Math.abs(v)).toBeLessThan(gas.side / 2);
});
