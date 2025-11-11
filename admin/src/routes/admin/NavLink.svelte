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

	// FIXME: There is a bug in svelte where preload data is triggering updates to the page rune.
	// Remove this when fixed
	const preload = 'false';
</script>

<a {...linkProps} data-sveltekit-preload-data={preload} aria-current={current ? 'page' : undefined}
	>{@render children?.()}</a
>

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
				width: 0.4275rem;
				height: 1.25rem;
				border-radius: 3px;
				background-color: var(--color--indicator);
				box-shadow: 0 0 7px 2px oklch(from var(--color--indicator) 0.8 c h / 0.6);
				content: ' ';
				view-transition-name: nav-link-active-indicator;
			}

			&:nth-child(1) {
				--color--indicator: var(--color-lavender);
			}
			&:nth-child(2) {
				--color--indicator: var(--color-mauve);
			}
			&:nth-child(3) {
				--color--indicator: var(--color-pink);
			}
			&:nth-child(4) {
				--color--indicator: var(--color-yellow);
			}
			&:nth-child(5) {
				--color--indicator: var(--color-flamingo);
			}
			&:nth-child(6) {
				--color--indicator: var(--color-maroon);
			}
			&:nth-child(7) {
				--color--indicator: var(--color-red);
			}
			&:nth-child(8) {
				--color--indicator: var(--color-peach);
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
