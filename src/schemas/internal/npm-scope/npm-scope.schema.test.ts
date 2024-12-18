import { describe, expect, it } from 'bun:test';
import { NpmScopeSchema } from '../npm-scope/npm-scope.schema';

describe('NpmScopeSchema', () => {
  it('should add @ prefix if missing', () => {
    expect(NpmScopeSchema.parse('my-org')).toBe('@my-org');
  });

  it('should keep @ prefix if present', () => {
    expect(NpmScopeSchema.parse('@my-org')).toBe('@my-org');
  });

  it('should trim whitespace', () => {
    expect(NpmScopeSchema.parse('  my-org  ')).toBe('@my-org');
    expect(NpmScopeSchema.parse('  @my-org  ')).toBe('@my-org');
  });
});
