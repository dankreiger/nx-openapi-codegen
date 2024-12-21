export const PACKAGE_TSUP_CONFIG_JSON = {
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	shims: true,
	external: ["tsup", "tslib"],
};

export const getPackageTsupConfigString = (
	tsupConfig: typeof PACKAGE_TSUP_CONFIG_JSON,
) => /* ts */ `import { defineConfig } from 'tsup';
export default defineConfig(${JSON.stringify(tsupConfig, null, 2)});
`;
