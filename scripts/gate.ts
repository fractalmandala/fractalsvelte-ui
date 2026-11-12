// pnpm gate [<kit>[/<name>]] [--json] — the component↔docs contract (AGENTS.md, Law 2 + Law 1).
// Analyses in memory (writes nothing). Exit 1 on any error.

import { formatGate, parseScope, runGate } from './lib/gate-core.ts';

const args = process.argv.slice(2);
const json = args.includes('--json');
const scope = parseScope(args.find((a) => !a.startsWith('-')));

const result = await runGate(scope);
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(formatGate(result));
process.exitCode = result.errors > 0 || result.scopeError ? 1 : 0;
