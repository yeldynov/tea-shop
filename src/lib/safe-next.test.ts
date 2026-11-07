// @vitest-environment node
import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it.each([
    { rule: "a same-site path", input: "/account/orders" },
    { rule: "the site root", input: "/" },
    { rule: "a path with query and hash", input: "/shop?tea=oolong#top" },
  ])("allows $input ($rule)", ({ input }) => {
    expect(safeNext(input)).toBe(input);
  });

  it.each([
    { rule: "protocol-relative URL", input: "//evil.com" },
    { rule: "backslash, which browsers treat as a slash", input: "/\\evil.com" },
    { rule: "absolute URL", input: "https://evil.com" },
    { rule: "a relative path without a leading slash", input: "account" },
    { rule: "empty string", input: "" },
    { rule: "missing param", input: undefined },
    { rule: "repeated param (?next=a&next=b) arrives as an array", input: ["/a", "/b"] },
  ])("blocks $input ($rule)", ({ input }) => {
    expect(safeNext(input)).toBe("/account");
  });

  it("returns the given fallback instead of the default", () => {
    expect(safeNext("//evil.com", "/admin")).toBe("/admin");
  });
});
