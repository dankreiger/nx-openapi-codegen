import { input } from '@inquirer/prompts';
import { NpmScopeSchema } from '../../../schemas';

/**
 * @returns The npm org name
 * @description This is the name of the npm organization
 * @default @my-org
 */
export async function getNpmOrgName() {
  return NpmScopeSchema.parse(
    await input({
      message: 'Enter the product prefix:',
      default: '@my-org',
    })
  );
}
