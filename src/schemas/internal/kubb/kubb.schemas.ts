import { z } from "zod";
import { KUBB_PLUGIN } from "../../../constants/index.ts";
import { AvailablePackagesSchema } from "../available-packages/index.ts";

export const KubbPluginNameSchema = z
	.enum([
		KUBB_PLUGIN.oas.pluginFnNameString,
		KUBB_PLUGIN.types.pluginFnNameString,
		KUBB_PLUGIN.axios.pluginFnNameString,
		KUBB_PLUGIN.fetch.pluginFnNameString,
		// KUBB_PLUGIN.swr.pluginFnNameString,
		KUBB_PLUGIN["faker-constant"].pluginFnNameString,
		KUBB_PLUGIN["faker-random"].pluginFnNameString,
		KUBB_PLUGIN["msw-constant"].pluginFnNameString,
		KUBB_PLUGIN["msw-random"].pluginFnNameString,
		KUBB_PLUGIN["rtk-query"].pluginFnNameString,
		KUBB_PLUGIN["tanstack-react-query"].pluginFnNameString,
		KUBB_PLUGIN["tanstack-react-query"].pluginFnNameString,
		KUBB_PLUGIN.zod.pluginFnNameString,
	])
	.describe("KubbPluginNameSchema");

export const KubbPluginsSchema = z
	.discriminatedUnion("packageName", [
		z.object({
			packageName: AvailablePackagesSchema.extract(["axios"]),
			pluginFnNameString: KubbPluginNameSchema.extract(["pluginClient"]),
			output: z.object({
				path: z.literal("./typescript/axios/src"),
			}),
			client: z.literal("axios"),
		}),
		z.object({
			packageName: AvailablePackagesSchema.extract(["faker-constant"]),
			pluginFnNameString: KubbPluginNameSchema.extract(["pluginFaker"]),
			output: z.object({
				path: z.literal("./typescript/faker-constant/src"),
			}),
			seed: z.array(z.number().min(222).max(222)),
		}),
		z.object({
			packageName: AvailablePackagesSchema.extract(["fetch"]),
			pluginFnNameString: KubbPluginNameSchema.extract(["pluginClient"]),
			output: z.object({
				path: z.literal("./typescript/fetch/src"),
			}),
			client: z.literal("fetch"),
		}),
		z.object({
			packageName: AvailablePackagesSchema.extract([
				"msw-constant",
				"msw-random",
			]),
			pluginFnNameString: KubbPluginNameSchema.extract(["pluginMsw"]),
			output: z.object({
				path: z.union([
					z.literal("./typescript/msw-constant/src"),
					z.literal("./typescript/msw-random/src"),
				]),
			}),
			parser: z.literal("faker"),
		}),
		z.object({
			packageName: AvailablePackagesSchema.extract(["tanstack-react-query"]),
			pluginFnNameString: KubbPluginNameSchema.extract(["pluginReactQuery"]),
			output: z.object({
				path: z.literal("./typescript/tanstack-react-query/src"),
			}),
			client: z.object({
				dataReturnType: z.literal("full"),
			}),
		}),
		z.object({
			packageName: AvailablePackagesSchema.exclude([
				"axios",
				"faker-constant",
				"fetch",
				"tanstack-react-query",
				"msw-constant",
				"msw-random",
			]),
			pluginFnNameString: KubbPluginNameSchema.exclude([
				"pluginClient",
				"pluginReactQuery",
				"pluginMsw",
			]),
			output: z.object({
				path: z.union([
					z.literal(
						"./typescript/faker-random/src" satisfies `./typescript/${z.infer<typeof AvailablePackagesSchema>}/src`,
					),
					z.literal(
						"./typescript/oas/src" satisfies `./typescript/${z.infer<typeof AvailablePackagesSchema>}/src`,
					),
					// z.literal(
					// 	"./swr/src" satisfies `./${z.infer<typeof AvailablePackagesSchema>}/src`,
					// ),
					z.literal(
						"./typescript/types/src" satisfies `./typescript/${z.infer<typeof AvailablePackagesSchema>}/src`,
					),
					z.literal(
						"./typescript/zod/src" satisfies `./typescript/${z.infer<typeof AvailablePackagesSchema>}/src`,
					),
				]),
			}),
		}),
	])
	.transform((plugin) => {
		const { packageName, pluginFnNameString, ...pluginFnOpts } = plugin;
		return {
			packageName,
			importString: KUBB_PLUGIN[packageName].importString,
			pluginFnNameString,
			pluginFnOpts,
		} as const;
	})
	.describe("KubbPluginsSchema");

export type KubbPlugin = z.infer<typeof KubbPluginsSchema>;
