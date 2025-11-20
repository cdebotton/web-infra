<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLButtonAttributes, 'size'> {
		size?: 'lg' | 'md' | 'sm';
		variant?: 'primary' | 'secondary';
	}

	const {
		class: className,
		children,
		size = 'md',
		variant = 'primary',
		...buttonProps
	}: Props = $props();
</script>

<button class={[className, size, variant]} {...buttonProps}>{@render children?.()}</button>

<style>
	button {
		height: 3.5rem;
		border: none;
		cursor: pointer;

		&.sm {
			height: 1rem;
			border-radius: 4px;
			font-size: var(--type-scale-xs);
			padding-inline: 0.5rem;
		}

		&.md {
			height: 2rem;
			border-radius: 8px;
			font-size: var(--type-scale-sm);
			padding-inline: 1rem;
		}

		&.lg {
			height: 3.5rem;
			border-radius: 13px;
			font-size: var(--type-scale-base);
			font-weight: 600;
			padding-inline: 2rem;
		}

		&.primary {
			background-color: var(--color-primary-surface);
			color: var(--color-primary-text);
		}
	}
</style>
