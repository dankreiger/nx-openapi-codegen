import { z } from "zod";

export const MonorepoNameSchema = z
	.string()
	.trim()
	.regex(/^[a-zA-Z0-9_-]+$/);
