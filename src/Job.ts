import { PrinterModel } from "./types"
import { HMS, PrinterStatus, PrintStage, PushAllResponse } from "./responses"
import { createId } from "@paralleldrive/cuid2"

const FILE_EXT_REGEX = new RegExp(/\.[^/.]+$/)

/**
 * Represents a single print job.
 *
 */
export class Job {
	private _jobData: JobData | undefined

	public constructor(data: PushAllResponse, printerModel: PrinterModel) {
		const currentDate = new Date()

		this._jobData = {
			id: createId(),
			printer: printerModel,
			name: data.subtask_name.replace(FILE_EXT_REGEX, ""),
			fileName: data.subtask_name,
			gcodeName: data.gcode_file,
			jobOrigin: data.print_type,
			totalLayerNumber: data.total_layer_num,
			totalPrintTime: data.mc_remaining_time,
			status: data.gcode_state,
			percentDone: data.mc_percent,
			layerNumber: data.layer_num,
			remainingTime: data.mc_remaining_time,
			skippedObjects: data.s_obj,
			statusHistory: [
				{
					status: data.gcode_state,
					changedAt: currentDate,
				},
			],
			speedLevelHistory: [
				{
					speedLevel: data.spd_lvl,
					speedMagnitude: data.spd_mag,
					changedAt: currentDate,
				},
			],
			printingStageHistory: [
				{
					stage: data.stg_cur,
					changedAt: currentDate,
				},
			],
			errorCodes: data.hms.map(hmsCode => ({
				attr: hmsCode.attr,
				code: hmsCode.code,
				thrownAt: currentDate,
				layerNumber: data.layer_num,
			})),
			createdAt: currentDate,
		}
	}

	/**
	 * Updates the job with new (up-to-date) data.
	 */
	public update(data: Partial<PushAllResponse>) {
		if (!this._jobData) return

		const existingData = this._jobData
		const currentDate = new Date()

		// update status history if the last entry isn't the same as the latest data
		if (
			data.gcode_state &&
			existingData.statusHistory.at(-1)?.status !== data.gcode_state
		) {
			existingData.statusHistory.push({
				status: data.gcode_state,
				changedAt: currentDate,
			})
		}

		// update speed level history if the last entry isn't the same as the latest data
		if (
			data.spd_lvl &&
			data.spd_mag &&
			existingData.speedLevelHistory.at(-1)?.speedLevel !== data.spd_lvl
		) {
			existingData.speedLevelHistory.push({
				speedLevel: data.spd_lvl,
				speedMagnitude: data.spd_mag,
				changedAt: currentDate,
			})
		}

		// update printing stage history if the last entry isn't the same as the latest data
		if (
			data.stg_cur &&
			existingData.printingStageHistory.at(-1)?.stage !== data.stg_cur
		) {
			existingData.printingStageHistory.push({
				stage: data.stg_cur,
				changedAt: currentDate,
			})
		}

		const newData = {
			status: data.gcode_state ?? existingData.status,
			percentDone: data.mc_percent ?? existingData.percentDone,
			layerNumber: data.layer_num ?? existingData.layerNumber,
			remainingTime: data.mc_remaining_time ?? existingData.remainingTime,
			skippedObjects: data.s_obj ?? existingData.skippedObjects,
			errorCodes:
				data.hms?.map((hmsCode, index) => ({
					attr: hmsCode.attr ?? existingData.errorCodes[index].attr,
					code: hmsCode.code ?? existingData.errorCodes[index].code,
					thrownAt: currentDate ?? existingData.errorCodes[index].thrownAt,
					layerNumber: data.layer_num ?? existingData.errorCodes[index].layerNumber,
				})) ?? existingData.errorCodes,
		}

		// merge the new data with the old data
		this._jobData = {
			...this._jobData,
			...newData,
		}
	}

	public get data() {
		return this._jobData
	}
}

/**
 * Represents the properties of a job.
 *
 * WARNING: Only values which are key information when the job finishes should be added here.
 */
interface JobData {
	/**
	 * The unique CUID of the job.
	 */
	id: string
	/**
	 * The printer model.
	 */
	printer: PrinterModel
	/**
	 * The name of the job.
	 *
	 * Uses the `subtask_name` property and strips any file extensions.
	 * @see PushAllCommand["subtask_name"]
	 */
	name: string
	/**
	 * The file name of the job.
	 *
	 * The `subtask_name` property.
	 * @see PushAllCommand["subtask_name"]
	 */
	fileName: PushAllResponse["subtask_name"]
	/**
	 * The name of the GCode which gets executed.
	 * @see PushAllCommand["gcode_file"]
	 */
	gcodeName: PushAllResponse["gcode_file"]
	/**
	 * The origin of the job.
	 * @see PushAllCommand["print_type"]
	 */
	jobOrigin: PushAllResponse["print_type"]
	/**
	 * The total layer number of the job.
	 */
	totalLayerNumber: PushAllResponse["total_layer_num"]
	/**
	 * The total print time the Job takes to print in minutes.
	 */
	totalPrintTime: PushAllResponse["mc_remaining_time"]
	/**
	 * The status of the job (printer).
	 */
	status: PushAllResponse["gcode_state"]
	/**
	 * The % of the print done from the job.
	 */
	percentDone: PushAllResponse["mc_percent"]
	/**
	 * The current layer number.
	 */
	layerNumber: PushAllResponse["layer_num"]
	/**
	 * The remaining time until the job finishes in minutes.
	 */
	remainingTime: PushAllResponse["mc_remaining_time"]
	/**
	 * Objects that have been skipped by the printer while printing.
	 * @see PushStatusCommand["s_obj"]
	 */
	skippedObjects: PushAllResponse["s_obj"]
	/**
	 * Stores the status changes throughout the job.
	 */
	statusHistory: StatusChangeItem[]
	/**
	 * Stores the manual speed level changes throughout the job.
	 */
	speedLevelHistory: SpeedLevelHistoryItem[]
	/**
	 * Stores the printing stage changes throughout the job.
	 */
	printingStageHistory: PrintingStageHistoryItem[]
	/**
	 * The HMS error codes the printer encountered while printing the Job.
	 */
	errorCodes: HMSCodeHistory[]
	/**
	 * The date time the job (print) started.
	 */
	createdAt: Date
}

/**
 * A status change instance.
 */
interface StatusChangeItem {
	status: PrinterStatus
	changedAt: Date
}

/**
 * A manual speed level change instance.
 */
interface SpeedLevelHistoryItem {
	speedLevel: PushAllResponse["spd_lvl"]
	speedMagnitude: PushAllResponse["spd_mag"]
	changedAt: Date
}

/**
 * A printing stage change instance.
 */
interface PrintingStageHistoryItem {
	stage: PrintStage
	changedAt: Date
}

interface HMSCodeHistory extends HMS {
	/**
	 * The time the error code was thrown.
	 */
	thrownAt: Date
	/**
	 * The layer number the error code was thrown at.
	 */
	layerNumber: number
}
