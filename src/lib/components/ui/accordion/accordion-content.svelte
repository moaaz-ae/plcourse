<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
	{...restProps}
>
	<div
		class={cn('text-muted-foreground pb-2 text-base leading-7 sm:text-lg sm:leading-8', className)}
	>
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
