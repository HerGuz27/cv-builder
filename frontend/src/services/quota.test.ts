import { afterEach, describe, expect, it, vi } from "vitest";
import { chain } from "../test/supabaseChain";

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("./supabase", () => ({ supabase: { from } }));

import { FREE_MONTHLY_LIMIT, getCredits, getRemaining } from "./quota";

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe("getRemaining", () => {
  it("resta lo usado del límite gratuito", async () => {
    from.mockReturnValue(chain({ data: { used: 1 } }));
    expect(await getRemaining()).toBe(FREE_MONTHLY_LIMIT - 1);
  });

  it("sin registro de uso queda todo el límite", async () => {
    from.mockReturnValue(chain({ data: null }));
    expect(await getRemaining()).toBe(FREE_MONTHLY_LIMIT);
  });

  it("nunca baja de 0", async () => {
    from.mockReturnValue(chain({ data: { used: 99 } }));
    expect(await getRemaining()).toBe(0);
  });

  it("consulta el período del mes actual en UTC", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-31T23:30:00Z"));
    const q = chain({ data: null });
    from.mockReturnValue(q);
    await getRemaining();
    expect(q.eq).toHaveBeenCalledWith("period", "2026-03");
  });

  it("lanza ante error", async () => {
    from.mockReturnValue(chain({ error: { message: "x" } }));
    await expect(getRemaining()).rejects.toThrow("No se pudo consultar tu cuota");
  });
});

describe("getCredits", () => {
  it("devuelve el balance", async () => {
    from.mockReturnValue(chain({ data: { balance: 7 } }));
    expect(await getCredits()).toBe(7);
  });
  it("0 si no hay fila", async () => {
    from.mockReturnValue(chain({ data: null }));
    expect(await getCredits()).toBe(0);
  });
  it("lanza ante error", async () => {
    from.mockReturnValue(chain({ error: { message: "x" } }));
    await expect(getCredits()).rejects.toThrow("No se pudieron consultar tus créditos");
  });
});
