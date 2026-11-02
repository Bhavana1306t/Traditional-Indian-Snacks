import { build } from 'vite';
import { spawn } from 'node:child_process';
import path from 'node:path';

async function run() {
  console.log('Bundling test suite with Vite...');
  await build({
    build: {
      ssr: 'scripts/test-workflows.ts',
      outDir: 'dist-test',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'test-bundle.mjs',
          format: 'esm',
        },
      },
    },
  });

  console.log('Executing test bundle in Node.js...\n');
  const child = spawn('node', ['dist-test/test-bundle.mjs'], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  child.on('close', (code) => {
    process.exit(code);
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
