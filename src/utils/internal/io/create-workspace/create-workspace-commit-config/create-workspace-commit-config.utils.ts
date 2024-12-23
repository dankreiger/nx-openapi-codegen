import { write } from "bun";

export async function createWorkspaceCommitConfig() {
	await write(
		".commitlintrc",
		`{
		extends: ["@commitlint/config-conventional"],
	}`,
	);

	await write(
		"./lefthook.json",
		JSON.stringify(
			{
				"pre-commit": {
					parallel: true,
					commands: {
						build: { run: "bun run build" },
						sort: { run: "bun run sort", stage_fixed: true },
						lint: { run: "bun run lint", stage_fixed: true },
					},
				},
				"commit-msg": {
					commands: {
						"check-commits": { run: "bunx commitlint --edit" },
						"check-branch": { run: "bun run commit:protect" },
					},
				},
				"post-merge": {
					"install-deps-postmerge": {
						tags: "frontend",
						run: "bunx install-deps-postmerge",
					},
				},
			},
			null,
			2,
		),
	);
}
