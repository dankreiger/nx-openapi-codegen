export const WORKSPACE_BIOME_CONFIG = {
	$schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
	vcs: {
		enabled: false,
		clientKind: "git",
		useIgnoreFile: false,
	},
	files: {
		ignoreUnknown: false,
		ignore: [],
	},
	formatter: {
		enabled: true,
		indentStyle: "tab",
	},
	organizeImports: {
		enabled: true,
	},
	linter: {
		enabled: true,
		rules: {
			recommended: true,
			correctness: {
				noUnusedImports: "error",
			},
		},
	},
	javascript: {
		formatter: {
			quoteStyle: "double",
		},
	},
} as const;