# Token Reference

The token schema is the public cross-project styling API. Values in `token-source.json` are authoritative defaults; `_tokens.sass` is generated from that source. Consuming applications may replace tokens globally or scope them through `Theme`.

<!-- BEGIN GENERATED TOKEN TABLES -->

### Typography

| Token | Default | Dark override |
| --- | --- | --- |
| `--font-sans` | `system-ui, sans-serif` | inherits default |
| `--font-mono` | `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace` | inherits default |
| `--text-xs` | `0.67rem` | inherits default |
| `--text-sm` | `0.75rem` | inherits default |
| `--text-md` | `0.875rem` | inherits default |
| `--text-bs` | `1rem` | inherits default |
| `--text-lg` | `1.125rem` | inherits default |
| `--text-xl` | `1.25rem` | inherits default |
| `--text-2xl` | `1.5rem` | inherits default |
| `--text-3xl` | `1.875rem` | inherits default |
| `--text-4xl` | `2.25rem` | inherits default |
| `--text-5xl` | `2.75rem` | inherits default |

### Space

| Token | Default | Dark override |
| --- | --- | --- |
| `--space-xs` | `var(--unit-space)` | inherits default |
| `--space-sm` | `calc(var(--unit-space) * 2)` | inherits default |
| `--space-md` | `calc(var(--unit-space) * 3)` | inherits default |
| `--space-bs` | `calc(var(--unit-space) * 4)` | inherits default |
| `--space-lg` | `calc(var(--unit-space) * 6)` | inherits default |
| `--space-xl` | `calc(var(--unit-space) * 8)` | inherits default |
| `--space-2xl` | `calc(var(--unit-space) * 12)` | inherits default |
| `--space-3xl` | `calc(var(--unit-space) * 16)` | inherits default |

### Radius

| Token | Default | Dark override |
| --- | --- | --- |
| `--radius-0` | `0` | inherits default |
| `--radius-2` | `2px` | inherits default |
| `--radius-3` | `3px` | inherits default |
| `--radius-4` | `4px` | inherits default |
| `--radius-6` | `6px` | inherits default |
| `--radius-8` | `8px` | inherits default |
| `--radius-10` | `10px` | inherits default |
| `--radius-12` | `12px` | inherits default |
| `--radius-16` | `16px` | inherits default |
| `--radius-24` | `24px` | inherits default |
| `--radius-sm` | `4px` | inherits default |
| `--radius-md` | `8px` | inherits default |
| `--radius-bs` | `12px` | inherits default |
| `--radius-lg` | `16px` | inherits default |
| `--radius-full` | `9999px` | inherits default |

### Controls

| Token | Default | Dark override |
| --- | --- | --- |
| `--control-h-sm` | `26px` | inherits default |
| `--control-h-md` | `32px` | inherits default |
| `--control-h-lg` | `38px` | inherits default |

### Elevation

| Token | Default | Dark override |
| --- | --- | --- |
| `--shadow-sm` | `0 1px 2px rgba(15, 23, 42, 0.06)` | `0 1px 2px rgba(0, 0, 0, 0.4)` |
| `--shadow-md` | `0 4px 12px rgba(15, 23, 42, 0.08)` | `0 4px 12px rgba(0, 0, 0, 0.35)` |
| `--shadow-bs` | `0 12px 32px rgba(15, 23, 42, 0.12)` | `0 12px 32px rgba(0, 0, 0, 0.45)` |

### Layering

| Token | Default | Dark override |
| --- | --- | --- |
| `--z-base` | `0` | inherits default |
| `--z-raised` | `10` | inherits default |
| `--z-sticky` | `100` | inherits default |
| `--z-modal` | `200` | inherits default |
| `--z-toast` | `300` | inherits default |

### Layout

| Token | Default | Dark override |
| --- | --- | --- |
| `--header-height` | `64px` | inherits default |
| `--footer-height` | `0px` | inherits default |
| `--measure` | `65ch` | inherits default |
| `--page-gutter` | `clamp(1rem, 4vw, 2rem)` | inherits default |
| `--sidebar-width` | `260px` | inherits default |
| `--toc-width` | `240px` | inherits default |
| `--card-min` | `16rem` | inherits default |
| `--breakpoint` | `768px` | inherits default |

