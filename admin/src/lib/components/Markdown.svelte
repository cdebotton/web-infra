<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import {
		TextB,
		TextItalic,
		TextStrikethrough,
		TextUnderline,
		TextAlignLeft,
		TextAlignCenter,
		TextAlignRight
	} from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let editorState = $state<{ editor: Editor | null }>({ editor: null });
	let element: HTMLElement = $state()!;

	onMount(() => {
		editorState.editor = new Editor({
			element,
			extensions: [StarterKit],
			onTransaction: ({ editor }) => {
				editorState = { editor };
			}
		});

		return () => {
			editorState.editor?.destroy();
		};
	});
</script>

<div class="app">
	{#if editorState.editor}
		<div class="controls">
			<!-- Text-->
			<button><TextB /></button>
			<button><TextItalic /></button>
			<button><TextUnderline /></button>
			<button><TextStrikethrough /></button>
			<!-- Align -->
			<button><TextAlignLeft /></button>
			<button><TextAlignCenter /></button>
			<button><TextAlignRight /></button>
		</div>
	{/if}
	<div bind:this={element}></div>
</div>

<style>
	.app {
		position: relative;

		:global .tiptap {
			min-height: 200px;
			border-radius: 5px;
			background-color: var(--color-surface-0);
			padding-block: 1rem;
			padding-inline: 1.5rem;
		}
	}
</style>
