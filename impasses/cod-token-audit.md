# Token audit (cod)

Generated 2026-11-19T02:21:56.016Z by `node scripts/cod/token-audit.ts`.
Parts scanned: 203. Parts with hardcoded prop-family classes: 130.

| family | literals | parts | prop not declared |
|:--|--:|--:|--:|
| gap | 200 | 89 | 195 |
| textColor | 174 | 80 | 79 |
| textSize | 141 | 55 | 79 |
| size | 120 | 41 | 88 |
| align | 114 | 60 | 100 |
| pad | 35 | 24 | 35 |
| radius | 24 | 19 | 19 |

## By part

### src/lib/components/actions/button/Button.svelte
- L75 `xcenter` (align, **no prop**): `class={['button row ycenter xcenter gap-sm', variant, size, shape, textSize, resolvedTextColor, block && 'wfull', pressable && 'motion', cla`
- L75 `gap-sm` (gap, **no prop**): `class={['button row ycenter xcenter gap-sm', variant, size, shape, textSize, resolvedTextColor, block && 'wfull', pressable && 'motion', cla`
- L89 `xcenter` (align, **no prop**): `class={['row ycenter xcenter gap-sm', variant, size, shape, textSize, resolvedTextColor, block && 'wfull', pressable && 'motion', className]`
- L89 `gap-sm` (gap, **no prop**): `class={['row ycenter xcenter gap-sm', variant, size, shape, textSize, resolvedTextColor, block && 'wfull', pressable && 'motion', className]`

### src/lib/components/actions/copy-button/CopyButton.svelte
- L82 `text-success` (textColor, prop exists but literal used): `<Icon icon={luCheck} class="text-success" />`

### src/lib/components/actions/link/Link.svelte
- L36 `text-secondary` (textColor, prop exists but literal used): `textColor ?? (look === 'subtle' ? 'text-secondary' : look === 'plain' ? 'text-primary' : undefined)`
- L36 `text-primary` (textColor, prop exists but literal used): `textColor ?? (look === 'subtle' ? 'text-secondary' : look === 'plain' ? 'text-primary' : undefined)`

### src/lib/components/actions/split-button/SplitButton.svelte
- L102 `radius-bs` (radius, prop exists but literal used): `'floating match-anchor pop glass rim shad-lg border-subtle radius-bs pad-xs box gap-xs',`
- L102 `pad-xs` (pad, **no prop**): `'floating match-anchor pop glass rim shad-lg border-subtle radius-bs pad-xs box gap-xs',`
- L102 `gap-xs` (gap, **no prop**): `'floating match-anchor pop glass rim shad-lg border-subtle radius-bs pad-xs box gap-xs',`
- L115 `text-danger` (textColor, prop exists but literal used): `class={['item', item.danger && 'text-danger']}`

### src/lib/components/actions/swap/Swap.svelte
- L60 `xcenter` (align, **no prop**): `class={['button btn-icon row xcenter ycenter', variant, size, textSize, resolvedTextColor, shape, className]}`
- L66 `xcenter` (align, **no prop**): `<span class={active ? 'selected inline-flex xcenter ycenter' : 'inline-flex xcenter ycenter'}>`
- L66 `xcenter` (align, **no prop**): `<span class={active ? 'selected inline-flex xcenter ycenter' : 'inline-flex xcenter ycenter'}>`
- L73 `xcenter` (align, **no prop**): `<span class={!active ? 'selected inline-flex xcenter ycenter' : 'inline-flex xcenter ycenter'}>`
- L73 `xcenter` (align, **no prop**): `<span class={!active ? 'selected inline-flex xcenter ycenter' : 'inline-flex xcenter ycenter'}>`

### src/lib/components/actions/toggle-group/ToggleGroup.svelte
- L89 `gap-sm` (gap, **no prop**): `attached ? 'button-group' : vertical ? 'box gap-sm' : 'row wrap gap-sm',`
- L89 `gap-sm` (gap, **no prop**): `attached ? 'button-group' : vertical ? 'box gap-sm' : 'row wrap gap-sm',`

### src/lib/components/actions/toggle/Toggle.svelte
- L56 `gap-sm` (gap, **no prop**): `'button no-scaling gap-sm weight-500 inline-flex',`

### src/lib/components/actions/toolbar/Toolbar.svelte
- L39 `gap-xs` (gap, **no prop**): `class={[vertical ? 'box gap-xs' : 'row gap-xs', className]}`
- L39 `gap-xs` (gap, **no prop**): `class={[vertical ? 'box gap-xs' : 'row gap-xs', className]}`

### src/lib/components/actions/toolbar/ToolbarGroup.svelte
- L24 `gap-xs` (gap, **no prop**): `attached ? 'button-group' : vertical ? 'box gap-xs' : 'row gap-xs',`
- L24 `gap-xs` (gap, **no prop**): `attached ? 'button-group' : vertical ? 'box gap-xs' : 'row gap-xs',`

### src/lib/components/data/accordion/AccordionItem.svelte
- L42 `ta-l` (align, **no prop**): `<span class="grow ta-l">`
- L56 `pad-bs` (pad, **no prop**): `<div class="pad-bs">{@render children?.()}</div>`

### src/lib/components/data/carousel/Carousel.svelte
- L245 `gap-sm` (gap, prop exists but literal used): `class={['box gap-sm', textSize, textColor, className]}`
- L258 `gap-sm` (gap, prop exists but literal used): `<div class="row ycenter gap-sm">`
- L261 `h-sm` (size, **no prop**): `size="h-sm"`
- L281 `h-sm` (size, **no prop**): `size="h-sm"`
- L289 `xcenter` (align, **no prop**): `<div class="row ycenter xcenter gap-sm relative" {@attach dotsAttach}>`
- L289 `gap-sm` (gap, prop exists but literal used): `<div class="row ycenter xcenter gap-sm relative" {@attach dotsAttach}>`
- L294 `pad-sm` (pad, **no prop**): `class="bare pad-sm focus-ring"`
- L300 `text-muted` (textColor, prop exists but literal used): `<span class={['dot', i === safeIndex ? '' : 'text-muted']}></span>`

### src/lib/components/data/data-table/DataTable.svelte
- L240 `gap-sm` (gap, **no prop**): `<div class={['box gap-sm', childTextSize, childTextColor, className]} {@attach flip.attach} {...rest}>`
- L241 `xbetween` (align, **no prop**): `<div class="row xbetween ycenter gap-sm wrap">`
- L241 `gap-sm` (gap, **no prop**): `<div class="row xbetween ycenter gap-sm wrap">`
- L242 `gap-sm` (gap, **no prop**): `<label class="row ycenter gap-sm grow">`
- L244 `gap-sm` (gap, **no prop**): `<span class="row ycenter gap-sm border modern bg-input grow field pad-sm">`
- L244 `pad-sm` (pad, **no prop**): `<span class="row ycenter gap-sm border modern bg-input grow field pad-sm">`
- L245 `text-muted` (textColor, prop exists but literal used): `<Icon icon={luSearch} class="text-muted shrink-0" />`
- L247 `h-lg` (size, **no prop**): `class="input bare grow h-lg text-md"`
- L247 `text-md` (textSize, prop exists but literal used): `class="input bare grow h-lg text-md"`
- L258 `h-lg` (size, **no prop**): `class={['button ghost h-lg text-sm gap-sm', shape]}`
- L258 `text-sm` (textSize, prop exists but literal used): `class={['button ghost h-lg text-sm gap-sm', shape]}`
- L258 `gap-sm` (gap, **no prop**): `class={['button ghost h-lg text-sm gap-sm', shape]}`
- L270 `pad-sm` (pad, **no prop**): `'floating at-bottom-end pop glass rim shad-sm border pad-sm measure-xs',`
- L277 `text-xs` (textSize, prop exists but literal used): `<p class="text-xs text-secondary weight-600 pad-sm">Visible columns</p>`
- L277 `text-secondary` (textColor, prop exists but literal used): `<p class="text-xs text-secondary weight-600 pad-sm">Visible columns</p>`
- L277 `pad-sm` (pad, **no prop**): `<p class="text-xs text-secondary weight-600 pad-sm">Visible columns</p>`
- L341 `gap-sm` (gap, **no prop**): `class="bare row ycenter gap-sm pointer focus-ring text-xs weight-600"`
- L341 `text-xs` (textSize, prop exists but literal used): `class="bare row ycenter gap-sm pointer focus-ring text-xs weight-600"`
- L382 `h-md` (size, **no prop**): `class="block h-md modern bg-input anim-pulse wvar"`
- L391 `text-secondary` (textColor, prop exists but literal used): `<TableCell class="data-table-empty text-secondary" colspan={colCount}>`
- L463 `pad-bs` (pad, **no prop**): `<div class="pad-bs">{@render detail(row)}</div>`
- L474 `xbetween` (align, **no prop**): `<div class="row xbetween ycenter gap-sm wrap">`
- L474 `gap-sm` (gap, **no prop**): `<div class="row xbetween ycenter gap-sm wrap">`
- L481 `gap-xs` (gap, **no prop**): `<div class="row gap-xs ycenter">`
- L484 `h-sm` (size, **no prop**): `size="h-sm"`
- L493 `h-sm` (size, **no prop**): `size="h-sm"`
- L503 `h-sm` (size, **no prop**): `size="h-sm"`
- L513 `h-sm` (size, **no prop**): `size="h-sm"`
- L522 `h-sm` (size, **no prop**): `size="h-sm"`

### src/lib/components/data/json-tree-view/internal/JsonNodeRow.svelte
- L83 `xbetween` (align, **no prop**): `'row ycenter xbetween gap-xs indent guides px-xs py-xs interactive bg-none',`
- L83 `gap-xs` (gap, prop exists but literal used): `'row ycenter xbetween gap-xs indent guides px-xs py-xs interactive bg-none',`
- L88 `gap-xs` (gap, prop exists but literal used): `<div class="row ycenter gap-xs min0 grow">`
- L92 `xcenter` (align, **no prop**): `class="bare row xcenter ycenter h-xs square text-muted pointer"`
- L92 `h-xs` (size, **no prop**): `class="bare row xcenter ycenter h-xs square text-muted pointer"`
- L92 `text-muted` (textColor, prop exists but literal used): `class="bare row xcenter ycenter h-xs square text-muted pointer"`
- L96 `text-xs` (textSize, prop exists but literal used): `<Icon icon={luChevronRight} class={['caret quarter text-xs', open && 'open']} />`
- L99 `h-xs` (size, **no prop**): `<span class="h-xs square shrink-0" aria-hidden="true"></span>`
- L115 `xcenter` (align, **no prop**): `class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"`
- L115 `h-xs` (size, **no prop**): `class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"`
- L115 `text-muted` (textColor, prop exists but literal used): `class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"`
- L119 `text-success` (textColor, prop exists but literal used): `<Icon icon={copiedId === id ? luCheck : luCopy} class={copiedId === id ? 'text-success' : undefined} />`

### src/lib/components/data/table/TableCell.svelte
- L20 `text-secondary` (textColor, prop exists but literal used): `const ink = $derived(textColor ?? (muted ? 'text-secondary' : undefined));`

### src/lib/components/data/virtual-list/VirtualList.svelte
- L183 `gap-sm` (gap, **no prop**): `class="placed sized row ycenter gap-sm"`

### src/lib/components/data/waterfall/Waterfall.svelte
- L105 `xbetween` (align, **no prop**): `<div class="grow row xbetween tabular-nums">`
- L110 `ta-r` (align, **no prop**): `<div class="wvar ta-r shrink-0 weight-500" {@attach vars({ w: '4rem' })}>Duration</div>`
- L131 `gap-xs` (gap, **no prop**): `<div class="wvar shrink-0 row ycenter gap-xs indent min0" {@attach vars({ w: '40%', level: row.depth })}>`
- L135 `xcenter` (align, **no prop**): `class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"`
- L135 `h-xs` (size, **no prop**): `class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"`
- L135 `text-muted` (textColor, prop exists but literal used): `class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"`
- L142 `text-xs` (textSize, prop exists but literal used): `<Icon icon={luChevronRight} class={['caret quarter text-xs', expanded.has(row.item.id) && 'open']} />`
- L145 `h-xs` (size, **no prop**): `<span class="h-xs square shrink-0" aria-hidden="true"></span>`
- L167 `ta-r` (align, **no prop**): `<div class={['wvar ta-r shrink-0 tabular-nums text-secondary', childTextSize]} {@attach vars({ w: '4rem' })}>`
- L167 `text-secondary` (textColor, prop exists but literal used): `<div class={['wvar ta-r shrink-0 tabular-nums text-secondary', childTextSize]} {@attach vars({ w: '4rem' })}>`

### src/lib/components/display/avatar/Avatar.svelte
- L61 `text-success` (textColor, **no prop**): `online: 'text-success',`
- L62 `text-warning` (textColor, **no prop**): `away: 'text-warning',`
- L63 `text-danger` (textColor, **no prop**): `busy: 'text-danger',`
- L64 `text-muted` (textColor, **no prop**): `offline: 'text-muted'`

### src/lib/components/display/card/CardContent.svelte
- L16 `gap-sm` (gap, **no prop**): `<div class={['box gap-sm text-secondary lh15', bodyClass[card.size], className]} {...rest}>`
- L16 `text-secondary` (textColor, **no prop**): `<div class={['box gap-sm text-secondary lh15', bodyClass[card.size], className]} {...rest}>`

