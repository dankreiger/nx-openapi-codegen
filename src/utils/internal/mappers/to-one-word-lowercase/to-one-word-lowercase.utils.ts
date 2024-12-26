import { toLowerCase } from "strong-string";

export function toOneWordLowerCase(str: string) {
	return toLowerCase(str).replaceAll("-", "").replaceAll("_", "");
}
