import { write } from "bun";

export async function createWorkspaceEnv() {
	await write(
		".env",
		`NX_SKIP_NX_CACHE=true
NX_VERBOSE_LOGGING=true
`,
	);
}
