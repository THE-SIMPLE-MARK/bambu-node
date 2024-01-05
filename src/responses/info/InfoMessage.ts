export type InfoMessageCommands = "get_version"

export type InfoMessageCommand = { command: InfoMessageCommands }

export interface InfoMessage {
	info: InfoMessageCommand
}

export function isInfoMessage(data: any): data is InfoMessage {
	return (
		!!data?.info && !!data?.info?.command && ["get_version"].includes(data.info.command)
	)
}
