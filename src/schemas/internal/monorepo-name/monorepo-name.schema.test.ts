import { describe, expect, test } from "bun:test";
import { MonorepoNameSchema } from './monorepo-name.schema';

describe('MonorepoNameSchema', () => {
  test('should accept valid monorepo names', () => {
    const validNames = ['my-repo', 'test_repo', 'repo123'];
    for (const name of validNames) {
      expect(() => MonorepoNameSchema.parse(name)).not.toThrow();
    }
  });

  test('should reject invalid monorepo names', () => {
    const invalidNames = ['my repo', 'test@repo', 'repo/123'];
    for (const name of invalidNames) {
      expect(() => MonorepoNameSchema.parse(name)).toThrow();
    }
  });
});
