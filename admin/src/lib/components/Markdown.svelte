<script lang="ts">
	import '@milkdown/crepe/theme/common/style.css';
	import '@milkdown/crepe/theme/nord-dark.css';

	import { Crepe } from '@milkdown/crepe';
	import { untrack } from 'svelte';

	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {}

	let { value = $bindable('# New document\n\n'), ...props }: Props = $props();

	function editor(node: HTMLElement) {
		const crepe = new Crepe({
			root: node,
			defaultValue: untrack(() => value),

			featureConfigs: {
				[Crepe.Feature.ImageBlock]: {
					async onUpload(file) {
						console.log(file);
						return '';
					}
				}
			}
		});

		crepe.create().then(() => {
			// Editor ready
			crepe.on((listener) => {
				listener.markdownUpdated(() => {
					value = crepe.getMarkdown();
				});
			});
		});

		return () => {
			crepe.destroy();
		};
	}
</script>

<span {@attach editor}></span>
<input type="hidden" {value} {...props} />

<style>
	:global {
		.milkdown .editor {
			height: 100dvh;
			padding: 1rem 2rem;
		}
	}
</style>
