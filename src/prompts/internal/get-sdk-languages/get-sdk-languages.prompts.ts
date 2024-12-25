import { checkbox } from "@inquirer/prompts";
import { type SdkLanguage, SdkLanguageSchema } from "../../../schemas/index.ts";

export async function getSdkLanguages(): Promise<SdkLanguage[]> {
	return checkbox({
		message: "Enter the languages to generate SDKs for:",
		choices: SdkLanguageSchema.options,
		required: true,
	});
}
