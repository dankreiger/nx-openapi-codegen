import { z } from "zod";

export const NxJsonSchema = z.object({
	implicitDependencies: z
		.record(z.any())
		.describe("Map of files to projects that implicitly depend on them.")
		.optional(),
	affected: z
		.object({
			defaultBase: z
				.string()
				.describe("Default based branch used by affected commands.")
				.optional(),
		})
		.strict()
		.describe("Default options for `nx affected`.")
		.optional(),
	defaultBase: z
		.string()
		.describe("Default --base used by affected logic.")
		.optional(),
	tasksRunnerOptions: z.record(z.any()).optional(),
	namedInputs: z
		.record(z.any())
		.describe("Named inputs used by inputs defined in targets")
		.optional(),
	targetDefaults: z.record(z.any()).describe("Target defaults").optional(),
	workspaceLayout: z
		.object({
			libsDir: z.string().describe("Default folder name for libs.").optional(),
			appsDir: z.string().describe("Default folder name for apps.").optional(),
		})
		.strict()
		.describe("Where new apps + libs should be placed.")
		.optional(),
	cli: z.any().optional(),
	generators: z.any().optional(),
	plugins: z
		.array(z.any())
		.describe("Plugins for extending the project graph.")
		.optional(),
	defaultProject: z
		.string()
		.describe(
			"Default project. When project isn't provided, the default project will be used.",
		)
		.optional(),
	nxCloudAccessToken: z
		.string()
		.describe(
			"The access token to use for nx-cloud. If set, the default tasks runner will be nx-cloud.",
		)
		.optional(),
	nxCloudUrl: z
		.string()
		.describe(
			"Specifies the url pointing to an instance of nx cloud. Used for remote caching and displaying run links.",
		)
		.optional(),
	nxCloudEncryptionKey: z
		.string()
		.describe(
			"Specifies the encryption key used to encrypt artifacts data before sending it to nx cloud.",
		)
		.optional(),
	neverConnectToCloud: z
		.boolean()
		.describe("Set this to true to disable all connections to Nx Cloud.")
		.optional(),
	parallel: z
		.number()
		.describe(
			"Specifies how many tasks are ran in parallel by Nx for the default tasks runner.",
		)
		.optional(),
	cacheDirectory: z
		.string()
		.describe("Specifies the default location of the cache directory.")
		.optional(),
	useDaemonProcess: z
		.boolean()
		.describe(
			"Specifies whether the daemon should be used for the default tasks runner.",
		)
		.optional(),
	useInferencePlugins: z
		.boolean()
		.describe(
			"Specifies whether to add inference plugins when generating new projects.",
		)
		.optional(),
	release: z
		.object({
			projects: z
				.any()
				.superRefine((x, ctx) => {
					const schemas = [
						z.string().describe("A project name"),
						z.array(z.string()).min(1).describe("An array of project names"),
					];
					const errors = schemas.reduce<z.ZodError[]>(
						(errors, schema) =>
							((result) =>
								result.error ? errors.concat(result.error) : errors)(
								schema.safeParse(x),
							),
						[],
					);
					if (schemas.length - errors.length !== 1) {
						ctx.addIssue({
							path: ctx.path,
							code: "invalid_union",
							unionErrors: errors,
							message: "Invalid input: Should pass single schema",
						});
					}
				})
				.optional(),
			groups: z
				.record(
					z.object({
						projectsRelationship: z.enum(["fixed", "independent"]).optional(),
						projects: z.any().superRefine((x, ctx) => {
							const schemas = [
								z.string().describe("A project name"),
								z
									.array(z.string())
									.min(1)
									.describe("An array of project names"),
							];
							const errors = schemas.reduce<z.ZodError[]>(
								(errors, schema) =>
									((result) =>
										result.error ? errors.concat(result.error) : errors)(
										schema.safeParse(x),
									),
								[],
							);
							if (schemas.length - errors.length !== 1) {
								ctx.addIssue({
									path: ctx.path,
									code: "invalid_union",
									unionErrors: errors,
									message: "Invalid input: Should pass single schema",
								});
							}
						}),
						version: z.any().optional(),
						changelog: z
							.any()
							.superRefine((x, ctx) => {
								const schemas = [z.any(), z.boolean()];
								const errors = schemas.reduce<z.ZodError[]>(
									(errors, schema) =>
										((result) =>
											result.error ? errors.concat(result.error) : errors)(
											schema.safeParse(x),
										),
									[],
								);
								if (schemas.length - errors.length !== 1) {
									ctx.addIssue({
										path: ctx.path,
										code: "invalid_union",
										unionErrors: errors,
										message: "Invalid input: Should pass single schema",
									});
								}
							})
							.optional(),
						releaseTagPattern: z.string().optional(),
						versionPlans: z
							.any()
							.superRefine((x, ctx) => {
								const schemas = [
									z.any(),
									z
										.boolean()
										.describe(
											"Enables using version plans as a specifier source for versioning and to determine changes for changelog generation.",
										),
								];
								const errors = schemas.reduce<z.ZodError[]>(
									(errors, schema) =>
										((result) =>
											result.error ? errors.concat(result.error) : errors)(
											schema.safeParse(x),
										),
									[],
								);
								if (schemas.length - errors.length !== 1) {
									ctx.addIssue({
										path: ctx.path,
										code: "invalid_union",
										unionErrors: errors,
										message: "Invalid input: Should pass single schema",
									});
								}
							})
							.optional(),
					}),
				)
				.optional(),
			changelog: z
				.object({
					workspaceChangelog: z
						.any()
						.superRefine((x, ctx) => {
							const schemas = [z.any(), z.boolean()];
							const errors = schemas.reduce<z.ZodError[]>(
								(errors, schema) =>
									((result) =>
										result.error ? errors.concat(result.error) : errors)(
										schema.safeParse(x),
									),
								[],
							);
							if (schemas.length - errors.length !== 1) {
								ctx.addIssue({
									path: ctx.path,
									code: "invalid_union",
									unionErrors: errors,
									message: "Invalid input: Should pass single schema",
								});
							}
						})
						.optional(),
					projectChangelogs: z
						.any()
						.superRefine((x, ctx) => {
							const schemas = [z.any(), z.boolean()];
							const errors = schemas.reduce<z.ZodError[]>(
								(errors, schema) =>
									((result) =>
										result.error ? errors.concat(result.error) : errors)(
										schema.safeParse(x),
									),
								[],
							);
							if (schemas.length - errors.length !== 1) {
								ctx.addIssue({
									path: ctx.path,
									code: "invalid_union",
									unionErrors: errors,
									message: "Invalid input: Should pass single schema",
								});
							}
						})
						.optional(),
					automaticFromRef: z
						.boolean()
						.describe(
							"Whether or not to automatically look up the first commit for the workspace (or package, if versioning independently) and use that as the starting point for changelog generation. If this is not enabled, changelog generation will fail if there is no previous matching git tag to use as a starting point.",
						)
						.optional(),
					git: z.any().optional(),
				})
				.optional(),
			conventionalCommits: z.any().optional(),
			projectsRelationship: z.enum(["fixed", "independent"]).optional(),
			git: z.any().optional(),
			version: z.any().optional(),
			versionPlans: z
				.any()
				.superRefine((x, ctx) => {
					const schemas = [
						z.any(),
						z
							.boolean()
							.describe(
								"Enables using version plans as a specifier source for versioning and to determine changes for changelog generation.",
							),
					];
					const errors = schemas.reduce<z.ZodError[]>(
						(errors, schema) =>
							((result) =>
								result.error ? errors.concat(result.error) : errors)(
								schema.safeParse(x),
							),
						[],
					);
					if (schemas.length - errors.length !== 1) {
						ctx.addIssue({
							path: ctx.path,
							code: "invalid_union",
							unionErrors: errors,
							message: "Invalid input: Should pass single schema",
						});
					}
				})
				.optional(),
			releaseTagPattern: z.string().optional(),
		})
		.strict()
		.describe("Configuration for the nx release commands.")
		.optional(),
	sync: z
		.object({
			globalGenerators: z
				.array(z.string())
				.describe(
					"List of workspace-wide sync generators to be run (not attached to targets)",
				)
				.optional(),
			generatorOptions: z
				.record(z.record(z.any()))
				.describe("Options for the sync generators.")
				.optional(),
			applyChanges: z
				.boolean()
				.describe(
					"Whether to automatically apply sync generator changes when running tasks. If not set, the user will be prompted. If set to `true`, the user will not be prompted and the changes will be applied. If set to `false`, the user will not be prompted and the changes will not be applied.",
				)
				.optional(),
			disabledTaskSyncGenerators: z
				.array(z.string())
				.describe("List of registered task sync generators to disable.")
				.optional(),
		})
		.strict()
		.describe("Configuration for the `nx sync` command")
		.optional(),
});

export type NxJson = z.infer<typeof NxJsonSchema>;
