import { GCodeCommand } from "./GCodeCommand"
import type { NumberRange } from "src/types"
import { isUpdateTempCommand } from "src/responses/print/UpdateTempResponse"

export class UpdateTempCommand extends GCodeCommand {
	public constructor(part: "extruder", temperature: NumberRange<0, 300>)
	public constructor(part: "bed", temperature: NumberRange<0, 100>)
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

	public static ownsResponse = isUpdateTempCommand
}
