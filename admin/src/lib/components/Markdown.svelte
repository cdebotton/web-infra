<script lang="ts">
	import { Editor } from '@tiptap/core';
	import DragHandle from '@tiptap/extension-drag-handle';
	import { TextStyleKit } from '@tiptap/extension-text-style';
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
	import { onMount, type Component } from 'svelte';

	let editorState = $state<{
		editor: Editor | null;
		isBold: boolean;
		canBold: boolean;
		isItalic: boolean;
		canItalic: boolean;
		isUnderline: boolean;
		canUnderline: boolean;
		isStrike: boolean;
		canStrike: boolean;
	}>({
		editor: null,
		isBold: false,
		canBold: false,
		isItalic: false,
		canItalic: false,
		isUnderline: false,
		canUnderline: false,
		isStrike: false,
		canStrike: false
	});
	let element: HTMLElement = $state()!;

	onMount(() => {
		editorState.editor = new Editor({
			element,
			extensions: [
				StarterKit,
				TextStyleKit,
				DragHandle.configure({
					render: () => {
						const element = document.createElement('div');
						element.classList.add('drag-handle');
						console.log(element);
						return element;
					}
				})
			],
			onTransaction: ({ editor }) => {
				editorState = {
					editor,
					isBold: editor.isActive('bold'),
					canBold: editor.can().chain().toggleBold().run(),
					isItalic: editor.isActive('italic'),
					canItalic: editor.can().chain().toggleItalic().run(),
					isUnderline: editor.isActive('underline'),
					canUnderline: editor.can().chain().toggleUnderline().run(),
					isStrike: editor.isActive('strike'),
					canStrike: editor.can().chain().toggleStrike().run()
				};
			}
		});

		return () => {
			editorState.editor?.destroy();
		};
	});
</script>

{#snippet toggle({
	icon: Icon,
	command,
	active,
	enabled
}: {
	icon: Component;
	command: (editor: Editor) => boolean;
	active: boolean;
	enabled: boolean;
})}
	{#if editorState.editor}
		{@const editor = editorState.editor}
		<button class={['toggle', { active, enabled }]} onclick={() => command(editor)}>
			<Icon />
		</button>
	{/if}
{/snippet}

<div class="app">
	{#if editorState.editor}
		<div class="controls">
			<!-- Text-->
			{@render toggle({
				icon: TextB,
				command: (e) => e.chain().focus().toggleBold().run(),
				active: editorState.isBold,
				enabled: editorState.canBold
			})}
			{@render toggle({
				icon: TextItalic,
				command: (e) => e.chain().focus().toggleItalic().run(),
				active: editorState.isItalic,
				enabled: editorState.canItalic
			})}
			{@render toggle({
				icon: TextUnderline,
				command: (e) => e.chain().focus().toggleUnderline().run(),
				active: editorState.isUnderline,
				enabled: editorState.canUnderline
			})}
			{@render toggle({
				icon: TextStrikethrough,
				command: (e) => e.chain().focus().toggleStrike().run(),
				active: editorState.isStrike,
				enabled: editorState.canStrike
			})}
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

		:global {
			.tiptap {
				min-height: 200px;
				border-radius: 5px;
				background-color: var(--color-surface-0);
				padding-block: 1rem;
				padding-inline: 1.5rem;
			}

			.drag-handle {
				top: 0.5rem;
				width: 0.75rem;
				aspect-ratio: 1;
				background-color: black;
				cursor: pointer;
			}
		}
	}

	.toggle {
		height: 1.5rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		padding-inline: 0.5rem;
		&.active {
			background-color: black;
		}
	}
</style>
