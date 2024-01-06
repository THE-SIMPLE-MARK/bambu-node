import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { isGetVersionCommand } from "src/responses"

export class GetVersionCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "info"
	public command: CommandInterface["command"] = "get_version"

	ownsResponse = isGetVersionCommand
}
