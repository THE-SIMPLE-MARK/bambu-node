import { GCodeCommand } from "./GCodeCommand"
import { isGCodeLineCommand } from "../responses"

export class GCodeLineCommand extends GCodeCommand {
	/**
	 * Creates a raw GCode line command.
	 * @param gcodes The array of GCode commands to execute.
	 */
	public constructor(gcodes: string[]) {
		super(gcodes)
	}

	ownsResponse = isGCodeLineCommand
}