### src/lib/components/display/card/CardDescription.svelte
- L16 `text-secondary` (textColor, **no prop**): `<p class={['text-secondary lh14', bodyClass[card.size], className]} {...rest}>`

### src/lib/components/display/card/CardFooter.svelte
- L17 `gap-sm` (gap, **no prop**): `<footer class={['row wrap ycenter gap-sm', 'x${align}', className]} {...rest}>`

### src/lib/components/display/card/CardHeader.svelte
- L15 `xbetween` (align, **no prop**): `<header class={['row xbetween ytop gap-bs', className]} {...rest}>`
- L15 `gap-bs` (gap, **no prop**): `<header class={['row xbetween ytop gap-bs', className]} {...rest}>`
- L16 `gap-xs` (gap, **no prop**): `<div class="box gap-xs grow wmin0">`
- L20 `gap-xs` (gap, **no prop**): `<div class="row ycenter gap-xs shrink-0">`

### src/lib/components/display/code/Code.svelte
- L102 `text-sm` (textSize, **no prop**): `<code class={['font-mono', 'text-sm', 'pad-xs', 'bg-panel', 'curved', className]} {...rest}>{code}</code>`
- L102 `pad-xs` (pad, **no prop**): `<code class={['font-mono', 'text-sm', 'pad-xs', 'bg-panel', 'curved', className]} {...rest}>{code}</code>`
- L105 `xbetween` (align, **no prop**): `<figcaption class="row xbetween ycenter gap-sm pad-sm">`
- L105 `gap-sm` (gap, **no prop**): `<figcaption class="row xbetween ycenter gap-sm pad-sm">`
- L105 `pad-sm` (pad, **no prop**): `<figcaption class="row xbetween ycenter gap-sm pad-sm">`
- L106 `text-sm` (textSize, **no prop**): `<span class="text-sm text-secondary truncate">{filename ?? lang}</span>`
- L106 `text-secondary` (textColor, **no prop**): `<span class="text-sm text-secondary truncate">{filename ?? lang}</span>`
- L109 `h-xs` (size, **no prop**): `size="h-xs"`

### src/lib/components/display/description-list/DescriptionList.svelte
- L41 `gap-sm` (gap, **no prop**): `columns === '1' ? 'gap-sm' : 'gap-lg',`
- L41 `gap-lg` (gap, **no prop**): `columns === '1' ? 'gap-sm' : 'gap-lg',`
- L46 `gap-xs` (gap, **no prop**): `const pairClass = $derived(orientation === 'horizontal' ? 'pair-row' : 'box gap-xs');`
- L53 `text-sm` (textSize, **no prop**): `<dt class="text-sm text-secondary weight-500">{item.term}</dt>`
- L53 `text-secondary` (textColor, **no prop**): `<dt class="text-sm text-secondary weight-500">{item.term}</dt>`
- L54 `text-md` (textSize, **no prop**): `<dd class="text-md">{item.description}</dd>`

### src/lib/components/display/image/Image.svelte
- L54 `gap-xs` (gap, **no prop**): `<figure class={['column gap-xs image-figure', className]} {...rest}>`
- L70 `xcenter` (align, **no prop**): `<div class="cover row xcenter ycenter text-muted gap-xs text-sm">`
- L70 `text-muted` (textColor, **no prop**): `<div class="cover row xcenter ycenter text-muted gap-xs text-sm">`
- L70 `gap-xs` (gap, **no prop**): `<div class="cover row xcenter ycenter text-muted gap-xs text-sm">`
- L70 `text-sm` (textSize, **no prop**): `<div class="cover row xcenter ycenter text-muted gap-xs text-sm">`
- L81 `text-xs` (textSize, **no prop**): `<figcaption class="text-xs text-muted">{caption}</figcaption>`
- L81 `text-muted` (textColor, **no prop**): `<figcaption class="text-xs text-muted">{caption}</figcaption>`

### src/lib/components/display/item/Item.svelte
- L47 `gap-sm` (gap, **no prop**): `'row ycenter gap-sm wfull',`

### src/lib/components/display/item/ItemActions.svelte
- L14 `gap-sm` (gap, **no prop**): `<div class={['shrink-0 row ycenter gap-sm', className]} {...rest}>`

### src/lib/components/display/item/ItemDescription.svelte
- L14 `text-sm` (textSize, **no prop**): `<p class={['text-sm text-muted lh14', className]} {...rest}>`
- L14 `text-muted` (textColor, **no prop**): `<p class={['text-sm text-muted lh14', className]} {...rest}>`

### src/lib/components/display/item/ItemMedia.svelte
- L17 `xcenter` (align, **no prop**): `<div class={['shrink-0 row ycenter xcenter text-secondary', className]} {...rest}>`
- L17 `text-secondary` (textColor, **no prop**): `<div class={['shrink-0 row ycenter xcenter text-secondary', className]} {...rest}>`

### src/lib/components/display/qr-code/QrCode.svelte
- L79 `xcenter` (align, **no prop**): `class={['relative inline-flex row xcenter ycenter bg-surface border overflow-hidden', shape, className]}`
- L83 `pad-md` (pad, **no prop**): `<div class="pad-md text-xs text-danger">{encoded.error}</div>`
- L83 `text-xs` (textSize, **no prop**): `<div class="pad-md text-xs text-danger">{encoded.error}</div>`
- L83 `text-danger` (textColor, **no prop**): `<div class="pad-md text-xs text-danger">{encoded.error}</div>`
- L91 `xcenter` (align, **no prop**): `<div class="cover row xcenter ycenter pointer-none">`
- L92 `pad-xs` (pad, **no prop**): `<div class="bg-surface pad-xs modern border-subtle">`

### src/lib/components/display/stat/Stat.svelte
- L83 `gap-bs` (gap, **no prop**): `const classes = $derived(['row', 'ycenter', 'gap-bs', className]);`
- L88 `text-xl` (textSize, prop exists but literal used): `<span class="text-xl text-muted shrink-0">`
- L88 `text-muted` (textColor, prop exists but literal used): `<span class="text-xl text-muted shrink-0">`
- L92 `gap-xs` (gap, **no prop**): `<div class="box gap-xs min0">`
- L93 `text-sm` (textSize, prop exists but literal used): `<div class="text-sm text-muted">{label}</div>`
- L93 `text-muted` (textColor, prop exists but literal used): `<div class="text-sm text-muted">{label}</div>`
- L94 `gap-sm` (gap, **no prop**): `<div class="row ycenter wrap gap-sm">`
- L101 `gap-xs` (gap, **no prop**): `'gap-xs',`
- L102 `text-sm` (textSize, prop exists but literal used): `'text-sm',`
- L105 `text-secondary` (textColor, prop exists but literal used): `resolvedTone === 'neutral' ? 'text-secondary' : 'text-${resolvedTone}'`
- L114 `text-sm` (textSize, prop exists but literal used): `<div class="text-sm text-muted">{hint}</div>`
- L114 `text-muted` (textColor, prop exists but literal used): `<div class="text-sm text-muted">{hint}</div>`

### src/lib/components/display/timeline/TimelineItem.svelte
- L23 `text-muted` (textColor, **no prop**): `const markerTone = $derived(!tone ? 'text-muted' : tone === 'neutral' ? 'text-secondary' : 'text-${tone}');`
- L23 `text-secondary` (textColor, **no prop**): `const markerTone = $derived(!tone ? 'text-muted' : tone === 'neutral' ? 'text-secondary' : 'text-${tone}');`
- L29 `pad-xs` (pad, **no prop**): `<span class={['soft', 'round', 'pad-xs', 'text-sm', tone, markerTone]}>`
- L29 `text-sm` (textSize, **no prop**): `<span class={['soft', 'round', 'pad-xs', 'text-sm', tone, markerTone]}>`
- L36 `gap-xs` (gap, **no prop**): `<div class="timeline-body box gap-xs">`
- L37 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween wrap gap-sm">`
- L37 `gap-sm` (gap, **no prop**): `<div class="row ycenter xbetween wrap gap-sm">`
- L40 `text-sm` (textSize, **no prop**): `<time class="text-sm text-muted tabular-nums">{time}</time>`
- L40 `text-muted` (textColor, **no prop**): `<time class="text-sm text-muted tabular-nums">{time}</time>`
- L44 `text-sm` (textSize, **no prop**): `<p class="text-sm text-secondary">{description}</p>`
- L44 `text-secondary` (textColor, **no prop**): `<p class="text-sm text-secondary">{description}</p>`

### src/lib/components/effects/glass-panel/GlassPanel.svelte
- L34 `gap-sm` (gap, **no prop**): `class={['glass', 'box', 'curved', pad, 'gap-sm', tint && 'tinted', border && 'border', rim && 'rim', className]}`

### src/lib/components/effects/glow-card/GlowCard.svelte
- L43 `gap-sm` (gap, **no prop**): `'gap-sm',`

### src/lib/components/effects/spotlight-card/SpotlightCard.svelte
- L32 `gap-sm` (gap, **no prop**): `class={['light', 'card', 'box', 'bg-surface', 'border-subtle', 'curved', pad, 'gap-sm', colorClass[color], className]}`

### src/lib/components/feedback/alert/Alert.svelte
- L65 `gap-md` (gap, **no prop**): `class={['row gap-md modern', pad, fills[look], tone, textSize, textColor ?? (look === 'solid' ? 'text-inverse' : undefined), className]}`
- L65 `text-inverse` (textColor, prop exists but literal used): `class={['row gap-md modern', pad, fills[look], tone, textSize, textColor ?? (look === 'solid' ? 'text-inverse' : undefined), className]}`
- L71 `text-bs` (textSize, prop exists but literal used): `<span class={['shrink-0 text-bs lh14', look === 'solid' ? '' : tone === 'neutral' ? 'text-secondary' : 'text-${tone}']}>`
- L71 `text-secondary` (textColor, prop exists but literal used): `<span class={['shrink-0 text-bs lh14', look === 'solid' ? '' : tone === 'neutral' ? 'text-secondary' : 'text-${tone}']}>`
- L75 `gap-xs` (gap, **no prop**): `<div class="box grow wmin0 gap-xs">`
- L77 `text-md` (textSize, prop exists but literal used): `<p class="weight-600 text-md lh14">{title}</p>`
- L80 `text-sm` (textSize, prop exists but literal used): `<div class="text-sm lh15">{@render children()}</div>`
- L83 `gap-sm` (gap, **no prop**): `<div class="row ycenter wrap gap-sm mt-xs">{@render actions()}</div>`
- L87 `text-bs` (textSize, prop exists but literal used): `<button type="button" class="dismiss focus-ring text-bs" aria-label="Dismiss" onclick={dismiss}>`

### src/lib/components/feedback/banner/Banner.svelte
- L86 `h-bs` (size, **no prop**): `class={['banner h-bs row ycenter gap-md wfull', 'msg', tone, textSize, textColor, sticky && 'sticky-top', className]}`
- L86 `gap-md` (gap, **no prop**): `class={['banner h-bs row ycenter gap-md wfull', 'msg', tone, textSize, textColor, sticky && 'sticky-top', className]}`
- L93 `text-bs` (textSize, prop exists but literal used): `<span class={['shrink-0 text-bs lh14', tone === 'neutral' ? 'text-secondary' : 'text-${tone}']}>`
- L93 `text-secondary` (textColor, prop exists but literal used): `<span class={['shrink-0 text-bs lh14', tone === 'neutral' ? 'text-secondary' : 'text-${tone}']}>`
- L97 `gap-xs` (gap, **no prop**): `<div class="box grow wmin0 gap-xs">`
- L99 `text-md` (textSize, prop exists but literal used): `<p class="weight-600 text-md lh14">{title}</p>`
- L102 `text-sm` (textSize, prop exists but literal used): `<div class="text-sm lh15">{@render children()}</div>`
- L106 `text-sm` (textSize, prop exists but literal used): `<a class="link shrink-0 text-sm weight-500" {href}>{action}</a>`
- L109 `text-bs` (textSize, prop exists but literal used): `<button type="button" class="dismiss focus-ring text-bs" aria-label="Dismiss" onclick={dismiss}>`

