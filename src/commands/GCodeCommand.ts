import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"

export type GCodeCommandParam = "gcode_file" | "gcode_line"

export abstract class GCodeCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public abstract command: GCodeCommandParam

	protected constructor(gcode: string[]) {
		super({ param: gcode.join("\n") + "\n" })
	}
}
