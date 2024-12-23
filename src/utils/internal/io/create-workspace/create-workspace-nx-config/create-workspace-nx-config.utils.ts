import { write } from "bun";
import sortKeys from "sort-keys";

export async function createWorkspaceNxConfig() {
	await write(
		"nx.json",
		JSON.stringify(
			sortKeys({
				...(await Bun.file("./nx.json").json()),
				neverConnectToCloud: true,
			}),
			null,
			2,
		),
	);
}
