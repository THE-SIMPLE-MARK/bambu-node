import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { SpeedLevel } from "src/responses"
import { isUpdateSpeedCommand } from "src/responses"

export class UpdateSpeedCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "print"
	public command: CommandInterface["command"] = "print_speed"

	/**
	 * Constructs a `print.print_speed` command, which is able to update the speed of the printing whilst printing.
	 * @param speed {SpeedLevel} The new speed level to set.
	 */
	public constructor({ speed }: { speed: SpeedLevel }) {
		super({ param: speed.toString() })
	}

	ownsResponse = isUpdateSpeedCommand
}
