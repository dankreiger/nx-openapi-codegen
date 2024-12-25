import { z } from "zod";

export const SdkLanguageSchema = z.enum(["swift", "kotlin", "typescript"]);

export type SdkLanguage = z.infer<typeof SdkLanguageSchema>;
