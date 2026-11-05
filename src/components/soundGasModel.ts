import { Body, Box, Material, Sphere, Vec3, World } from "cannon-es";

export function createSoundGas(volume: number) {
  const side = 4 * Math.cbrt(volume);
  const world = new World({ gravity: new Vec3(0, 0, 0) });
  world.defaultContactMaterial.friction = 0;
  world.defaultContactMaterial.restitution = 1;
  const material = new Material({ friction: 0, restitution: 1 });
  let wallHits = 0;
  const flashes = Array(48).fill(0) as number[];
  for (let axis = 0; axis < 3; axis++) for (const sign of [-1, 1]) {
    const dimensions = [side, side, side]; dimensions[axis] = .1;
    const wall = new Body({ mass: 0, material, shape: new Box(new Vec3(...dimensions as [number, number, number])) });
    const position = [0, 0, 0]; position[axis] = sign * (side / 2 + .1);
    wall.position.set(...position as [number, number, number]); world.addBody(wall);
  }
  // Fixed seed permits equal-energy volume comparisons without coincident particles.
  let seed = 2707;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const bodies = Array.from({ length: 48 }, (_, i) => {
    const body = new Body({ mass: 1, material, shape: new Sphere(.075), linearDamping: 0, angularDamping: 0, fixedRotation: true });
    body.position.set(((i % 4) / 3 - .5) * side * .72, ((Math.floor(i / 4) % 4) / 3 - .5) * side * .72, (Math.floor(i / 16) / 2 - .5) * side * .72);
    const velocity = new Vec3(random() - .5, random() - .5, random() - .5);
    velocity.normalize(); velocity.scale(.8 + random() * .6, body.velocity);
    body.addEventListener("collide", (event: { body: Body }) => { flashes[i] = .16; if (event.body.mass === 0) wallHits++; });
    world.addBody(body); return body;
  });
  return {
    bodies, flashes, side,
    get wallHits() { return wallHits; },
    step() {
      world.step(1 / 120);
      for (let i = 0; i < flashes.length; i++) flashes[i] = Math.max(0, flashes[i] - 1 / 120);
    },
  };
}
