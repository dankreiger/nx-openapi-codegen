import { z } from "zod";

export const ShellErrorOutputSchema = z
	.object({
		exitCode: z.number().int(),
		stdout: z.string(),
		stderr: z.string(),
	})
	.passthrough()
	.readonly();

export type ShellErrorOutput = z.infer<typeof ShellErrorOutputSchema>;
