import { vi } from "vitest";

/** Query builder falso: cada método encadena y el resultado es "awaitable". */
export function chain(result: { data?: unknown; error?: { message: string } | null }) {
  const value = { data: null, error: null, ...result };
  const q: Record<string, unknown> = {};
  for (const m of ["select", "eq", "order"]) q[m] = vi.fn(() => q);
  q.maybeSingle = vi.fn(() => Promise.resolve(value));
  q.single = vi.fn(() => Promise.resolve(value));
  q.then = (res: (v: typeof value) => unknown) => Promise.resolve(value).then(res);
  return q;
}
