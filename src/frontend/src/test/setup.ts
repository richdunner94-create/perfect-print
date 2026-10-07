import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components expose `data-ocid` hooks; use them as the test-id
// attribute so semantic queries can fall back to stable selectors.
configure({ testIdAttribute: "data-ocid" });

// jsdom does not implement the Pointer Capture API that Radix UI primitives
// (Select, Dialog, Sheet) call on pointer interactions. Without these the
// components throw `target.hasPointerCapture is not a function`.
if (typeof Element !== "undefined") {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}

// Radix Select scrolls the active option into view; jsdom has no layout.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Radix Switch (and other primitives) measure their size with ResizeObserver,
// which jsdom does not provide.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}

afterEach(() => {
  cleanup();
});
