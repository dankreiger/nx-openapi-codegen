import type { MonorepoConfig } from "../../../../../schemas/index.ts";

// Orval - better react-query client
export async function generateOrvalConfig(config: MonorepoConfig) {
	await Bun.write(
		`${config.codegenConfigsDir}/orval.config.ts`,
		/*ts*/ `import { defineConfig } from "orval";
	export default defineConfig({
	"${config.npmOrgScope}": {
			input: "${config.openapiUrlOrFilePath}",
			output: {
				workspace: "../../${config.packagesBaseDirPath}".replace(/\\/g, "/"),
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
