import type { ReadonlyDeep } from "type-fest";
import type { AvailablePackages } from "../../schemas";

export type MonorepoConfig = ReadonlyDeep<{
	repoName: string;
	npmOrgName: `@${string}`;
	packagesBaseDir: string;
	selectedPackages: AvailablePackages[];
}>;
