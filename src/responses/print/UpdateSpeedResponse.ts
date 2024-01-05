import type { PrintMessageCommand } from "./PrintMessage"
import type { NumberRange, StringNumber } from "src/types"
import { PushStatusResponse } from "./PushStatusResponse"
import { SpeedLevel } from "./PushAllResponse"

export interface UpdateSpeedResponse extends PushStatusResponse {
	param: string
	spd_lvl: SpeedLevel
	spd_mag: NumberRange<50, 166>
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isUpdateSpeedCommand(
	data: PrintMessageCommand
): data is UpdateSpeedResponse {
	return (
		data.command === "push_status" &&
		(data.hasOwnProperty("spd_lvl") || data.hasOwnProperty("spd_mag"))
	)
}
