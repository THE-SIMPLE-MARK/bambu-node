export type PrintMessageCommands =
	| "push_status"
	| "resume"
	| "gcode_line"
	| "gcode_file"
	| "project_file"

export type PrintMessageCommand = { command: PrintMessageCommands } & Record<
	string,
	unknown
>

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
