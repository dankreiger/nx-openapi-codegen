import chalk from "chalk";
export const Logger = {
	doneGenerating: (subject: string, info?: Record<string, unknown>) =>
		console.log(
			chalk.green(`\n✓ Done generating: ${chalk.bold.white(subject)}`),
			info ? chalk.yellow(JSON.stringify(info, null, 2)) : "",
		),
	info: (message: string, info?: Record<string, unknown>) =>
		console.log(
			chalk.blue(`ℹ ${message}`),
			info ? chalk.yellow(JSON.stringify(info, null, 2)) : "",
		),
	success: (message: string, info?: Record<string, unknown>) =>
		console.log(
			chalk.green(`✓ ${message}\n`),
			info ? chalk.yellow(JSON.stringify(info, null, 2)) : "",
		),
	error: (message: string, info?: Record<string, unknown>) =>
		console.log(
			`✗ ${message}`,
			info ? chalk.yellow(JSON.stringify(info, null, 2)) : "",
		),
};
