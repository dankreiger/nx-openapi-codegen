import type { MonorepoConfig } from "../../../../../schemas/index.ts";

// Orval - better react-query client
export async function generateOrvalConfig(config: MonorepoConfig) {
	if (!config.byLanguage.typescript) {
		throw new Error(
			"Typescript packages directory is not set, cannot create Orval codegen config. This probably means you didn't select typescript as a language to generate SDKs for.",
		);
	}

	await Bun.write(
		`${config.byLanguage.typescript.codegenConfigsDirectoryPath}/orval.config.ts`,
		/*ts*/ `import { defineConfig } from "orval";
	export default defineConfig({
	"${config.npmOrgScope}": {
			input: "${config.openapiUrlOrFilePath}",
			output: {
				workspace: "../../${config.byLanguage.typescript.codegenConfigsDirectoryPath}".replace(/\\/g, "/"),
				mode: "single",
				target: "./tanstack-react-query/src/index.ts",
				client: "react-query",
				clean: false,
				// baseUrl: 'https://petstore.swagger.io/v2',
			},
			hooks: {
				afterAllFilesWrite: "bunx biome check --write --unsafe",
			},
		},
})`,
	);
}
