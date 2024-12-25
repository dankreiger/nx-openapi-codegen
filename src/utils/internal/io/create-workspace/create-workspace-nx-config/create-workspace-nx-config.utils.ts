import { write } from "bun";
import { merge } from "lodash-es";
import sortKeys from "sort-keys";
import type { NxJson } from "../../../../../schemas/internal/nx-json/index.ts";

export async function createWorkspaceNxConfig() {
	const updateNxJson = async (nxJson: Partial<NxJson>): Promise<NxJson> =>
		merge({
			...((await Bun.file("./nx.json").json()) as NxJson),
			...nxJson,
		});

	const SORTED_NX_JSON = sortKeys(
		await updateNxJson({
			parallel: 5,
			neverConnectToCloud: true,
			release: {
				projects: ["*"],
				version: {
					conventionalCommits: true,
					preVersionCommand: "bunx nx run-many -t build",
				},
				changelog: {
					workspaceChangelog: {
						createRelease: "github",
					},
					automaticFromRef: true,
				},
			},
		}),
	);

	await write("nx.json", JSON.stringify(SORTED_NX_JSON, null, 2));
}
