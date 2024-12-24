import type { ReadonlyDeep } from "type-fest";
import type { AvailablePackages } from "../schemas/index.ts";

export const KUBB_PLUGIN = {
	oas: {
		pluginFnNameString: "pluginOas",
		importString: "import { pluginOas } from '@kubb/plugin-oas';",
	},
	types: {
		pluginFnNameString: "pluginTs",
		importString: "import { pluginTs } from '@kubb/plugin-ts';",
	},
	axios: {
		pluginFnNameString: "pluginClient",
		importString: "import { pluginClient } from '@kubb/plugin-client';",
	},
	fetch: {
		pluginFnNameString: "pluginClient",
		importString: "import { pluginClient } from '@kubb/plugin-client';",
	},
	// swr: {
	// 	pluginFnNameString: "pluginSwr",
	// 	importString: "import { pluginSwr } from '@kubb/plugin-swr';",
	// },
	"faker-constant": {
		pluginFnNameString: "pluginFaker",
		importString: "import { pluginFaker } from '@kubb/plugin-faker';",
	},
	"faker-random": {
		pluginFnNameString: "pluginFaker",
		importString: "import { pluginFaker } from '@kubb/plugin-faker';",
	},
	"msw-constant": {
		pluginFnNameString: "pluginMsw",
		importString: "import { pluginMsw } from '@kubb/plugin-msw';",
	},
	"msw-random": {
		pluginFnNameString: "pluginMsw",
		importString: "import { pluginMsw } from '@kubb/plugin-msw';",
	},
	"rtk-query": {
		pluginFnNameString: "	pluginRtkQuery",
		importString: "import { pluginRtkQuery } from '@kubb/plugin-rtk-query';",
	},
	"tanstack-react-query": {
		pluginFnNameString: "pluginReactQuery",
		importString:
			"import { pluginReactQuery } from '@kubb/plugin-react-query';",
	},
	zod: {
		pluginFnNameString: "pluginZod",
		importString: "import { pluginZod } from '@kubb/plugin-zod';",
	},
} as const satisfies ReadonlyDeep<
	Record<
		AvailablePackages,
		{
			pluginFnNameString: string;
			importString: string;
		}
	>
>;
