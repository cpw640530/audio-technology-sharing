import "@testing-library/jest-dom/vitest";

// jsdom has no layout engine; resize-sensitive tests provide explicit dimensions.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom has no media-query API; individual tests may override matches/events.
Object.defineProperty(window, "matchMedia", {
  configurable: true,
  writable: true,
  value: (media: string) => ({
    media, matches: false, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => true,
  }),
});
