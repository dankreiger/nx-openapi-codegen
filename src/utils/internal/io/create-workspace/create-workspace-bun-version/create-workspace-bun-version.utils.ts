import { write } from "bun";

export async function createWorkspaceBunVersion() {
	await write(".bun-version", "1.1.42");
}
