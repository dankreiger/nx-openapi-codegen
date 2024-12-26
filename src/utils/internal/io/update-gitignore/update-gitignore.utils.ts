import { appendFile } from "node:fs/promises";

const KOTLIN_PATH = "./packages/kotlin";
const file = Bun.file(KOTLIN_PATH);

export const updateGitignore = async () => {
	if (await file.exists()) {
		await appendFile(
			`${KOTLIN_PATH}/.gitignore`,
			`
  .gradle
  **/build/
  !src/**/build/
  
  # Ignore Gradle GUI config
  gradle-app.setting
  
  # Avoid ignoring Gradle wrapper jar file (.jar files are usually ignored)
  !gradle-wrapper.jar
  
  # Avoid ignore Gradle wrappper properties
  !gradle-wrapper.properties
  
  # Cache of project
  .gradletasknamecache
  
  # Eclipse Gradle plugin generated files
  # Eclipse Core
  .project
  # JDT-specific (Eclipse Java Development Tools)
  .classpath
  `,
		);
	}
};
