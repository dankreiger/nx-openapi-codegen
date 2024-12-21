import { mkdir } from "node:fs/promises";
import type { MonorepoConfig } from "../../../../../schemas/index.ts";

export async function createWorkspaceCodegenConfig(config: MonorepoConfig) {
	await mkdir(config.codegenConfigDir, { recursive: true });

	await generateKubbConfig(config);
	await generateOrvalConfig(config);
}

async function generateKubbConfig(config: MonorepoConfig) {
	const { codegenConfigDir } = config;

	return await Bun.write(
		`${codegenConfigDir}/kubb.config.ts`,
		/*ts*/ `${"#!/usr/bin/env bun"}    
import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
// import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginSwr } from "@kubb/plugin-swr";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const execAsync = promisify(exec);

// Config for Kubb
export default defineConfig(async () => {
  await execAsync(
    "find ${config.packagesBaseDirPath} -type d -path '*/src' -o -path '*/dist' -o -name 'node_modules' -exec rm -rf {} +",
  ).catch(console.error);

  return [
    {
      root: '.',
      input: {
        path: '${config.openapiUrl}',
      },
      output: {
        path: '${config.packagesBaseDirPath}',
        clean: false,
        barrelType: false,
      },
      plugins: [
				pluginOas(),
				pluginTs({
					output: {
						path: './types/src',
					},
				}),
				pluginClient({
          output: {
            path: './axios/src',
          },
          client: 'axios',
				}),
				pluginClient({
          output: {
            path: './fetch/src',
          },
          client: 'axios',
				}),
				pluginSwr({
					output: {
						path: "./swr/src",
					},
				}),
				pluginFaker({
					seed: [202],
					output: {
						path: './faker-constant/src',
					},
				}),
				pluginFaker({
					output: {
						path: './faker-random/src',
					},
				}),
				pluginMsw({
					output: {
						path: './msw-constant/src',
					},
				}),
				pluginMsw({
					output: {
						path: './msw-random/src',
					},
				}),
				// pluginReactQuery({
				// 	output: {
				// 		path: './tanstack-react-query/src',
				// 	},
				// 	client: {
				// 		dataReturnType: "full",
				// 	},
				// }),
				pluginZod({
					output: {
						path: './zod/src',
					},
				})
			]
		}
	];
});
    `,
	);
}

// Orval - better react-query client
async function generateOrvalConfig(config: MonorepoConfig) {
	await Bun.write(
		`${config.codegenConfigDir}/orval.config.ts`,
		/*ts*/ `import { defineConfig } from "orval";
export default defineConfig({
	"${config.npmOrgScope}": {
			input: "${config.openapiUrl}",
			output: {
				mode: "single",
				target: "./../${config.packagesBaseDirPath}/tanstack-react-query/src/index.ts",
				client: "react-query",
				clean: true,
				// baseUrl: 'https://petstore.swagger.io/v2',
			},
			hooks: {
				afterAllFilesWrite: "bunx biome check --write --unsafe",
			},
		},
})`,
	);
}
