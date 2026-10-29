export interface DesignbenchPreset {
	id: string;
	name: string;
	description: string;
	syntax: 'indented' | 'scss' | 'css';
	styles: string;
	markup: string;
}

export const DESIGNBENCH_PRESETS: DesignbenchPreset[] = [
	{
		id: 'full-design-showcase',
		name: '★ Full DESIGN.md Specimen Showcase',
		description: 'Complete specimen gallery featuring all archetypes and token scales from DESIGN.md.',
		syntax: 'indented',
		styles: `/* DESIGN.md — Full Fractalgraphic Specimen Styles (Indented SASS) */
.design-specimen-page
	display: flex
	flex-direction: column
	gap: var(--space-2xl)
	max-width: 960px
	margin: 0 auto

/* Blueprint Frame */
.blueprint-box
	position: relative
	background: var(--bg-raised)
	border: 1px dashed var(--border-blueprint)
	border-radius: 0
	padding: var(--space-xl) var(--space-lg)

	&::before, &::after
		position: absolute
		font-family: var(--font-mono)
		font-size: 11px
		line-height: 1
		color: var(--theme-color)
		pointer-events: none

	&::before
		content: "+"
		top: -6px
		left: -4px

	&::after
		content: "+"
		bottom: -6px
		right: -4px

.blueprint-box-corner-tr
	position: absolute
	top: -6px
	right: -4px
	font-family: var(--font-mono)
	font-size: 11px
	line-height: 1
	color: var(--theme-color)
	pointer-events: none

.blueprint-box-corner-bl
	position: absolute
	bottom: -6px
	left: -4px
	font-family: var(--font-mono)
	font-size: 11px
	line-height: 1
	color: var(--theme-color)
	pointer-events: none

.blueprint-box-badge
	display: inline-block
	background: var(--theme-color)
	color: var(--text-inverse)
	font-family: var(--font-mono)
	font-size: var(--text-xs)
	font-weight: 700
	letter-spacing: 0.10em
	text-transform: uppercase
	padding: 3px 8px
	border-radius: 2px
	margin-bottom: var(--space-md)

/* Split Comparison Card */
.split-card
	display: grid
	grid-template-columns: 1fr
	border: 1px solid var(--border-subtle)
	background: var(--bg)
	border-radius: 0

@media (min-width: 768px)
	.split-card
		grid-template-columns: 1fr 1fr

.split-card-pane-left
	position: relative
	padding: var(--space-xl) var(--space-lg)
	border-top: 3px solid var(--theme-color)

.split-card-pane-right
	position: relative
	padding: var(--space-xl) var(--space-lg)
	border-top: 1px solid var(--border-subtle)

@media (min-width: 768px)
	.split-card-pane-right
		border-top: 3px solid transparent
		border-left: 1px solid var(--border-subtle)

.split-card-list
	list-style: none
	margin: var(--space-md) 0 0 0
	padding: 0
	display: flex
	flex-direction: column
	gap: var(--space-sm)

.split-card-item
	display: flex
	align-items: flex-start
	gap: var(--space-xs)
	font-size: var(--text-md)
	line-height: 1.5
	color: var(--text-secondary)

.split-card-item-positive .split-card-marker
	color: var(--theme-color)
	font-family: var(--font-mono)
	font-weight: 700

.split-card-item-negative .split-card-marker
	color: var(--text-muted)
	font-family: var(--font-mono)
	font-weight: 400

/* Metric Strip */
.metric-strip
	display: grid
	grid-template-columns: repeat(2, minmax(0, 1fr))
	border: 1px solid var(--border-subtle)
	background: var(--bg)
	border-radius: 0

@media (min-width: 640px)
	.metric-strip
		grid-template-columns: repeat(3, minmax(0, 1fr))

@media (min-width: 900px)
	.metric-strip
		grid-template-columns: repeat(6, minmax(0, 1fr))

.metric-strip-cell
	padding: var(--space-md) var(--space-sm)
	display: flex
	flex-direction: column
	gap: var(--space-xs)
	border-right: 1px solid var(--border-subtle)
	border-bottom: 1px solid var(--border-subtle)

@media (min-width: 900px)
	.metric-strip-cell
		border-bottom: none

	.metric-strip-cell:last-child
		border-right: none

.metric-strip-val
	font-size: var(--text-3xl)
	font-weight: 700
	line-height: 1.0
	color: var(--theme-color)

.metric-strip-label
	font-family: var(--font-mono)
	font-size: var(--text-xs)
	font-weight: 500
	letter-spacing: 0.12em
	text-transform: uppercase
	color: var(--text-muted)

/* Benchmark Cards */
.benchmark-cards
	display: grid
	grid-template-columns: 1fr
	border: 1px solid var(--border-subtle)
	border-radius: 12px
	background: var(--bg)
	overflow: hidden

@media (min-width: 768px)
	.benchmark-cards
		grid-template-columns: repeat(3, minmax(0, 1fr))

.benchmark-card
	padding: var(--space-lg)
	border-bottom: 1px solid var(--border-subtle)

@media (min-width: 768px)
	.benchmark-card
		border-bottom: none
		border-right: 1px solid var(--border-subtle)

	.benchmark-card:last-child
		border-right: none

.benchmark-card-title
	font-size: var(--text-md)
	font-weight: 700
	color: var(--text-primary)
	margin-bottom: var(--space-md)

.benchmark-row
	display: flex
	align-items: center
	justify-content: space-between
	gap: var(--space-md)
	margin-bottom: var(--space-xs)

.benchmark-row-track
	flex: 1
	height: 3px
	background: var(--state-hover)
	border-radius: 2px
	overflow: hidden

.benchmark-row-fill
	height: 100%
	border-radius: 2px

.benchmark-row-fill-1
	background: var(--theme-color)

.benchmark-row-fill-2
	background: var(--color-alt)

.benchmark-row-fill-3
	background: var(--color-alt2)

.benchmark-row-val
	font-family: var(--font-mono)
	font-size: var(--text-sm)
	font-weight: 700
	color: var(--text-primary)
	min-width: 4.5rem
	text-align: right

.benchmark-row-unit
	font-weight: 400
	color: var(--text-muted)

/* Stage Row */
.stage-row
	display: grid
	grid-template-columns: 100px 1.2fr 1fr
	padding: var(--space-xl) 0
	border-bottom: 1px solid var(--border-subtle)
	gap: var(--space-xl)

.stage-row-number
	font-family: var(--font-mono)
	font-size: var(--text-sm)
	font-weight: 600
	letter-spacing: 0.12em
	text-transform: uppercase
	color: var(--theme-color)

.stage-row-content
	display: flex
	flex-direction: column
	gap: var(--space-xs)

.stage-row-title
	font-size: var(--text-2xl)
	font-weight: 700
	letter-spacing: -0.02em
	color: var(--text-primary)

.stage-row-body
	font-size: var(--text-md)
	line-height: 1.6
	color: var(--text-secondary)

.stage-row-list
	display: flex
	flex-direction: column
	gap: var(--space-xs)

.stage-row-item
	display: flex
	justify-content: space-between
	align-items: baseline
	padding-bottom: var(--space-xs)
	border-bottom: 1px dotted var(--border-subtle)
	font-family: var(--font-mono)
	font-size: var(--text-sm)

.stage-row-item-meta
	color: var(--text-muted)
	font-size: var(--text-xs)
	letter-spacing: 0.08em
	text-transform: uppercase

/* Terminal Code Frame */
.terminal-frame
	background: var(--bg-surface)
	border: 1px solid var(--border-strong)
	border-radius: 4px
	padding: var(--space-lg)
	font-family: var(--font-mono)
	font-size: var(--text-sm)
	line-height: 1.6
	color: var(--text-primary)

.terminal-comment
	color: var(--text-muted)

.terminal-cmd
	color: var(--theme-color)
	font-weight: 600

/* Action Buttons */
.cta-row
	display: flex
	gap: var(--space-sm)
	align-items: center
	margin-top: var(--space-md)

.btn
	display: inline-flex
	align-items: center
	justify-content: center
	font-family: var(--font-mono)
	font-size: var(--text-sm)
	font-weight: 600
	line-height: 1
	padding: var(--space-sm) var(--space-bs)
	border-radius: 2px
	text-decoration: none
	cursor: pointer
	transition: all 120ms ease-out

.btn-primary
	background: var(--theme-color)
	color: var(--text-inverse)
	border: 1px solid var(--theme-color)

	&:hover
		background: var(--theme-6)
		border-color: var(--theme-6)

.btn-secondary
	background: var(--bg)
	color: var(--text-primary)
	border: 1px solid var(--border-strong)

	&:hover
		background: var(--bg-surface)

/* Hairline Divider */
.hairline-divider
	width: 100%
	height: 1px
	background: var(--border-subtle)
	border: none
	margin: 0`,
		markup: `<div class="design-specimen-page sans">
  <!-- Specimen Header -->
  <header>
    <div class="eyebrow">FRACTALGRAPHIC DESIGN SYSTEM · SPEC BENCH</div>
    <h1 class="text-4xl" style="margin: var(--space-xs) 0;">Components & Token Geometry</h1>
    <p class="text-lg" style="margin: 0; color: var(--text-secondary);">
      A strict, implementation-grade live specimen test conforming to DESIGN.md.
    </p>
  </header>

  <hr class="hairline-divider">

  <!-- 01 Blueprint Box -->
  <section class="blueprint-box">
    <span class="blueprint-box-corner-tr">+</span>
    <span class="blueprint-box-corner-bl">+</span>
    <div class="blueprint-box-badge">[ THE OPENER ]</div>
    <h2 class="text-2xl" style="margin: 0 0 var(--space-sm);">Tailwind is very good.</h2>
    <p class="text-md" style="margin: 0 0 var(--space-sm); color: var(--text-secondary);">
      If it fits your hands, if shadcn is load-bearing in your work — close this tab with my blessing. You are not the problem this solves.
    </p>
    <p class="text-md" style="margin: 0; color: var(--text-secondary);">
      Still here? Then you want the other stack. Structure without a compiler, a component library that reads the same tokens, and a system consistent enough to trust. <strong style="color: var(--theme-color);">Hi.</strong>
    </p>
  </section>

  <hr class="hairline-divider">

  <!-- 02 Split Comparison Card -->
  <section class="split-card">
    <div class="split-card-pane-left">
      <h3 class="text-xl" style="margin: 0;">Built for you if</h3>
      <ul class="split-card-list">
        <li class="split-card-item split-card-item-positive">
          <span class="split-card-marker">+</span>
          <span>You write CSS well and resent re-writing it</span>
        </li>
        <li class="split-card-item split-card-item-positive">
          <span class="split-card-marker">+</span>
          <span>You want a build step you can delete</span>
        </li>
        <li class="split-card-item split-card-item-positive">
          <span class="split-card-marker">+</span>
          <span>You want your agent held to a contract, not trusted</span>
        </li>
      </ul>
    </div>
    <div class="split-card-pane-right">
      <h3 class="text-xl" style="margin: 0; color: var(--text-secondary);">Not for you if</h3>
      <ul class="split-card-list">
        <li class="split-card-item split-card-item-negative">
          <span class="split-card-marker">—</span>
          <span>Tailwind already fits your hands</span>
        </li>
        <li class="split-card-item split-card-item-negative">
          <span class="split-card-marker">—</span>
          <span>shadcn or daisyUI is load-bearing in your work</span>
        </li>
        <li class="split-card-item split-card-item-negative">
          <span class="split-card-marker">—</span>
          <span>You need the biggest ecosystem and most StackOverflow answers</span>
        </li>
      </ul>
    </div>
  </section>

  <hr class="hairline-divider">

  <!-- 03 Metric Strip -->
  <section class="metric-strip">
    <div class="metric-strip-cell">
      <span class="metric-strip-val">157</span>
      <span class="metric-strip-label">Repositories</span>
    </div>
    <div class="metric-strip-cell">
      <span class="metric-strip-val">124</span>
      <span class="metric-strip-label">Tools</span>
    </div>
    <div class="metric-strip-cell">
      <span class="metric-strip-val">39</span>
      <span class="metric-strip-label">Demos</span>
    </div>
    <div class="metric-strip-cell">
      <span class="metric-strip-val">20</span>
      <span class="metric-strip-label">Articles</span>
    </div>
    <div class="metric-strip-cell">
      <span class="metric-strip-val">16</span>
      <span class="metric-strip-label">Docs</span>
    </div>
    <div class="metric-strip-cell">
      <span class="metric-strip-val">13</span>
      <span class="metric-strip-label">Showcases</span>
    </div>
  </section>

  <hr class="hairline-divider">

  <!-- 04 Benchmark Cards -->
  <section class="benchmark-cards">
    <div class="benchmark-card">
      <div class="benchmark-card-title">Minified bundle</div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-1" style="width: 33%;"></div></div>
        <span class="benchmark-row-val">9.90 <span class="benchmark-row-unit">KiB</span></span>
      </div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-2" style="width: 50%;"></div></div>
        <span class="benchmark-row-val">14.63 <span class="benchmark-row-unit">KiB</span></span>
      </div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-3" style="width: 100%;"></div></div>
        <span class="benchmark-row-val">29.54 <span class="benchmark-row-unit">KiB</span></span>
      </div>
    </div>
    <div class="benchmark-card">
      <div class="benchmark-card-title">Gzip bundle</div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-1" style="width: 39%;"></div></div>
        <span class="benchmark-row-val">4.35 <span class="benchmark-row-unit">KiB</span></span>
      </div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-2" style="width: 49%;"></div></div>
        <span class="benchmark-row-val">5.47 <span class="benchmark-row-unit">KiB</span></span>
      </div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-3" style="width: 100%;"></div></div>
        <span class="benchmark-row-val">11.12 <span class="benchmark-row-unit">KiB</span></span>
      </div>
    </div>
    <div class="benchmark-card">
      <div class="benchmark-card-title">500 KiB file</div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-1" style="width: 77%;"></div></div>
        <span class="benchmark-row-val">90.98 <span class="benchmark-row-unit">ms</span></span>
      </div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-2" style="width: 81%;"></div></div>
        <span class="benchmark-row-val">96.41 <span class="benchmark-row-unit">ms</span></span>
      </div>
      <div class="benchmark-row">
        <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-3" style="width: 100%;"></div></div>
        <span class="benchmark-row-val">118.39 <span class="benchmark-row-unit">ms</span></span>
      </div>
    </div>
  </section>

  <hr class="hairline-divider">

  <!-- 05 Stage Step Row -->
  <section class="stage-row">
    <div class="stage-row-number">STAGE 02</div>
    <div class="stage-row-content">
      <h3 class="stage-row-title" style="margin: 0;">Design</h3>
      <p class="stage-row-body" style="margin: 0;">
        Decide proportion once and stop re-deciding it. Then take a palette, or build one — colour stays yours throughout.
      </p>
    </div>
    <div class="stage-row-list">
      <div class="stage-row-item">
        <span>fractalstyler2</span>
        <span class="stage-row-item-meta">250 CLASSES</span>
      </div>
      <div class="stage-row-item">
        <span>fractalthemer</span>
        <span class="stage-row-item-meta">41 PALETTES</span>
      </div>
      <div class="stage-row-item">
        <span>the studio</span>
        <span class="stage-row-item-meta">IN BROWSER</span>
      </div>
    </div>
  </section>

  <hr class="hairline-divider">

  <!-- 06 Terminal & CTA Buttons -->
  <section>
    <div class="terminal-frame">
      <div class="terminal-comment"># the styling system, compiled, nothing to configure</div>
      <div>npx <span class="terminal-cmd">fractalstyler2</span> init --css</div>
      <br>
      <div class="terminal-comment"># or the whole project, scaffolded and agent-ready</div>
      <div>npx <span class="terminal-cmd">fractal-svelte-scaffold</span></div>
    </div>

    <div class="cta-row">
      <button class="btn btn-primary">Read the docs</button>
      <button class="btn btn-secondary">GitHub</button>
    </div>
  </section>
</div>`
	},
	{
		id: 'blueprint-box',
		name: 'Blueprint Box',
		description: 'Dashed coral border with corner registration marks and anchor pill tag.',
		syntax: 'indented',
		styles: `.blueprint-box
	position: relative
	background: var(--bg-raised)
	border: 1px dashed var(--border-blueprint)
	border-radius: 0
	padding: var(--space-xl) var(--space-lg)

	&::before, &::after
		position: absolute
		font-family: var(--font-mono)
		font-size: 11px
		line-height: 1
		color: var(--theme-color)
		pointer-events: none

	&::before
		content: "+"
		top: -6px
		left: -4px

	&::after
		content: "+"
		bottom: -6px
		right: -4px

.blueprint-box-corner-tr
	position: absolute
	top: -6px
	right: -4px
	font-family: var(--font-mono)
	font-size: 11px
	line-height: 1
	color: var(--theme-color)
	pointer-events: none

.blueprint-box-corner-bl
	position: absolute
	bottom: -6px
	left: -4px
	font-family: var(--font-mono)
	font-size: 11px
	line-height: 1
	color: var(--theme-color)
	pointer-events: none

.blueprint-box-badge
	display: inline-block
	background: var(--theme-color)
	color: var(--text-inverse)
	font-family: var(--font-mono)
	font-size: var(--text-xs)
	font-weight: 700
	letter-spacing: 0.10em
	text-transform: uppercase
	padding: 3px 8px
	border-radius: 2px
	margin-bottom: var(--space-md)`,
		markup: `<div class="blueprint-box sans">
  <span class="blueprint-box-corner-tr">+</span>
  <span class="blueprint-box-corner-bl">+</span>
  <div class="blueprint-box-badge">[ THE OPENER ]</div>
  <h3 class="text-2xl" style="margin: 0 0 var(--space-sm);">Tailwind is very good.</h3>
  <p class="text-md" style="margin: 0 0 var(--space-sm); color: var(--text-secondary);">
    If it fits your hands, if shadcn is load-bearing in your work — close this tab with my blessing. You are not the problem this solves.
  </p>
  <p class="text-md" style="margin: 0; color: var(--text-secondary);">
    Still here? Then you want the other stack. Structure without a compiler, a component library that reads the same tokens, and a system consistent enough to trust. <strong style="color: var(--theme-color);">Hi.</strong>
  </p>
</div>`
	},
	{
		id: 'split-card',
		name: 'Split Comparison Card',
		description: 'Asymmetric 2-column qualification card with top accent stripe.',
		syntax: 'indented',
		styles: `.split-card
	display: grid
	grid-template-columns: 1fr 1fr
	border: 1px solid var(--border-subtle)
	background: var(--bg)
	border-radius: 0

.split-card-pane-left
	position: relative
	padding: var(--space-xl) var(--space-lg)
	border-top: 3px solid var(--theme-color)

.split-card-pane-right
	position: relative
	padding: var(--space-xl) var(--space-lg)
	border-top: 3px solid transparent
	border-left: 1px solid var(--border-subtle)

.split-card-list
	list-style: none
	margin: var(--space-md) 0 0 0
	padding: 0
	display: flex
	flex-direction: column
	gap: var(--space-sm)

.split-card-item
	display: flex
	align-items: flex-start
	gap: var(--space-xs)
	font-size: var(--text-md)
	line-height: 1.5
	color: var(--text-secondary)

.split-card-item-positive .split-card-marker
	color: var(--theme-color)
	font-family: var(--font-mono)
	font-weight: 700

.split-card-item-negative .split-card-marker
	color: var(--text-muted)
	font-family: var(--font-mono)
	font-weight: 400`,
		markup: `<div class="split-card sans">
  <div class="split-card-pane-left">
    <h3 class="text-xl" style="margin: 0;">Built for you if</h3>
    <ul class="split-card-list">
      <li class="split-card-item split-card-item-positive">
        <span class="split-card-marker">+</span>
        <span>You write CSS well and resent re-writing it</span>
      </li>
      <li class="split-card-item split-card-item-positive">
        <span class="split-card-marker">+</span>
        <span>You want a build step you can delete</span>
      </li>
      <li class="split-card-item split-card-item-positive">
        <span class="split-card-marker">+</span>
        <span>You want your agent held to a contract, not trusted</span>
      </li>
    </ul>
  </div>
  <div class="split-card-pane-right">
    <h3 class="text-xl" style="margin: 0; color: var(--text-secondary);">Not for you if</h3>
    <ul class="split-card-list">
      <li class="split-card-item split-card-item-negative">
        <span class="split-card-marker">—</span>
        <span>Tailwind already fits your hands</span>
      </li>
      <li class="split-card-item split-card-item-negative">
        <span class="split-card-marker">—</span>
        <span>shadcn or daisyUI is load-bearing in your work</span>
      </li>
      <li class="split-card-item split-card-item-negative">
        <span class="split-card-marker">—</span>
        <span>You need the biggest ecosystem and most StackOverflow answers</span>
      </li>
    </ul>
  </div>
</div>`
	},
	{
		id: 'metric-strip',
		name: '6-Cell Metric Strip',
		description: 'Single-row metric grid with 1px internal hairlines and accent numbers.',
		syntax: 'indented',
		styles: `.metric-strip
	display: grid
	grid-template-columns: repeat(6, 1fr)
	border: 1px solid var(--border-subtle)
	background: var(--bg)
	border-radius: 0

.metric-strip-cell
	padding: var(--space-md) var(--space-sm)
	display: flex
	flex-direction: column
	gap: var(--space-xs)
	border-right: 1px solid var(--border-subtle)

	&:last-child
		border-right: none

.metric-strip-val
	font-size: var(--text-3xl)
	font-weight: 700
	line-height: 1.0
	color: var(--theme-color)

.metric-strip-label
	font-family: var(--font-mono)
	font-size: var(--text-xs)
	font-weight: 500
	letter-spacing: 0.12em
	text-transform: uppercase
	color: var(--text-muted)`,
		markup: `<div class="metric-strip sans">
  <div class="metric-strip-cell">
    <span class="metric-strip-val">157</span>
    <span class="metric-strip-label">Repositories</span>
  </div>
  <div class="metric-strip-cell">
    <span class="metric-strip-val">124</span>
    <span class="metric-strip-label">Tools</span>
  </div>
  <div class="metric-strip-cell">
    <span class="metric-strip-val">39</span>
    <span class="metric-strip-label">Demos</span>
  </div>
  <div class="metric-strip-cell">
    <span class="metric-strip-val">20</span>
    <span class="metric-strip-label">Articles</span>
  </div>
  <div class="metric-strip-cell">
    <span class="metric-strip-val">16</span>
    <span class="metric-strip-label">Docs</span>
  </div>
  <div class="metric-strip-cell">
    <span class="metric-strip-val">13</span>
    <span class="metric-strip-label">Showcases</span>
  </div>
</div>`
	},
	{
		id: 'benchmark-cards',
		name: 'Benchmark Card Trio',
		description: '3-card horizontal grid with progress tracks and theme-color series.',
		syntax: 'indented',
		styles: `.benchmark-cards
	display: grid
	grid-template-columns: 1fr
	border: 1px solid var(--border-subtle)
	border-radius: 12px
	background: var(--bg)
	overflow: hidden

@media (min-width: 768px)
	.benchmark-cards
		grid-template-columns: repeat(3, minmax(0, 1fr))

.benchmark-card
	padding: var(--space-lg)
	border-bottom: 1px solid var(--border-subtle)

@media (min-width: 768px)
	.benchmark-card
		border-bottom: none
		border-right: 1px solid var(--border-subtle)

	.benchmark-card:last-child
		border-right: none

.benchmark-card-title
	font-size: var(--text-md)
	font-weight: 700
	color: var(--text-primary)
	margin-bottom: var(--space-md)

.benchmark-row
	display: flex
	align-items: center
	justify-content: space-between
	gap: var(--space-md)
	margin-bottom: var(--space-xs)

.benchmark-row-track
	flex: 1
	height: 3px
	background: var(--state-hover)
	border-radius: 2px
	overflow: hidden

.benchmark-row-fill
	height: 100%
	border-radius: 2px

.benchmark-row-fill-1
	background: var(--theme-color)

.benchmark-row-fill-2
	background: var(--color-alt)

.benchmark-row-fill-3
	background: var(--color-alt2)

.benchmark-row-val
	font-family: var(--font-mono)
	font-size: var(--text-sm)
	font-weight: 700
	color: var(--text-primary)
	min-width: 4.5rem
	text-align: right

.benchmark-row-unit
	font-weight: 400
	color: var(--text-muted)`,
		markup: `<div class="benchmark-cards sans">
  <div class="benchmark-card">
    <div class="benchmark-card-title">Minified bundle</div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-1" style="width: 33%;"></div></div>
      <span class="benchmark-row-val">9.90 <span class="benchmark-row-unit">KiB</span></span>
    </div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-2" style="width: 50%;"></div></div>
      <span class="benchmark-row-val">14.63 <span class="benchmark-row-unit">KiB</span></span>
    </div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-3" style="width: 100%;"></div></div>
      <span class="benchmark-row-val">29.54 <span class="benchmark-row-unit">KiB</span></span>
    </div>
  </div>
  <div class="benchmark-card">
    <div class="benchmark-card-title">Gzip bundle</div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-1" style="width: 39%;"></div></div>
      <span class="benchmark-row-val">4.35 <span class="benchmark-row-unit">KiB</span></span>
    </div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-2" style="width: 49%;"></div></div>
      <span class="benchmark-row-val">5.47 <span class="benchmark-row-unit">KiB</span></span>
    </div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-3" style="width: 100%;"></div></div>
      <span class="benchmark-row-val">11.12 <span class="benchmark-row-unit">KiB</span></span>
    </div>
  </div>
  <div class="benchmark-card">
    <div class="benchmark-card-title">500 KiB file</div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-1" style="width: 77%;"></div></div>
      <span class="benchmark-row-val">90.98 <span class="benchmark-row-unit">ms</span></span>
    </div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-2" style="width: 81%;"></div></div>
      <span class="benchmark-row-val">96.41 <span class="benchmark-row-unit">ms</span></span>
    </div>
    <div class="benchmark-row">
      <div class="benchmark-row-track"><div class="benchmark-row-fill benchmark-row-fill-3" style="width: 100%;"></div></div>
      <span class="benchmark-row-val">118.39 <span class="benchmark-row-unit">ms</span></span>
    </div>
  </div>
</div>`
	},
	{
		id: 'endless-bench',
		name: '⚡ Endless Theme Bench (bench.html)',
		description: 'Full developer workbench from bench.html with thread, diffs, overlays, components & style sheet.',
		syntax: 'css',
		styles: `/* Theme variables for Endless Theme Bench (bench.html) */
:root {
  --canvas: #ffffff;
  --background: #ffffff;
  --foreground: #09090b;
  --sidebar: #f4f4f5;
  --sidebar-foreground: #09090b;
  --sidebar-accent: #e4e4e7;
  --sidebar-accent-foreground: #09090b;
  --sidebar-ring: #ff4500;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #ff4500;
  --primary-foreground: #ffffff;
  --secondary: #f4f4f5;
  --secondary-foreground: #09090b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --subtle-foreground: #a1a1aa;
  --accent: #f4f4f5;
  --accent-foreground: #09090b;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e4e4e7;
  --border-seam: #ff4500;
  --border-hairline: #efefef;
  --input: #e4e4e7;
  --ring: #ff4500;
  --radius: 0.5rem;
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.12);
  --file-accent: #2563eb;
  --timeline-accent: #2563eb;
  --success: #10b981;
  --warning: #f59e0b;
  --attention: #f59e0b;
  --diff-added: #10b981;
  --diff-removed: #ef4444;
  --state-active: #e4e4e7;
  --state-hover: #f4f4f5;
  --surface-recessed: rgba(0, 0, 0, 0.04);
  --selection-color-default: rgba(37, 99, 235, 0.15);
  --bb-sidebar-row-height: 28px;
  --bb-sidebar-row-height-coarse: 36px;
  --spacing: 0.25rem;
}

.dark, [data-theme="dark"] {
  --canvas: #151515;
  --background: #151515;
  --foreground: #c1c1c1;
  --sidebar: #1b1b1b;
  --sidebar-foreground: #c1c1c1;
  --sidebar-accent: #252528;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-ring: #ff4500;
  --card: #18181b;
  --card-foreground: #f4f4f5;
  --popover: #1f1f23;
  --popover-foreground: #f4f4f5;
  --primary: #ff4500;
  --primary-foreground: #09090b;
  --secondary: #27272a;
  --secondary-foreground: #f4f4f5;
  --muted: #27272a;
  --muted-foreground: #8a8a93;
  --subtle-foreground: #71717a;
  --accent: #27272a;
  --accent-foreground: #f4f4f5;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #27272a;
  --border-seam: #ff4500;
  --border-hairline: #222225;
  --input: #27272a;
  --ring: #ff4500;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.45);
  --file-accent: #79a9db;
  --timeline-accent: #79a9db;
  --success: #4bc680;
  --warning: #fc8c45;
  --attention: #f0b135;
  --diff-added: #4bc680;
  --diff-removed: #ef4444;
  --state-active: #27272a;
  --state-hover: #222225;
  --surface-recessed: rgba(127, 127, 127, 0.08);
  --selection-color-default: rgba(47, 180, 255, 0.25);
}`,
		markup: ''
	},
	{
		id: 'blank',
		name: 'Blank Canvas',
		description: 'Empty workbench for testing custom component styling and markup.',
		syntax: 'css',
		styles: `/* Paste custom CSS or indented SASS here */
.my-card
	padding: var(--space-lg)
	background: var(--bg)
	border: 1px solid var(--border-subtle)
	border-radius: 4px

.my-card h2
	margin: 0 0 var(--space-xs)
	color: var(--text-primary)

.my-card p
	margin: 0
	color: var(--text-secondary)`,
		markup: `<div class="my-card sans">
  <h2 class="text-2xl">Component Specimen</h2>
  <p class="text-md">Type styles on the left, markup in the center, and inspect the real-time result here.</p>
</div>`
	}
];