### src/lib/components/feedback/empty-state/EmptyState.svelte
- L39 `h-xs` (size, prop exists but literal used): `'h-xs': 'text-bs',`
- L39 `text-bs` (textSize, prop exists but literal used): `'h-xs': 'text-bs',`
- L40 `h-sm` (size, prop exists but literal used): `'h-sm': 'text-lg',`
- L40 `text-lg` (textSize, prop exists but literal used): `'h-sm': 'text-lg',`
- L41 `h-md` (size, prop exists but literal used): `'h-md': 'text-xl',`
- L41 `text-xl` (textSize, prop exists but literal used): `'h-md': 'text-xl',`
- L42 `h-bs` (size, prop exists but literal used): `'h-bs': 'text-2xl',`
- L42 `text-2xl` (textSize, prop exists but literal used): `'h-bs': 'text-2xl',`
- L43 `h-lg` (size, prop exists but literal used): `'h-lg': 'text-3xl',`
- L43 `text-3xl` (textSize, prop exists but literal used): `'h-lg': 'text-3xl',`
- L44 `h-xl` (size, prop exists but literal used): `'h-xl': 'text-4xl',`
- L45 `h-2xl` (size, prop exists but literal used): `'h-2xl': 'text-4xl',`
- L46 `h-3xl` (size, prop exists but literal used): `'h-3xl': 'text-4xl'`
- L55 `xcenter` (align, **no prop**): `class={['box xcenter gap-md ta-c', pad, textSize, textColor, frameClass, className]}`
- L55 `gap-md` (gap, **no prop**): `class={['box xcenter gap-md ta-c', pad, textSize, textColor, frameClass, className]}`
- L55 `ta-c` (align, **no prop**): `class={['box xcenter gap-md ta-c', pad, textSize, textColor, frameClass, className]}`
- L59 `text-muted` (textColor, prop exists but literal used): `<span class={['text-muted lh14', iconScale[size]]}>`
- L63 `xcenter` (align, **no prop**): `<div class="box xcenter gap-xs measure-sm">`
- L63 `gap-xs` (gap, **no prop**): `<div class="box xcenter gap-xs measure-sm">`
- L68 `text-sm` (textSize, prop exists but literal used): `<p class="text-sm text-secondary lh15">{description}</p>`
- L68 `text-secondary` (textColor, prop exists but literal used): `<p class="text-sm text-secondary lh15">{description}</p>`
- L71 `text-sm` (textSize, prop exists but literal used): `<div class="text-sm text-secondary lh15">{@render children()}</div>`
- L71 `text-secondary` (textColor, prop exists but literal used): `<div class="text-sm text-secondary lh15">{@render children()}</div>`
- L75 `gap-sm` (gap, **no prop**): `<div class="row ycenter wrap gap-sm">{@render actions()}</div>`

### src/lib/components/feedback/meter/Meter.svelte
- L65 `text-xs` (textSize, **no prop**): `sm: 'text-xs',`
- L66 `text-md` (textSize, **no prop**): `md: 'text-md',`
- L67 `text-lg` (textSize, **no prop**): `lg: 'text-lg'`
- L93 `xcenter` (align, **no prop**): `<div class={['cover box xcenter ycenter tabular-nums text-secondary', size]}>`
- L93 `text-secondary` (textColor, **no prop**): `<div class={['cover box xcenter ycenter tabular-nums text-secondary', size]}>`
- L103 `gap-xs` (gap, **no prop**): `<div class={['box gap-xs wfull', size, className]} {...rest}>`
- L105 `xbetween` (align, **no prop**): `<div class="row xbetween ycenter gap-sm">`
- L105 `gap-sm` (gap, **no prop**): `<div class="row xbetween ycenter gap-sm">`
- L107 `text-sm` (textSize, **no prop**): `<span class="text-sm text-secondary">{label}</span>`
- L107 `text-secondary` (textColor, **no prop**): `<span class="text-sm text-secondary">{label}</span>`
- L110 `text-sm` (textSize, **no prop**): `<span class="text-sm text-muted tabular-nums">{text}</span>`
- L110 `text-muted` (textColor, **no prop**): `<span class="text-sm text-muted tabular-nums">{text}</span>`

### src/lib/components/feedback/progress-circular/ProgressCircular.svelte
- L58 `xcenter` (align, **no prop**): `<div class={['cover row xcenter ycenter tabular-nums text-secondary', size]}>`
- L58 `text-secondary` (textColor, **no prop**): `<div class={['cover row xcenter ycenter tabular-nums text-secondary', size]}>`
- L62 `text-xs` (textSize, **no prop**): `<span class="text-xs weight-500">{pct}%</span>`

### src/lib/components/feedback/progress-linear/ProgressLinear.svelte
- L51 `gap-xs` (gap, **no prop**): `<div class={['box gap-xs wfull', size, className]} {...rest}>`
- L53 `xbetween` (align, **no prop**): `<div class="row xbetween ycenter gap-sm">`
- L53 `gap-sm` (gap, **no prop**): `<div class="row xbetween ycenter gap-sm">`
- L55 `text-sm` (textSize, **no prop**): `<span class="text-sm text-secondary weight-500">{label}</span>`
- L55 `text-secondary` (textColor, **no prop**): `<span class="text-sm text-secondary weight-500">{label}</span>`
- L58 `text-sm` (textSize, **no prop**): `<span class="text-sm text-muted tabular-nums">{readout}</span>`
- L58 `text-muted` (textColor, **no prop**): `<span class="text-sm text-muted tabular-nums">{readout}</span>`

### src/lib/components/feedback/skeleton/Skeleton.svelte
- L37 `gap-sm` (gap, **no prop**): `<div class="motion box gap-sm" {@attach vars({ mo: 1 - fade.current })}>`

### src/lib/components/feedback/spinner/Spinner.svelte
- L34 `text-secondary` (textColor, **no prop**): `class={['row ycenter', size, tone === 'neutral' ? 'text-secondary' : 'text-${tone}', className]}`
- L46 `gap-xs` (gap, **no prop**): `<span class="row ycenter gap-xs" aria-hidden="true">`
- L52 `gap-xs` (gap, **no prop**): `<span class="row ycenter gap-xs" aria-hidden="true">`

### src/lib/components/feedback/status/Status.svelte
- L29 `gap-sm` (gap, **no prop**): `<span class={['row ycenter gap-sm', size, textSize, textColor, className]} {...rest}>`
- L30 `text-secondary` (textColor, prop exists but literal used): `<span class={['relative inline-flex shrink-0', tone === 'neutral' ? 'text-secondary' : 'text-${tone}']}>`

### src/lib/components/feedback/timer/Timer.svelte
- L99 `gap-md` (gap, **no prop**): `<div class={['inline-flex row ycenter gap-md', className]} {...rest}>`
- L108 `gap-xs` (gap, **no prop**): `<div class="row ycenter gap-xs">`
- L110 `h-sm` (size, prop exists but literal used): `<Button variant="outline" size="h-sm" icon={luPause} onclick={pause}>Pause</Button>`
- L112 `h-sm` (size, prop exists but literal used): `<Button variant="secondary" size="h-sm" icon={luPlay} onclick={start}>`
- L116 `h-sm` (size, prop exists but literal used): `<IconButton variant="ghost" size="h-sm" icon={luRotateCcw} label="Reset timer" onclick={reset} />`

