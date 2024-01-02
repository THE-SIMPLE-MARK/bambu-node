export interface BambuClientEvents {
	message: [topic: string, key: string, data: object]
	globalRawMessage: [topic: string, payload: Buffer]
	printerDataUpdate: [data: object]
	// TODO: create events for print job statuses
}
