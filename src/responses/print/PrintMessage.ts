import { State } from "src/commands/UpdateStateCommand"

export type PrintMessageCommands =
	| "push_status"
	| State
	| "gcode_line"
	| "gcode_file"
	| "project_file"

export type PrintMessageCommand = {
	command: PrintMessageCommands
	param?: string
}

export interface PrintMessage {
	print: PrintMessageCommand
}

export function isPrintMessage(data: any): data is PrintMessage {
	return (
		!!data?.print &&
		!!data?.print?.command &&
		["push_status", "resume", "gcode_line", "gcode_file", "project_file"].includes(
			data.print.command
		)
	)
}
