import { describe, expect, it } from "bun:test";
import { AvailablePackagesSchema } from "../available-packages/available-packages.schema";

describe("AvailablePackagesSchema", () => {
	it("should accept valid package names", () => {
		const validPackages = [
			"axios",
			"faker-constant",
			"faker-random",
			"fetch",
			"msw-constant",
			"msw-random",
			"oas",
			"redoc",
			"swr",
			"tanstack-react-query",
			"tanstack-solid-query",
			"tanstack-svelte-query",
			"tanstack-vue-query",
			"types",
			"zod",
		];

		for (const pkg of validPackages) {
			expect(() => AvailablePackagesSchema.parse(pkg)).not.toThrow();
		}
	});

	it("should reject invalid package names", () => {
		expect(() => AvailablePackagesSchema.parse("invalid-package")).toThrow();
	});
});
