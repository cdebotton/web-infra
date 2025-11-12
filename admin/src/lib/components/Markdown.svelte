<script lang="ts">
	import { Marked } from 'marked';
	import { addTokenPositions } from 'marked-token-position';

	import { o } from '../../../.svelte-kit/output/server/chunks';

	interface Props {
		value?: string;
	}

	let { value = $bindable('') }: Props = $props();
	const marked = new Marked();

	const tokens = $derived.by(() => {
		let lexed = marked.lexer(value);
		return addTokenPositions(lexed);
	});

	function setCaretPosition(element, offset) {
		const range = document.createRange();
		const selection = window.getSelection();

		let charCount = 0;
		let found = false;

		function traverseNodes(node) {
			if (found) return;

			if (node.nodeType === Node.TEXT_NODE) {
				const nextCharCount = charCount + node.length;
				if (offset >= charCount && offset <= nextCharCount) {
					range.setStart(node, offset - charCount);
					range.collapse(true);
					found = true;
					return;
				}
				charCount = nextCharCount;
			} else {
				for (let i = 0; i < node.childNodes.length; i++) {
					traverseNodes(node.childNodes[i]);
					if (found) return;
				}
			}
		}

		traverseNodes(element);

		if (found) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
	function renderMarkdown(node: HTMLElement) {
		let html = '';
		const position = getCaretPosition(node);
		for (let token of tokens) {
			html += renderToken(token);
		}

		node.innerHTML = html;
		setCaretPosition(node, position);
	}
	interface Position {
		offset: number;
		line: number;
		column: number;
	}

	interface TokenWithPosition {
		depth: number;
		raw: string;
		text: string;
		type: string;
		tokens: Array<TokenWithPosition>;
		position: {
			start: Position;
			end: Position;
			lines: Array<{ start: Position; end: Position }>;
		};
	}
	function getCaretPosition(element) {
		const selection = window.getSelection();
		if (selection.rangeCount === 0) return 0;

		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.endContainer, range.endOffset);

		return preCaretRange.toString().length;
	}
	function renderToken(token: TokenWithPosition) {
		const fragment = document.createDocumentFragment();
		let element: Node;
		switch (token.type) {
			case 'heading':
				element = document.createElement('h1');
				element.innerHTML = token.raw;
				break;
			case 'paragraph':
				element = document.createElement('p');
				element.innerHTML = token.raw;
				break;
			case 'space':
				element = document.createElement('br');
				break;
			case 'text':
				element = document.createTextNode(token.raw);
				break;
			default:
				console.log(token);
				return;
		}
		fragment.appendChild(element);

		const div = document.createElement('div');
		div.appendChild(fragment);

		return div.innerHTML;
	}
</script>

<div {@attach renderMarkdown} bind:innerText={value} contenteditable="plaintext-only"></div>

<style>
	div {
		overflow: hidden;
		height: 100%;
		padding: 1rem;
		background-color: var(--color-surface-0);
	}
</style>
