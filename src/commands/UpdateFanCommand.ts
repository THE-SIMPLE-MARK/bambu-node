import { GCodeCommand } from "./GCodeCommand"
import type { IntRange } from "src/types"

const fanMap = { cooling: "P1", big_1: "P2", big_2: "P3" }

interface Fans {
	big_1: IntRange<0, 100>
	big_2: IntRange<0, 100>
	cooling: IntRange<0, 100>
	heatbreak: IntRange<0, 100>
	gear: number
}

export class UpdateFanCommand extends GCodeCommand {
	public constructor(fan: keyof Fans, percent: IntRange<0, 101>) {
		console.log(fan, fanMap, fan in fanMap)

		if (!(fan in fanMap)) {
			throw new Error("Cannot set this fan speed.")
		}

		super([`M106 ${fanMap[fan as keyof typeof fanMap]} S${(255 * percent) / 100}`])
	}
}
