import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers empty-state reads instead of trapping", async () => {
  await expect(actor.listServices()).resolves.toEqual([]);
  await expect(actor.listPosts()).resolves.toEqual([]);
  await expect(actor.listBookings()).rejects.toThrow();
});

it("seeds visa guidance for China, France, and the USA", async () => {
  const visas = await actor.listVisas();
  const countries = visas.map((visa) => Object.keys(visa.country)[0]).sort();
  expect(countries).toEqual(["china", "france", "usa"]);
  for (const visa of visas) {
    expect(visa.title.length).toBeGreaterThan(0);
    expect(visa.requirements.length).toBeGreaterThan(0);
  }
});

it("round-trips a booking through the real canister", async () => {
  const id = await actor.createBooking(
    "Ada Lovelace",
    "+1 206 555 0142",
    "ada@example.com",
    "Business cards",
    "2026-03-04",
    "10:00",
    "Please use matte stock.",
  );
  expect(id).toBe(0n);
  // listBookings is admin-only, so the anonymous caller cannot read it back.
  await expect(actor.listBookings()).rejects.toThrow();
});

it("round-trips a contact message through the real canister", async () => {
  const id = await actor.submitContactMessage(
    "Grace Hopper",
    "grace@example.com",
    "+1 206 555 0199",
    "Do you print banners?",
  );
  expect(id).toBe(0n);
  await expect(actor.listContactMessages()).rejects.toThrow();
});

it("rejects anonymous callers from admin-only mutations", async () => {
  await expect(
    actor.createService("Banners", "Large format", null, true),
  ).rejects.toThrow();
  await expect(
    actor.createPost("Sale", "20% off", null, { promotion: null }, true),
  ).rejects.toThrow();
  await expect(
    actor.updateVisa(
      { china: null },
      "China",
      "desc",
      "req",
      "info",
      "fees",
    ),
  ).rejects.toThrow();
  await expect(actor.getDashboardCounts()).rejects.toThrow();
});

it("exposes the public service and post read paths", async () => {
  await expect(actor.getService(0n)).resolves.toEqual([]);
  await expect(actor.getPost(0n)).resolves.toEqual([]);
  await expect(actor.getVisa({ china: null })).resolves.toEqual([
    expect.objectContaining({ country: { china: null } }),
  ]);
});
