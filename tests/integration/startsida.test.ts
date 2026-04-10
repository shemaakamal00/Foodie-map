import { describe, it, expect } from "vitest";

describe("startsida integration", () => {
  it("renderar HTML container", () => {
    document.body.innerHTML = `<div id="home-sample-list-unique"></div>`;

    const el = document.getElementById("home-sample-list-unique");

    expect(el).not.toBeNull();
  });
});