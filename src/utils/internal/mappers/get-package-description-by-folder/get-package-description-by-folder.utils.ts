import type { AvailablePackages } from "../../../../schemas/index.ts";

export const getPackageDescriptionByFolder = (folder: AvailablePackages) => {
	function assertUnreachable(_x: never): never {
		throw new Error("Didn't expect to get here");
	}
	const COMMON_STR = "OpenAPI generated ";
	return (() => {
		switch (folder) {
			case "types":
				return `${COMMON_STR} Type definitions for the models and schemas.`;
			case "axios":
				return `${COMMON_STR} HTTP client definitions for the axios library.`;
			case "faker-constant":
				return `${COMMON_STR} Constant data generation using Faker.js.`;
			case "faker-random":
				return `${COMMON_STR} Random data generation using Faker.js.`;
			case "fetch":
				return `${COMMON_STR} HTTP client definitions for the Fetch API.`;
			case "msw-constant":
				return `${COMMON_STR} Constant mock service worker handlers.`;
			case "msw-random":
				return `${COMMON_STR} Random mock service worker handlers.`;
			case "oas":
				return `${COMMON_STR} OpenAPI specification utilities and types.`;
			case "rtk-query":
				return `${COMMON_STR} Redux Toolkit Query utilities and types.`;
			case "swr":
				return `${COMMON_STR} Type definitions and utilities for SWR.`;
			case "tanstack-react-query":
				return `${COMMON_STR} Type definitions and utilities for TanStack React Query.`;
			case "zod":
				return `${COMMON_STR} Type definitions and utilities for Zod.`;
			default:
				return assertUnreachable(folder);
		}
	})() satisfies `OpenAPI generated ${string}`;
};
