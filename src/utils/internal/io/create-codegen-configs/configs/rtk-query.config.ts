import type { ConfigFile } from "@rtk-query/codegen-openapi";
import { camelCase } from "lodash-es";
import type { MonorepoConfig } from "../../../../../schemas/index.ts";
import { getNormalizedPath } from "../../../mappers/index.ts";

export async function generateRtkQueryConfig(config: MonorepoConfig) {
	const RTK_QUERY_CONFIG = {
		schemaFile: config.openapiUrlOrFilePath,
		apiFile: getNormalizedPath({
			path: `${config.packagesBaseDirPath}/rtk-query/src/index.ts`,
		}),
		apiImport: "emptySplitApi",
		outputFile: getNormalizedPath({
			path: `${config.packagesBaseDirPath}/rtk-query/src/${camelCase(config.githubOrgName)}.ts`,
		}),
		exportName: getNormalizedPath({
			path: `${camelCase(config.githubOrgName)}Api`,
		}),
		hooks: true,
	} as const satisfies ConfigFile;

	await Bun.write(
		RTK_QUERY_CONFIG.apiFile,
		/*ts*/ `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * initialize an empty api service that we'll inject endpoints into later as needed
 */
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: () => ({}),
})
	`,
	);

	await Bun.write(
		`${config.codegenConfigsDir}/rtk-query.config.json`,
		JSON.stringify(RTK_QUERY_CONFIG, null, 2),
	);
}
