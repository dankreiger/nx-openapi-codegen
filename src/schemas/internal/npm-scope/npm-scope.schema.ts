import { z } from 'zod';

export const NpmScopeSchema = z
  .string()
  .trim()
  .transform((val) => (!val.startsWith('@') ? `@${val}` : val))
  .pipe(z.string().regex(/^@[a-zA-Z0-9_-]+$/, 'Invalid npm org name'))
  .readonly();
