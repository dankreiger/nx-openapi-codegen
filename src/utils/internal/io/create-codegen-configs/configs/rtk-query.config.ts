import path from "node:path";
import type { ConfigFile } from "@rtk-query/codegen-openapi";
import { camelCase } from "lodash-es";
import { parseFilePath } from "../../../../../schemas/index.ts";
import type { MonorepoConfig } from "../../../../../schemas/internal/monorepo-config/index.ts";

export async function generateRtkQueryConfig(config: MonorepoConfig) {
	const OFFSET_PACKAGE_BASE_PATH = path.join(
		config.codegenConfigPathOffset,
		config.packagesBaseDirPath,
	);
	const RTK_SRC_FOLDER = "rtk-query/src" as const;
	const EXPORT_NAME = camelCase(config.githubOrgName);
	const BASE_API_MODULE_NAME = "emptySplitApi" as const;

	const RTK_QUERY_CONFIG = {
		schemaFile: config.openapiUrlOrFilePath,
		apiFile: parseFilePath(
			path.join(OFFSET_PACKAGE_BASE_PATH, RTK_SRC_FOLDER, "index.ts"),
		),
		apiImport: BASE_API_MODULE_NAME,
		outputFile: parseFilePath(
			path.join(OFFSET_PACKAGE_BASE_PATH, RTK_SRC_FOLDER, `${EXPORT_NAME}.ts`),
		),
		exportName: EXPORT_NAME,
		hooks: true,
	} as const satisfies ConfigFile;

	await Bun.write(
		path.join(config.packagesBaseDirPath, RTK_SRC_FOLDER, "index.ts"),
		/*ts*/ `
		import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
		/**
		 * @see https://redux-toolkit.js.org/rtk-query/usage/code-generation
		 */
		export const ${BASE_API_MODULE_NAME} = createApi({
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
