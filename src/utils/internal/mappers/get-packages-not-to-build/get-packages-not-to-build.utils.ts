import { z } from "zod";
import {
	AvailablePackagesSchema,
	type MonorepoConfig,
} from "../../../../schemas/index.ts";

const BlockListSchema = z.enum([
	AvailablePackagesSchema.Enum.oas, // only json files
	AvailablePackagesSchema.Enum["tanstack-react-query"], // a little buggy with some type definitions, but we could still build it if we want
]);
// ----- clean this up -----
export const getPackagesNotToBuild = <const T extends OutputAs>(
	input: FnInput<T>,
) => {
	if (input.outputAs === "schema") {
		return BlockListSchema;
	}
	return BlockListSchema.options
		.map((pkg) => `${input.config.npmOrgScope}/${pkg}` as const)
		.join(",");
};

export const getPackagesNotToBuildSchema = <const T extends OutputAs>(
	input: FnInput<T>,
) => {
	const res = getPackagesNotToBuild({
		config: input.config,
		outputAs: "schema",
	});
	if (typeof res !== "string") return res;

	throw new Error("Failed to parse packages not to build");
};

export const getPackagesNotToBuildString = <const T extends OutputAs>(
	input: FnInput<T>,
) => {
	const res = getPackagesNotToBuild({
		config: input.config,
		outputAs: "string",
	});
	if (typeof res !== "string") {
		throw new Error("Failed to parse packages not to build");
	}
	return res;
};

type OutputAs<T extends "schema" | "string" = "schema" | "string"> = T;
type FnInput<T extends OutputAs = OutputAs> = {
	readonly config: MonorepoConfig;
	readonly outputAs: OutputAs<T>;
};