### Motion

| Token | Default | Dark override |
| --- | --- | --- |
| `--motion-fast` | `120ms` | inherits default |
| `--motion-base` | `160ms` | inherits default |
| `--motion-slow` | `240ms` | inherits default |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | inherits default |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | inherits default |

### Palette

| Token | Default | Dark override |
| --- | --- | --- |
| `--unit-space` | `0.25rem` | inherits default |
| `--app-inline` | `var(--space-lg)` | inherits default |
| `--fit-height` | `calc(var(--header-height) + var(--footer-height))` | inherits default |
| `--transin1` | `cubic-bezier(0.470, 0.000, 0.745, 0.715)` | inherits default |
| `--transin2` | `cubic-bezier(0.550, 0.055, 0.675, 0.190)` | inherits default |
| `--transin3` | `cubic-bezier(0.755, 0.050, 0.855, 0.060)` | inherits default |
| `--transout1` | `cubic-bezier(0.390, 0.575, 0.565, 1.000)` | inherits default |
| `--transout2` | `cubic-bezier(0.215, 0.610, 0.355, 1.000)` | inherits default |
| `--transout3` | `cubic-bezier(0.230, 1.000, 0.320, 1.000)` | inherits default |
| `--speed1` | `90ms` | inherits default |
| `--speed2` | `140ms` | inherits default |
| `--speed3` | `220ms` | inherits default |
| `--motionin1` | `var(--speed1) var(--transin1)` | inherits default |
| `--motionout1` | `var(--speed1) var(--transout1)` | inherits default |
| `--motionin2` | `var(--speed2) var(--transin2)` | inherits default |
| `--motionout2` | `var(--speed2) var(--transout2)` | inherits default |
| `--motionin3` | `var(--speed3) var(--transin3)` | inherits default |
| `--motionout3` | `var(--speed3) var(--transout3)` | inherits default |
| `--height-bs` | `32px` | inherits default |
| `--height-md` | `24px` | inherits default |
| `--white-fixed` | `#ffffff` | inherits default |
| `--black-fixed` | `#171717` | inherits default |
| `--bg` | `#fafafa` | `#101010` |
| `--bg-surface` | `#fafafa` | `#202021` |
| `--bg-panel` | `#fbfbf9` | `#1f1f20` |
| `--bg-sunken` | `#f7f6f0` | `#1f1f20` |
| `--bg-raised` | `#f4f4f5` | `#3a3a3a` |
| `--bg-extra` | `#f7f8f9` | `#111111` |
| `--bg-input` | `#faf7f7` | `#1c1c1d` |
| `--bg-button` | `#ced8d3` | `#171818` |
| `--text-primary` | `#262627` | `#edf2f7` |
| `--text-secondary` | `#777777` | `#c7c7c7` |
| `--text-muted` | `#aeaeae` | `#7c7c7c` |
| `--text-inverse` | `#ffffff` | `#7c7c7c` |
| `--state-surface` | `var(--bg)` | `#7c7c7c` |
| `--state-hover` | `#eae9e8` | `#4a4a4b` |
| `--state-selected` | `#f4f2ec` | `#666668` |
| `--border` | `#d8d8d8` | `#2f2f2f` |
| `--border-subtle` | `#eceaea` | `#1e1e1f` |
| `--border-strong` | `#cfcfcf` | `#7c7c7c` |
| `--theme-color` | `#ff3e00` | `#2f9e44` |
| `--theme-color-alt` | `#c84b21` | `#36731d` |
| `--success` | `#10b981` | `#34d399` |
| `--success-hover` | `#059669` | `#6ee7b7` |
| `--warning` | `#f59e0b` | `#fbbf24` |
| `--warning-hover` | `#d97706` | `#fcd34d` |
| `--danger` | `#ef4444` | `#f87171` |
| `--danger-hover` | `#dc2626` | `#fca5a5` |
| `--info` | `#3b82f6` | `#60a5fa` |
| `--info-hover` | `#2563eb` | `#93c5fd` |
| `--ring` | `rgba(0, 127, 78, 0.35)` | `rgba(16, 185, 129, 0.4)` |

<!-- END GENERATED TOKEN TABLES -->
