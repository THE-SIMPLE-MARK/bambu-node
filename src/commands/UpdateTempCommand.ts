import { GCodeCommand, GCodeCommandParam } from "./GCodeCommand"
import type { NumberRange } from "src/types"
import { isUpdateTempCommand } from "src/responses"

export class UpdateTempCommand extends GCodeCommand {
	public command: GCodeCommandParam = "gcode_line"

	public constructor(part: "extruder", temperature: NumberRange<0, 300>)
	public constructor(part: "bed", temperature: NumberRange<0, 100>)

	/**
	 * Constructs a `print.gcode_line` command, which is able to change the target temperatures of the different components of the printer.
	 * @param part The part to change the target temperature of.
	 * @param temperature The new target temperature in Celsius.
	 */
	public constructor(
		part: "bed" | "extruder",
		temperature: NumberRange<0, 100> | NumberRange<0, 300>
	) {
		let GCode = ""
		switch (part) {
			case "bed":
				GCode = "M140"
				break
			case "extruder":
				GCode = "M104"
				break
			default:
				throw new Error("Part not found!")
		}

		super([`${GCode} S${temperature}`])
	}

	ownsResponse = isUpdateTempCommand
}
