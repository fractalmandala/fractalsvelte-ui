<!-- @example Pen, guide, frame and clear button :: A thicker line, no baseline guide, a curved frame, and a quiet clear button on a bare surface. -->
<script lang="ts">
	import { SignaturePad } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<SignaturePad label="Applicant signature, thick pen" lineWidth={6} size="h-md" textColor="text-secondary" />
	<SignaturePad label="Initials, no guide" showGuide={false} showClear={false} shape="curved" />
	<SignaturePad label="Countersignature, rounded frame" shape="round" surface="outlined" />
</div>
