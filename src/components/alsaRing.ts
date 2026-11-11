export type AlsaRing = { read: number; used: number };

export function transferRing(ring: AlsaRing, capacity: number, requested: number, operation: "read" | "write") {
  if (![capacity, requested, ring.read, ring.used].every(Number.isInteger) || capacity < 1 || requested < 0 || ring.read < 0 || ring.read >= capacity || ring.used < 0 || ring.used > capacity) throw new RangeError("Invalid ring state");
  const transferred = Math.min(requested, operation === "read" ? ring.used : capacity - ring.used);
  return {
    ring: operation === "read"
      ? { read: (ring.read + transferred) % capacity, used: ring.used - transferred }
      : { read: ring.read, used: ring.used + transferred },
    transferred,
    missing: requested - transferred,
  };
}

// Snapshot editing is not a transfer; retain the full/empty distinction when a pointer does not move.
export function repositionRing(ring: AlsaRing, capacity: number, pointer: "read" | "write", frame: number): AlsaRing {
  const write = (ring.read + ring.used) % capacity;
  if (frame === (pointer === "read" ? ring.read : write)) return ring;
  return pointer === "read"
    ? { read: frame, used: (write - frame + capacity) % capacity }
    : { read: ring.read, used: (frame - ring.read + capacity) % capacity };
}
