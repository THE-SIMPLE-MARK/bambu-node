import { GCodeCommand, GCodeCommandParam } from "./GCodeCommand"
import type { NumberRange } from "src/types"
import { isUpdateTempCommand } from "src/responses"

enum TempUpdatePartType {
	BED = "M140",
	EXTRUDER = "M104",
}

export class UpdateTempCommand extends GCodeCommand {
	public command: GCodeCommandParam = "gcode_line"

	public constructor({
		part,
		temperature,
	}: {
		part: TempUpdatePartType
		temperature: NumberRange<0, 300>
	})
	public constructor({
		part,
		temperature,
	}: {
		part: TempUpdatePartType
		temperature: NumberRange<0, 100>
	})

	/**
	 * Constructs a `print.gcode_line` command, which is able to change the target temperatures of the different components of the printer.
	 * @param part The part to change the target temperature of.
	 * @param temperature The new target temperature in Celsius.
	 */
	public constructor({
		part,
		temperature,
	}: {
		part: TempUpdatePartType
		temperature: NumberRange<0, 100> | NumberRange<0, 300>
	}) {
		super([`${part} S${temperature}`])
	}

	ownsResponse = isUpdateTempCommand
}
