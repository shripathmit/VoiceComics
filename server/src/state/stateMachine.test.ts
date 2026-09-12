import { test } from "node:test";
import assert from "node:assert/strict";
import { applyDeltas, checkTermination, checkTerminationWithCap, MAX_TURNS_PER_RUN } from "./stateMachine.js";

test("applyDeltas clamps to [0, 100]", () => {
  const result = applyDeltas(
    { rapport_score: 95, patience_level: 5, comfort_level: 50 },
    { rapport_delta: 20, patience_delta: -30, comfort_delta: -20 }
  );
  assert.equal(result.rapport_score, 100);
  assert.equal(result.patience_level, 0);
  assert.equal(result.comfort_level, 30);
});

test("checkTermination: success requires rapport>=75 and patience>30", () => {
  assert.equal(
    checkTermination({ rapport_score: 80, patience_level: 40, comfort_level: 50 }, false),
    "success"
  );
  assert.equal(
    checkTermination({ rapport_score: 80, patience_level: 30, comfort_level: 50 }, false),
    "ongoing"
  );
});

test("checkTermination: soft_disengage when patience <= 20", () => {
  assert.equal(
    checkTermination({ rapport_score: 50, patience_level: 20, comfort_level: 50 }, false),
    "soft_disengage"
  );
});

test("checkTermination: hard_rejection on low rapport or boundary violation", () => {
  assert.equal(
    checkTermination({ rapport_score: 15, patience_level: 80, comfort_level: 50 }, false),
    "hard_rejection"
  );
  assert.equal(
    checkTermination({ rapport_score: 90, patience_level: 90, comfort_level: 90 }, true),
    "hard_rejection"
  );
});

test("checkTerminationWithCap: stays ongoing before the cap", () => {
  const state = { rapport_score: 50, patience_level: 50, comfort_level: 50 };
  assert.equal(checkTerminationWithCap(state, false, MAX_TURNS_PER_RUN - 1), "ongoing");
});

test("checkTerminationWithCap: times out at the cap if still ongoing", () => {
  const state = { rapport_score: 50, patience_level: 50, comfort_level: 50 };
  assert.equal(checkTerminationWithCap(state, false, MAX_TURNS_PER_RUN), "time_expired");
});

test("checkTerminationWithCap: a real outcome still wins even past the cap", () => {
  const state = { rapport_score: 80, patience_level: 40, comfort_level: 50 };
  assert.equal(checkTerminationWithCap(state, false, MAX_TURNS_PER_RUN), "success");
});
