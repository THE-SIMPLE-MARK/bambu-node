import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"
import { State } from "src/commands/UpdateStateCommand"

export interface UpdateStateCommand extends PrintMessageCommand {
	command: State
	param: string
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isUpdateStateCommand(
	data: PrintMessageCommand
): data is UpdateStateCommand {
	return data.command === <State>data.command
}
