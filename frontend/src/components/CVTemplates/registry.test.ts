import { describe, expect, it } from "vitest";
import { CV_TEMPLATES, DEFAULT_TEMPLATE, getTemplate } from "./registry";

describe("getTemplate", () => {
  it("devuelve la plantilla pedida", () => {
    for (const t of CV_TEMPLATES) expect(getTemplate(t.id).id).toBe(t.id);
  });
  it("cae en la default si el id no existe o falta", () => {
    expect(getTemplate("inexistente" as never).id).toBe(DEFAULT_TEMPLATE);
    expect(getTemplate(undefined).id).toBe(DEFAULT_TEMPLATE);
  });
});
