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
	<a href="/admin"><House weight="fill" /> Dashboard</a>
	<a href="/admin/documents"><Files weight="fill" />Documents</a>
	<a href="/admin/assets"><Image weight="fill" />Assets</a>
	<a href="/admin/taxonomy"><Tag weight="fill" />Taxonomy</a>
	<a href="/admin/users"><Users weight="fill" />Users</a>
	<a href="/admin/analytics"><ChartBar weight="fill" />Analytics</a>
	<a href="/admin/logs"><Notebook weight="fill" />Logs</a>
	<a href="/admin/config"><Wrench weight="fill" />Configuration</a>

	<form {...logout}>
		<button><SignOut weight="fill" />Logout</button>
	</form>
</nav>

<main>
	<svelte:boundary>{@render children?.()}</svelte:boundary>
</main>

<style>
	:global(body) {
		display: grid;
		min-height: 100svh;
		grid-template-columns: max-content auto;
		grid-template-rows: max-content auto;
	}

	:root {
		background-color: var(--color-background);
		color: var(--color-text);
	}

	main {
		grid-column: 2;
		grid-row: 1 / -1;
		margin-inline: 4rem;
	}

	header {
		background-color: var(--color-surface);
		h1 {
			font-size: var(--type-scale-xl);
			padding-block: 1rem;
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
		padding-inline: 2rem;
	}

	nav {
		display: grid;
		align-content: start;
		background-color: var(--color-surface);

		a {
			display: inline-flex;
			justify-content: space-between;
			font-size: var(--type-scale-base);
			font-weight: 300;
			gap: 1rem;
			letter-spacing: 0.025rem;
			padding-block: 0.5rem;
		}
	}

	button {
		display: inline-flex;
		width: 100%;
		align-items: baseline;
		justify-content: space-between;
		border: none;
		background: none;
		cursor: pointer;
		padding-block: 0.5rem;
	}
</style>
