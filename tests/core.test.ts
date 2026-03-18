import { describe, it, expect } from "vitest";
import { Cutflow } from "../src/core.js";
describe("Cutflow", () => {
  it("init", () => { expect(new Cutflow().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Cutflow(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Cutflow(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
