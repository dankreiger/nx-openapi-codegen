## TODO

- [ ] consider making this a nicely written CLI, maybe with a nice scaffold using like [effect](https://effect.website/docs/getting-started/create-effect-app/#cli) that will provide good code quality, and a nice user experience with CLI flags expected of a CLI tool
- [ ] make generated monorepo agnostic ... currently it uses nx but it should just use bun workspaces
- [ ] add publishable GitHub packages to the release pipeline for Swift and Kotlin Android
- [ ] add stepwise gifs to readme showing various prompts
- [ ] use renovate bot with a script to update listed deps in src/constants/dependencies.constants.ts - right now they're hardcoded on a working version but over time this is obviously not what you want
