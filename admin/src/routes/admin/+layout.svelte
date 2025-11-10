<script lang="ts">
	import {
		House,
		Files,
		Image,
		Tag,
		Users,
		ChartBar,
		Notebook,
		Wrench,
		SignOut
	} from 'phosphor-svelte';

	import { logout } from '$lib/auth.remote';

	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition({
				async update() {
					resolve();
					await navigation.complete;
				}
			});
		});
	});

	function link(href: string, exact = false) {
		const current = exact ? page.url.pathname === href : page.url.pathname.startsWith(href);
		return { href, 'aria-current': current ? ('page' as const) : undefined };
	}
</script>

<header>
	<h1>Admin</h1>

	<span class="avatar"></span>
	<!-- <form {...logout}> -->
	<!-- 	<button><SignOut weight="fill" /></button> -->
	<!-- </form> -->
</header>

<nav>
	<a {...link('/admin', true)}><House weight="light" />Dashboard</a>
	<a {...link(resolve('/admin/documents'))}><Files weight="light" />Documents</a>
	<a {...link(resolve('/admin/assets'))}><Image weight="light" />Assets</a>
	<a {...link(resolve('/admin/taxonomy'))}><Tag weight="light" />Taxonomy</a>
	<a {...link(resolve('/admin/users'))}><Users weight="light" />Users</a>
	<a {...link(resolve('/admin/analytics'))}><ChartBar weight="light" />Analytics</a>
	<a {...link(resolve('/admin/logs'))}><Notebook weight="light" />Logs</a>
	<a {...link(resolve('/admin/config'))}><Wrench weight="light" />Config</a>
</nav>

<main>
	<svelte:boundary>{@render children?.()}</svelte:boundary>
</main>

<style>
	:global(body) {
		display: grid;
		min-height: 100svh;
		grid-template-columns: 4rem min-content auto;
	}

	main {
		grid-column: 3 / -1;
		padding-block: 1rem;
		padding-inline: 2rem;
	}

	header {
		display: flex;
		flex-flow: column;
		background-color: var(--color-bg-crust);
		grid-column: 1 / span 1;
		padding-block: 2rem;
		padding-inline: 0.5rem;

		h1 {
			flex: 1;
			margin: 0;
			color: var(--color-maroon);
			font-size: var(--type-scale-xl);
			font-weight: 900;
			justify-self: center;
			letter-spacing: -0.025rem;
			writing-mode: vertical-lr;
		}

		.avatar {
			display: inline-block;
			width: 100%;
			border: 2px solid var(--color-maroon);
			border-radius: 9999px;
			aspect-ratio: 1;
			background-image: url('https://picsum.photos/64/64');
			background-size: cover;
		}
	}

	nav {
		display: grid;
		align-content: start;
		justify-content: center;
		background-color: var(--color-bg-mantle);
		grid-column: 2 / span 1;
		padding-block: 2rem;

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

			&:nth-child(1) {
				--accent-color: var(--color-yellow);
			}
			&:nth-child(2) {
				--accent-color: var(--color-pink);
			}
			&:nth-child(3) {
				--accent-color: var(--color-maroon);
			}
			&:nth-child(4) {
				--accent-color: var(--color-red);
			}
			&:nth-child(5) {
				--accent-color: var(--color-peach);
			}
			&:nth-child(6) {
				--accent-color: var(--color-mauve);
			}
			&:nth-child(7) {
				--accent-color: var(--color-lavender);
			}
			&:nth-child(8) {
				--accent-color: var(--color-sapphire);
			}

			&:hover,
			&[aria-current='page'] {
				background-color: var(--accent-color);
				color: black;

				:global(svg path) {
					color: black;
				}
			}

			:global(svg path) {
				color: var(--color-maroon);
			}
		}
	}

	button {
		display: inline-flex;
		align-items: baseline;
		justify-content: space-between;
		border: none;
		background: none;
		cursor: pointer;
	}
</style>
