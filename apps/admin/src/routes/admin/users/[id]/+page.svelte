<script lang="ts">
	import Input from '$lib/components/Input.svelte';

	import { getUser, updateUser } from './users.remote';

	import { page } from '$app/state';

	let user = $derived(await getUser(page.params.id));
</script>

<h2>{user.email}</h2>
<form enctype="multipart/form-data" {...updateUser}>
	<Input value={user.displayName} name="display_name" type="text" />
	<input type="file" name="avatar" accept="image/jpeg,image/jpg,image/webp,image/avif,image/png" />
	<button type="submit">Save</button>
</form>
