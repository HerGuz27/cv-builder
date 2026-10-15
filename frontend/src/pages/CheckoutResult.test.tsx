import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getOrder } = vi.hoisted(() => ({ getOrder: vi.fn() }));
vi.mock("../services/payments", () => ({ getOrder }));

import CheckoutResultPage from "./CheckoutResult";

const setup = (url = "/checkout/result?order=o1") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <CheckoutResultPage />
    </MemoryRouter>
  );

const tick = (ms: number) => act(async () => void (await vi.advanceTimersByTimeAsync(ms)));

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  getOrder.mockReset();
});

describe("CheckoutResult", () => {
  it("sin order en la URL avisa que no hay orden", () => {
    setup("/checkout/result");
    expect(screen.getByText(/No encontramos la orden/)).toBeInTheDocument();
    expect(getOrder).not.toHaveBeenCalled();
  });

  it("muestra éxito y los créditos cuando la orden está paid", async () => {
    getOrder.mockResolvedValue({ id: "o1", status: "paid", credits: 10 });
    setup();
    await tick(0);
    expect(screen.getByText("¡Pago acreditado!")).toBeInTheDocument();
    expect(screen.getByText(/10 créditos/)).toBeInTheDocument();
  });

  it.each(["failed", "cancelled", "refunded"])("muestra fallo si la orden está %s", async (status) => {
    getOrder.mockResolvedValue({ id: "o1", status, credits: 10 });
    setup();
    await tick(0);
    expect(screen.getByText("El pago no se completó")).toBeInTheDocument();
    expect(screen.getByText("Volver a intentar")).toBeInTheDocument();
  });

  it("ignora parámetros de la URL: el estado sale solo de la base", async () => {
    getOrder.mockResolvedValue({ id: "o1", status: "pending", credits: 10 });
    setup("/checkout/result?order=o1&status=paid&success=true");
    await tick(0);
    expect(screen.queryByText("¡Pago acreditado!")).toBeNull();
  });

  it("sigue consultando cada 2 s mientras está pending y termina al pasar a paid", async () => {
    getOrder
      .mockResolvedValueOnce({ id: "o1", status: "pending", credits: 10 })
      .mockResolvedValueOnce({ id: "o1", status: "pending", credits: 10 })
      .mockResolvedValue({ id: "o1", status: "paid", credits: 10 });
    setup();
    await tick(0);
    expect(screen.getByText("Confirmando tu pago...")).toBeInTheDocument();
    await tick(2000);
    await tick(2000);
    expect(screen.getByText("¡Pago acreditado!")).toBeInTheDocument();
    const calls = getOrder.mock.calls.length;
    await tick(10_000);
    expect(getOrder.mock.calls.length).toBe(calls);
  });

  it("tras 60 s en pending muestra 'procesando' y deja de consultar", async () => {
    getOrder.mockResolvedValue({ id: "o1", status: "pending", credits: 10 });
    setup();
    await tick(61_000);
    expect(screen.getByText("Estamos procesando tu pago")).toBeInTheDocument();
    const calls = getOrder.mock.calls.length;
    await tick(10_000);
    expect(getOrder.mock.calls.length).toBe(calls);
  });

  it("muestra el error de consulta pero reintenta", async () => {
    getOrder
      .mockRejectedValueOnce(new Error("No se pudo consultar la orden"))
      .mockResolvedValue({ id: "o1", status: "paid", credits: 3 });
    setup();
    await tick(0);
    expect(screen.getByText("No se pudo consultar la orden")).toBeInTheDocument();
    await tick(2000);
    expect(screen.getByText("¡Pago acreditado!")).toBeInTheDocument();
  });

  it("al desmontar deja de consultar", async () => {
    getOrder.mockResolvedValue({ id: "o1", status: "pending", credits: 1 });
    const { unmount } = setup();
    await tick(0);
    unmount();
    const calls = getOrder.mock.calls.length;
    await tick(10_000);
    expect(getOrder.mock.calls.length).toBe(calls);
  });
});
