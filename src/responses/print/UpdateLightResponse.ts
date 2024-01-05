import type { PrintMessageCommand } from "./PrintMessage"
import type { StringNumber } from "src/types"
import { PushStatusResponse } from "./PushStatusResponse"
import { LightReport } from "./PushAllResponse"

export interface UpdateLightResponse extends PushStatusResponse {
	param: string
	lights_report: LightReport[]
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isUpdateLightCommand(
	data: PrintMessageCommand
): data is UpdateLightResponse {
	return data.command === "push_status" && data.hasOwnProperty("lights_report")
}
