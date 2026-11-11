import { describe, expect, it } from "vitest";
import { repositionRing, transferRing } from "./alsaRing";

describe("ALSA ring teaching operations", () => {
  it("moves the read pointer through wraparound without inventing data", () => {
    expect(transferRing({ read: 448, used: 256 }, 512, 128, "read")).toEqual({ ring: { read: 64, used: 128 }, transferred: 128, missing: 0 });
    expect(transferRing({ read: 448, used: 64 }, 512, 128, "read")).toEqual({ ring: { read: 0, used: 0 }, transferred: 64, missing: 64 });
  });
  it("caps writes at capacity and distinguishes a full ring from an empty ring", () => {
    expect(transferRing({ read: 0, used: 448 }, 512, 128, "write")).toEqual({ ring: { read: 0, used: 512 }, transferred: 64, missing: 64 });
    expect(transferRing({ read: 0, used: 512 }, 512, 128, "write").transferred).toBe(0);
    expect(transferRing({ read: 0, used: 0 }, 512, 128, "read").transferred).toBe(0);
    for (const used of [0, 512]) for (const pointer of ["read", "write"] as const) expect(repositionRing({ read: 0, used }, 512, pointer, 0).used).toBe(used);
  });
  it("preserves the opposite pointer during snapshot edits", () => {
    expect(repositionRing({ read: 0, used: 512 }, 1024, "read", 256)).toEqual({ read: 256, used: 256 });
    expect(repositionRing({ read: 256, used: 256 }, 1024, "write", 128)).toEqual({ read: 256, used: 896 });
  });
  it("rejects invalid transfer state", () => {
    expect(() => transferRing({ read: 0, used: 513 }, 512, 128, "read")).toThrow(RangeError);
    expect(() => transferRing({ read: 512, used: 0 }, 512, 128, "write")).toThrow(RangeError);
    expect(() => transferRing({ read: 0, used: 0 }, 512, NaN, "read")).toThrow(RangeError);
  });
});
