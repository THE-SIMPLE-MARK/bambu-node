export type MCPrintMessageCommands = "push_info"

export type MCPrintMessageCommand = { command: MCPrintMessageCommands }

export interface MCPrintMessage {
	print: MCPrintMessageCommand
}

export function isMCPrintMessage(data: any): data is MCPrintMessage {
	return (
		!!data?.mc_print &&
		!!data?.mc_print?.command &&
		["push_info"].includes(data.mc_print.command)
	)
}
