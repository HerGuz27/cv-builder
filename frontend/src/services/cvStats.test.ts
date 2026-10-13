import { beforeEach, describe, expect, it, vi } from "vitest";
import { chain } from "../test/supabaseChain";
import { emptyCVData } from "../data/emptyCV";
import type { CVData } from "../types/cv";

const { rpc, from } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock("./supabase", () => ({ supabase: { rpc, from } }));

import { getTotalCVs, registerCVCreated } from "./cvStats";

const cv = (nombre: string): CVData => ({ ...emptyCVData, personal: { ...emptyCVData.personal, nombre } });

beforeEach(() => {
  rpc.mockReset();
  from.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("registerCVCreated", () => {
  it("suma y devuelve el total nuevo", async () => {
    rpc.mockResolvedValue({ data: 42, error: null });
    expect(await registerCVCreated(cv("Ana"))).toBe(42);
  });

  it("no vuelve a contar el mismo CV", async () => {
    rpc.mockResolvedValue({ data: 1, error: null });
    await registerCVCreated(cv("Ana"));
    expect(await registerCVCreated(cv("Ana"))).toBeNull();
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("cuenta CVs distintos por separado", async () => {
    rpc.mockResolvedValue({ data: 1, error: null });
    await registerCVCreated(cv("Ana"));
    await registerCVCreated(cv("Beto"));
    expect(rpc).toHaveBeenCalledTimes(2);
  });

  it("si el RPC falla devuelve null y no marca el CV como contado", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    expect(await registerCVCreated(cv("Ana"))).toBeNull();

    rpc.mockResolvedValueOnce({ data: 5, error: null });
    expect(await registerCVCreated(cv("Ana"))).toBe(5);
  });

  it("recuerda solo los últimos 50 hashes", async () => {
    rpc.mockResolvedValue({ data: 1, error: null });
    for (let i = 0; i < 55; i++) await registerCVCreated(cv(`n${i}`));
    const stored = JSON.parse(localStorage.getItem("jobsearch.cv.counted.v1")!);
    expect(stored).toHaveLength(50);
  });

  it("tolera localStorage corrupto", async () => {
    localStorage.setItem("jobsearch.cv.counted.v1", "{no json");
    rpc.mockResolvedValue({ data: 3, error: null });
    expect(await registerCVCreated(cv("Ana"))).toBe(3);
  });
});

describe("getTotalCVs", () => {
  it("devuelve el total numérico", async () => {
    from.mockReturnValue(chain({ data: { total: "12" } }));
    expect(await getTotalCVs()).toBe(12);
  });
  it("null si hay error", async () => {
    from.mockReturnValue(chain({ error: { message: "x" } }));
    expect(await getTotalCVs()).toBeNull();
  });
});
