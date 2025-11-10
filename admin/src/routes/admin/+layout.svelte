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

	import NavLink from './NavLink.svelte';

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
</script>

<header>
	<h1>Admin</h1>

	<button aria-haspopup="true" popovertarget="account-menu" aria-label="Context menu" class="avatar"
	></button>
	<ul popover id="account-menu" role="menu">
		<li>
			<form {...logout}>
				<button><SignOut weight="fill" /></button>
			</form>
		</li>
	</ul>
</header>

<nav>
	<NavLink href="/admin" exact><House weight="light" />Dashboard</NavLink>
	<NavLink href="/admin/documents"><Files weight="light" />Documents</NavLink>
	<NavLink href="/admin/assets"><Image weight="light" />Assets</NavLink>
	<NavLink href="/admin/taxonomy"><Tag weight="light" />Taxonomy</NavLink>
	<NavLink href="/admin/users"><Users weight="light" />Users</NavLink>
	<NavLink href="/admin/analytics"><ChartBar weight="light" />Analytics</NavLink>
	<NavLink href="/admin/logs"><Notebook weight="light" />Logs</NavLink>
	<NavLink href="/admin/config"><Wrench weight="light" />Config</NavLink>
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
			anchor-name: --context-anchor;
			aspect-ratio: 1;
			background-image: url('https://picsum.photos/64/64');
			background-size: cover;
		}

		[role='menu'] {
			position: fixed;
			bottom: anchor(bottom);
			left: calc(anchor(right) + 1rem);
			background-color: white;
			position-anchor: --context-anchor;
		}
	}

	nav {
		display: grid;
		align-content: start;
		justify-content: center;
		background-color: var(--color-bg-mantle);
		grid-column: 2 / span 1;
		padding-block: 2rem;
	}
</style>
