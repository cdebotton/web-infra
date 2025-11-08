<script lang="ts">
	import { getUsers } from './users.remote';

	import { resolve } from '$app/paths';
</script>

<h2>Users</h2>

<ul>
	{#each await getUsers() as user (user.id)}
		<li>
			<a href={resolve('/admin/users/{user.id}')}>{user.email}</a>
		</li>
	{/each}
</ul>
