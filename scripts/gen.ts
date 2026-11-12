// pnpm gen — regenerate everything generated: spring tokens, custom.css (+ classes.json),
// the barrel (src/lib/index.ts) and api.json. Deterministic and atomic; safe to run concurrently.

import { runGen } from './lib/generate.ts';

const { results } = await runGen();
for (const r of results) console.log(`${r.ok ? '✔' : '✘'} ${r.step.padEnd(8)} ${r.summary}`);
if (results.some((r) => !r.ok)) process.exitCode = 1;
