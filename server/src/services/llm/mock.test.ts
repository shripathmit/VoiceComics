import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, tallyEnding } from "./mock.js";

test("classify: keyword buckets", () => {
  assert.equal(classify("I push forward and confront it"), "bold");
  assert.equal(classify("I wait quietly and listen"), "cautious");
  assert.equal(classify("I examine the file closely"), "curious");
  assert.equal(classify("uhh I dunno"), "neutral");
});

test("tallyEnding: picks the clear majority", () => {
  assert.equal(tallyEnding(["bold", "bold", "curious"]), "bold");
  assert.equal(tallyEnding(["cautious", "cautious", "cautious", "bold"]), "cautious");
});

test("tallyEnding: ties resolve to mixed", () => {
  assert.equal(tallyEnding(["bold", "cautious"]), "mixed");
  assert.equal(tallyEnding(["bold", "curious", "cautious"]), "mixed");
});

test("tallyEnding: all-neutral resolves to neutral", () => {
  assert.equal(tallyEnding(["neutral", "neutral"]), "neutral");
});
