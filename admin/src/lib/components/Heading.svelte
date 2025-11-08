<script lang="ts">
	type Props = {
		level?: number;
	}

	const { level = 2}: Props = $props();
	const element= $derived(`h${level}`)
</script>

<svelte:element bind:this={element}></svelte:element>
