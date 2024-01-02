import type { PrintMessageCommand } from "./PrintMessage"
import { StringNumber } from "src/types"

export interface GCodeLineCommand extends PrintMessageCommand {
	command: "gcode_line"
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	return_code: StringNumber
	sequence_id: StringNumber
}

export function isGCodeLineCommand(data: PrintMessageCommand): data is GCodeLineCommand {
	return data.command === "gcode_line"
}
