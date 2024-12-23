// export const getNormalizedPath = (input: {
// 	path: string;
// }) =>
// 	input.path
// 		.split("/")
// 		.filter((r) => typeof r === "string")
// 		.join("/")
// 		.replaceAll(/\/{2,}/g, "/")
// 		.replace(/\/$/, ""); // remove trailing slash and double slashes

import path from "node:path";

export const getNormalizedPath = (input: { path: string }) => {
	const normalized = path.normalize(input.path);
	// Convert backslashes to forward slashes
	return normalized.replace(/\\/g, "/");
};
