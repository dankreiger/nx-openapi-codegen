import { describe, expect, it, jest, mock } from 'bun:test';
import { ZodError } from 'zod';
import { getNpmOrgName } from './get-npm-org-name.prompts';

const inputMock = jest.fn()

mock.module('@inquirer/prompts', () => ({
  input: inputMock,
}));

describe('getNpmOrgName', () => {
  it('should return the npm org name', async () => {
    inputMock.mockResolvedValueOnce('@test');
    const result = await getNpmOrgName();
    expect(result).toBe('@test');
  });

  it('should add @ prefix if missing', async () => {
    inputMock.mockResolvedValueOnce('test');
    const result = await getNpmOrgName();
    expect(result).toBe('@test');
  });

  it('should trim whitespace', async () => {
    inputMock.mockResolvedValueOnce('  @test  ');
    const result = await getNpmOrgName();
    expect(result).toBe('@test');
  });

  it('should throw an error if the input is invalid', async () => {
    inputMock.mockResolvedValueOnce('invalid/input');
    await expect(getNpmOrgName()).rejects.toThrowError(
      new ZodError([
        {
          validation: 'regex',
          code: 'invalid_string',
          message: 'Invalid npm org name',
          path: [],
        },
      ])
    );
  });
});
