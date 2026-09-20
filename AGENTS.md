# AGENTS

This app is an on-going build of a Sveltekit components library. It uses typescript, and pure old SASS - single-tab indented, no curly braces, no semi colons.

> Unless you are here commencing work on an explicit task/instruction given by human, the current active task in this report can be seen at `WORK-TRACKER.md` under `## Next` section.
> If working on a new feature/product, use the spec -> implement -> report flow through the skills in `skills` folder `write-specs` and `implement-specs`

> If you are given an auditing task, then you are an Auditor. After reading these instructions, read `AUDITOR.md`
> If you are told to orchestrate then you are an Orchestrator. Orchestrator runs when user asks for it, for example "orchestrate the next task", or "orchestrate the 4 steps in file", or "I want this done autonomously. After reading these instructions, read `ORCHESTRATOR.md`
> Unless you are given audit or orchestration, you are a task agent.
> After every task, always evaluate if README.md, or any docs, need to be update, and maintain them in up-to-date state.

Since it is an ongoing build, things about this repo keep changing.

## Rules for Gemini
> Do not create walkthrough/implementation documents. Use the rules specified in this document instead, for specs, worklog, etc.

## Styling

Only SASS is permitted for styling. SASS is not SCSS - it does not use curly braces or semi colons. Strictly single-tab to be used for indenting.
See `src/lib/styles` for all classes. 
**Do not create new classes, only use the existing classes from these files.**
Do not create or new arbitrary new font-sizes.

✅ **Correct Indenting** - The below correctly uses single-tab indenting.

```sass
.tree
	display: flex
	flex-direction: column
	gap: 1px
	overflow-y: auto
	flex: 1
	min-height: 0
	padding: 8px
```

❌ **Wrong Indenting** - The below incorrectly uses double-space indenting.

```sass
.convert
  display: flex
  flex-direction: column
  height: 100%
  min-height: 0
```

## Essential Documentation, Log, Reports

Every file inside `docs` MUST include YAML frontmatter. This excludes `INDEX.md` or `AGENTS.md` or `SKILLS.md` files.
Ignore always the files in `docs/raw`. They are scratch notes and must not contanimate your work or thinking.

```YAML
---
title: Title in Title Case
description: Exactly one sentence summary (max 120 characters).
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: doc | worklog | report | audit | spec
---
```

- All internal references must use markdown standard relative path linking - `[link text](link)` and NOT `[[Title Case]]` syntax.
- When creating or removing pages, respective `index.md` must be updated with the exact one-line description.
- Section headers in files, like `##` and `###` should not be separated by `---` lines. Avoid using `---` lines. Use double line break instead. `---` are used exclusively to separate the YAML frontmatter.
- For all files with YAML frontmatter, do not start those files with `#` header and title. Title is captured in the frontmatter, so start with the content.

### Work Tracking
The file `WORK-TRACKER.md` is the file for all work progress, current stage, further instructions. The human admin will add tasks there, and you must update status and take instructions from it. It has the following sections, and this structure must be maintained:
1. `## Next` - human's instructions for next steps by agent. Maintained by human, agent should not edit.
2. `## Reports` - index of agent's report against task given by human. Maintained by agent.

### Work Log
Agent must maintain a work log in the `docs/worklog` folder. Each task should have its own report file named `YYYY-MM-DD-task-name.md` — the date prefix is the task's creation date and MUST equal the `created` field in the frontmatter, so the folder lists in chronological order. Never create an undated worklog file; never rename one without updating its inbound links. These files need the following mandatory YAML frontmatter:

```YAML
---
title: Title in Title Case
description: Exactly one sentence summary (max 120 characters).
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: worklog
status: open | closed | completed
truth: //only if type is "completed" or "closed"
state: //if applies to a specific state only
---
```

1. Agent can only mark `type` as "complete" or "closed" on approval by human. 
2. On marking completed or dropped, it must add link to the file where human approval is given. 
3. If approval was given in a chat session, it must quote the exact date, time, and chat context where this was done.
4. Every report must be a set of notes by agent containing these sections:

```
## Instruction
// exact copy-paste of the task instruction that was added by human in the \`## Next\` section of \`WORK-TRACKER.md\`

## Log
// list of actions taken so far. keep this up to date to maintain context and handoff in this repo.

## Files
// linked list of all created files and folders

## Deps and Installations
// list of any dependencies or other installations/downloads done for these tasks

## Learnings
// list of any learnings, memory about human preferences, guidelines picked up during this task
```

1. An up to date index of all reports must be maintained in the `## Reports` section of the `WORK-TRACKER.md`.
2. Begin each task by creating its report file. If you are asked to continue a task, refer to the report file to understand its current status.

## Specs, Product

Always capture the specs of what you are creating, whether a feature, a ui component, a tool, or a full view/tab new addition.
Use the `write-product-spec` and `write-tech-spec` skills in the `skills` folder.