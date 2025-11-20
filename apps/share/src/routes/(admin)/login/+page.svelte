<script>
	import { login } from '$lib/auth.remote';
	import Button from '$lib/components/button';
	import Input from '$lib/components/input';
</script>

<form {...login}>
	<h1>Manage</h1>
	<Input size="lg" name="email" type="email" placeholder="Email" />
	<Input size="lg" name="password" type="password" placeholder="Password" />
	<Button type="submit" size="lg">Go</Button>
</form>

<style>
	:global(body) {
		min-height: 100dvh;
		align-content: center;
		justify-items: center;
	}

	form {
		display: grid;
		gap: 1.5rem 0.5rem;
		grid-template-columns: repeat(4, 1fr);

		h1 {
			font-family: var(--font-serif);
			font-size: var(--type-scale-xl);
			font-weight: 500;
			grid-column: 1 / -1;
			letter-spacing: 0.0125em;
			padding-inline: 2rem;
		}

		:global {
			> :nth-child(2) {
				grid-column: span 2;
			}
			> :nth-child(3) {
				grid-column: span 2;
			}
			> :nth-child(4) {
				grid-column: 4 / span 1;
			}
		}
	}
</style>
