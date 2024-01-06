import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isPushAllCommand } from "src/responses"

export class PushAllCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "pushing"
	public command: CommandInterface["command"] = "pushall"

	/**
	 * Constructs a new `pushing.pushall` command, which gets all properties from the printer.
	 * @version
	 *  - X1 series: Already sends `pushing.pushall` responses automatically every ~2 secs.
	 *  - Other series: Only sends partial responses of `pushing.pushall` with only the values that have changed since the last response.
	 */
	constructor() {
		super()
	}

	ownsResponse = isPushAllCommand
}
