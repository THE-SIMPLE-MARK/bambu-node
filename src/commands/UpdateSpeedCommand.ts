import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { SpeedLevel } from "src/responses"
import { isUpdateSpeedCommand } from "src/responses/print/UpdateSpeedResponse"

export class UpdateSpeedCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "print_speed"
	public sequenceId: CommandInterface["sequenceId"] = 2004

	public constructor(speed: SpeedLevel) {
		super({ param: speed.toString() })
	}

	public static ownsResponse = isUpdateSpeedCommand
}
