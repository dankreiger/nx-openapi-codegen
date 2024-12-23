import type { MonorepoConfig } from "../../../../../schemas/index.ts";

export async function generateKubbConfig(config: MonorepoConfig) {
	return await Bun.write(
		`${config.codegenConfigsDir}/kubb.config.ts`,
		/*ts*/ `${"#!/usr/bin/env bun"}    
import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginSwr } from "@kubb/plugin-swr";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";


// Config for Kubb
export default defineConfig(async () => {
  return [
    {
      root: '.',
      input: {
        path: '${config.openapiUrlOrFilePath}',
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
				pluginReactQuery({
					output: {
						path: './tanstack-react-query/src',
					},
					client: {
						dataReturnType: "full",
					},
				}),
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
