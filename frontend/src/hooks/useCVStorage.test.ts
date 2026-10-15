import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emptyCVData } from "../data/emptyCV";
import type { CVData } from "../types/cv";
import { readDraft, useCVStorage } from "./useCVStorage";

const DRAFT = "jobsearch.cv.draft.v1";
const SAVED = "jobsearch.cv.saved.v1";
const named = (nombre: string): CVData => ({ ...emptyCVData, personal: { ...emptyCVData.personal, nombre } });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("autosave", () => {
  it("no escribe en el primer render", () => {
    renderHook(() => useCVStorage(named("Ana")));
    act(() => void vi.advanceTimersByTime(2000));
    expect(localStorage.getItem(DRAFT)).toBeNull();
  });

  it("guarda el borrador con debounce de 600 ms", () => {
    const { rerender } = renderHook(({ d }) => useCVStorage(d), { initialProps: { d: named("A") } });
    rerender({ d: named("Ana") });
    act(() => void vi.advanceTimersByTime(500));
    expect(localStorage.getItem(DRAFT)).toBeNull();
    act(() => void vi.advanceTimersByTime(150));
    expect(readDraft()?.personal.nombre).toBe("Ana");
  });

  it("cambios seguidos solo escriben el último", () => {
    const { rerender } = renderHook(({ d }) => useCVStorage(d), { initialProps: { d: named("A") } });
    rerender({ d: named("Ab") });
    act(() => void vi.advanceTimersByTime(300));
    rerender({ d: named("Abc") });
    act(() => void vi.advanceTimersByTime(600));
    expect(readDraft()?.personal.nombre).toBe("Abc");
  });

  it("no rompe si localStorage lanza", () => {
    const { rerender } = renderHook(({ d }) => useCVStorage(d), { initialProps: { d: named("A") } });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    rerender({ d: named("B") });
    expect(() => act(() => void vi.advanceTimersByTime(700))).not.toThrow();
  });
});

describe("readDraft", () => {
  it("null con JSON corrupto o forma inválida", () => {
    localStorage.setItem(DRAFT, "{x");
    expect(readDraft()).toBeNull();
    localStorage.setItem(DRAFT, JSON.stringify({ foo: 1 }));
    expect(readDraft()).toBeNull();
  });
});

describe("guardados", () => {
  it("usa 'CV sin nombre' si el nombre está vacío", () => {
    const { result } = renderHook(() => useCVStorage(emptyCVData));
    act(() => result.current.save(named("   ")));
    expect(result.current.saved[0].nombre).toBe("CV sin nombre");
  });

  it("ordena del más nuevo al más viejo y topea en 10", () => {
    const { result } = renderHook(() => useCVStorage(emptyCVData));
    for (let i = 0; i < 12; i++) act(() => result.current.save(named(`cv${i}`)));
    expect(result.current.saved).toHaveLength(10);
    expect(result.current.saved[0].nombre).toBe("cv11");
    expect(JSON.parse(localStorage.getItem(SAVED)!)).toHaveLength(10);
  });

  it("remove borra por id", () => {
    const { result } = renderHook(() => useCVStorage(emptyCVData));
    act(() => result.current.save(named("a")));
    const id = result.current.saved[0].id;
    act(() => result.current.remove(id));
    expect(result.current.saved).toHaveLength(0);
  });

  it("ignora entradas guardadas inválidas", () => {
    localStorage.setItem(SAVED, JSON.stringify([{ id: "1", data: { x: 1 } }]));
    const { result } = renderHook(() => useCVStorage(emptyCVData));
    expect(result.current.saved).toEqual([]);
  });
});
