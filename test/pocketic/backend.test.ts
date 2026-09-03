import { PocketIc, createIdentity } from "@dfinity/pic";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

describe("FAREPULSE backend public API", () => {
  it("answers an empty-state read instead of trapping", async () => {
    // Fresh canister: no caller has been assigned a role yet.
    await expect(actor.getCallerUserRole()).resolves.toEqual({ guest: null });
    await expect(actor.isCallerAdmin()).resolves.toBe(false);
  });

  it("round-trips a caller role through the real canister", async () => {
    const caller = createIdentity("alice").getPrincipal();
    actor.setPrincipal(caller);
    // Register the caller as admin first so the role assignment does not trap
    // with "User is not registered".
    await actor._initialize_access_control();
    await expect(actor.assignCallerUserRole(caller, { admin: null })).resolves.toBeNull();
    await expect(actor.getCallerUserRole()).resolves.toEqual({ admin: null });
    await expect(actor.isCallerAdmin()).resolves.toBe(true);
  });

  it("does not leak one caller's role to another caller", async () => {
    const alice = createIdentity("alice").getPrincipal();
    const bob = createIdentity("bob").getPrincipal();
    actor.setPrincipal(alice);
    // Register alice as admin first so the role assignment does not trap.
    await actor._initialize_access_control();
    await actor.assignCallerUserRole(alice, { admin: null });
    // Register bob as a regular user. After access control is initialized the
    // mixin traps on getCallerUserRole for an unregistered caller, so bob must
    // be registered to observe his own role.
    await actor.assignCallerUserRole(bob, { user: null });
    actor.setPrincipal(bob);
    // Bob sees his own role, not alice's admin role.
    await expect(actor.getCallerUserRole()).resolves.toEqual({ user: null });
    await expect(actor.isCallerAdmin()).resolves.toBe(false);
  });

  it("exposes the schema and executes an empty query without trapping", async () => {
    await expect(actor.schema()).resolves.toBeTypeOf("string");
    const result = await actor.execute("{}");
    expect(result).toHaveProperty("hasMore");
    expect(Array.isArray(result.rows)).toBe(true);
  });

  it("initializes access control without trapping", async () => {
    await expect(actor._initialize_access_control()).resolves.toBeNull();
  });

  it("starts and finishes an internet identity sign-in without trapping", async () => {
    const nonce = await actor._internet_identity_sign_in_start();
    expect(nonce).toBeInstanceOf(Uint8Array);
    const result = await actor._internet_identity_sign_in_finish();
    // Accept either an ok or err variant; the previous `expect(...) || expect(...)`
    // never worked as a fallback because `expect()` returns a truthy object.
    expect(result.ok !== undefined || result.err !== undefined).toBe(true);
  });
});
