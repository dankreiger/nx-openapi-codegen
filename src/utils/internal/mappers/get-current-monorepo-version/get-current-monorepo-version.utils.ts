export async function getCurrentMonorepoVersion() {
	return (await Bun.file("./package.json").json()).version;
}
