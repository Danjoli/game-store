import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats values in Brazilian reais", () => {
    expect(formatCurrency(49.9)).toContain("49,90");
  });
});
