import type { BambuClientPrinterStatus, IncomingMessageData, PrinterData } from "./types"
import type { Job, JobData } from "src/Job"

export type FinishOutcome = "SUCCESS" | "FAILED" | "UNEXPECTED"

export interface BambuClientEvents {
	message: [topic: string, key: string, data: IncomingMessageData]
	rawMessage: [topic: string, payload: Buffer]
	"client:connect": []
	"client:disconnect": [isDisconnectOffline: boolean]
	"client:error": [error: Error]
	"printer:dataUpdate": [data: PrinterData, updatePackage: Partial<PrinterData>]
	"printer:statusUpdate": [
		oldStatus: BambuClientPrinterStatus,
		newStatus: BambuClientPrinterStatus,
	]
	"job:update": [job: Job, updatePackage: Partial<JobData>]
	"job:start": [job: Job]
	"job:pause": [job: Job, isClientOffline: boolean]
	"job:offlineRecovery": [job: Job]
	"job:unpause": [job: Job]
	"job:finish": [job: Job, outcome: FinishOutcome]
}
