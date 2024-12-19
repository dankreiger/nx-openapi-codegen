export const PACKAGE_TSUP_CONFIG = `import { defineConfig } from 'tsup';
export default defineConfig({
  entry: {
    '.': 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  sourcemap: true,
  clean: true,
});
`;
