import { describe, expect, mock, test } from "bun:test";
import { getPackagesBaseDir } from './get-packages-base-dir.prompts';


describe('getPackagesBaseDir', () => {
  test('should return default value if empty', async () => {
 
    const result = await getPackagesBaseDir();
    expect(result).toBe('packages');
  });

  test('should return custom directory', async () => {
    mock.module('@inquirer/prompts', () => ({
      input: mock(() => Promise.resolve('libs'))
    }));
    const result = await getPackagesBaseDir();
    expect(result).toBe('libs');
  });
}); 
