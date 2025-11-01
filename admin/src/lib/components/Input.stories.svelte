<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from './Input.svelte';
  import { fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'components/Input',
    component: Input,
    args: {
      onchange: fn,
    }
  });
</script>

<Story name="Active" />

