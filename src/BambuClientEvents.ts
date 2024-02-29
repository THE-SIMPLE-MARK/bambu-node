import type { BambuClientPrinterStatus, IncomingMessageData, PrinterData } from "./types"
import type { Job } from "src/Job"

export type FinishReason = "SUCCESS" | "FAILED" | "UNEXPECTED"

export interface BambuClientEvents {
	message: [topic: string, key: string, data: IncomingMessageData]
	rawMessage: [topic: string, payload: Buffer]
	"client:connect": []
	"client:disconnect": [isDisconnectOffline: boolean]
	"client:error": [error: Error]
	"printer:dataUpdate": [data: PrinterData]
	"printer:statusUpdate": [
		oldStatus: BambuClientPrinterStatus,
		newStatus: BambuClientPrinterStatus,
	]
	"job:start": [job: Job]
	"job:pause": [job: Job]
	"job:offlineRecovery": [job: Job]
	"job:unpause": [job: Job]
	"job:finish": [job: Job, reason: FinishReason]
}