### src/lib/components/feedback/toast/Toast.svelte
- L62 `text-secondary` (textColor, prop exists but literal used): `neutral: 'text-secondary',`
- L63 `text-info` (textColor, prop exists but literal used): `info: 'text-info',`
- L64 `text-success` (textColor, prop exists but literal used): `success: 'text-success',`
- L65 `text-warning` (textColor, prop exists but literal used): `warning: 'text-warning',`
- L66 `text-danger` (textColor, prop exists but literal used): `danger: 'text-danger',`
- L67 `text-secondary` (textColor, prop exists but literal used): `loading: 'text-secondary'`
- L79 `gap-md` (gap, **no prop**): `class={['row gap-md modern glass rim shad-md border bg-overlay measure-sm', pad, textSize, textColor, className]}`
- L85 `text-bs` (textSize, prop exists but literal used): `<span class={['shrink-0 text-bs lh14', toneClass[tone], tone === 'loading' && 'anim-spin']}>`
- L88 `gap-xs` (gap, **no prop**): `<div class="box grow wmin0 gap-xs">`
- L90 `text-sm` (textSize, prop exists but literal used): `<div class="weight-500 text-sm lh14">{@render children()}</div>`
- L92 `text-sm` (textSize, prop exists but literal used): `<p class="weight-500 text-sm lh14">{message}</p>`
- L95 `text-sm` (textSize, prop exists but literal used): `<p class="text-sm text-secondary lh15">{description}</p>`
- L95 `text-secondary` (textColor, prop exists but literal used): `<p class="text-sm text-secondary lh15">{description}</p>`
- L98 `gap-sm` (gap, **no prop**): `<div class="row ycenter wrap gap-sm mt-xs">`
- L101 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="primary" href={action.href} onclick={() => run(action)}>{action.label}</Button>`
- L103 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="primary" onclick={() => run(action)}>{action.label}</Button>`
- L107 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="ghost" onclick={() => run(cancel)}>{cancel.label}</Button>`
- L113 `text-bs` (textSize, prop exists but literal used): `<button type="button" class="dismiss focus-ring text-bs" aria-label="Dismiss" onclick={() => onDismiss?.()}>`

### src/lib/components/feedback/toast/Toaster.svelte
- L164 `gap-sm` (gap, **no prop**): `class={['pile measure-sm', fromTop && 'from-top', opened && 'open', 'gap-sm']}`

### src/lib/components/inputs/fieldset/Fieldset.svelte
- L52 `text-sm` (textSize, **no prop**): `<legend class="text-sm weight-600 px-xs">{legend}</legend>`
- L55 `text-sm` (textSize, **no prop**): `<p id={descId} class="text-sm text-secondary">{description}</p>`
- L55 `text-secondary` (textColor, **no prop**): `<p id={descId} class="text-sm text-secondary">{description}</p>`
- L61 `text-xs` (textSize, **no prop**): `<p id={errorId} role="alert" class="text-xs text-danger">{error}</p>`
- L61 `text-danger` (textColor, **no prop**): `<p id={errorId} role="alert" class="text-xs text-danger">{error}</p>`

### src/lib/components/inputs/file-drop/FileDrop.svelte
- L175 `gap-sm` (gap, **no prop**): `<div class={['box gap-sm wfull', className]} aria-invalid={control.invalid || undefined} {...rest}>`
- L180 `xcenter` (align, **no prop**): `'bg-none box xcenter gap-sm wfull pad-lg radius-lg border-dashed pointer',`
- L180 `gap-sm` (gap, **no prop**): `'bg-none box xcenter gap-sm wfull pad-lg radius-lg border-dashed pointer',`
- L180 `pad-lg` (pad, **no prop**): `'bg-none box xcenter gap-sm wfull pad-lg radius-lg border-dashed pointer',`
- L180 `radius-lg` (radius, **no prop**): `'bg-none box xcenter gap-sm wfull pad-lg radius-lg border-dashed pointer',`
- L197 `xcenter` (align, **no prop**): `<span class="row ycenter xcenter square h-xl radius-full state-selected text-theme">`
- L197 `h-xl` (size, **no prop**): `<span class="row ycenter xcenter square h-xl radius-full state-selected text-theme">`
- L197 `radius-full` (radius, **no prop**): `<span class="row ycenter xcenter square h-xl radius-full state-selected text-theme">`
- L200 `xcenter` (align, **no prop**): `<span class="box xcenter gap-xs">`
- L200 `gap-xs` (gap, **no prop**): `<span class="box xcenter gap-xs">`
- L202 `text-sm` (textSize, **no prop**): `<span class="text-sm text-muted">`
- L202 `text-muted` (textColor, **no prop**): `<span class="text-sm text-muted">`
- L229 `gap-xs` (gap, **no prop**): `<ul id={listId} class="box gap-xs">`
- L232 `gap-sm` (gap, **no prop**): `<li class="row ycenter gap-sm pad-sm radius-md border" transition:springScale={{ start: 0.96 }}>`
- L232 `pad-sm` (pad, **no prop**): `<li class="row ycenter gap-sm pad-sm radius-md border" transition:springScale={{ start: 0.96 }}>`
- L232 `radius-md` (radius, **no prop**): `<li class="row ycenter gap-sm pad-sm radius-md border" transition:springScale={{ start: 0.96 }}>`
- L234 `h-xl` (size, **no prop**): `<img src={preview} alt="" class="h-xl square modern fit-cover shrink-0 border-subtle" />`
- L236 `text-muted` (textColor, **no prop**): `<span class="text-muted shrink-0"><Icon icon={luFile} /></span>`
- L240 `text-xs` (textSize, **no prop**): `<span class="text-xs text-muted tabular-nums">{formatSize(file.size)}</span>`
- L240 `text-muted` (textColor, **no prop**): `<span class="text-xs text-muted tabular-nums">{formatSize(file.size)}</span>`
- L244 `xcenter` (align, **no prop**): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L244 `h-md` (size, **no prop**): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L244 `radius-full` (radius, **no prop**): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L244 `text-muted` (textColor, **no prop**): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L256 `gap-xs` (gap, **no prop**): `<ul id={rejectId} class="box gap-xs">`
- L258 `text-sm` (textSize, **no prop**): `<li class="text-sm text-danger">{item.reason}</li>`
- L258 `text-danger` (textColor, **no prop**): `<li class="text-sm text-danger">{item.reason}</li>`

### src/lib/components/inputs/input-group/InputGroup.svelte
- L80 `xleft` (align, **no prop**): `}).map((c) => (orientation === 'vertical' && c === 'row' ? 'box xleft' : c)),`

### src/lib/components/inputs/input-group/InputGroupAddon.svelte
- L15 `gap-xs` (gap, **no prop**): `<div class={['row ycenter shrink-0 gap-xs', className]} data-align={align} {...rest}>`

### src/lib/components/inputs/input-group/InputGroupText.svelte
- L14 `text-muted` (textColor, **no prop**): `<span class={['text-muted text-sm select-none shrink-0', className]} {...rest}>`
- L14 `text-sm` (textSize, **no prop**): `<span class={['text-muted text-sm select-none shrink-0', className]} {...rest}>`

### src/lib/components/inputs/input/Input.svelte
- L108 `text-muted` (textColor, prop exists but literal used): `<Icon {icon} class="text-muted shrink-0" />`
- L130 `xcenter` (align, **no prop**): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L130 `h-md` (size, prop exists but literal used): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L130 `radius-full` (radius, prop exists but literal used): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L130 `text-muted` (textColor, prop exists but literal used): `class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`

### src/lib/components/inputs/native-select/NativeSelect.svelte
- L106 `text-muted` (textColor, prop exists but literal used): `<Icon icon={luChevronDown} class="text-muted shrink-0" />`

### src/lib/components/inputs/number-input/NumberInput.svelte
- L242 `text-muted` (textColor, prop exists but literal used): `class="scrub-handle row ycenter px-xs text-muted shrink-0"`
- L279 `xcenter` (align, **no prop**): `class="bare row ycenter xcenter grow px-sm press"`
- L291 `xcenter` (align, **no prop**): `class="bare row ycenter xcenter grow px-sm press bt-sub"`

### src/lib/components/inputs/password-input/PasswordInput.svelte
- L90 `xcenter` (align, **no prop**): `class="bare btn-icon row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L90 `h-md` (size, prop exists but literal used): `class="bare btn-icon row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L90 `radius-full` (radius, prop exists but literal used): `class="bare btn-icon row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L90 `text-muted` (textColor, prop exists but literal used): `class="bare btn-icon row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"`
- L103 `gap-xs` (gap, **no prop**): `<div class={['box gap-xs wfull', className]}>`
- L134 `text-sm` (textSize, prop exists but literal used): `<p id={capsId} class="text-sm text-warning">Caps Lock is on.</p>`
- L134 `text-warning` (textColor, prop exists but literal used): `<p id={capsId} class="text-sm text-warning">Caps Lock is on.</p>`
- L137 `gap-xs` (gap, **no prop**): `<div id={meterId} class="box gap-xs">`
- L150 `text-xs` (textSize, prop exists but literal used): `<p class={['text-xs', score.tone === 'danger' ? 'text-danger' : score.tone === 'warning' ? 'text-warning' : 'text-success']}>`
- L150 `text-danger` (textColor, prop exists but literal used): `<p class={['text-xs', score.tone === 'danger' ? 'text-danger' : score.tone === 'warning' ? 'text-warning' : 'text-success']}>`
- L150 `text-warning` (textColor, prop exists but literal used): `<p class={['text-xs', score.tone === 'danger' ? 'text-danger' : score.tone === 'warning' ? 'text-warning' : 'text-success']}>`
- L150 `text-success` (textColor, prop exists but literal used): `<p class={['text-xs', score.tone === 'danger' ? 'text-danger' : score.tone === 'warning' ? 'text-warning' : 'text-success']}>`

### src/lib/components/inputs/pin-input/PinInput.svelte
- L164 `h-xs` (size, prop exists but literal used): `'h-xs': '2.25rem',`
- L165 `h-sm` (size, prop exists but literal used): `'h-sm': '2.5rem',`
- L166 `h-md` (size, prop exists but literal used): `'h-md': '3rem',`
- L167 `h-bs` (size, prop exists but literal used): `'h-bs': '3.25rem',`
- L168 `h-lg` (size, prop exists but literal used): `'h-lg': '3.5rem',`
- L169 `h-xl` (size, prop exists but literal used): `'h-xl': '4rem',`
- L170 `h-2xl` (size, prop exists but literal used): `'h-2xl': '4.5rem',`
- L171 `h-3xl` (size, prop exists but literal used): `'h-3xl': '5rem'`
- L191 `xcenter` (align, **no prop**): `<div class={['motion row ycenter xcenter', frame, resolvedSize]}>`
- L194 `ta-c` (align, **no prop**): `class="bare wfull hfull ta-c tabular-nums weight-600"`

### src/lib/components/inputs/search-input/SearchInput.svelte
- L85 `text-muted` (textColor, prop exists but literal used): `<Icon icon={luLoaderCircle} class="anim-spin text-muted shrink-0" />`
- L87 `h-md` (size, prop exists but literal used): `<kbd class="kbd h-md text-xs">{shortcut}</kbd>`
- L87 `text-xs` (textSize, prop exists but literal used): `<kbd class="kbd h-md text-xs">{shortcut}</kbd>`

### src/lib/components/inputs/signature-pad/SignaturePad.svelte
- L152 `h-sm` (size, **no prop**): `class="button btn-icon ghost h-sm modern corner-tr text-muted"`
- L152 `text-muted` (textColor, **no prop**): `class="button btn-icon ghost h-sm modern corner-tr text-muted"`

### src/lib/components/inputs/tags-input/TagsInput.svelte
- L215 `gap-xs` (gap, **no prop**): `<div class={['box gap-xs wfull', className]}>`
- L222 `gap-xs` (gap, **no prop**): `<div class="row wrap ycenter gap-xs grow wmin0">`
- L228 `text-sm` (textSize, prop exists but literal used): `class={['bare tag px-sm focus-ring', tagVariant, tagShape, tagTextSize ?? textSize ?? 'text-sm', defaultTextColor(tagVariant)]}`
- L246 `gap-xs` (gap, **no prop**): `class={['tag row ycenter gap-xs', tagVariant, tagShape, tagTextSize ?? textSize ?? 'text-sm', defaultTextColor(tagVariant)]}`
- L246 `text-sm` (textSize, prop exists but literal used): `class={['tag row ycenter gap-xs', tagVariant, tagShape, tagTextSize ?? textSize ?? 'text-sm', defaultTextColor(tagVariant)]}`
- L253 `xcenter` (align, **no prop**): `class="bare tag-remove row ycenter xcenter radius-full press"`
- L253 `radius-full` (radius, prop exists but literal used): `class="bare tag-remove row ycenter xcenter radius-full press"`
- L284 `text-sm` (textSize, prop exists but literal used): `<p id={messageId} class="text-sm text-danger">{message}</p>`
- L284 `text-danger` (textColor, prop exists but literal used): `<p id={messageId} class="text-sm text-danger">{message}</p>`

### src/lib/components/inputs/textarea/Textarea.svelte
- L92 `gap-xs` (gap, **no prop**): `<div class={['box gap-xs wfull', className]}>`
- L112 `text-xs` (textSize, prop exists but literal used): `<span id={counterId} class={['text-xs tabular-nums ta-r', atLimit ? 'text-danger' : 'text-muted']}>`
- L112 `ta-r` (align, **no prop**): `<span id={counterId} class={['text-xs tabular-nums ta-r', atLimit ? 'text-danger' : 'text-muted']}>`
- L112 `text-danger` (textColor, prop exists but literal used): `<span id={counterId} class={['text-xs tabular-nums ta-r', atLimit ? 'text-danger' : 'text-muted']}>`
- L112 `text-muted` (textColor, prop exists but literal used): `<span id={counterId} class={['text-xs tabular-nums ta-r', atLimit ? 'text-danger' : 'text-muted']}>`

### src/lib/components/layout/bleed/Bleed.svelte
- L11 `gap-xs` (gap, **no prop**): `'gap-xs': 'var(--space-xs)',`
- L12 `gap-sm` (gap, **no prop**): `'gap-sm': 'var(--space-sm)',`
- L13 `gap-md` (gap, **no prop**): `'gap-md': 'var(--space-md)',`
- L14 `gap-bs` (gap, **no prop**): `'gap-bs': 'var(--space-bs)',`
- L15 `gap-lg` (gap, **no prop**): `'gap-lg': 'var(--space-lg)',`
- L16 `gap-xl` (gap, **no prop**): `'gap-xl': 'var(--space-xl)',`
- L17 `gap-2xl` (gap, **no prop**): `'gap-2xl': 'var(--space-2xl)',`
- L18 `gap-3xl` (gap, **no prop**): `'gap-3xl': 'var(--space-3xl)'`

### src/lib/components/layout/resizable/ResizableHandle.svelte
- L94 `radius-sm` (radius, **no prop**): `<span class="grid center bg-surface border radius-sm shad-xs shrink-0 pointer-none z-raised h-sm square text-muted">`
- L94 `h-sm` (size, **no prop**): `<span class="grid center bg-surface border radius-sm shad-xs shrink-0 pointer-none z-raised h-sm square text-muted">`
- L94 `text-muted` (textColor, **no prop**): `<span class="grid center bg-surface border radius-sm shad-xs shrink-0 pointer-none z-raised h-sm square text-muted">`

### src/lib/components/layout/stack/Stack.svelte
- L38 `xleft` (align, prop exists but literal used): `start: 'xleft',`
- L39 `xcenter` (align, prop exists but literal used): `center: 'xcenter',`
- L40 `xright` (align, prop exists but literal used): `end: 'xright',`
- L56 `xleft` (align, prop exists but literal used): `xleft: 'xleft',`
- L57 `xcenter` (align, prop exists but literal used): `xcenter: 'xcenter',`
- L58 `xright` (align, prop exists but literal used): `xright: 'xright',`
- L59 `xbetween` (align, prop exists but literal used): `xbetween: 'xbetween',`
- L60 `xcenter` (align, prop exists but literal used): `'xcenter mleft': 'xcenter mleft',`
- L60 `xcenter` (align, prop exists but literal used): `'xcenter mleft': 'xcenter mleft',`
- L61 `xright` (align, prop exists but literal used): `'xright mleft': 'xright mleft'`
- L61 `xright` (align, prop exists but literal used): `'xright mleft': 'xright mleft'`
- L69 `xcenter` (align, prop exists but literal used): `'xcenter mleft': 'center',`
- L70 `xright` (align, prop exists but literal used): `'xright mleft': 'right'`

### src/lib/components/motion/animated-list/AnimatedList.svelte
- L50 `gap-sm` (gap, **no prop**): `<div class={['relative box gap-sm', className]} role="list" {@attach flip.attach} {...rest}>`

### src/lib/components/motion/reorder/Reorder.svelte
- L276 `gap-sm` (gap, **no prop**): `class={['gap-sm', axis === 'x' ? 'row' : 'box', className]}`

### src/lib/components/navigation/back-to-top/BackToTop.svelte
- L52 `h-3xl` (size, prop exists but literal used): `<div class="relative square h-3xl row xcenter ycenter">`
- L52 `xcenter` (align, **no prop**): `<div class="relative square h-3xl row xcenter ycenter">`

### src/lib/components/navigation/breadcrumbs/Breadcrumbs.svelte
- L65 `gap-xs` (gap, **no prop**): `<ol class="row ycenter wrap gap-xs">`
- L68 `text-muted` (textColor, prop exists but literal used): `<li class="row ycenter text-muted shrink-0" aria-hidden="true">`
- L76 `h-md` (size, **no prop**): `class="bare button btn-icon ghost modern h-md text-sm inline-flex"`
- L76 `text-sm` (textSize, prop exists but literal used): `class="bare button btn-icon ghost modern h-md text-sm inline-flex"`
- L85 `gap-xs` (gap, **no prop**): `<a href={slot.item.href} class={['link-subtle focus-ring row ycenter gap-xs', textSize]}>`
- L93 `gap-xs` (gap, **no prop**): `<li class={['row ycenter gap-xs weight-500', textSize, textColor]} aria-current="page">`

### src/lib/components/navigation/dock/Dock.svelte
- L81 `xcenter` (align, **no prop**): `'row ycenter xcenter gap-sm bg-surface glass border rim shad-lg modern', pad,`
- L81 `gap-sm` (gap, **no prop**): `'row ycenter xcenter gap-sm bg-surface glass border rim shad-lg modern', pad,`
- L104 `xcenter` (align, **no prop**): `'inline-flex xcenter ycenter square h-xl modern',`
- L104 `h-xl` (size, **no prop**): `'inline-flex xcenter ycenter square h-xl modern',`
- L105 `text-secondary` (textColor, **no prop**): `active ? '' : 'text-secondary',`

### src/lib/components/navigation/navbar/Navbar.svelte
- L58 `xbetween` (align, **no prop**): `<nav aria-label={label} class="row ycenter xbetween gap-bs wfull">`
- L58 `gap-bs` (gap, **no prop**): `<nav aria-label={label} class="row ycenter xbetween gap-bs wfull">`
- L59 `gap-lg` (gap, **no prop**): `<div class="row ycenter gap-lg min0">`
- L64 `gap-lg` (gap, **no prop**): `<div class="header-nav row ycenter gap-lg">`
- L69 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm shrink-0">`
- L72 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm">{@render actions()}</div>`
- L89 `pad-sm` (pad, **no prop**): `class="floating at-bottom-end pop enter-down spring-snappy glass border rim shad-lg modern pad-sm measure-xs"`
- L92 `gap-xs` (gap, **no prop**): `<nav class="column gap-xs pad-xs" aria-label={label}>`
- L92 `pad-xs` (pad, **no prop**): `<nav class="column gap-xs pad-xs" aria-label={label}>`
- L95 `gap-sm` (gap, **no prop**): `<div class="bt pt-sm mt-xs row ycenter gap-sm wrap">{@render actions()}</div>`

### src/lib/components/navigation/navbar/NavbarLink.svelte
- L22 `text-secondary` (textColor, prop exists but literal used): `class={['nav-link', textSize, current ? ['weight-500', textColor] : 'text-secondary', className]}`

