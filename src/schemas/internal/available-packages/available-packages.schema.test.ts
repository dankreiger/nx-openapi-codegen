import { describe, expect, it } from 'bun:test';
import { AvailablePackagesSchema } from '../available-packages/available-packages.schema';

describe('AvailablePackagesSchema', () => {
  it('should accept valid package names', () => {
    const validPackages = [
      'axios',
      'faker-constant',
      'faker-random',
      'msw-constant',
      'msw-random',
      'zod',
      'fetch',
    ];

    for (const pkg of validPackages) {
      expect(() => AvailablePackagesSchema.parse(pkg)).not.toThrow();
    }
  });

  it('should reject invalid package names', () => {
    expect(() => AvailablePackagesSchema.parse('invalid-package')).toThrow();
  });
});
