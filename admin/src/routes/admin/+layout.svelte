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
</script>

<header>
	<h1>Admin</h1>
</header>

<nav>
	<a href={resolve('/admin')}><House weight="fill" /></a>
	<a href={resolve('/admin/documents')}><Files weight="fill" /></a>
	<a href={resolve('/admin/assets')}><Image weight="fill" /></a>
	<a href={resolve('/admin/taxonomy')}><Tag weight="fill" /></a>
	<a href={resolve('/admin/users')}><Users weight="fill" /></a>
	<a href={resolve('/admin/analytics')}><ChartBar weight="fill" /></a>
	<a href={resolve('/admin/logs')}><Notebook weight="fill" /></a>
	<a href={resolve('/admin/config')}><Wrench weight="fill" /></a>

	<form {...logout}>
		<button><SignOut weight="fill" /></button>
	</form>
</nav>

<main>
	<svelte:boundary>{@render children?.()}</svelte:boundary>
</main>

<style>
	:global(body) {
		display: grid;
		min-height: 100svh;
		grid-template-columns: min-content auto;
		grid-template-rows: max-content auto;
	}

	:root {
		background-color: var(--color-background);
		color: var(--color-text);
	}

	main {
		grid-column: 2;
		grid-row: 1 / -1;
	}

	header {
		background-color: var(--color-surface);

		h1 {
			margin: 0;
			font-size: var(--type-scale-xl);
			writing-mode: vertical-lr;
		}
	}

	header,
	nav {
		grid-column: 1;
		text-align: right;
	}

	header,
	nav a,
	button {
		padding-inline: 0.25rem;
	}

	nav {
		display: grid;
		align-content: center;
		justify-content: center;
		background-color: var(--color-surface);

		a {
			justify-content: space-between;
			font-size: var(--type-scale-small);
			font-weight: 300;
			gap: 1rem;
			letter-spacing: 0.025rem;
			padding-block: 0.5rem;
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
