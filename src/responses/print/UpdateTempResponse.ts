import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"

export interface UpdateTempResponse extends PrintMessageCommand {
	command: "gcode_line"
	param: string
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isUpdateTempCommand(
	data: PrintMessageCommand
): data is UpdateTempResponse {
	return (
		data.command === "gcode_line" &&
		Boolean(data?.param?.startsWith("M104") || data?.param?.startsWith("M140"))
	)
}
