<script lang="ts">
	import { getCurrentUser } from '$lib/auth.remote';

	const currentUser = $derived(await getCurrentUser());
</script>

<main>
	<header>
		<h2>Hello, {currentUser?.displayName}!</h2>
		<nav></nav>
	</header>
	<p>Change stuff</p>
</main>

<style>
	header {
		margin-block-end: 1rem;
		padding-block: 1rem;

		h2 {
			border-bottom: 1px solid currentColor;
			font-size: var(--type-scale-xl);
		}
	}
</style>
