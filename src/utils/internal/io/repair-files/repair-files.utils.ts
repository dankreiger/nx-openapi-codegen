export async function repairFiles() {
	Bun.spawnSync(["bun", "biome", "check", "--write", "--unsafe"], {
		stdout: "inherit",
	});
}
