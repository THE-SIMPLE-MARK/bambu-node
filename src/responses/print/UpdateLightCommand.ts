import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"
import { PushStatusCommand } from "./PushStatusCommand"
import { LightReport } from "./PushAllCommand"

export interface UpdateLightCommand extends PushStatusCommand {
	param: string
	lights_report: LightReport[]
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isUpdateLightCommand(
	data: PrintMessageCommand
): data is UpdateLightCommand {
	return data.command === "push_status" && data.hasOwnProperty("lights_report")
}
