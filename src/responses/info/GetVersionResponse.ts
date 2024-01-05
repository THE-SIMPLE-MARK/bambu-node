import type { StringNumber } from "src/types"
import type { InfoMessageCommand } from "./InfoMessage"

export interface VersionModule {
	/**
	 * The module's name.
	 */
	name: string
	/**
	 * The module's hardware version.
	 */
	hw_ver: string
	/**
	 * The module's serial number.
	 */
	sn: string
	/**
	 * The module's software version.
	 */
	sw_ver: string
}

export interface GetVersionResponse extends InfoMessageCommand {
	command: "get_version"
	module: VersionModule[]
	sequence_id: StringNumber
}

export function isGetVersionCommand(
	data: InfoMessageCommand
): data is GetVersionResponse {
	return data.command === "get_version"
}
