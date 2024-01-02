import { PushAllCommand } from "src/responses"
import { PrintMessageCommand } from "./PrintMessage"

export interface PushStatusCommand extends Partial<PushAllCommand> {
	command: "push_status"
}

export function isPushStatusCommand(
	data: PrintMessageCommand
): data is PushStatusCommand {
	return data.command === "push_status" && Object.keys(data).length < 40
}
