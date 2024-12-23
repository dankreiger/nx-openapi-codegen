import { DEPENDENCIES } from "../../../../constants/index.ts";
import type { AvailablePackages } from "../../../../schemas/index.ts";

// rename "folder" to "packageName"
export const getPeerDepByFolder = (
	folder: AvailablePackages,
): Partial<Readonly<Record<keyof typeof DEPENDENCIES, string>>> => {
	const checkExhaustive = (folder: never) => {
		throw new Error(`checkExhaustivePeerDependencies: ${folder}`);
	};
	switch (folder) {
		case "axios":
			return {
				axios: DEPENDENCIES.axios,
			};
		case "faker-constant":
			return {
				"@faker-js/faker": DEPENDENCIES["@faker-js/faker"],
			};
		case "faker-random":
			return {
				"@faker-js/faker": DEPENDENCIES["@faker-js/faker"],
			};
		case "fetch":
			return {};
		case "msw-constant":
			return {
				"@faker-js/faker": DEPENDENCIES["@faker-js/faker"],
				msw: DEPENDENCIES.msw,
			};
		case "msw-random":
			return {
				"@faker-js/faker": DEPENDENCIES["@faker-js/faker"],
				msw: DEPENDENCIES.msw,
			};
		case "tanstack-react-query":
			return {
				react: DEPENDENCIES.react,
				"react-dom": DEPENDENCIES["react-dom"],
				"@tanstack/react-query": DEPENDENCIES["@tanstack/react-query"],
			};
		case "oas":
			return {};
		case "rtk-query":
			return {
				"@reduxjs/toolkit": DEPENDENCIES["@reduxjs/toolkit"],
				"react-redux": DEPENDENCIES["react-redux"],
			};
		case "swr":
			return {
				swr: DEPENDENCIES.swr,
			};
		case "types":
			return {};

		case "zod":
			return {
				zod: DEPENDENCIES.zod,
			};
		default:
			return checkExhaustive(folder);
	}
};
