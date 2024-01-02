import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isGetVersionCommand } from "src/responses"

export class GetVersionCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "info"
	public command: CommandInterface["command"] = "get_version"
	public sequenceId: CommandInterface["sequenceId"] = 20_004

	public static ownsCommand = isGetVersionCommand
}
