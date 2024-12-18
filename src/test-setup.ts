import { mock } from "bun:test";

mock.module("bun", () => ({
	write: mock(() => Promise.resolve()),
}));

mock.module("@inquirer/prompts", () => ({
	input: mock(() => Promise.resolve("packages")),
}));

mock.module("@nx/devkit", () => ({
	getProjects: mock(() => Promise.resolve([])),
}));

