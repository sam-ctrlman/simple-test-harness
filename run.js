#!/usr/bin/env node
// run.js — discover *.test.js files, load them (registering tests),
// then run the harness. Usage: node run.js [dir-or-file ...]

const fs = require("fs");
const path = require("path");
const harness = require("./harness");

function findTests(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return target.endsWith(".test.js") ? [target] : [];
  return fs.readdirSync(target).flatMap((name) => {
    if (name === "node_modules" || name.startsWith(".")) return [];
    return findTests(path.join(target, name));
  });
}

(async () => {
  const targets = process.argv.slice(2);
  const roots = targets.length ? targets : ["."];
  const files = [...new Set(roots.flatMap((r) => findTests(path.resolve(r))))];

  if (!files.length) {
    console.error("No *.test.js files found.");
    process.exit(1);
  }

  for (const file of files) require(file);

  const ok = await harness.run();
  process.exit(ok ? 0 : 1);
})();
