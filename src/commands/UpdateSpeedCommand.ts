import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { SpeedLevel } from "src/responses"
import { isUpdateSpeedCommand } from "src/responses"

export class UpdateSpeedCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "print_speed"

	/**
	 * Constructs a `print.print_speed` command, which is able to update the speed of the printing whilst printing.
	 * @param speed {SpeedLevel}
	 */
	public constructor(speed: SpeedLevel) {
		// check if the given number is not in the enum
		if (!Object.values(SpeedLevel).includes(speed))
			throw new Error("An unknown speed level was specified!")

		super({ param: speed.toString() })
	}

	ownsResponse = isUpdateSpeedCommand
}
