import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"

export interface GCodeFileResponse extends PrintMessageCommand {
	command: "gcode_file"
	param: `${string}.code`
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isGcodeFileCommand(data: PrintMessageCommand): data is GCodeFileResponse {
	return data.command === "gcode_file"
}
