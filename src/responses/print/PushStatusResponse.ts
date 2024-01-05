import { PushAllResponse } from "src/responses"
import { PrintMessageCommand } from "./PrintMessage"

export interface PushStatusResponse extends Partial<PushAllResponse> {
	command: "push_status"
}

export function isPushStatusCommand(
	data: PrintMessageCommand
): data is PushStatusResponse {
	return data.command === "push_status" && Object.keys(data).length < 40
}
