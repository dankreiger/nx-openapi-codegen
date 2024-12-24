import { statSync } from "node:fs";
import { z } from "zod";
import { parseFilePath } from "../file-path/index.ts";

export const ExistingFilePathSchema = z.preprocess(
	(value) => {
		return {
			path: parseFilePath(typeof value === "string" ? value : ""),
		};
	},
	z
		.string({
			required_error: "File path is required",
			invalid_type_error: "File path must be a string",
		})
		.min(1, { message: "File path cannot be empty" })
		.superRefine((value, ctx) => {
			try {
				const stats = statSync(value);
				if (!stats.isFile()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Path exists but is not a file: ${value}`,
					});
				}
			} catch {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `File does not exist: ${value}`,
				});
			}
		}),
);
