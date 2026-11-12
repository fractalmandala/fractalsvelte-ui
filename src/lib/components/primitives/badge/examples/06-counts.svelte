<!-- @example Counts :: A count sits beside a label, set in tabular numerals so a column of counts lines up. -->
<script lang="ts">
	import { Badge } from '@fractaldesign/fractalsvelte-ui';
</script>

<ul class="box gap-sm measure-xs">
	<li class="row ycenter ybetween text-secondary">
		Inbox <Badge size="sm" variant="secondary">128</Badge>
	</li>
	<li class="row ycenter ybetween text-secondary">
		Drafts <Badge size="sm" variant="secondary">7</Badge>
	</li>
	<li class="row ycenter ybetween text-secondary">
		Needs review <Badge size="sm" variant="danger">12</Badge>
	</li>
</ul>
