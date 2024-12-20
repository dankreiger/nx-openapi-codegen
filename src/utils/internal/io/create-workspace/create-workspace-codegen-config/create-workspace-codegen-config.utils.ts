import { mkdir } from "node:fs/promises";
import type { AvailablePackages, MonorepoConfig } from "../../../../../schemas";

type KubbPluginName =
	`@kubb/plugin-${"axios" | "client" | "faker" | "msw" | "oas" | "redoc" | "react-query" | "solid-query" | "svelte-query" | "vue-query" | "swr" | "ts" | "zod"}`;

export async function createWorkspaceCodegenConfig(config: MonorepoConfig) {
	await mkdir(config.kubbConfigDir, { recursive: true });

	await generateKubbConfig(config);
}

async function generateKubbConfig(config: MonorepoConfig) {
	const { kubbConfigDir } = config;

	const PACKAGE_TO_KUBB_PLUGIN = {
		axios: "@kubb/plugin-client",
		"faker-constant": "@kubb/plugin-faker",
		"faker-random": "@kubb/plugin-faker",
		fetch: "@kubb/plugin-client",
		"msw-constant": "@kubb/plugin-msw",
		"msw-random": "@kubb/plugin-msw",
		oas: "@kubb/plugin-oas",
		redoc: "@kubb/plugin-redoc",
		swr: "@kubb/plugin-swr",
		"tanstack-react-query": "@kubb/plugin-react-query",
		"tanstack-solid-query": "@kubb/plugin-solid-query",
		"tanstack-svelte-query": "@kubb/plugin-svelte-query",
		"tanstack-vue-query": "@kubb/plugin-vue-query",
		types: "@kubb/plugin-ts",
		zod: "@kubb/plugin-zod",
	} satisfies Record<AvailablePackages, KubbPluginName>;

	const PLUGINS_TO_INSTALL = config.selectedPackages
		.map((pkg) => PACKAGE_TO_KUBB_PLUGIN[pkg])
		.filter(Boolean);

	await Bun.$`bun add -D -E ${{ raw: PLUGINS_TO_INSTALL.join(" ") }}`;

	return await Bun.write(
		`${kubbConfigDir}/kubb.config.ts`,
		/*ts*/ `${"#!/usr/bin/env bun"}    
import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginSolidQuery } from "@kubb/plugin-solid-query";
import { pluginSvelteQuery } from "@kubb/plugin-svelte-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginVueQuery } from "@kubb/plugin-vue-query";
import { pluginZod } from "@kubb/plugin-zod";

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const execAsync = promisify(exec);

// Config for Kubb
export default defineConfig(async () => {
  await execAsync(
    "find ${config.packagesBaseDir} -type d -path '*/src' -o -path '*/dist' -o -name 'node_modules' -exec rm -rf {} +",
  ).catch(console.error);

  return [
    {
      root: '.',
      input: {
        path: '${config.openapiPath}',
      },
      output: {
        path: '${config.packagesBaseDir}',
        clean: false,
        barrelType: false,
      },
      plugins: [
				pluginOas({
					output: {
						path: './oas/src',
					},
				}),
				pluginTs({
					output: {
						path: './types/src',
					},
				}),
        ${
					config.selectedPackages.includes("axios")
						? /*ts*/ `pluginClient({
          output: {
            path: './axios/src',
          },
          client: 'axios',
				}),`
						: ""
				}
				${
					config.selectedPackages.includes("faker-constant") ||
					config.selectedPackages.includes("msw-constant")
						? /*ts*/ `pluginFaker({
						seed: [202],
						output: {
							path: './faker-constant/src',
						},
					}),`
						: ""
				}
				${
					config.selectedPackages.includes("faker-random") ||
					config.selectedPackages.includes("msw-random")
						? /*ts*/ `pluginFaker({
						output: {
							path: './faker-random/src',
						},
					}),`
						: ""
				}
				${
					config.selectedPackages.includes("fetch")
						? /*ts*/ `pluginClient({
          output: {
            path: './fetch/src',
          },
          client: 'fetch',
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("msw-constant")
						? /*ts*/ `pluginMsw({
          output: {
            path: './msw-constant/src',
          }
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("msw-random")
						? /*ts*/ `pluginMsw({
          output: {
            path: './msw-random/src',
          },
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("tanstack-react-query")
						? /*ts*/ `pluginReactQuery({
          output: {
            path: './tanstack-react-query/src',
          }
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("tanstack-solid-query")
						? /*ts*/ `pluginSolidQuery({
          output: {
            path: './tanstack-solid-query/src',
          }
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("tanstack-svelte-query")
						? /*ts*/ `pluginSvelteQuery({
          output: {
            path: './tanstack-svelte-query/src',
          },
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("tanstack-vue-query")
						? /*ts*/ `pluginVueQuery({
          output: {
            path: './tanstack-vue-query/src',
          }
        }),`
						: ""
				}
				${
					config.selectedPackages.includes("zod")
						? /*ts*/ `pluginZod({
          output: {
            path: './zod/src',
          },
        }),`
						: ""
				}
      ],
    },
  ];
});
    `,
	);
}
