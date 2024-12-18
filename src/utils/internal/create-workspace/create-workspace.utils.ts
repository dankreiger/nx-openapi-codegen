import { $ } from 'bun';
import type { MonorepoConfig } from '../../../types';
import { prepareRootPackageJson } from '../prepare-root-package-json';

export async function createWorkspace(config: MonorepoConfig) {
  const { repoName } = config;

  await $`bunx create-nx-workspace@latest ${repoName} \
    --preset=ts \
    --formatter=none \
    --linter=none \
    --strict=true \
    --nxCloud=skip \
    --pm=bun \
    --useGitHub=true`;


  process.chdir(repoName);

  // Add @nx/js to the workspace
  await $`bunx nx add @nx/js --save-exact`;

  // Install dev dependencies
  await $`bun add -D @gitopslovers/nx-biome tslib @nx/devkit --save-exact`;

  // Prepare root package.json
  await prepareRootPackageJson();
}
