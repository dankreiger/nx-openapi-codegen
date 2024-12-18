import { input } from '@inquirer/prompts';
import { MonorepoNameSchema } from '../../../schemas/internal/monorepo-name/monorepo-name.schema';

export async function getMonorepoName() {
  return MonorepoNameSchema.parse(
    await input({
      message: 'Enter the monorepo name:',
      default: 'my-monorepo',
    })
  );
}
