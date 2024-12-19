import { z } from "zod";

export const BaseDirSchema = z.string().trim().default("packages");
