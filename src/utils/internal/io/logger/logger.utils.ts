import chalk from "chalk";
export const Logger = {
	doneGenerating: (subject: string) =>
		console.log(
			chalk.green(`\n✓ Done generating: ${chalk.bold.white(subject)}`),
		),
	success: (message: string) => console.log(chalk.green(`✓ ${message}\n`)),

	error: (message: string) => console.log(`✗ ${message}`),
};
