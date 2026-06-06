// harness.js — a tiny zero-dependency test harness.
// Provides test()/describe() to register tests, an assert API,
// and run() to execute everything and report results.

const tests = [];
let suite = null;

function describe(name, fn) {
  const prev = suite;
  suite = prev ? `${prev} > ${name}` : name;
  fn();
  suite = prev;
}

function test(name, fn) {
  tests.push({ name: suite ? `${suite} > ${name}` : name, fn });
}

class AssertionError extends Error {}

const assert = {
  ok(value, msg) {
    if (!value) throw new AssertionError(msg || `expected truthy, got ${fmt(value)}`);
  },
  equal(actual, expected, msg) {
    if (actual !== expected)
      throw new AssertionError(msg || `expected ${fmt(expected)}, got ${fmt(actual)}`);
  },
  deepEqual(actual, expected, msg) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) throw new AssertionError(msg || `expected ${e}, got ${a}`);
  },
  throws(fn, msg) {
    let threw = false;
    try { fn(); } catch { threw = true; }
    if (!threw) throw new AssertionError(msg || "expected function to throw");
  },
};

function fmt(v) {
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

const C = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

async function run() {
  let passed = 0;
  const failures = [];
  const start = Date.now();

  for (const t of tests) {
    try {
      await t.fn();
      passed++;
      console.log(`${C.green("✓")} ${C.dim(t.name)}`);
    } catch (err) {
      failures.push({ name: t.name, err });
      console.log(`${C.red("✗")} ${t.name}`);
    }
  }

  const ms = Date.now() - start;
  console.log("");
  if (failures.length) {
    console.log(C.bold("Failures:"));
    for (const f of failures) {
      console.log(`  ${C.red("✗")} ${f.name}`);
      console.log(`    ${C.dim(f.err.message)}`);
    }
    console.log("");
  }

  const summary = `${passed} passed, ${failures.length} failed ${C.dim(`(${ms}ms)`)}`;
  console.log(failures.length ? C.red(summary) : C.green(summary));
  return failures.length === 0;
}

module.exports = { describe, test, assert, run, _tests: tests };
