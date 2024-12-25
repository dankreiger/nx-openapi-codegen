import { z } from "zod";
import { AvailablePackagesSchema } from "../available-packages/index.ts";
import { FilePathSchema } from "../file-path/index.ts";

export const MonorepoConfigByLanguageSchema = z
	.discriminatedUnion("language", [
		z.object({
			language: z.literal("typescript"),
			codegenConfigsDirectoryPath: FilePathSchema,
			rtkCodegenOffsetPathToWorkspaceRoot: FilePathSchema,
			selectedTypescriptSdks: z.array(AvailablePackagesSchema).readonly(),
			packagesDirectoryPath: FilePathSchema,
		}),
		z.object({
			language: z.literal("swift"),
			codegenConfigsDirectoryPath: FilePathSchema,
			packagesDirectoryPath: FilePathSchema,
		}),
		z.object({
			language: z.literal("kotlin"),
			codegenConfigsDirectoryPath: FilePathSchema,
			packagesDirectoryPath: FilePathSchema,
		}),
	])
	.readonly();
