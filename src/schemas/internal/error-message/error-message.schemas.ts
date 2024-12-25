import { execSync } from "node:child_process";
import chalk from "chalk";
import osName from "os-name";
import { z } from "zod";
import { BUN_VERSION } from "../../../constants/bun-version.constants";
import { Logger } from "../../../utils/index.ts";

export const ErrorMessageSchema = z.union([
	z.instanceof(Error).transform((res) => res.message),
	z.object({ message: z.string() }).transform((res) => res.message),
	z.object({ stderr: z.string() }).transform((res) => res.stderr),
	z.string(),
]);

export const BunErrorMessageSchema = ErrorMessageSchema.catch((res) => {
	if (res.error.errors.some((err) => err.message.includes("not found"))) {
		try {
			execSync(`npm install -g bun@${BUN_VERSION}`, {
				stdio: "inherit",
			});
		} catch {
			if (osName().toLowerCase().includes("windows")) {
				try {
					execSync(`scoop install bun@${BUN_VERSION}`, {
						stdio: "inherit",
					});
				} catch {
					try {
						execSync(`powershell -c 'irm bun.sh/install.ps1|iex'`, {
							stdio: "inherit",
						});
					} catch (err) {
						console.error(err);

						Logger.error(
							`✗ Failed to install Bun - visit ${chalk.underline.blue("https://bun.sh")} to install Bun`,
						);

						process.exit(1);
					}
				}
			} else {
				try {
					execSync(
						`curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}"`,
					);
				} catch (err) {
					try {
						execSync(`brew install oven-sh/bun/bun@${BUN_VERSION}`);
					} catch (err) {
						console.error(err);
						Logger.error(
							`✗ Failed to install Bun - visit ${chalk.underline.blue("https://bun.sh")} to install Bun`,
						);
						process.exit(1);
					}
					console.error(err);
					Logger.error(
						`✗ Failed to install Bun - visit ${chalk.underline.blue("https://bun.sh")} to install Bun`,
					);
					process.exit(1);
				}
			}
		}
	}

	throw res;
});

export const ShellErrorOutputSchema = z
	.object({
		exitCode: z.number().int(),
		stdout: z.string(),
		stderr: z.string(),
	})
	.passthrough()
	.readonly();

export type ShellErrorOutput = z.infer<typeof ShellErrorOutputSchema>;
