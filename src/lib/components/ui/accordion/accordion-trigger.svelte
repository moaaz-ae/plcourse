<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { Plus } from '@lucide/svelte';
	import { cn, type WithoutChild } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps['level'];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			'flex flex-1 items-center justify-between rounded-md py-3 text-left text-lg leading-7 font-semibold transition-all outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 sm:text-xl sm:leading-8 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<Plus
			aria-hidden="true"
			class="pointer-events-none size-5 shrink-0 opacity-60 transition-transform duration-200"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
