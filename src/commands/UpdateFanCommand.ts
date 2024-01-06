import { GCodeCommand, GCodeCommandParam } from "./GCodeCommand"
import type { NumberRange, ValueOf } from "src/types"
import { isUpdateFanCommand } from "src/responses"

interface Fans {
	big_1: NumberRange<0, 100>
	big_2: NumberRange<0, 100>
	cooling: NumberRange<0, 100>
	heatbreak: NumberRange<0, 100>
}

export class UpdateFanCommand extends GCodeCommand {
	public command: GCodeCommandParam = "gcode_line"

	/**
	 * Constructs a `print.gcode_line` command, which is able to update the current speeds of every fan on the printer.
	 * @param fan {Fans} The fan's speed to update.
	 * @param percent {ValueOf<Fans>} The fan's new speed in % (0-100)
	 */
	public constructor(fan: keyof Fans, percent: ValueOf<Fans>) {
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

	ownsResponse = isUpdateFanCommand
}
