import { define } from 'bun';

await define({
  '.': {
    target: 'bun',
    outdir: 'dist',
  },
});
