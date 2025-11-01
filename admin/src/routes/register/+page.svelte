<script lang="ts">
	import { register } from '$lib/auth.remote';
	import Input from '$lib/components/Input.svelte';
</script>

<main>
	<form {...register}>
		<Input name="email" type="text" placeholder="Email address" />
		<Input name="displayName" type="text" placeholder="Display name" />
		<Input name="firstName" type="text" placeholder="First name" />
		<Input name="lastName" type="text" placeholder="Last name" />
		<Input name="password" type="password" placeholder="Password" />
		<Input name="password2" type="password" placeholder="Confirm password" />
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
