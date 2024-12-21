import type { AvailablePackages } from "../../../../schemas/index.ts";

export const getPackageTypeByFolder = (
	folder: AvailablePackages,
): "dom" | "no-dom" => {
	const exhaustiveCheck = (folder: never): never => {
		throw new Error(`Unknown package type: ${folder}`);
	};

	switch (folder) {
		case "axios":
			return "dom";
		case "faker-constant":
			return "no-dom";
		case "faker-random":
			return "no-dom";
		case "fetch":
			return "dom";
		case "msw-constant":
			return "no-dom";
		case "msw-random":
			return "no-dom";
		case "oas":
			return "no-dom";
		case "swr":
			return "dom";
		case "tanstack-react-query":
			return "dom";
		case "types":
			return "no-dom";
		case "zod":
			return "dom";
		default:
			return exhaustiveCheck(folder);
	}
};
