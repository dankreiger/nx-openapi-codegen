import path from "node:path";
import { z } from "zod";

/**
 * Define a Zod-branded type for file paths.
 */
export const FilePathSchema = z
	.string()
	.transform((input) => path.normalize(input).trim()) // Normalize the path
	.refine(
		(normalized) => /^[a-zA-Z0-9._\-\/:\\]+$/.test(normalized), // Validate allowed characters
		"Invalid file path: contains forbidden characters.",
	)
	.brand<"FilePath">(); // Brand the validated value as `FilePath`

/**
 * Type alias for a valid file path.
 */
type FilePath = z.infer<typeof FilePathSchema>;

/**
 * Function to validate a file path at runtime.
 */
export function parseFilePath(input: string): FilePath {
	return FilePathSchema.parse(input);
}
