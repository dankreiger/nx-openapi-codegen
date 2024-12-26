import path from "node:path";
import { split } from "strong-string";
import type { RequireExactlyOne } from "type-fest";
import { z } from "zod";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG } from "../../../constants/workspace-scripts-base-dir.constants.ts";
import { SdkLanguageSchema } from "../sdk-language/sdk-language.schemas.ts";
import { WorkspaceScriptNameSchema } from "../workspace-script-name/index.ts";

export const WorkspacePackageJsonScriptConfigSchema = z.object({
	name: WorkspaceScriptNameSchema,
	customScript: z.string().optional(),
	isIndexFile: z.boolean().optional().default(true),
	useBun: z.boolean().optional().default(true),
});

export type WorkspacePackageJsonScriptConfig = RequireExactlyOne<
	Partial<z.infer<typeof WorkspacePackageJsonScriptConfigSchema>>,
	"name"
>;

const createBunWrapper =
	(init: z.infer<typeof WorkspacePackageJsonScriptConfigSchema>) =>
	(inp: { derivedScript: string }) =>
		init.useBun
			? (`bun --bun ${inp.derivedScript}` as const)
			: (`bun ${inp.derivedScript}` as const);

function deriveScript(
	input: z.infer<typeof WorkspacePackageJsonScriptConfigSchema>,
): string {
	if (input.customScript) return input.customScript;

	const [LANGUAGE, ...REMAINING_SEGMENTS] = split(input.name, ":");

	if (!LANGUAGE)
		throw new Error(
			"Invalid script name - must be prefixed with a programming language [kotlin, swift, or typescript]",
		);

	const BASE_PATH = path.join(
		WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG[SdkLanguageSchema.parse(LANGUAGE)],
	);

	const wrapWithBun = createBunWrapper(input);

	if (input.isIndexFile) {
		return wrapWithBun({
			derivedScript: path.join(BASE_PATH, ...REMAINING_SEGMENTS, "index.ts"),
		});
	}

	const LAST_SEGMENT = REMAINING_SEGMENTS.pop();
	return wrapWithBun({
		derivedScript: path.join(
			BASE_PATH,
			...REMAINING_SEGMENTS,
			`${LAST_SEGMENT}.ts`,
		),
	});
}

export const WorkspacePackageJsonScriptValueSchema =
	WorkspacePackageJsonScriptConfigSchema.transform(deriveScript);

export type WorkspacePackageJsonScriptValue = z.infer<
	typeof WorkspacePackageJsonScriptValueSchema
>;
