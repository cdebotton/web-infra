<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	const { class: className, ...inputProps }: HTMLInputAttributes = $props();
	const id = $props.id();
	const derivedId = $derived(inputProps.id ?? id);
</script>

<span>
	<input class={['', className]} {...inputProps} id={derivedId} />
	<label for={derivedId}>{inputProps.placeholder}</label>
</span>

<style>
	span {
		--height: 2rem;
		--px: 1rem;
		display: inline-grid;
		margin-block-start: 0.75rem;
	}

	label {
		display: block;
		height: var(--height);
		align-content: center;
		margin-left: 0px;
		color: oklch(from currentColor 0.75 c h);
		cursor: text;
		font-size: 1em;
		grid-column: 1 / 1;
		grid-row: 1 / 1;
		padding-inline: var(--px);
		pointer-events: none;
		transition: all 175ms ease-in;
		translate: 0 0;
	}

	span:focus-within label,
	span:not(:has(:placeholder-shown)) label {
		font-size: var(--type-scale-xs);
		translate: 0 -1.5rem;
	}

	input {
		width: 100%;
		height: var(--height);
		border: none;
		border-bottom: 1px solid gray;
		font-size: var(--type-scale-lg);
		grid-column: 1 / 1;
		grid-row: 1 / 1;
		padding-inline: var(--px);
	}

	input:focus {
		border-bottom-color: currentColor;
		outline: none;
	}

	input::placeholder {
		opacity: 0;
	}
</style>
