import type { z } from 'zod';
import type { ShellErrorOutputSchema } from '../../schemas';

export type ShellError = z.infer<typeof ShellErrorOutputSchema>;
