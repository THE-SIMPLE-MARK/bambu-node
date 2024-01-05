import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"

export interface GCodeFileResponse extends PrintMessageCommand {
	command: "gcode_file"
	param: `${string}.code`
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}
