<script lang="ts">
	import { login } from '$lib/auth.remote';
	import Input from '$lib/components/Input.svelte';
</script>

<main>
	<form {...login}>
		<Input name="email" type="text" placeholder="Email address" />
		<Input name="password" type="password" placeholder="Password" />
		<button>Log in</button>
	</form>
</main>

<style>
	main {
		min-height: 100dvh;
		align-content: center;
		padding: 1rem;
	}

	form {
		display: flex;
		max-width: 64ch;
		flex-flow: column;
		gap: 1rem;
		margin-inline: auto;
	}

	button {
		height: 3rem;
		border: none;
		border-radius: 7px;
		cursor: pointer;
	}
</style>
