<script lang="ts">
	import { Icon } from '@fractaldesign/fractalsvelte-ui';
	import { klChevronDown, klSearch, klSun } from '@fractaldesign/fractalsvelte-ui/icons/keylinestroke';
	import { klfClock9, klfSearch } from '@fractaldesign/fractalsvelte-ui/icons/keylinefill';
</script>

<div class="row gap-lg ycenter">
	<Icon icon={klSearch} size={14} />
	<Icon icon={klSearch} size={18} />
	<Icon icon={klSearch} size={24} />
	<Icon icon={klSearch} size={32} />
	<Icon icon={klSun} size="1.5rem" label="Daylight" />
	<Icon icon={klChevronDown} size={24} strokeWidth={1} />
</div>

<div class="row gap-lg ycenter">
	<Icon icon={klfSearch} size={24} />
	<Icon icon={klfClock9} size={24} />
	<Icon icon={klfClock9} size="2rem" label="Closing time" />
</div>
