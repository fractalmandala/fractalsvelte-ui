# pass 2 — data — shots

`before/` — the pre-pass state.
`after/`  — the post-pass state, one crop per component page, anchored at the
Examples heading so the previews are readable.

Pairs that show a real visual change:

- carousel — `before/carousel-examples.jpg` / `after/carousel-examples.jpg`:
  the indicator was invisible (`soft` is in no registry) and now paints.
- table — `before/table-page.png` (full page) / `after/table-examples.jpg`.
- collapsible — `after/collapsible-examples.jpg` (surface off) and
  `after/collapsible-surface-on.jpg` (`surface="outlined"`).

The rest of the group is a no-visual-change pass by construction: every new
prop defaults to the class the component already emitted. That claim is
measured, not assumed — see `../pass-2-data.md` §5.

Every example on every page was opened in the agent browser and checked; the
crops here are one per page, not one per example, to keep the folder usable.
