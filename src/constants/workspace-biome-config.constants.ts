export const WORKSPACE_BIOME_CONFIG = {
	$schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
	organizeImports: {
		enabled: true,
	},
	files: {
		ignoreUnknown: false,
		ignore: [
			"package.json",
			"__snapshots__",
			"e2e/schemas",
			"coverage",
			"assets",
			"public",
			"dist",
			"artifacts",
			".next",
			".github",
			".codesandbox",
			".devcontainer",
		],
	},
	formatter: {
		enabled: true,
		indentStyle: "space",
		indentWidth: 2,
		lineWidth: 160,
		lineEnding: "lf",
	},
	linter: {
		enabled: true,
		rules: {
			suspicious: {
				noExplicitAny: "off",
				noArrayIndexKey: "warn",
				noShadowRestrictedNames: "off",
				noConfusingVoidType: "off",
			},
			complexity: {
				noForEach: "off",
				noBannedTypes: "off",
				useArrowFunction: "off",
				useLiteralKeys: "off",
			},
			style: {
				noNonNullAssertion: "off",
				noParameterAssign: "off",
			},
			correctness: {
				noEmptyPattern: "off",
				noConstructorReturn: "off",
				noUnsafeOptionalChaining: "off",
				useImportExtensions: "error",
				noUnusedVariables: "off",
			},
			performance: {
				noAccumulatingSpread: "off",
			},
		},
	},
	javascript: {
		formatter: {
			enabled: true,
			trailingCommas: "all",
			semicolons: "asNeeded",
			quoteStyle: "single",
			jsxQuoteStyle: "double",
			bracketSameLine: false,
		},
	},
	json: {
		formatter: {
			enabled: true,
		},
		parser: {
			allowComments: true,
		},
	},
};
