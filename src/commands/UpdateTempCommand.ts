import { GCodeCommand } from "./GCodeCommand"
import type { IntRange } from "src/types"
import { isUpdateTempCommand } from "src/responses/print/UpdateTempCommand"

export class UpdateTempCommand extends GCodeCommand {
	public constructor(part: "extruder", temperature: IntRange<0, 301>)
	public constructor(part: "bed", temperature: IntRange<0, 101>)
	public constructor(
		part: "bed" | "extruder",
		temperature: IntRange<0, 101> | IntRange<0, 301>
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
