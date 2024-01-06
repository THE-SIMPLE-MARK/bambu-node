import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"

export type GCodeCommandParam = "gcode_file" | "gcode_line"

export abstract class GCodeCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public abstract command: GCodeCommandParam

	/**
	 * Constructs a basic `print.gcode_file` or `print.gcode_line` command, which must be extended first to use.
	 * @param gcode The array of Gcode instructions to execute. Implementation can be overridden if using with `gcode_file`.
	 * @protected
	 */
	protected constructor(gcode: string[]) {
		super({ param: gcode.join("\n") + "\n" })
	}
}
