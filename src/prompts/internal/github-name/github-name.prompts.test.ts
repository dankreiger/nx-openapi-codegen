import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { input } from "@inquirer/prompts";
import { render } from "@inquirer/testing";
import { getGithubName } from "./github-name.prompts.ts";

describe("getGithubName", () => {
	const DEFAULT_ORG_NAME = "my-org";
	const ORG_NAME_PROMPT = "? Enter the github org name";
	const VALIDATION_ERROR =
		"The repository or organization name can only contain ASCII letters, digits, and the characters ., -, and _.";

	afterEach(() => {
		mock.restore();
	});

	test("should return valid org name", async () => {
		const api = await render(input, getGithubName({ nameType: "org" }).config);

		expect(api.getScreen()).toBe(`${ORG_NAME_PROMPT} (${DEFAULT_ORG_NAME})`);
		api.events.type("test-org");

		expect(api.getScreen()).toBe(`${ORG_NAME_PROMPT} test-org`);

		api.events.keypress({ name: "enter" });

		await expect(api.answer).resolves.toBe("test-org");
	});

	test("should return default org name if no input is provided", async () => {
		const api = await render(input, getGithubName({ nameType: "org" }).config);

		api.events.keypress({ name: "enter" });
		await expect(api.answer).resolves.toBe(DEFAULT_ORG_NAME);
	});

	test("should not process with input with spaces", async () => {
		const result = getGithubName({ nameType: "org" });
		const validateSpy = spyOn(result.config, "validate");

		const api = await render(input, result.config);

		api.events.type("has spaces");
		api.events.keypress({ name: "enter" });
		expect(validateSpy.mock.results[0].value).toBe(VALIDATION_ERROR);
	});

	test("should not process with input with invalid characters", async () => {
		const result = getGithubName({ nameType: "org" });
		const validateSpy = spyOn(result.config, "validate");

		const api = await render(input, result.config);

		api.events.type("has invalid characters");
		api.events.keypress({ name: "enter" });
		expect(api.getScreen()).toBe(`${ORG_NAME_PROMPT} has invalid characters`);

		expect(validateSpy.mock.results[0].value).toBe(VALIDATION_ERROR);
	});
});
