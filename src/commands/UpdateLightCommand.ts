import { AbstractCommand } from "./AbstractCommand"
import type { CommandInterface } from "./CommandInterface"
import { LightReport } from "src/responses"
import { isUpdateLightCommand } from "src/responses"

export interface UpdateLightLoopOptions {
	/**
	 * The amount of milliseconds the light should be on for each iteration.
	 */
	led_on_time: number
	/**
	 * The amount of milliseconds the light should be off for each iteration.
	 */
	led_off_time: number
	/**
	 * Time between each iteration.
	 */
	interval_time: number
	/**
	 * How many times to iterate.
	 */
	loop_times: number
}

export class UpdateLightCommand extends AbstractCommand {
	public category: CommandInterface["category"] = "system"
	public command: CommandInterface["command"] = "ledctrl"

	/**
	 * Constructs a `system.ledctrl` command, which is able to update the lights throughout the printer.
	 * @param light The light to update.
	 * @param mode The new mode of the light.
	 * @param loopOptions Loop options of the light. Only if `mode = "flashing"`.
	 */
	public constructor({
		light,
		mode,
		loopOptions = {
			led_on_time: 0,
			led_off_time: 0,
			loop_times: 0,
			interval_time: 0,
		},
	}: {
		light: LightReport["node"]
		mode: LightReport["mode"]
		loopOptions?: UpdateLightLoopOptions
	}) {
		super({
			led_node: light,
			led_mode: mode,
			...loopOptions,
		})
	}

	ownsResponse = isUpdateLightCommand
}
