import sortKeys from "sort-keys";
import type { TsConfigJson } from "type-fest";

export async function updateTsconfigJson(input: {
	transform: (tsconfigJson: TsConfigJson) => TsConfigJson;
	tsconfigPath: `${string}/tsconfig${".base" | ".lib" | ".spec" | ".docs" | ""}.json`;
}) {
	const { transform, tsconfigPath = `${process.cwd()}/tsconfig.json` } = input;

	await Bun.write(
		tsconfigPath,
		JSON.stringify(
			sortKeys(
				transform((await Bun.file(tsconfigPath).json()) as TsConfigJson),
				{ deep: true },
			),
			null,
			2,
		),
	);
}

export const updateTsconfigJsonBase = () =>
	updateTsconfigJson({
		tsconfigPath: "./tsconfig.base.json",
		transform: () => ({
			compilerOptions: {
				lib: ["DOM", "DOM.Iterable", "ES2023"],
				module: "NodeNext",
				moduleResolution: "NodeNext",
				noEmit: true,
			},
		}),
	});
