import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"

export interface ProjectFileCommand extends PrintMessageCommand {
	command: "project_file"
	/**
	 * The location of the project file.
	 */
	param: `Metadata/${string}.gcode`
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
	subtask_name: `${number}.3mf`
}

export function isProjectFileCommand(
	data: PrintMessageCommand
): data is ProjectFileCommand {
	return data.command === "project_file"
}
