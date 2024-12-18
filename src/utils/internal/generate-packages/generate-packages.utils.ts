import { $ } from 'bun';
import type { MonorepoConfig } from '../../../types';
import { getTags } from '../get-tags';

export async function generatePackages(config: MonorepoConfig) {
  const { npmOrgName, packagesBaseDir, selectedPackages } = config;


  for (const folder of selectedPackages) {
    const PACKAGE_NAME = `${npmOrgName}/${folder}` as const;

    console.log(
      `\nGenerating library for: ${folder} with prefix: ${npmOrgName}\n`
    );

    await $`bunx nx generate @nx/js:library \
      --directory=${packagesBaseDir}/${folder} \
      --importPath=${PACKAGE_NAME} \
      --name=${PACKAGE_NAME} \
      --publishable=true \
      --unitTestRunner=none \
      --linter=none \
      --tags=${getTags([folder])} \
      --no-interactive`;

    await $`bunx nx g @gitopslovers/nx-biome:configuration --project ${PACKAGE_NAME}`;

    console.log(`\nDone generating: ${folder}`);
  }
}
