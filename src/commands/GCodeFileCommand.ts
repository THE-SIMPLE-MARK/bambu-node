import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isGcodeFileCommand } from "src/responses"

export class GCodeFileCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "gcode_file"

	/**
	 * Constructs a new GCode file command, which executes a GCode file on the printer's filesystem.
	 * @param fileName The file name of the GCode to execute on the printer. (on the printer's filesystem)
	 */
	public constructor(fileName: string) {
		super({ param: fileName })
	}

	ownsResponse = isGcodeFileCommand
}