### src/lib/components/navigation/navigation-menu/NavigationMenu.svelte
- L202 `gap-xs` (gap, **no prop**): `class={['relative', vertical ? 'row gap-xs' : 'box gap-xs', className]}`
- L202 `gap-xs` (gap, **no prop**): `class={['relative', vertical ? 'row gap-xs' : 'box gap-xs', className]}`
- L213 `radius-lg` (radius, **no prop**): `'floating viewport pop spring-snappy border rim shad-lg radius-lg',`
- L230 `gap-xs` (gap, **no prop**): `class={['relative', vertical ? 'column' : 'row', 'gap-xs']}`

### src/lib/components/navigation/navigation-menu/NavigationMenuItem.svelte
- L107 `gap-sm` (gap, **no prop**): `'bare relative z-raised row ycenter gap-sm px-md h-lg weight-500 focus-ring select-none',`
- L107 `h-lg` (size, **no prop**): `'bare relative z-raised row ycenter gap-sm px-md h-lg weight-500 focus-ring select-none',`
- L108 `text-secondary` (textColor, **no prop**): `open ? '' : 'text-secondary'`

### src/lib/components/navigation/navigation-menu/NavigationMenuLink.svelte
- L21 `h-lg` (size, **no prop**): `'bare relative z-raised row ycenter px-md h-lg weight-500 focus-ring',`
- L22 `text-secondary` (textColor, **no prop**): `current ? '' : 'text-secondary',`

### src/lib/components/navigation/pagination/Pagination.svelte
- L87 `gap-xs` (gap, **no prop**): `<nav aria-label={label} class={['row ycenter wrap gap-xs', className]} {...rest}>`
- L94 `xcenter` (align, **no prop**): `<span class={['inline-flex xcenter ycenter text-muted', size, textSize]} aria-hidden="true">`
- L94 `text-muted` (textColor, prop exists but literal used): `<span class={['inline-flex xcenter ycenter text-muted', size, textSize]} aria-hidden="true">`
- L120 `text-secondary` (textColor, prop exists but literal used): `<p class={['text-secondary tabular-nums px-sm', size, textSize, 'row ycenter']} aria-live="polite">`
- L124 `text-secondary` (textColor, prop exists but literal used): `<p class={['text-secondary tabular-nums px-sm', size, textSize, 'row ycenter']} aria-live="polite">`
- L126 `text-muted` (textColor, prop exists but literal used): `<span class="text-muted">/</span>`

### src/lib/components/navigation/sidebar-nav/SidebarNav.svelte
- L76 `xcenter` (align, **no prop**): `collapsed && 'xcenter',`
- L100 `text-xs` (textSize, **no prop**): `<span class="badge soft round text-xs h-md px-sm tabular-nums shrink-0">{item.badge}</span>`
- L100 `h-md` (size, **no prop**): `<span class="badge soft round text-xs h-md px-sm tabular-nums shrink-0">{item.badge}</span>`
- L114 `text-xs` (textSize, **no prop**): `<span class="badge soft round text-xs h-md px-sm tabular-nums shrink-0">{item.badge}</span>`
- L114 `h-md` (size, **no prop**): `<span class="badge soft round text-xs h-md px-sm tabular-nums shrink-0">{item.badge}</span>`
- L145 `ta-l` (align, **no prop**): `<span class="grow truncate ta-l">{item.label}</span>`
- L147 `text-xs` (textSize, **no prop**): `<span class="badge soft round text-xs h-md px-sm tabular-nums shrink-0">{item.badge}</span>`
- L147 `h-md` (size, **no prop**): `<span class="badge soft round text-xs h-md px-sm tabular-nums shrink-0">{item.badge}</span>`
- L182 `gap-xs` (gap, **no prop**): `'rail spring spring-snappy column gap-xs bg-surface br', pad,`

### src/lib/components/navigation/stepper/Stepper.svelte
- L105 `text-muted` (textColor, **no prop**): `upcoming: 'bg-surface text-muted border',`
- L111 `gap-xs` (gap, **no prop**): `<ol class={['ycenter', vertical ? 'column gap-xs' : 'row']}>`
- L116 `gap-sm` (gap, **no prop**): `<li class={['min0', vertical ? 'row gap-sm ytop wfull' : 'column gap-sm', !vertical && !last && 'grow']}>`
- L116 `gap-sm` (gap, **no prop**): `<li class={['min0', vertical ? 'row gap-sm ytop wfull' : 'column gap-sm', !vertical && !last && 'grow']}>`
- L122 `xcenter` (align, **no prop**): `'bare round inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500 focus-ring',`
- L122 `h-lg` (size, **no prop**): `'bare round inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500 focus-ring',`
- L122 `text-sm` (textSize, **no prop**): `'bare round inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500 focus-ring',`
- L142 `xcenter` (align, **no prop**): `'round inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500',`
- L142 `h-lg` (size, **no prop**): `'round inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500',`
- L142 `text-sm` (textSize, **no prop**): `'round inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500',`
- L167 `text-sm` (textSize, **no prop**): `<p class={['text-sm weight-500', status === 'upcoming' ? 'text-muted' : status === 'error' ? 'text-danger' : '']}>`
- L167 `text-muted` (textColor, **no prop**): `<p class={['text-sm weight-500', status === 'upcoming' ? 'text-muted' : status === 'error' ? 'text-danger' : '']}>`
- L167 `text-danger` (textColor, **no prop**): `<p class={['text-sm weight-500', status === 'upcoming' ? 'text-muted' : status === 'error' ? 'text-danger' : '']}>`
- L171 `text-xs` (textSize, **no prop**): `<p class="text-xs text-muted">{step.description}</p>`
- L171 `text-muted` (textColor, **no prop**): `<p class="text-xs text-muted">{step.description}</p>`
- L183 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween pt-md">`
- L184 `h-sm` (size, **no prop**): `<Button variant="outline" size="h-sm" disabled={currentIndex <= 0 && !finished} onclick={stepPrev}>`
- L187 `h-sm` (size, **no prop**): `<Button variant="themed" size="h-sm" disabled={finished} onclick={stepNext}>`

### src/lib/components/navigation/tabs/Tab.svelte
- L38 `xcenter` (align, **no prop**): `'bare relative z-raised row ycenter xcenter gap-sm px-md weight-500 focus-ring select-none',`
- L38 `gap-sm` (gap, **no prop**): `'bare relative z-raised row ycenter xcenter gap-sm px-md weight-500 focus-ring select-none',`
- L41 `text-secondary` (textColor, **no prop**): `selected ? tabs.textColor : 'text-secondary',`

### src/lib/components/navigation/tabs/TabList.svelte
- L79 `pad-xs` (pad, **no prop**): `variant === 'enclosed' && 'pad-xs bg-input border modern',`
- L80 `gap-xs` (gap, **no prop**): `variant === 'pill' && 'gap-xs',`

### src/lib/components/navigation/tabs/TabPanel.svelte
- L29 `pad-bs` (pad, **no prop**): `class={['pad-bs focus-ring', className]}`
- L42 `pad-bs` (pad, **no prop**): `class={['pad-bs focus-ring', className]}`

### src/lib/components/navigation/tabs/Tabs.svelte
- L73 `gap-bs` (gap, **no prop**): `<div class={['box gap-bs', className]} {...rest}>`

### src/lib/components/navigation/toc/Toc.svelte
- L159 `text-muted` (textColor, **no prop**): `<p class="nav-header text-muted">{label}</p>`

