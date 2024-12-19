import { $ } from "bun";
import type { MonorepoConfig } from "../../../types";
import { preparePackageJson } from "../prepare-package-json";

export async function createWorkspace(config: MonorepoConfig) {
	const { repoName } = config;

	await $`bunx create-nx-workspace@latest ${repoName} \
    --preset=ts \
    --formatter=none \
    --linter=none \
    --strict=true \
    --nxCloud=skip \
    --pm=bun \
    --useGitHub=true`;

	process.chdir(repoName);

	// Run the untrusted command to install the packages
	await $`bun pm untrusted`;

	// Add @nx/js to the workspace
	await $`bunx nx add @nx/js --save-exact`;

	// Install dev dependencies
	await $`bun add -D @gitopslovers/nx-biome tslib tsup @nx/devkit --save-exact`;

	// Prepare root package.json
	await preparePackageJson({
		packageJsonOverride: {
			scripts: {
				build: "bunx nx run-many --target=build --projects=tag:typescript",
				lint: "bunx nx run-many --target=biome-lint --projects=tag:typescript",
				sort: "bunx nx run-many --target=sort --projects=tag:typescript",
			},
		},
	});
}
