import type { MCPrintMessageCommand } from "./McPrintMessage"
import type { StringNumber } from "src/types"

export interface PushInfoResponse extends MCPrintMessageCommand {
	command: "push_info"
	param: string
	sequence_id: StringNumber
}

export function isPushInfoCommand(data: MCPrintMessageCommand): data is PushInfoResponse {
	return data.command === "push_info"
}

export interface CleanPushInfoCommand {
	category: string
	content: string
	rawParam: string
	sequenceId: number
	subcategory?: string
}

export function getCleanPushInfoCommand(command: PushInfoResponse): CleanPushInfoCommand {
	const [, category, subcategory, content] =
		command.param.match(/^\[(.+?)](?:\[(.+?)])?\s*(.+)$/) ?? []

	return {
		sequenceId: Number(command.sequence_id),
		category,
		subcategory,
		content,
		rawParam: command.param,
	}
}
