import { z } from 'zod';

export const AvailablePackagesSchema = z.enum([
  'axios',
  'faker-constant',
  'faker-random',
  'msw-constant',
  'msw-random',
  'zod',
  'fetch',
]);
