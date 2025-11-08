<script lang="ts">
	import { getDocuments } from './documents.remote';

	import { resolve } from '$app/paths';
</script>

<nav>
	<a href={resolve('/admin/documents/new')}>New document</a>
</nav>

<main>
	<h2>Documents</h2>
	<ul>
		{#each await getDocuments() as doc (doc.id)}
			<li>{document.title}</li>
		{/each}
	</ul>
</main>