### src/lib/components/overlays/command-palette/CommandPalette.svelte
- L141 `radius-lg` (radius, **no prop**): `class={['dialog open-column sized pop enter-scale radius-lg shad-2xl', surfaceClass[surface], className]}`
- L147 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm px-lg py-bs bb-sub shrink-0">`
- L148 `text-muted` (textColor, **no prop**): `<Icon icon={luSearch} class="text-muted shrink-0" />`
- L151 `text-md` (textSize, **no prop**): `class="bare grow text-md"`
- L166 `gap-xs` (gap, **no prop**): `class="box gap-xs pad-xs grow min0 scroll-y scroll-thin"`
- L166 `pad-xs` (pad, **no prop**): `class="box gap-xs pad-xs grow min0 scroll-y scroll-thin"`
- L173 `text-xs` (textSize, **no prop**): `<div class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{group.group}</div>`
- L173 `text-muted` (textColor, **no prop**): `<div class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{group.group}</div>`
- L192 `text-secondary` (textColor, **no prop**): `<Icon icon={command.icon} class="text-secondary shrink-0" />`
- L200 `text-xs` (textSize, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{command.shortcut}</kbd>`
- L200 `text-muted` (textColor, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{command.shortcut}</kbd>`
- L206 `text-sm` (textSize, **no prop**): `<div class="px-sm py-lg text-sm text-muted ta-c">`
- L206 `text-muted` (textColor, **no prop**): `<div class="px-sm py-lg text-sm text-muted ta-c">`
- L206 `ta-c` (align, **no prop**): `<div class="px-sm py-lg text-sm text-muted ta-c">`
- L216 `gap-sm` (gap, **no prop**): `<footer class="row wrap ycenter gap-sm px-lg py-sm bt-sub text-xs text-muted shrink-0">`
- L216 `text-xs` (textSize, **no prop**): `<footer class="row wrap ycenter gap-sm px-lg py-sm bt-sub text-xs text-muted shrink-0">`
- L216 `text-muted` (textColor, **no prop**): `<footer class="row wrap ycenter gap-sm px-lg py-sm bt-sub text-xs text-muted shrink-0">`
- L220 `gap-xs` (gap, **no prop**): `<span class="row ycenter gap-xs"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> to navigate</span>`
- L221 `gap-xs` (gap, **no prop**): `<span class="row ycenter gap-xs"><kbd class="kbd">↵</kbd> to select</span>`
- L222 `gap-xs` (gap, **no prop**): `<span class="row ycenter gap-xs"><kbd class="kbd">esc</kbd> to close</span>`

### src/lib/components/overlays/context-menu/ContextMenu.svelte
- L140 `radius-lg` (radius, **no prop**): `'floating pop enter-scale spring-snappy border rim shad-lg radius-lg wmin-xs box gap-xs focus-none', pad,`
- L140 `gap-xs` (gap, **no prop**): `'floating pop enter-scale spring-snappy border rim shad-lg radius-lg wmin-xs box gap-xs focus-none', pad,`

### src/lib/components/overlays/dialog/Dialog.svelte
- L101 `gap-xs` (gap, **no prop**): `<header class={['box gap-xs px-lg pt-lg pb-md', closeButton && 'pr-2xl']}>`
- L103 `text-lg` (textSize, **no prop**): `<h2 id={titleId} class="text-lg weight-600 lh12 ls-tight-bs">{@render text(title)}</h2>`
- L106 `text-sm` (textSize, **no prop**): `<p id={descId} class="text-sm lh15 text-secondary">{@render text(description)}</p>`
- L106 `text-secondary` (textColor, **no prop**): `<p id={descId} class="text-sm lh15 text-secondary">{@render text(description)}</p>`
- L113 `text-md` (textSize, **no prop**): `'px-lg text-md lh15 text-secondary',`
- L113 `text-secondary` (textColor, **no prop**): `'px-lg text-md lh15 text-secondary',`
- L123 `xright` (align, **no prop**): `<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub">`
- L123 `gap-sm` (gap, **no prop**): `<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub">`
- L128 `h-sm` (size, **no prop**): `<Button variant="ghost" size="h-sm" icon={luX} class="btn-icon pin-tr text-muted" aria-label="Close" onclick={close} />`
- L128 `text-muted` (textColor, **no prop**): `<Button variant="ghost" size="h-sm" icon={luX} class="btn-icon pin-tr text-muted" aria-label="Close" onclick={close} />`
- L146 `xcenter` (align, **no prop**): `class="box xcenter py-2xl px-md"`
- L151 `ta-l` (align, **no prop**): `<div class={['relative box ta-l radius-lg shad-2xl', surfaceClass[surface], outsideWidth[width]]}>`
- L151 `radius-lg` (radius, **no prop**): `<div class={['relative box ta-l radius-lg shad-2xl', surfaceClass[surface], outsideWidth[width]]}>`
- L160 `radius-lg` (radius, **no prop**): `'dialog open-column sized pop enter-scale radius-lg shad-2xl',`

### src/lib/components/overlays/drawer/Drawer.svelte
- L117 `radius-lg` (radius, **no prop**): `'dialog sheet open-column sized pop radius-lg shad-2xl',`
- L132 `xcenter` (align, **no prop**): `<div class="row xcenter py-sm shrink-0">`
- L138 `gap-xs` (gap, **no prop**): `<header class={['box gap-xs px-lg pt-lg pb-md', closeButton && 'pr-2xl']}>`
- L140 `text-lg` (textSize, **no prop**): `<h2 id={titleId} class="text-lg weight-600 lh12 ls-tight-bs">{@render text(title)}</h2>`
- L143 `text-sm` (textSize, **no prop**): `<p id={descId} class="text-sm lh15 text-secondary">{@render text(description)}</p>`
- L143 `text-secondary` (textColor, **no prop**): `<p id={descId} class="text-sm lh15 text-secondary">{@render text(description)}</p>`
- L148 `text-md` (textSize, **no prop**): `<div class={['px-lg text-md lh15 text-secondary grow min0 scroll-y scroll-thin', !(title || description) && !bottom && 'pt-lg', !footer && '`
- L148 `text-secondary` (textColor, **no prop**): `<div class={['px-lg text-md lh15 text-secondary grow min0 scroll-y scroll-thin', !(title || description) && !bottom && 'pt-lg', !footer && '`
- L153 `xright` (align, **no prop**): `<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub shrink-0">`
- L153 `gap-sm` (gap, **no prop**): `<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub shrink-0">`
- L158 `h-sm` (size, **no prop**): `<Button variant="ghost" size="h-sm" icon={luX} class="btn-icon pin-tr text-muted" aria-label="Close" onclick={close} />`
- L158 `text-muted` (textColor, **no prop**): `<Button variant="ghost" size="h-sm" icon={luX} class="btn-icon pin-tr text-muted" aria-label="Close" onclick={close} />`

### src/lib/components/overlays/dropdown-menu/DropdownMenu.svelte
- L111 `radius-lg` (radius, **no prop**): `'floating pop spring-snappy border rim shad-lg radius-lg wmin-xs box gap-xs focus-none', pad,`
- L111 `gap-xs` (gap, **no prop**): `'floating pop spring-snappy border rim shad-lg radius-lg wmin-xs box gap-xs focus-none', pad,`

### src/lib/components/overlays/dropdown-menu/MenuCheckboxItem.svelte
- L52 `xcenter` (align, **no prop**): `<span class="box xcenter ycenter h-md square shrink-0">`
- L52 `h-md` (size, **no prop**): `<span class="box xcenter ycenter h-md square shrink-0">`
- L59 `text-xs` (textSize, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`
- L59 `text-muted` (textColor, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`

### src/lib/components/overlays/dropdown-menu/MenuItem.svelte
- L57 `text-secondary` (textColor, **no prop**): `<Icon {icon} class="text-secondary shrink-0" />`
- L59 `h-md` (size, **no prop**): `<span class="h-md square shrink-0"></span>`
- L63 `text-xs` (textSize, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`
- L63 `text-muted` (textColor, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`
- L78 `text-secondary` (textColor, **no prop**): `<Icon {icon} class="text-secondary shrink-0" />`
- L80 `h-md` (size, **no prop**): `<span class="h-md square shrink-0"></span>`
- L84 `text-xs` (textSize, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`
- L84 `text-muted` (textColor, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`

### src/lib/components/overlays/dropdown-menu/MenuLabel.svelte
- L14 `text-xs` (textSize, **no prop**): `<div class={['text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none', className]} {...rest}>`
- L14 `text-muted` (textColor, **no prop**): `<div class={['text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none', className]} {...rest}>`

### src/lib/components/overlays/dropdown-menu/MenuRadioItem.svelte
- L46 `xcenter` (align, **no prop**): `<span class="box xcenter ycenter h-md square shrink-0">`
- L46 `h-md` (size, **no prop**): `<span class="box xcenter ycenter h-md square shrink-0">`
- L53 `text-xs` (textSize, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`
- L53 `text-muted` (textColor, **no prop**): `<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>`

### src/lib/components/overlays/dropdown-menu/MenuSub.svelte
- L107 `text-secondary` (textColor, **no prop**): `<Icon {icon} class="text-secondary shrink-0" />`
- L110 `text-muted` (textColor, **no prop**): `<Icon icon={luChevronRight} class="text-muted shrink-0" />`
- L120 `radius-lg` (radius, **no prop**): `'floating at-right-start pop enter-right spring-snappy border rim shad-lg radius-lg pad-xs wmin-xs box gap-xs focus-none',`
- L120 `pad-xs` (pad, **no prop**): `'floating at-right-start pop enter-right spring-snappy border rim shad-lg radius-lg pad-xs wmin-xs box gap-xs focus-none',`
- L120 `gap-xs` (gap, **no prop**): `'floating at-right-start pop enter-right spring-snappy border rim shad-lg radius-lg pad-xs wmin-xs box gap-xs focus-none',`

### src/lib/components/overlays/floating-panel/FloatingPanel.svelte
- L99 `xbetween` (align, **no prop**): `class={['row ycenter xbetween gap-sm px-md py-sm bb bg-panel', !pinned && (dragging ? 'grabbing' : 'grab')]}`
- L99 `gap-sm` (gap, **no prop**): `class={['row ycenter xbetween gap-sm px-md py-sm bb bg-panel', !pinned && (dragging ? 'grabbing' : 'grab')]}`
- L105 `text-sm` (textSize, **no prop**): `<span class="text-sm weight-600 truncate">{title}</span>`
- L106 `gap-xs` (gap, **no prop**): `<div class="row ycenter gap-xs shrink-0">`
- L113 `h-sm` (size, **no prop**): `size="h-sm"`
- L122 `h-sm` (size, **no prop**): `size="h-sm"`
- L129 `h-sm` (size, **no prop**): `<IconButton variant="ghost" size="h-sm" icon={luX} label="Close panel" onclick={close} />`
- L135 `pad-md` (pad, **no prop**): `<div class="pad-md scroll-y">`
- L139 `xright` (align, **no prop**): `<footer class="px-md py-sm bt bg-panel row xright gap-sm">`
- L139 `gap-sm` (gap, **no prop**): `<footer class="px-md py-sm bt bg-panel row xright gap-sm">`

### src/lib/components/overlays/hover-card/HoverCard.svelte
- L119 `radius-lg` (radius, **no prop**): `'floating pop spring-snappy border rim shad-lg radius-lg max-w-sm wmin-xs', pad,`

### src/lib/components/overlays/lightbox/Lightbox.svelte
- L92 `xbetween` (align, **no prop**): `class={['dialog lightbox-stage column xbetween', pad, className]}`
- L97 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween wfull">`
- L98 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm">`
- L100 `text-sm` (textSize, **no prop**): `<span class="text-sm weight-500 tabular-nums bg-overlay border modern px-sm py-xs">`
- L105 `gap-xs` (gap, **no prop**): `<div class="row ycenter gap-xs">`
- L108 `h-md` (size, **no prop**): `size="h-md"`
- L115 `h-md` (size, **no prop**): `size="h-md"`
- L123 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween gap-md grow min0 wfull">`
- L123 `gap-md` (gap, **no prop**): `<div class="row ycenter xbetween gap-md grow min0 wfull">`
- L126 `h-lg` (size, **no prop**): `size="h-lg"`
- L133 `xcenter` (align, **no prop**): `<div class="column xcenter ycenter gap-sm grow min0 overflow-hidden">`
- L133 `gap-sm` (gap, **no prop**): `<div class="column xcenter ycenter gap-sm grow min0 overflow-hidden">`
- L143 `text-sm` (textSize, **no prop**): `<p class="text-sm bg-overlay border modern px-md py-xs">{currentItem.caption}</p>`
- L150 `h-lg` (size, **no prop**): `size="h-lg"`
- L159 `xcenter` (align, **no prop**): `<div class="row xcenter ycenter gap-xs wrap">`
- L159 `gap-xs` (gap, **no prop**): `<div class="row xcenter ycenter gap-xs wrap">`
- L164 `h-xl` (size, **no prop**): `'bare h-xl square modern overflow-hidden pointer focus-ring',`

### src/lib/components/overlays/menubar/Menubar.svelte
- L85 `gap-xs` (gap, **no prop**): `class={['row gap-xs', className]}`

### src/lib/components/overlays/menubar/MenubarMenu.svelte
- L159 `h-bs` (size, **no prop**): `class={['button ghost modern no-scaling inline-flex h-bs text-sm px-md weight-500', disabled && 'disabled']}`
- L159 `text-sm` (textSize, **no prop**): `class={['button ghost modern no-scaling inline-flex h-bs text-sm px-md weight-500', disabled && 'disabled']}`
- L176 `radius-lg` (radius, **no prop**): `'floating at-bottom-start pop enter-down spring-snappy border rim shad-lg radius-lg wmin-xs box gap-xs focus-none', pad,`
- L176 `gap-xs` (gap, **no prop**): `'floating at-bottom-start pop enter-down spring-snappy border rim shad-lg radius-lg wmin-xs box gap-xs focus-none', pad,`

### src/lib/components/overlays/popover/Popover.svelte
- L117 `radius-lg` (radius, **no prop**): `'floating pop spring-snappy border rim shad-lg radius-lg max-w-sm focus-none', pad,`

### src/lib/components/overlays/tooltip/Tooltip.svelte
- L108 `radius-md` (radius, **no prop**): `'floating pop spring-snappy glass border rim shad-md radius-md px-sm py-xs max-w-xs pointer-none lh15',`

### src/lib/components/overlays/tour/Tour.svelte
- L158 `gap-md` (gap, **no prop**): `'tour-card box gap-md elevated curved shad-lg pad-md',`
- L158 `pad-md` (pad, **no prop**): `'tour-card box gap-md elevated curved shad-lg pad-md',`
- L165 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween gap-sm">`
- L165 `gap-sm` (gap, **no prop**): `<div class="row ycenter xbetween gap-sm">`
- L166 `text-xs` (textSize, **no prop**): `<span class="text-xs weight-500 text-muted tabular-nums">`
- L166 `text-muted` (textColor, **no prop**): `<span class="text-xs weight-500 text-muted tabular-nums">`
- L169 `h-xs` (size, **no prop**): `<IconButton variant="ghost" size="h-xs" icon={luX} label="Close tour" onclick={skip} />`
- L172 `gap-xs` (gap, **no prop**): `<div class="box gap-xs">`
- L173 `text-bs` (textSize, **no prop**): `<h3 id="tour-step-title" class="text-bs weight-600">{step.title}</h3>`
- L174 `text-sm` (textSize, **no prop**): `<p class="text-sm text-secondary">{step.description}</p>`
- L174 `text-secondary` (textColor, **no prop**): `<p class="text-sm text-secondary">{step.description}</p>`
- L177 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween gap-sm">`
- L177 `gap-sm` (gap, **no prop**): `<div class="row ycenter xbetween gap-sm">`
- L178 `h-sm` (size, **no prop**): `<Button variant="ghost" size="h-sm" onclick={skip}>Skip</Button>`
- L179 `gap-xs` (gap, **no prop**): `<div class="row ycenter gap-xs">`
- L181 `h-sm` (size, **no prop**): `<Button variant="outline" size="h-sm" onclick={() => goTo(safeIndex - 1)}>Back</Button>`
- L183 `h-sm` (size, **no prop**): `<Button variant="themed" size="h-sm" onclick={next}>`

### src/lib/components/overlays/trigger-menu/TriggerMenu.svelte
- L156 `pad-sm` (pad, **no prop**): `class="wfull bare pad-sm bg-none font-sans focus-none resize-y"`
- L190 `pad-xs` (pad, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L190 `gap-xs` (gap, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L197 `text-xs` (textSize, **no prop**): `<div class="text-xs text-muted weight-500 px-sm pt-xs pb-xs select-none">{activeConfig.label}</div>`
- L197 `text-muted` (textColor, **no prop**): `<div class="text-xs text-muted weight-500 px-sm pt-xs pb-xs select-none">{activeConfig.label}</div>`
- L200 `text-sm` (textSize, **no prop**): `<div class="px-sm py-sm text-sm text-muted">No matching items</div>`
- L200 `text-muted` (textColor, **no prop**): `<div class="px-sm py-sm text-sm text-muted">No matching items</div>`
- L211 `gap-sm` (gap, **no prop**): `class={['item row ycenter gap-sm', i === activeIndex && 'highlighted', item.disabled && 'disabled']}`
- L218 `text-muted` (textColor, **no prop**): `<Icon icon={item.icon} class="text-muted shrink-0" />`
- L220 `xleft` (align, **no prop**): `<span class="column xleft min0">`
- L223 `text-xs` (textSize, **no prop**): `<span class="text-xs text-muted truncate">{item.description}</span>`
- L223 `text-muted` (textColor, **no prop**): `<span class="text-xs text-muted truncate">{item.description}</span>`

### src/lib/components/pickers/autocomplete/Autocomplete.svelte
- L162 `text-muted` (textColor, prop exists but literal used): `<span class="pl-sm text-muted row ycenter pointer-none shrink-0" aria-hidden="true">`
- L197 `h-md` (size, prop exists but literal used): `class="relative z-raised btn-icon h-md ghost round mr-xs text-muted"`
- L197 `text-muted` (textColor, prop exists but literal used): `class="relative z-raised btn-icon h-md ghost round mr-xs text-muted"`
- L213 `pad-xs` (pad, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L213 `gap-xs` (gap, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L220 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">`
- L220 `text-sm` (textSize, prop exists but literal used): `<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">`
- L220 `text-muted` (textColor, prop exists but literal used): `<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">`
- L225 `text-sm` (textSize, prop exists but literal used): `<div class="px-sm py-sm text-sm text-muted">{emptyText}</div>`
- L225 `text-muted` (textColor, prop exists but literal used): `<div class="px-sm py-sm text-sm text-muted">{emptyText}</div>`
- L236 `xbetween` (align, **no prop**): `class={['item row ycenter xbetween', i === activeIndex && 'highlighted', option.disabled && 'disabled']}`
- L242 `xleft` (align, **no prop**): `<span class="column xleft min0">`
- L245 `text-xs` (textSize, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`
- L245 `text-muted` (textColor, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`

### src/lib/components/pickers/calendar/Calendar.svelte
- L260 `gap-sm` (gap, **no prop**): `class={['box gap-sm select-none', disabled && 'disabled', className]}`
- L263 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween gap-sm">`
- L263 `gap-sm` (gap, **no prop**): `<div class="row ycenter xbetween gap-sm">`
- L266 `h-lg` (size, **no prop**): `class="button btn-icon ghost round h-lg"`
- L273 `text-md` (textSize, **no prop**): `<div class="text-md weight-500 grow ta-c">{title}</div>`
- L273 `ta-c` (align, **no prop**): `<div class="text-md weight-500 grow ta-c">{title}</div>`
- L276 `h-lg` (size, **no prop**): `class="button btn-icon ghost round h-lg"`
- L285 `gap-lg` (gap, **no prop**): `<div bind:this={grid} class={['row ytop gap-lg motion', numberOfMonths > 1 && 'wrap']}>`
- L292 `gap-xs` (gap, **no prop**): `class="box gap-xs grow"`
- L297 `ta-c` (align, **no prop**): `<div role="columnheader" class="ta-c text-xs text-muted weight-500 py-xs">{name}</div>`
- L297 `text-xs` (textSize, **no prop**): `<div role="columnheader" class="ta-c text-xs text-muted weight-500 py-xs">{name}</div>`
- L297 `text-muted` (textColor, **no prop**): `<div role="columnheader" class="ta-c text-xs text-muted weight-500 py-xs">{name}</div>`

### src/lib/components/pickers/color-picker/ColorPicker.svelte
- L271 `gap-sm` (gap, **no prop**): `class={['box gap-sm measure-xs text-md', disabled && 'disabled', className]}`
- L271 `text-md` (textSize, **no prop**): `class={['box gap-sm measure-xs text-md', disabled && 'disabled', className]}`
- L292 `h-md` (size, **no prop**): `<div class="thumb free h-md border" {@attach vars({ vx, vy })}></div>`
- L305 `h-sm` (size, **no prop**): `class={['track spectrum relative wfull h-sm', disabled ? 'disabled' : 'pointer touch-none']}`
- L312 `h-md` (size, **no prop**): `<div class="thumb h-md" {@attach vars({ value: hsv.h / 360 })}></div>`
- L326 `h-sm` (size, **no prop**): `class={['track alpha-fade relative wfull h-sm', disabled ? 'disabled' : 'pointer touch-none']}`
- L333 `h-md` (size, **no prop**): `<div class="thumb h-md" {@attach vars({ value: hsv.a })}></div>`
- L337 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm">`
- L338 `h-xl` (size, **no prop**): `<div class="swatch square h-xl modern shrink-0 border" {@attach vars({ color: css })} aria-hidden="true"></div>`
- L341 `h-lg` (size, **no prop**): `class="input grow bg-input border modern h-lg text-sm font-mono"`
- L341 `text-sm` (textSize, **no prop**): `class="input grow bg-input border modern h-lg text-sm font-mono"`
- L352 `h-lg` (size, **no prop**): `<button type="button" class="button btn-icon ghost modern h-lg" aria-label="Pick a colour from the screen" {disabled} onclick={eyeDrop}>`
- L359 `gap-xs` (gap, **no prop**): `<div class="row wrap gap-xs" role="group" aria-label="Swatches">`
- L363 `h-lg` (size, **no prop**): `class={['cell swatch focus-ring h-lg', swatchOn(colour) && 'selected']}`

### src/lib/components/pickers/combobox/Combobox.svelte
- L246 `xright` (align, **no prop**): `'field anchor relative row ycenter xright bg-input border',`
- L278 `gap-xs` (gap, **no prop**): `<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">`
- L282 `h-md` (size, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L282 `text-muted` (textColor, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L291 `h-md` (size, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L291 `text-muted` (textColor, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L300 `text-muted` (textColor, prop exists but literal used): `<Icon icon={luChevronDown} class={['caret text-muted', open && 'open']} />`
- L313 `pad-xs` (pad, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L313 `gap-xs` (gap, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L320 `gap-sm` (gap, **no prop**): `<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">`
- L320 `text-sm` (textSize, prop exists but literal used): `<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">`
- L320 `text-muted` (textColor, prop exists but literal used): `<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">`
- L328 `text-xs` (textSize, prop exists but literal used): `<div id={'${uid}-g${gi}'} class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{g.group}</div>`
- L328 `text-muted` (textColor, prop exists but literal used): `<div id={'${uid}-g${gi}'} class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{g.group}</div>`
- L350 `text-secondary` (textColor, prop exists but literal used): `<Icon icon={option.icon} class="text-secondary shrink-0" />`
- L359 `text-xs` (textSize, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`
- L359 `text-muted` (textColor, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`
- L370 `text-sm` (textSize, prop exists but literal used): `<div class="px-sm py-sm text-sm text-muted">`
- L370 `text-muted` (textColor, prop exists but literal used): `<div class="px-sm py-sm text-sm text-muted">`

### src/lib/components/pickers/date-field/internal/Segments.svelte
- L302 `text-muted` (textColor, **no prop**): `<span class="text-muted" aria-hidden="true">{part.text}</span>`

### src/lib/components/pickers/date-picker/DatePicker.svelte
- L171 `xright` (align, **no prop**): `'field anchor relative row ycenter xright bg-input border',`
- L203 `gap-xs` (gap, **no prop**): `<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">`
- L205 `h-md` (size, prop exists but literal used): `<button type="button" class="pointer-auto btn-icon h-md ghost round text-muted" aria-label="Clear date" onclick={clear}>`
- L205 `text-muted` (textColor, prop exists but literal used): `<button type="button" class="pointer-auto btn-icon h-md ghost round text-muted" aria-label="Clear date" onclick={clear}>`
- L211 `h-md` (size, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L211 `text-muted` (textColor, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L232 `pad-bs` (pad, **no prop**): `class="floating at-bottom-start pop enter-down spring-snappy glass border rim shad-lg modern pad-bs box gap-sm focus-none"`
- L232 `gap-sm` (gap, **no prop**): `class="floating at-bottom-start pop enter-down spring-snappy glass border rim shad-lg modern pad-bs box gap-sm focus-none"`
- L238 `gap-xs` (gap, **no prop**): `<div class="row wrap gap-xs">`
- L240 `h-bs` (size, prop exists but literal used): `<button type="button" class="button ghost h-bs text-sm modern" onclick={() => choose(preset.value)}>`
- L240 `text-sm` (textSize, prop exists but literal used): `<button type="button" class="button ghost h-bs text-sm modern" onclick={() => choose(preset.value)}>`

### src/lib/components/pickers/date-range-field/DateRangeField.svelte
- L98 `text-muted` (textColor, prop exists but literal used): `<span class="text-muted px-xs" aria-hidden="true">–</span>`

### src/lib/components/pickers/date-range-picker/DateRangePicker.svelte
- L142 `xright` (align, **no prop**): `'field anchor relative row ycenter xright bg-input border',`
- L156 `xleft` (align, **no prop**): `class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans', textSize, textColor, resolvedShape, clearable && ha`
- L156 `gap-sm` (gap, **no prop**): `class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans', textSize, textColor, resolvedShape, clearable && ha`
- L165 `ta-l` (align, **no prop**): `<span class={['truncate grow ta-l', !hasValue && 'text-muted']}>{hasValue ? display : placeholder}</span>`
- L165 `text-muted` (textColor, prop exists but literal used): `<span class={['truncate grow ta-l', !hasValue && 'text-muted']}>{hasValue ? display : placeholder}</span>`
- L167 `gap-xs` (gap, **no prop**): `<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">`
- L169 `h-md` (size, prop exists but literal used): `<button type="button" class="pointer-auto btn-icon h-md ghost round text-muted" aria-label="Clear dates" onclick={clear}>`
- L169 `text-muted` (textColor, prop exists but literal used): `<button type="button" class="pointer-auto btn-icon h-md ghost round text-muted" aria-label="Clear dates" onclick={clear}>`
- L173 `text-muted` (textColor, prop exists but literal used): `<Icon icon={luCalendar} class="text-muted" />`
- L183 `pad-bs` (pad, **no prop**): `class="floating at-bottom-start pop enter-down spring-snappy glass border rim shad-lg modern pad-bs box gap-sm focus-none"`
- L183 `gap-sm` (gap, **no prop**): `class="floating at-bottom-start pop enter-down spring-snappy glass border rim shad-lg modern pad-bs box gap-sm focus-none"`
- L188 `gap-xs` (gap, **no prop**): `<div class="row wrap gap-xs">`
- L190 `h-bs` (size, prop exists but literal used): `<button type="button" class="button ghost h-bs text-sm modern" onclick={() => applyPreset(preset)}>`
- L190 `text-sm` (textSize, prop exists but literal used): `<button type="button" class="button ghost h-bs text-sm modern" onclick={() => applyPreset(preset)}>`

### src/lib/components/pickers/select/Select.svelte
- L147 `xright` (align, **no prop**): `'field anchor relative row ycenter xright bg-input border',`
- L161 `xleft` (align, **no prop**): `class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans', textSize, textColor, resolvedShape, clearable && ha`
- L161 `gap-sm` (gap, **no prop**): `class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans', textSize, textColor, resolvedShape, clearable && ha`
- L171 `text-secondary` (textColor, prop exists but literal used): `<Icon icon={chosen[0].icon} class="text-secondary shrink-0" />`
- L173 `text-muted` (textColor, prop exists but literal used): `<span class={['truncate grow', !hasValue && 'text-muted']}>`
- L177 `text-xs` (textSize, prop exists but literal used): `<span class="text-xs text-muted tabular-nums shrink-0">{chosen.length}</span>`
- L177 `text-muted` (textColor, prop exists but literal used): `<span class="text-xs text-muted tabular-nums shrink-0">{chosen.length}</span>`
- L180 `gap-xs` (gap, **no prop**): `<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">`
- L184 `h-md` (size, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L184 `text-muted` (textColor, prop exists but literal used): `class="pointer-auto btn-icon h-md ghost round text-muted"`
- L191 `text-muted` (textColor, prop exists but literal used): `<Icon icon={luChevronDown} class={['caret text-muted', open && 'open']} />`
- L204 `pad-xs` (pad, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L204 `gap-xs` (gap, **no prop**): `'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs f`
- L215 `text-xs` (textSize, prop exists but literal used): `<div id={'${uid}-g${gi}'} class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{g.group}</div>`
- L215 `text-muted` (textColor, prop exists but literal used): `<div id={'${uid}-g${gi}'} class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{g.group}</div>`
- L229 `text-secondary` (textColor, prop exists but literal used): `<Icon icon={option.icon} class="text-secondary shrink-0" />`
- L234 `text-xs` (textSize, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`
- L234 `text-muted` (textColor, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`
- L244 `text-sm` (textSize, prop exists but literal used): `<div class="px-sm py-sm text-sm text-muted">No options</div>`
- L244 `text-muted` (textColor, prop exists but literal used): `<div class="px-sm py-sm text-sm text-muted">No options</div>`

### src/lib/components/pickers/time-range-field/TimeRangeField.svelte
- L101 `text-muted` (textColor, prop exists but literal used): `<span class="text-muted px-xs" aria-hidden="true">–</span>`

### src/lib/components/primitives/badge/Badge.svelte
- L38 `xcenter` (align, **no prop**): `'badge inline-flex xcenter ycenter gap-xs tabular-nums',`
- L38 `gap-xs` (gap, **no prop**): `'badge inline-flex xcenter ycenter gap-xs tabular-nums',`

### src/lib/components/primitives/divider/Divider.svelte
- L27 `h-xs` (size, **no prop**): `'h-xs': 'my-xs',`
- L28 `h-sm` (size, **no prop**): `'h-sm': 'my-sm',`
- L29 `h-md` (size, **no prop**): `'h-md': 'my-md',`
- L30 `h-bs` (size, **no prop**): `'h-bs': 'my-bs',`
- L31 `h-lg` (size, **no prop**): `'h-lg': 'my-lg',`
- L32 `h-xl` (size, **no prop**): `'h-xl': 'my-xl',`
- L33 `h-2xl` (size, **no prop**): `'h-2xl': 'my-2xl',`
- L34 `h-3xl` (size, **no prop**): `'h-3xl': 'my-3xl'`
- L37 `h-xs` (size, **no prop**): `'h-xs': 'mx-xs',`
- L38 `h-sm` (size, **no prop**): `'h-sm': 'mx-sm',`
- L39 `h-md` (size, **no prop**): `'h-md': 'mx-md',`
- L40 `h-bs` (size, **no prop**): `'h-bs': 'mx-bs',`
- L41 `h-lg` (size, **no prop**): `'h-lg': 'mx-lg',`
- L42 `h-xl` (size, **no prop**): `'h-xl': 'mx-xl',`
- L43 `h-2xl` (size, **no prop**): `'h-2xl': 'mx-2xl',`
- L44 `h-3xl` (size, **no prop**): `'h-3xl': 'mx-3xl'`
- L54 `xcenter` (align, **no prop**): `<div class={['row xcenter gap-sm wfull', space, className]} {...rest}>`
- L54 `gap-sm` (gap, **no prop**): `<div class={['row xcenter gap-sm wfull', space, className]} {...rest}>`
- L56 `text-xs` (textSize, **no prop**): `<span class="shrink-0 text-xs text-muted tt-u ls-wide-bs">{@render children?.()}</span>`
- L56 `text-muted` (textColor, **no prop**): `<span class="shrink-0 text-xs text-muted tt-u ls-wide-bs">{@render children?.()}</span>`

### src/lib/components/primitives/kbd/Kbd.svelte
- L31 `xcenter` (align, **no prop**): `const classes = $derived(['inline-flex xcenter gap-xs', className]);`
- L31 `gap-xs` (gap, **no prop**): `const classes = $derived(['inline-flex xcenter gap-xs', className]);`
- L39 `text-muted` (textColor, prop exists but literal used): `<span class="text-muted" aria-hidden="true">{separator}</span>`

### src/lib/components/primitives/label/Label.svelte
- L34 `xcenter` (align, **no prop**): `'inline-flex xcenter gap-xs weight-500',`
- L34 `gap-xs` (gap, **no prop**): `'inline-flex xcenter gap-xs weight-500',`
- L46 `text-danger` (textColor, prop exists but literal used): `<span class="text-danger" aria-hidden="true">*</span>`
- L49 `text-muted` (textColor, prop exists but literal used): `<span class="weight-400 text-muted">Optional</span>`

### src/lib/components/primitives/tag/Tag.svelte
- L45 `xcenter` (align, **no prop**): `'tag inline-flex xcenter gap-xs',`
- L45 `gap-xs` (gap, **no prop**): `'tag inline-flex xcenter gap-xs',`
- L62 `xcenter` (align, **no prop**): `class="bare tag-remove inline-flex xcenter ycenter radius-full focus-ring"`
- L62 `radius-full` (radius, prop exists but literal used): `class="bare tag-remove inline-flex xcenter ycenter radius-full focus-ring"`

### src/lib/components/primitives/typography/Heading.svelte
- L20 `text-2xl` (textSize, prop exists but literal used): `2: 'text-2xl lh11 weight-600 ls-tight-lg',`

### src/lib/components/primitives/typography/List.svelte
- L18 `gap-xs` (gap, **no prop**): `<svelte:element this={as} class={[as === 'ol' ? 'numbers' : 'bullets', 'box gap-xs', textSize, textColor, className]} {...rest}>`

### src/lib/components/primitives/typography/Text.svelte
- L21 `text-sm` (textSize, prop exists but literal used): `muted: 'text-sm',`
- L22 `text-lg` (textSize, prop exists but literal used): `large: 'text-lg weight-600',`
- L23 `text-sm` (textSize, prop exists but literal used): `small: 'text-sm weight-500'`
- L26 `text-secondary` (textColor, prop exists but literal used): `textColor ?? (look === 'lead' ? 'text-secondary' : look === 'muted' ? 'text-muted' : 'text-primary')`
- L26 `text-muted` (textColor, prop exists but literal used): `textColor ?? (look === 'lead' ? 'text-secondary' : look === 'muted' ? 'text-muted' : 'text-primary')`
- L26 `text-primary` (textColor, prop exists but literal used): `textColor ?? (look === 'lead' ? 'text-secondary' : look === 'muted' ? 'text-muted' : 'text-primary')`

### src/lib/components/selection/angle-slider/AngleSlider.svelte
- L116 `gap-xs` (gap, **no prop**): `<div class="box gap-xs">`

### src/lib/components/selection/checkbox/Checkbox.svelte
- L57 `gap-sm` (gap, **no prop**): `class={['inline-flex gap-sm', description ? 'ytop' : 'ycenter', 'row', textSize, textColor, disabled ? 'disabled' : 'pointer', className]}`
- L80 `xleft` (align, **no prop**): `<span class="column xleft gap-xs">`
- L80 `gap-xs` (gap, **no prop**): `<span class="column xleft gap-xs">`

### src/lib/components/selection/chip-group/ChipGroup.svelte
- L73 `gap-sm` (gap, **no prop**): `class={['row wrap ycenter gap-sm', disabled && 'disabled', className]}`
- L92 `gap-xs` (gap, **no prop**): `'inline-flex gap-xs',`

### src/lib/components/selection/listbox/Listbox.svelte
- L78 `gap-xs` (gap, **no prop**): `'box gap-xs outlined bg-surface pad-xs overflow-auto',`
- L78 `pad-xs` (pad, **no prop**): `'box gap-xs outlined bg-surface pad-xs overflow-auto',`
- L92 `pad-md` (pad, **no prop**): `<div class="pad-md ta-c text-sm text-muted">{emptyText}</div>`
- L92 `ta-c` (align, **no prop**): `<div class="pad-md ta-c text-sm text-muted">{emptyText}</div>`
- L92 `text-sm` (textSize, prop exists but literal used): `<div class="pad-md ta-c text-sm text-muted">{emptyText}</div>`
- L92 `text-muted` (textColor, prop exists but literal used): `<div class="pad-md ta-c text-sm text-muted">{emptyText}</div>`
- L96 `text-xs` (textSize, prop exists but literal used): `<div class="px-sm pt-xs text-xs weight-600 text-muted">{section.group}</div>`
- L96 `text-muted` (textColor, prop exists but literal used): `<div class="px-sm pt-xs text-xs weight-600 text-muted">{section.group}</div>`
- L108 `xbetween` (align, **no prop**): `'item row ycenter xbetween focus-ring',`
- L115 `gap-sm` (gap, **no prop**): `<span class="row ycenter gap-sm min0">`
- L117 `text-muted` (textColor, prop exists but literal used): `<Icon icon={option.icon} class="text-muted shrink-0" />`
- L119 `xleft` (align, **no prop**): `<span class="column xleft min0">`
- L122 `text-xs` (textSize, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`
- L122 `text-muted` (textColor, prop exists but literal used): `<span class="text-xs text-muted truncate">{option.description}</span>`

### src/lib/components/selection/radio-group/Radio.svelte
- L40 `gap-sm` (gap, **no prop**): `'row gap-sm relative',`
- L41 `pad-md` (pad, **no prop**): `card ? 'ytop pad-md modern spring bg-surface' : description ? 'ytop' : 'ycenter',`
- L64 `xleft` (align, **no prop**): `<span class="column xleft gap-xs">`
- L64 `gap-xs` (gap, **no prop**): `<span class="column xleft gap-xs">`
- L67 `text-secondary` (textColor, **no prop**): `<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>`
- L67 `text-sm` (textSize, **no prop**): `<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>`

### src/lib/components/selection/radio-group/RadioGroup.svelte
- L76 `gap-sm` (gap, **no prop**): `class={[orientation === 'horizontal' ? 'row wrap' : 'column', form === 'card' ? 'gap-sm' : 'gap-md', className]}`
- L76 `gap-md` (gap, **no prop**): `class={[orientation === 'horizontal' ? 'row wrap' : 'column', form === 'card' ? 'gap-sm' : 'gap-md', className]}`

### src/lib/components/selection/rating/Rating.svelte
- L121 `text-muted` (textColor, prop exists but literal used): `<Icon {icon} class="text-muted" />`
- L122 `text-warning` (textColor, prop exists but literal used): `<span class="clip text-warning" {@attach vars({ value: fillOf(unit) })}>`

### src/lib/components/selection/segmented-control/SegmentedControl.svelte
- L130 `xcenter` (align, **no prop**): `'bare relative z-raised row ycenter xcenter gap-sm px-md weight-500 focus-ring select-none',`
- L130 `gap-sm` (gap, **no prop**): `'bare relative z-raised row ycenter xcenter gap-sm px-md weight-500 focus-ring select-none',`
- L133 `text-secondary` (textColor, prop exists but literal used): `on ? textColor : 'text-secondary'`

### src/lib/components/selection/slider/Slider.svelte
- L184 `text-xs` (textSize, prop exists but literal used): `{#if tick.label}<span class="tick-label text-xs text-muted tabular-nums">{tick.label}</span>{/if}`
- L184 `text-muted` (textColor, prop exists but literal used): `{#if tick.label}<span class="tick-label text-xs text-muted tabular-nums">{tick.label}</span>{/if}`
- L205 `text-xs` (textSize, prop exists but literal used): `<span class="bubble bg-overlay border rim modern text-xs tabular-nums" aria-hidden="true">{show(v)}</span>`

### src/lib/components/selection/switch/Switch.svelte
- L48 `xleft` (align, prop exists but literal used): `<span class="column xleft gap-xs">`
- L48 `gap-xs` (gap, **no prop**): `<span class="column xleft gap-xs">`
- L51 `text-secondary` (textColor, prop exists but literal used): `<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>`
- L51 `text-sm` (textSize, prop exists but literal used): `<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>`
- L57 `gap-md` (gap, **no prop**): `<label class={['inline-flex row gap-md', description ? 'ytop' : 'ycenter', textSize, textColor, disabled ? 'disabled' : 'pointer', className`

### src/lib/components/theme/theme-customizer/ThemeCustomizer.svelte
- L134 `gap-xs` (gap, **no prop**): `<div class="box gap-xs">`
- L135 `xbetween` (align, **no prop**): `<div class="row ycenter xbetween">`
- L136 `text-sm` (textSize, **no prop**): `<span class="text-sm text-secondary">{name}</span>`
- L136 `text-secondary` (textColor, **no prop**): `<span class="text-sm text-secondary">{name}</span>`
- L137 `text-sm` (textSize, **no prop**): `<span class="text-sm tabular-nums text-muted">{display}</span>`
- L137 `text-muted` (textColor, **no prop**): `<span class="text-sm tabular-nums text-muted">{display}</span>`
- L155 `gap-lg` (gap, **no prop**): `<div class={['box gap-lg pad-lg radius-lg border bg-panel', className]} {...rest}>`
- L155 `pad-lg` (pad, **no prop**): `<div class={['box gap-lg pad-lg radius-lg border bg-panel', className]} {...rest}>`
- L155 `radius-lg` (radius, **no prop**): `<div class={['box gap-lg pad-lg radius-lg border bg-panel', className]} {...rest}>`
- L157 `gap-sm` (gap, **no prop**): `<div class="box gap-sm">`
- L158 `text-sm` (textSize, **no prop**): `<p class="text-sm weight-500">Mode</p>`
- L164 `gap-sm` (gap, **no prop**): `<div class="box gap-sm">`
- L165 `text-sm` (textSize, **no prop**): `<p class="text-sm weight-500">Theme</p>`
- L171 `gap-md` (gap, **no prop**): `<div class="box gap-md">`
- L172 `text-sm` (textSize, **no prop**): `<p class="text-sm weight-500">Colour</p>`
- L180 `gap-sm` (gap, **no prop**): `<div class="box gap-sm">`
- L181 `text-sm` (textSize, **no prop**): `<p class="text-sm weight-500">Shape</p>`
- L182 `text-sm` (textSize, **no prop**): `<div role="radiogroup" aria-label="Shape" class="choice-group text-sm" {@attach roving({ orientation: 'horizontal', onNavigate: (item) => it`
- L193 `gap-sm` (gap, **no prop**): `<div class="box gap-sm">`
- L194 `text-sm` (textSize, **no prop**): `<p class="text-sm weight-500">Density</p>`
- L195 `text-sm` (textSize, **no prop**): `<div role="radiogroup" aria-label="Density" class="choice-group text-sm" {@attach roving({ orientation: 'horizontal', onNavigate: (item) => `
- L206 `gap-sm` (gap, **no prop**): `<div class="box gap-sm">`
- L207 `text-sm` (textSize, **no prop**): `<p class="text-sm weight-500">Motion</p>`
- L208 `text-sm` (textSize, **no prop**): `<div role="radiogroup" aria-label="Motion" class="choice-group text-sm" {@attach roving({ orientation: 'horizontal', onNavigate: (item) => i`
- L228 `gap-sm` (gap, **no prop**): `class="box gap-sm pad-bs radius-md border"`
- L228 `pad-bs` (pad, **no prop**): `class="box gap-sm pad-bs radius-md border"`
- L228 `radius-md` (radius, **no prop**): `class="box gap-sm pad-bs radius-md border"`
- L230 `text-xs` (textSize, **no prop**): `<p class="text-xs text-muted">Preview</p>`
- L230 `text-muted` (textColor, **no prop**): `<p class="text-xs text-muted">Preview</p>`
- L232 `text-sm` (textSize, **no prop**): `<p class="text-sm text-secondary tabular-nums">$1,284.00 due 18 Nov</p>`
- L232 `text-secondary` (textColor, **no prop**): `<p class="text-sm text-secondary tabular-nums">$1,284.00 due 18 Nov</p>`
- L233 `gap-sm` (gap, **no prop**): `<div class="row wrap gap-sm">`
- L234 `h-sm` (size, **no prop**): `<Button size="h-sm">Pay now</Button>`
- L235 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="secondary">Download PDF</Button>`
- L236 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="themed">Accent</Button>`
- L242 `gap-sm` (gap, **no prop**): `<div class="row wrap gap-sm">`
- L243 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="secondary" onclick={reset}>`
- L247 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="outline" onclick={() => copy('css')}>`
- L251 `h-sm` (size, **no prop**): `<Button size="h-sm" variant="outline" onclick={() => copy('config')}>`

### src/lib/components/theme/theme-picker/ThemePicker.svelte
- L41 `gap-sm` (gap, **no prop**): `class={['row wrap gap-sm', size, className]}`
- L53 `xcenter` (align, **no prop**): `class="bare pick focus-ring box xcenter gap-xs"`
- L53 `gap-xs` (gap, **no prop**): `class="bare pick focus-ring box xcenter gap-xs"`
- L59 `text-sm` (textSize, **no prop**): `<span class="text-sm text-secondary">{preset.label}</span>`
- L59 `text-secondary` (textColor, **no prop**): `<span class="text-sm text-secondary">{preset.label}</span>`
