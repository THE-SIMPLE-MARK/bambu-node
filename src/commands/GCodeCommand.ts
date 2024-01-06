import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"

export abstract class GCodeCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "gcode_line"
	public sequenceId: CommandInterface["sequenceId"] = 2006

	protected constructor(gcode: string[]) {
		super({ param: gcode.join("\n") + "\n" })
	}
}
