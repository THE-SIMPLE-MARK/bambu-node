import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { LightReport } from "src/responses"
import { isUpdateLightCommand } from "src/responses/print/UpdateLightResponse"

export class UpdateLightCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "system"
	public command: CommandInterface["command"] = "ledctrl"
	public sequenceId: CommandInterface["sequenceId"] = 2003

	public constructor(
		light: LightReport["node"],
		mode: LightReport["mode"],
		loopOptions = { led_on_time: 500, led_off_time: 500, loop_times: 0, interval_time: 0 }
	) {
		super({
			led_node: light,
			led_mode: mode,
			...loopOptions,
		})
	}

	public static ownsResponse = isUpdateLightCommand
}
