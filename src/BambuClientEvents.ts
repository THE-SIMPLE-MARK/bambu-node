import { IncomingMessageData, PrinterData } from "./types"
import { PrinterStatus } from "./responses"

export interface BambuClientEvents {
	message: [topic: string, key: string, data: IncomingMessageData]
	rawMessage: [topic: string, payload: Buffer]
	"printer:dataUpdate": [data: PrinterData]
	"printer:statusUpdate": [oldStatus: PrinterStatus, oldStatus: PrinterStatus]
	// TODO: create events for print job statuses
}
