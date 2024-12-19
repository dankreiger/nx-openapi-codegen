import { describe, expect, mock, test } from "bun:test";
import { getMonorepoName } from "./get-monorepo-name.prompts";

mock.module("@inquirer/prompts", () => ({
	input: mock(() => {}),
}));

describe("getMonorepoName", () => {
	test("should return valid monorepo name", async () => {
		mock.module("@inquirer/prompts", () => ({
			input: mock(() => Promise.resolve("test-repo")),
		}));
		const result = await getMonorepoName();
		expect(result).toBe("test-repo");
	});

	test("should throw on invalid monorepo name", async () => {
		mock.module("@inquirer/prompts", () => ({
			input: mock(() => Promise.resolve("test@repo")),
		}));
		await expect(getMonorepoName()).rejects.toThrow();
	});
});
