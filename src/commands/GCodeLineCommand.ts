import { GCodeCommand, GCodeCommandParam } from "./GCodeCommand"
import { isGCodeLineCommand } from "src/responses"

export class GCodeLineCommand extends GCodeCommand {
	public command: GCodeCommandParam = "gcode_line"

	/**
	 * Creates a raw GCode line command, which executes an array of GCode instructions on the printer.
	 * @param gcodes The array of GCode instructions to execute.
	 */
	public constructor(gcodes: string[]) {
		super(gcodes)
	}

	ownsResponse = isGCodeLineCommand
}
