# simple-test-harness

A tiny, zero-dependency test harness for Node.js (~120 lines). Discovers
`*.test.js` files, runs them, and reports pass/fail with a non-zero exit
code on failure so it drops straight into CI.

## Run

```bash
npm test              # runs every *.test.js under the current dir
node run.js src/      # only a subdirectory
node run.js a.test.js # a single file
```

## Write a test

```js
const { describe, test, assert } = require("./harness");

describe("add", () => {
  test("adds two numbers", () => {
    assert.equal(add(2, 3), 5);
  });
});

test("async works too", async () => {
  assert.equal(await Promise.resolve(42), 42);
});
```

## Assertions

| Call | Passes when |
|------|-------------|
| `assert.ok(v)` | `v` is truthy |
| `assert.equal(a, b)` | `a === b` |
| `assert.deepEqual(a, b)` | same JSON shape |
| `assert.throws(fn)` | `fn()` throws |

Every assertion takes an optional final `msg` argument shown on failure.

## Files

- `harness.js` — registry, assertions, runner
- `run.js` — CLI: finds and loads test files
- `example.test.js` — sample tests against `src/math.js`

## Extending

Add assertions to the `assert` object in `harness.js`. Each one just throws
an `AssertionError` on failure — the runner handles the rest. To add `beforeEach`
hooks, store them alongside `tests` and invoke them inside `run()`'s loop.
