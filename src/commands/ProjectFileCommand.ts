import { isProjectFileCommand } from "src/responses"
import { AbstractCommand } from "./AbstractCommand"
import { CommandInterface } from "./CommandInterface"

export class ProjectFileCommand extends AbstractCommand {
	public command: CommandInterface["command"] = "project_file"
	public category: CommandInterface["category"] = "print"

	/**
	 * Creates a project file command for printing a file
	 * @param param The path to the project file (e.g., "Metadata/plate_1.gcode")
	 * @param options Additional options for the print job
	 * @description https://github.com/Doridian/OpenBambuAPI/blob/5868cc07cef7c43a97900092ebcc426a74a2abe5/mqtt.md
	 */
	public constructor({
		param,
		options = {},
	}: {
		param: string
		options?: {
			file?: string
			url?: string
			md5?: string
			timelapse?: boolean
			bed_type?: string
			bed_levelling?: boolean
			flow_cali?: boolean
			vibration_cali?: boolean
			layer_inspect?: boolean
			use_ams?: boolean
			ams_mapping?: string
		}
	}) {
		super({
			param,
			project_id: "0", // Always 0 for local prints
			profile_id: "0", // Always 0 for local prints
			task_id: "0", // Always 0 for local prints
			subtask_id: "0", // Always 0 for local prints
			subtask_name: "",
			file: options.file || "",
			url: options.url || "",
			md5: options.md5 || "",
			timelapse: options.timelapse ?? true,
			bed_type: options.bed_type || "auto",
			bed_levelling: options.bed_levelling ?? true,
			flow_cali: options.flow_cali ?? true,
			vibration_cali: options.vibration_cali ?? true,
			layer_inspect: options.layer_inspect ?? true,
			ams_mapping: options.ams_mapping || "",
			use_ams: options.use_ams ?? false,
		})
	}

	ownsResponse = isProjectFileCommand
}
