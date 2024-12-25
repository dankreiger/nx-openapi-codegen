declare module "bun" {
	interface Env {
		readonly RUN_MODE: "skip-prompts" | undefined;
	}
}
