<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { State } from '$lib/types';
	import { cn } from '$lib/utils';

	let { data, selected }: NodeProps = $props();

	const state = $derived(data.state as State | undefined);
	const isMilestone = $derived(!!data.isMilestone);
	const isDone = $derived(state === State.Review);
</script>

<Handle
	type="target"
	position={Position.Left}
	isConnectable={false}
	class="h-px! min-h-0! w-px! min-w-0! border-none! bg-transparent!"
/>
<Handle
	type="source"
	position={Position.Right}
	isConnectable={false}
	class="h-px! min-h-0! w-px! min-w-0! border-none! bg-transparent!"
/>

<div
	class={cn(
		'nodrag flex max-w-[190px] min-w-[148px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 shadow-xs transition-all duration-150 select-none',
		isMilestone ? 'border-orange-300 bg-orange-50' : 'bg-card border-border',
		selected && !isMilestone && 'ring-primary border-primary ring-2 ring-offset-1',
		selected && isMilestone && 'border-orange-400 ring-2 ring-orange-400 ring-offset-1'
	)}
>
	<div
		class={cn(
			'size-2 shrink-0 rounded-full',
			state === State.Review && 'bg-emerald-400',
			state === State.Learning && 'bg-amber-400',
			state === State.Relearning && 'bg-orange-400',
			!state && 'bg-border'
		)}
	></div>

	<span
		class="text-foreground truncate text-[11px] leading-tight font-medium"
		title={data.title as string}
	>
		{data.title}
	</span>

	{#if isMilestone}
		<div class="icon-[mingcute--star-fill] ml-auto size-3 shrink-0 text-orange-400"></div>
	{:else if isDone}
		<div class="icon-[mingcute--check-fill] ml-auto size-3 shrink-0 text-emerald-400"></div>
	{/if}
</div>
