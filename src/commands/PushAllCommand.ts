import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isPushAllCommand } from "src/responses"

export class PushAllCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "pushing"
	public command: CommandInterface["command"] = "pushall"
	public sequenceId: CommandInterface["sequenceId"] = 1

	public static ownsCommand = isPushAllCommand
}
