import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isUpdateStateCommand } from "src/responses"

const sequenceMap = { pause: 2008, resume: 2009, stop: 2010 }
export type State = "pause" | "resume" | "stop"

export class UpdateStateCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"]

	/**
	 * Constructs a `print.print_speed` command, which is able to change the state of the printer, aka stop, resume or pause it.
	 * @param state {State} The new state of the printer.
	 */
	public constructor(state: State) {
		super()
		this.command = state
		this.sequenceId = sequenceMap[state]
	}

	ownsResponse = isUpdateStateCommand
}
