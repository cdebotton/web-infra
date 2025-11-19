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
	<span class="rim"></span>
	<h1>Admin</h1>
	<nav>
		<NavLink href="/admin" exact>
			<span class="icon"><House weight="light" /></span>
			<span class="label">Dashboard</span>
		</NavLink>
		<NavLink href="/admin/documents">
			<span class="icon"><Files weight="light" /></span>
			<span class="label">Documents</span></NavLink
		>
		<NavLink href="/admin/assets">
			<span class="icon"><Image weight="light" /></span>
			<span class="label">Assets</span></NavLink
		>
		<NavLink href="/admin/taxonomy">
			<span class="icon"><Tag weight="light" /></span>
			<span class="label">Taxonomy</span></NavLink
		>
		<NavLink href="/admin/users">
			<span class="icon"><Users weight="light" /></span>
			<span class="label">Users</span></NavLink
		>
		<NavLink href="/admin/analytics">
			<span class="icon"><ChartBar weight="light" /></span>
			<span class="label">Analytics</span></NavLink
		>
		<NavLink href="/admin/logs">
			<span class="icon"><Notebook weight="light" /></span>
			<span class="label">Logs</span>
		</NavLink>
		<NavLink href="/admin/config">
			<span class="icon"><Wrench weight="light" /></span>
			<span class="label">Config</span>
		</NavLink>
	</nav>

	<span class="avatar-container">
		<button
			aria-haspopup="true"
			popovertarget="account-menu"
			aria-label="Context menu"
			class="avatar"
		></button>
	</span>
	<ul popover id="account-menu" role="menu">
		<li>
			<form {...logout}>
				<button><SignOut weight="fill" /></button>
			</form>
		</li>
	</ul>
</header>

<main>
	<svelte:boundary>{@render children?.()}</svelte:boundary>
</main>

<style>
	:global(body) {
		display: grid;
		min-height: 100svh;
		container: body / inline-size;
		grid-template-columns: max-content min-content auto;
	}

	main {
		display: flex;
		flex-flow: column;
		grid-column: 3 / -1;
		padding-block: 1rem;
		padding-inline: 2rem;
	}

	@keyframes gradient-roll {
		from {
			background-position: -100dvw 0;
		}
		to {
			background-position: 0 0;
		}
	}

	header {
		display: grid;
		align-content: start;
		background-color: var(--color-bg-mantle);
		grid-template-columns: repeat(2, min-content);
		grid-template-rows: auto 1fr;

		.rim {
			background-color: var(--color-bg-crust);
			grid-column: 1;
			grid-row: 1 / -1;
		}
	}

	h1 {
		margin: 0;
		animation: gradient-roll 10s linear infinite alternate;
		background-clip: text;
		background-image: linear-gradient(
			to right,
			var(--color-teal),
			var(--color-lavender),
			var(--color-mauve),
			var(--color-pink),
			var(--color-maroon),
			var(--color-peach)
		);
		background-repeat: no-repeat;
		background-size: 200dvw 100dvh;
		color: transparent;
		font-size: var(--type-scale-lg);
		font-weight: 900;
		grid-column: 1;
		grid-row: 1;
		justify-self: center;
		letter-spacing: -0.025rem;
		margin-inline: 1rem;
		padding-block: 0.5rem;
		writing-mode: vertical-lr;
	}

	nav {
		display: grid;
		align-content: start;
		grid-column: 1 / -1;
		grid-row: 2;
		grid-template-columns: subgrid;

		.icon {
			display: inline-grid;
			height: 2rem;
			align-items: center;
			justify-self: center;
		}

		.label {
			padding-inline: 1rem 2rem;
		}

		@container body (width <= 800px) {
			.icon {
				font-size: var(--type-scale-lg);
			}

			.label {
				display: none;
			}
		}
	}

	.avatar-container {
		background-color: var(--color-bg-crust);
		grid-column: 1;
		grid-row: 3;
		justify-self: center;
		padding-block: 1rem;
	}

	.avatar {
		display: block;
		width: 1.5rem;
		border: 2px solid var(--color-maroon);
		border-radius: 9999px;
		anchor-name: --context-anchor;
		aspect-ratio: 1 / 1;
		background-image: url('https://picsum.photos/64/64');
		background-size: cover;
	}

	[role='menu'] {
		position: fixed;
		background-color: white;
		inset-block-start: calc(anchor(start) + 10px);
		inset-inline-start: calc(anchor(end) + 0.5rem);
		position-anchor: --context-anchor;
	}
</style>
