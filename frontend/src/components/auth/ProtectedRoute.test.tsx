import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }));
vi.mock("../../context/AuthContext", () => ({ useAuth }));

import ProtectedRoute from "./ProtectedRoute";

const setup = () =>
  render(
    <MemoryRouter initialEntries={["/ats"]}>
      <Routes>
        <Route path="/login" element={<p>login</p>} />
        <Route path="/ats" element={<ProtectedRoute><p>privado</p></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => useAuth.mockReset());

describe("ProtectedRoute", () => {
  it("redirige a /login sin usuario", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    setup();
    expect(screen.getByText("login")).toBeInTheDocument();
  });
  it("renderiza el contenido con usuario", () => {
    useAuth.mockReturnValue({ user: { id: "1" }, loading: false });
    setup();
    expect(screen.getByText("privado")).toBeInTheDocument();
  });
  it("no redirige ni muestra contenido mientras carga", () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    setup();
    expect(screen.queryByText("login")).toBeNull();
    expect(screen.queryByText("privado")).toBeNull();
  });
});
