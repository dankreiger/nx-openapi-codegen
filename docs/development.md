

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

To release:

Ensure you have a `.env.local` file with the `GITHUB_TOKEN` environment variable.

## Publishing

The package is automatically published to NPM when pushing to the main branch. The workflow:

1. Commits are made using conventional commits (`bun run commit`)
2. Push to main triggers the release workflow
3. release-it creates a new version based on conventional commits
4. A new GitHub release is created
5. The package is published to NPM

