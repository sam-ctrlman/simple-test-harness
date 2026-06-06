// example.test.js — shows how to write tests with the harness.

const { describe, test, assert } = require("./harness");
const { add, divide } = require("./src/math");

describe("add", () => {
  test("adds two numbers", () => {
    assert.equal(add(2, 3), 5);
  });

  test("handles negatives", () => {
    assert.equal(add(-2, 1), -1);
  });
});

describe("divide", () => {
  test("divides two numbers", () => {
    assert.equal(divide(10, 2), 5);
  });

  test("throws on divide by zero", () => {
    assert.throws(() => divide(1, 0));
  });
});

test("async tests are supported", async () => {
  const value = await Promise.resolve(42);
  assert.equal(value, 42);
});
