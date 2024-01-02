import type { StringNumber } from "src/types"
import type { InfoMessageCommand } from "./InfoMessage"

export interface VersionModule {
	hw_ver: string
	name: string
	sn: string
	sw_ver: string
}

export interface GetVersionCommand extends InfoMessageCommand {
	command: "get_version"
	module: VersionModule[]
	sequence_id: StringNumber
}

export function isGetVersionCommand(data: InfoMessageCommand): data is GetVersionCommand {
	return data.command === "get_version"
}
