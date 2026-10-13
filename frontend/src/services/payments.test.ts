import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { chain } from "../test/supabaseChain";

const { from, getSession } = vi.hoisted(() => ({ from: vi.fn(), getSession: vi.fn() }));
vi.mock("./supabase", () => ({ supabase: { from, auth: { getSession } } }));

import { formatPrice, getOrder, listPackages, startCheckout } from "./payments";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("location", { href: "" });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe("listPackages", () => {
  it("convierte price_amount a número", async () => {
    from.mockReturnValue(
      chain({ data: [{ id: "a", name: "Pack", credits: 5, price_amount: "9.90", currency: "USD" }] })
    );
    const [pkg] = await listPackages();
    expect(pkg.price_amount).toBe(9.9);
  });

  it("devuelve [] si no hay data", async () => {
    from.mockReturnValue(chain({ data: null }));
    expect(await listPackages()).toEqual([]);
  });

  it("lanza si la query falla", async () => {
    from.mockReturnValue(chain({ error: { message: "x" } }));
    await expect(listPackages()).rejects.toThrow("No se pudieron cargar los paquetes");
  });
});

describe("startCheckout", () => {
  const withToken = () => getSession.mockResolvedValue({ data: { session: { access_token: "jwt" } } });

  it("exige sesión y no llama a la función sin token", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    await expect(startCheckout("p1")).rejects.toThrow("Iniciá sesión");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("envía el JWT y el packageId, y redirige al checkoutUrl", async () => {
    withToken();
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ checkoutUrl: "https://pay.test/c/1" }) });
    await startCheckout("p1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/functions\/v1\/payments-checkout$/);
    expect(init.headers.Authorization).toBe("Bearer jwt");
    expect(JSON.parse(init.body)).toEqual({ packageId: "p1" });
    expect(window.location.href).toBe("https://pay.test/c/1");
  });

  it("propaga el error del servidor y no redirige", async () => {
    withToken();
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: "Paquete inválido" }) });
    await expect(startCheckout("p1")).rejects.toThrow("Paquete inválido");
    expect(window.location.href).toBe("");
  });

  it("falla si la respuesta ok no trae checkoutUrl", async () => {
    withToken();
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    await expect(startCheckout("p1")).rejects.toThrow("No se pudo iniciar el pago");
    expect(window.location.href).toBe("");
  });

  it("tolera un cuerpo que no es JSON", async () => {
    withToken();
    fetchMock.mockResolvedValue({ ok: false, json: async () => Promise.reject(new Error("bad")) });
    await expect(startCheckout("p1")).rejects.toThrow("No se pudo iniciar el pago");
  });
});

describe("getOrder", () => {
  it("devuelve la orden", async () => {
    from.mockReturnValue(chain({ data: { id: "o1", status: "paid", credits: 10 } }));
    expect(await getOrder("o1")).toEqual({ id: "o1", status: "paid", credits: 10 });
  });
  it("lanza ante error", async () => {
    from.mockReturnValue(chain({ error: { message: "x" } }));
    await expect(getOrder("o1")).rejects.toThrow("No se pudo consultar la orden");
  });
});

describe("formatPrice", () => {
  it("incluye el monto y la moneda", () => {
    const out = formatPrice(1500, "USD");
    expect(out).toContain("1");
    expect(out).toMatch(/US\$|\$/);
  });
});
