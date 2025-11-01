<script lang="ts">
	import './app.css';
	const { children } = $props();
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

{@render children?.()}
