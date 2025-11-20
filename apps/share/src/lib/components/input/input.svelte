<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		size?: 'sm' | 'md' | 'lg';
	}

	const { class: className, size = 'md', ...inputProps }: Props = $props();
</script>

<input class={[className, size]} {...inputProps} />

<style>
	input {
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);

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
			font-weight: 300;
			padding-inline: 2rem;
		}
	}
</style>
