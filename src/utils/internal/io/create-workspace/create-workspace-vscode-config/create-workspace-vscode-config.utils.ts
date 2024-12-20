import { write } from "bun";

const VS_CODE_JSON = {
	EXTENSIONS: "./.vscode/extensions.json",
	SETTINGS: "./.vscode/settings.json",
} as const;

export async function createWorkspaceVscodeConfig() {
	const vsCodeExtensions = (await Bun.file(VS_CODE_JSON.EXTENSIONS).json()) as {
		recommendations?: string[];
		unwantedRecommendations?: string[];
	};

	await write(
		VS_CODE_JSON.EXTENSIONS,
		JSON.stringify(
			{
				...vsCodeExtensions,
				recommendations: [
					...(vsCodeExtensions.recommendations ?? []),
					"biomejs.biome",
					"foxundermoon.shell-format",
				],
			},
			null,
			2,
		),
	);

	await write(
		VS_CODE_JSON.SETTINGS,
		JSON.stringify(
			{
				"editor.formatOnSave": true,
				"editor.defaultFormatter": "biomejs.biome",
				"editor.codeActionsOnSave": {
					"quickfix.biome": "explicit",
					"source.organizeImports.biome": "explicit",
					"source.fixAll.biome": "explicit",
				},
				"biome.enabled": true,
				"[dotenv]": {
					"editor.defaultFormatter": "foxundermoon.shell-format",
				},
				"[typescript]": {
					"editor.defaultFormatter": "biomejs.biome",
				},
			},
			null,
			2,
		),
	);
}
