<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
</script>

<form>
	<section>
		<div>
			<Markdown />
		</div>
	</section>
	<section>
		<div>
			<Input type="text" name="title" placeholder="Title" />
		</div>
		<div>
			<Input type="text" name="slug" placeholder="Slug" />
		</div>
	</section>
</form>

<style>
	form {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr 20rem;
	}
</style>
