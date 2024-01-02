import { IncomingMessageData, PrinterData } from "./types"

export interface BambuClientEvents {
	message: [topic: string, key: string, data: IncomingMessageData]
	globalRawMessage: [topic: string, payload: Buffer]
	printerDataUpdate: [data: PrinterData]
	// TODO: create events for print job statuses
}
