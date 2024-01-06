import { GCodeCommand, GCodeCommandParam } from "./GCodeCommand"
import type { NumberRange, ValueOf } from "src/types"
import { isUpdateFanCommand } from "src/responses"

export enum Fan {
	PART_COOLING_FAN = 1,
	AUXILIARY_FAN = 2,
	CHAMBER_FAN = 3,
}

export class UpdateFanCommand extends GCodeCommand {
	public command: GCodeCommandParam = "gcode_line"

	/**
	 * Constructs a `print.gcode_line` command, which is able to update the current speeds of every fan on the printer.
	 * @param fan {Fan} The fan's speed to update.
	 * @param percent {NumberRange<0, 100>} The fan's new speed in % (0-100)
	 */
	public constructor(fan: Fan, percent: NumberRange<0, 100>) {
		// check if the given number is not in the enum
		if (!Object.values(Fan).includes(fan))
			throw new Error("An unknown fan was specified!")

		super([`M106 P${fan.toString()} S${(255 * percent) / 100}`])
	}

	ownsResponse = isUpdateFanCommand
}
