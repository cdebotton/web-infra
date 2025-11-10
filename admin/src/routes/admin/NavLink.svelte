<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { page } from '$app/state';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		exact?: boolean;
	}

	const { children, exact = false, ...linkProps }: Props = $props();
	const current = $derived.by(() => {
		if (exact) {
			return page.url.pathname.toString() === linkProps.href.toString();
		}

		return page.url.pathname.startsWith(linkProps.href.toString());
	});
</script>

<a {...linkProps} aria-current={current ? 'page' : undefined}>{@render children?.()}</a>

<style>
	a {
		display: inline-grid;
		align-items: center;
		border-bottom: 1px solid var(--color-bg);
		font-size: var(--type-scale-sm);
		gap: 0 1rem;
		grid-template-columns: max-content auto;
		letter-spacing: 0.0125rem;
		padding-block: 0.5rem;
		padding-inline: 2rem 3rem;

		&[aria-current='page'] {
			position: relative;
			background-color: var(--color-bg-crust);
			cursor: default;

			&::after {
				position: absolute;
				right: 1rem;
				display: block;
				width: 0.3275rem;
				height: 1.25rem;
				border-radius: 3px;
				background-color: var(--color-mauve);
				content: ' ';
			}
		}

		&:not([aria-current='page']):hover {
			background-color: var(--color-bg-crust);
		}

		:global(svg path) {
			color: var(--color-maroon);
		}
	}
</style>
