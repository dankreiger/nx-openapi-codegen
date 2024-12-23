import { exec } from "node:child_process";
import { promisify } from "node:util";
import { BunErrorMessageSchema } from "../../../../schemas/internal/index.ts";
import { Logger } from "../logger/index.ts";

const execAsync = promisify(exec);

const getBunCommand = () => {
	// Windows needs .cmd extension when executing from Node
	if (process.platform === "win32") {
		return "bun.cmd";
	}
	return "bun";
};

export const checkBunInstallation = async () => {
	try {
		const bunCmd = getBunCommand();
		const result = await execAsync(`${bunCmd} --version`);
		return BunErrorMessageSchema.safeParse(result);
	} catch (err) {
		Logger.error(`Failed to execute Bun command: ${err}`);
		return BunErrorMessageSchema.safeParse(err);
	}
};
