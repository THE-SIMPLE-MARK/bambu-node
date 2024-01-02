import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isGCodeLineCommand } from "src/responses"

export class GCodeCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "gcode_line"
	public sequenceId: CommandInterface["sequenceId"] = 2006

	public constructor(gcode: string[]) {
		super({ param: gcode.join("\n") + "\n" })
	}

	public static ownsCommand = isGCodeLineCommand
}
