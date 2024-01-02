import type { PrintMessageCommand } from "./PrintMessage"
import type { IntRange, StringNumber } from "src/types"
import { PushStatusCommand } from "./PushStatusCommand"
import { SpeedLevel } from "./PushAllCommand"

export interface UpdateSpeedCommand extends PushStatusCommand {
	param: string
	spd_lvl: SpeedLevel
	spd_mag: IntRange<50, 201>
	reason: "SUCCESS" | "FAILURE" | string
	result: "SUCCESS" | "FAILURE" | string
	sequence_id: StringNumber
}

export function isUpdateSpeedCommand(
	data: PrintMessageCommand
): data is UpdateSpeedCommand {
	return (
		data.command === "push_status" &&
		(data.hasOwnProperty("spd_lvl") || data.hasOwnProperty("spd_mag"))
	)
}
