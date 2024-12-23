import { write } from "bun";
import { WORKSPACE_BIOME_CONFIG } from "../../../../../constants/index.ts";

export async function createWorkspaceBiomeConfig() {
	await write("biome.json", JSON.stringify(WORKSPACE_BIOME_CONFIG, null, 2));
}
