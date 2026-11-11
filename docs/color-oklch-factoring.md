# color factoring using oklch

1. Foundation & Layout (Canvas & Containment)
bg-main           // The absolute background of the viewport/window (formerly bg-main)
bg-surface        // Secondary layout areas, sidebars, alternate rows (formerly bg-surface)
bg-panel       // Cards, panels, inputs, floating elements (formerly bg-panel)

2. Interactive Components (Controls)
bg-button        // Default state for buttons, switches, checkboxes
bg-button-secondary // Subtle variants, ghosts, or secondary buttons

3. States (Applied as overlays or dedicated tokens)
state-hover
state-active
state-focus
state-selected

State Layer Isolation: state-hover and state-selected should ideally be semi-transparent white/black overlays (or relative chroma shifts) applied on top of any background, rather than distinct solid colors. This ensures that a hover effect looks correct whether it is hovered over bg-app or bg-panel.

## Oklch schemas

Assuming base hue ($H$) and chroma ($C$) from theme/palette.

### decreasing lightness

oklch(99% 0.005 132)
oklch(96% 0.008 132)
oklch(100% 0 132)

### increasing lightness

oklch(14% 0.005 H)
oklch(17% 0.007 H)
oklch(21% 0.010 H)
oklch(26% 0.012 H)
oklch(10% 0.004 H)

> Step lightness (L) by increments of 3% to 5% for distinct structural layers in dark mode.
> Keep chroma (C) very low (<=0.01) for neutrals to prevent muddy grays, or tie C to a brand hue for tinted neutrals (e.g., cool blue-grays or warm slate-grays).

### borders

border-subtle: oklch(from var(--text-primary) l c h / 8%)
border-default: oklch(from var(--text-primary) l c h / 15%)
border-strong: oklch(from var(--text-primary) l c h / 30%)

*(Using text color token as the base with varying opacity ensures borders automatically adapt to light/dark mode and contrast constraints).*

* **Absolute Lightness delta approach (Manual CSS variables):**
* *In Dark Mode (Base $L = 14\%$):*
* `border-subtle`: `oklch(22% 0.005 H)` ($L_{\text{base}} + 8\%$)
* `border-default`: `oklch(29% 0.005 H)` ($L_{\text{base}} + 15\%$)
* `border-strong`: `oklch(45% 0.005 H)` ($L_{\text{base}} + 31\%$)
* *In Light Mode (Base $L = 99\%$):*
* `border-subtle`: `oklch(91% 0.005 H)` ($L_{\text{base}} - 8\%$)
* `border-default`: `oklch(84% 0.005 H)` ($L_{\text{base}} - 15\%$)
* `border-strong`: `oklch(60% 0.005 H)` ($L_{\text{base}} - 39\%$)