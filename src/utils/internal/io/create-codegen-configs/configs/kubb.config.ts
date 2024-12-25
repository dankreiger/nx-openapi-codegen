import { join, split, toCapitalize } from "strong-string";
import type { Replace } from "type-fest";
import { KUBB_PLUGIN } from "../../../../../constants/kubb.constants.ts";
import {
	type AvailablePackages,
	type KubbPlugin,
	KubbPluginNameSchema,
	KubbPluginsSchema,
	type MonorepoConfig,
} from "../../../../../schemas/index.ts";

export async function generateKubbConfig(config: MonorepoConfig) {
	const kubbPlugins = getKubbPlugins(config.selectedPackages);

	const plugins = kubbPlugins.map(
		(r) =>
			`${r.pluginFnNameString}(${JSON.stringify(r.pluginFnOpts)})` as const,
	);

	return await Bun.write(
		`${config.codegenConfigsDir}/kubb.config.ts`,
		/*ts*/ `${"#!/usr/bin/env bun"}    
		import { defineConfig } from "@kubb/core";

		${[...new Set(kubbPlugins.map((plugin) => plugin.importString))].join("\n")}

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
					},
					plugins: [${plugins}],
				}
			];
		});
    `,
	);
}

const mapKubbPluginName = (packageName: AvailablePackages) => {
	const mappedPluginName0 = packageName.replace(
		/tanstack|constant|random|rtk-query/,
		"",
	) as Exclude<
		Replace<
			typeof packageName,
			"tanstack" | "-constant" | "-random" | "rtk-query",
			""
		>,
		""
	>;

	const mappedPluginName1 = mappedPluginName0.replace(
		/axios|fetch/,
		"Client",
	) as Replace<typeof mappedPluginName0, "axios" | "fetch", "Client">;

	const mappedPluginName2 = mappedPluginName1.replace(/types/, "Ts") as Replace<
		typeof mappedPluginName1,
		"types",
		"Ts"
	>;

	const finalPlugin =
		`plugin${join(split(mappedPluginName2, "-").map(toCapitalize), "")}` as const;

	return {
		pluginFnNameString: finalPlugin,
		pluginNpmImportString: KUBB_PLUGIN[packageName].importString,
	} as const;
};

const getKubbSpecificOpts = (packageName: AvailablePackages) => {
	switch (packageName) {
		case "tanstack-react-query":
			return {
				client: {
					dataReturnType: "full",
				},
			};
		case "axios":
			return {
				client: "axios",
			};
		case "fetch":
			return {
				client: "fetch",
			};
		case "faker-constant":
			return {
				seed: [222],
			};
		case "msw-constant":
		case "msw-random":
			return {
				parser: "faker",
			};
	}
};

const getKubbPlugins = (selectedPackages: readonly AvailablePackages[]) => {
	const selectedPackagesSet = new Set(selectedPackages);
	const REQUIRED_PKGS = new Set([
		"types",
		"oas",
		"faker-constant",
		"faker-random",
	] as const);

	for (const pkg of REQUIRED_PKGS) {
		if (!selectedPackagesSet.has(pkg)) {
			selectedPackagesSet.add(pkg);
		}
	}

	const configs: KubbPlugin[] = [];

	for (const packageName of [...selectedPackagesSet].filter(
		(r) => r !== "rtk-query", // not generared by kubb
	)) {
		const pluginInfo = mapKubbPluginName(packageName);

		configs.push(
			KubbPluginsSchema.parse({
				packageName,
				pluginFnNameString: KubbPluginNameSchema.parse(
					pluginInfo.pluginFnNameString,
				),
				output: {
					path: `./typescript/${packageName}/src`,
				},
				...getKubbSpecificOpts(packageName),
			} as const),
		);
	}

	return configs;
};
