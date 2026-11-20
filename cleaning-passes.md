# Task - 19 Nov

Need to work on fractalsvelte-ui
`/Users/amrit/fractaldesign/packages/fractalsvelte-ui`
use this workflow (alongwith existing guide plan implement flow)

> **first read the full instructions below. If confused anywhere, not fully clear, do not proceed. do not assume, do not guess. just come back to me talk to me. let's clear it out. Begin only when you are clear on goal and objectives.**

> **you have your own browser. check that you  can run it, can run dev in it.**

## Do the below pass 1 component group at a time. Movement to next group has to be if current pass has fixed 100% issues as per CoD's approval.

starting with group "data"
1. take stick of components in group, examples, and any and all `.ts` files defining props, const, tc.
2. run dev server, take VISUAL stock of the same also -> important, you will miss many issues if you do not visually see the component documentation pages -> component usages there, examples there
3. identify all issues. issues are:
	- violations of or drift from rules in `/Users/amrit/fractaldesign/packages/fractalsvelte-ui/AGENTS.md`, and no edit/fix should ALTER the file `/Users/amrit/fractaldesign/packages/fractalsvelte-ui/src/lib/internal/tokens.ts`, because we need 1 fixed source of truth, else we keep drifting. 
	- bad examples -> cut off, poorly sizes, unstyled, not showing what they claim to be, not correctly labelled, unnecessary examples (explained in AGENTS.md)
	- identify all component, example, and components' related `.ts` files with comments and annotations in their code. prepare list of all such items (for the annoations have to be removed).

Now, follow the guided plan implement workflow.

A. Plan
- plan all the fixes - what will you change, what code where, why, for what outcome.
- ensure your plans do not include changing `tokens.ts` or the canonical props established in it.
- plan to strip out the annotations and comments into a separate `comments.md` file in that component's own folder; and
- for the component's documentation API reference table to draw from that comments.md file.

B. Submit to CoD for approval. CoD should be told conditions drawn above and in/by AGENTS.md file.
when approved,

C. Implement.
Visually check all fixed components/examples again! Then, 

D. Submit to Cod for approval.

Proceed to next group only if CoD approves.

> **When stuck, always stop, and message the User (me). Explain the issue. Do not loop, do not double guess, do not experiment.**


## GOAL - complete such cleaning and fixing pass of all component groups from data to selection - data, display, effects, feedback, inputs, layout, motion, navigation, overlays, pickers, primitives, selection.

Do not panic, do 1 group at a time. There is no rush. You are the Svelte expert. You just have to standardize the package according to some rules.

At any time, refer to and learn fractalstyler - `packages/fractalstyler`, `packages/fractalstyler/registry.json`, `packages/fractalstyler/mcp`, `packages/fractalstyler/skills`.

## Begin...