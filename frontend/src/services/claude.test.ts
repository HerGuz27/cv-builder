import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("./supabase", () => ({ supabase: { auth: { getSession } } }));

import { AnalysisError, analyzeJobMatch } from "./claude";

const fetchMock = vi.fn();
beforeEach(() => vi.stubGlobal("fetch", fetchMock));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe("analyzeJobMatch", () => {
  it("usa el JWT del usuario y envía cv y oferta", async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: "jwt" } } });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ score: 80 }) });

    const result = await analyzeJobMatch("mi cv", "la oferta");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/functions\/v1\/job-ats$/);
    expect(init.headers.Authorization).toBe("Bearer jwt");
    expect(JSON.parse(init.body)).toEqual({ cvText: "mi cv", jobDescription: "la oferta" });
    expect(result).toEqual({ score: 80 });
  });

  it("sin sesión no usa 'undefined' como token", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    await analyzeJobMatch("a", "b");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).not.toContain("undefined");
  });

  it("lanza AnalysisError con code NO_CREDITS", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Sin créditos", code: "NO_CREDITS" }),
    });
    const err = await analyzeJobMatch("a", "b").catch((e) => e);
    expect(err).toBeInstanceOf(AnalysisError);
    expect(err.code).toBe("NO_CREDITS");
    expect(err.message).toBe("Sin créditos");
  });

  it("mensaje por defecto si el error no es JSON", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    fetchMock.mockResolvedValue({ ok: false, json: async () => Promise.reject(new Error("x")) });
    await expect(analyzeJobMatch("a", "b")).rejects.toThrow("Error al conectar con Supabase");
  });
});
