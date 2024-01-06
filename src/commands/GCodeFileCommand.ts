import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isGcodeFileCommand, isPushAllCommand } from "src/responses"

export class PushAllCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "gcode_file"
	public sequenceId: CommandInterface["sequenceId"] = 1

	/**
	 * Constructs a new GCode file command.
	 * @param fileName The file name of the GCode to execute on the printer. (on the printer's filesystem)
	 */
	public constructor(fileName: string) {
		super({ param: fileName })
	}

	ownsResponse = isGcodeFileCommand
}
