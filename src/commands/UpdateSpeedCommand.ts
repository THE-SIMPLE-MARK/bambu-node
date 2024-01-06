import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { SpeedLevel } from "src/responses"
import { isUpdateSpeedCommand } from "src/responses"

export class UpdateSpeedCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "print_speed"

	public constructor(speed: SpeedLevel) {
		super({ param: speed.toString() })
	}

	ownsResponse = isUpdateSpeedCommand
}
