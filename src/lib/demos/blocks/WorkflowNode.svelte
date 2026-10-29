<script lang="ts">
	import { WorkflowNode } from '$lib/styler';
	import { luMail } from '@fractaldesign/icons/lucide';
</script>

<WorkflowNode
	title="Send email"
	subtitle="Gmail"
	icon={luMail}
	inputs={[{ id: 'to', label: 'To' }, { id: 'body', label: 'Body' }]}
	outputs={[{ id: 'sent', label: 'Sent' }]}
/>
