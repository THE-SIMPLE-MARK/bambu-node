import { GCodeCommand } from "./GCodeCommand"
import type { NumberRange } from "src/types"
import { isUpdateFanCommand } from "src/responses/print/UpdateFanCommand"

interface Fans {
	big_1: NumberRange<0, 100>
	big_2: NumberRange<0, 100>
	cooling: NumberRange<0, 100>
	heatbreak: NumberRange<0, 100>
}

export class UpdateFanCommand extends GCodeCommand {
	public constructor(fan: keyof Fans, percent: Fans[keyof Fans]) {
		let fanId = ""
		switch (fan) {
			case "cooling": // part cooling fan
				fanId = "P1"
				break
			case "big_1": // aux fan
				fanId = "P2"
				break
			case "big_2":
				fanId = "P3"
				break
			default:
				throw new Error("Unknown fan!")
		}

		super([`M106 ${fanId} S${(255 * percent) / 100}`])
	}

	public static ownsResponse = isUpdateFanCommand
}
