import { mock, spyOn } from "bun:test";

mock.module("node:fs/promises", () => ({
	chmod: mock(),
	mkdir: mock(),
	stat: mock(),
	readFile: mock(),
	rm: mock(),
}));

spyOn(process, "chdir").mockImplementation(() => {});
spyOn(Bun, "write").mockImplementation(() => Promise.resolve(1));
spyOn(console, "log").mockImplementation(() => {});
spyOn(console, "error").mockImplementation(() => {});
