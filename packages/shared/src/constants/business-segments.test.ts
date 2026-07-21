import { describe, expect, it } from "vitest";
import {
  isBusinessSegmentValue,
  resolveBusinessSegment,
} from "./business-segments.js";

describe("resolveBusinessSegment", () => {
  it("aceita valor exato da lista", () => {
    expect(resolveBusinessSegment("Marketing digital")).toBe("Marketing digital");
  });

  it("normaliza texto sem acento", () => {
    expect(resolveBusinessSegment("marketing digital")).toBe("Marketing digital");
  });

  it("retorna vazio para valor desconhecido", () => {
    expect(resolveBusinessSegment("Segmento inventado")).toBe("");
  });

  it("valida valores permitidos", () => {
    expect(isBusinessSegmentValue("Design e UX/UI")).toBe(true);
    expect(isBusinessSegmentValue("Texto livre")).toBe(false);
  });
});
